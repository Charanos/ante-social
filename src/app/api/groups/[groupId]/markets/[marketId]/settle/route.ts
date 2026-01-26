import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../../../../auth/[...nextauth]/route"

export async function POST(req: Request, { params }: any) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const { groupId, marketId } = params as { groupId: string, marketId: string }
  const { action, winnerId } = await req.json() // action: "declare_winner", "confirm", "disagree"

  const market = await prisma.privateGroupMarket.findUnique({
    where: { id: marketId },
    include: { participants: true }
  })

  if (!market) return Response.json({ error: "Market not found" }, { status: 404 })

  if (action === "declare_winner") {
      // Only admin or creator can declare? For now, let's say creator.
      if (market.created_by !== session.user.id) {
          return Response.json({ error: "Only creator can declare winner" }, { status: 403 })
      }

      await prisma.privateGroupMarket.update({
          where: { id: marketId },
          data: {
              status: "pending_confirmation",
              declared_winner_id: winnerId,
              confirmations: 0,
              disagreements: 0
          }
      })
      return Response.json({ success: true })
  }

  if (action === "confirm") {
      await prisma.privateGroupMarket.update({
          where: { id: marketId },
          data: { confirmations: { increment: 1 } }
      })
      
      // Check for auto-finalization (simplified: 1 confirmation is enough for now as per plan)
      // In real app, check time window etc.
      const updatedMarket = await prisma.privateGroupMarket.findUnique({ where: { id: marketId } })
      
      if (updatedMarket && updatedMarket.confirmations >= 1 && updatedMarket.disagreements === 0) {
          await finalizeMarket(marketId, updatedMarket.declared_winner_id!)
      }

      return Response.json({ success: true })
  }

  if (action === "disagree") {
      await prisma.privateGroupMarket.update({
          where: { id: marketId },
          data: { 
              status: "disputed",
              disagreements: { increment: 1 } 
          }
      })
      return Response.json({ success: true })
  }

  return Response.json({ error: "Invalid action" }, { status: 400 })
}

async function finalizeMarket(marketId: string, winnerId: string) {
    const market = await prisma.privateGroupMarket.findUnique({
        where: { id: marketId },
        include: { participants: true }
    })
    if (!market) return;

    const totalPool = market.participants.length * market.buy_in_amount;
    const platformFee = totalPool * 0.05;
    const prizePool = totalPool - platformFee;

    await prisma.$transaction(async (tx) => {
        // 1. Update Market
        await tx.privateGroupMarket.update({
            where: { id: marketId },
            data: { status: "settled" }
        })

        // 2. Pay Winner
        await tx.wallet.update({
            where: { user_id: winnerId },
            data: { 
                balance: { increment: prizePool },
                total_winnings: { increment: prizePool }
            }
        })

        // 3. Create Transaction
        await tx.transaction.create({
            data: {
                user_id: winnerId,
                type: "payout",
                amount: prizePool,
                description: `Won group bet: ${market.title}`,
                bet_pool_id: marketId
            }
        })
    })
}
