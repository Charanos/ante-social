import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
  }

  const withdrawals = await prisma.transaction.findMany({
      where: { type: 'withdrawal', status: 'pending' },
      include: { user: { select: { email: true, username: true } } }
  })

  return Response.json(withdrawals)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
        return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { transactionId, action } = await req.json() // action: "approve", "reject"

    const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId }
    })

    if (!transaction) return Response.json({ error: "Transaction not found" }, { status: 404 })

    if (action === 'reject') {
        await prisma.$transaction(async (tx) => {
            // Refund balance
            await tx.wallet.update({
                where: { user_id: transaction.user_id },
                data: { 
                    balance: { increment: transaction.amount },
                    daily_withdrawal_total: { decrement: transaction.amount }
                }
            })
            
            await tx.transaction.update({
                where: { id: transactionId },
                data: { status: 'failed', description: transaction.description + " (Rejected by Admin)" }
            })
        })
    } else {
        // Approve (Mark as completed, money already deducted)
        // In real app, trigger actual payout via NOWPayments Payout API here
        await prisma.transaction.update({
            where: { id: transactionId },
            data: { status: 'completed' }
        })
    }

    return Response.json({ success: true })
}
