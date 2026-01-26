import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../../auth/[...nextauth]/route"

export async function POST(req: Request, { params }: any) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { groupId } = params as { groupId: string }
  const { title, description, market_type, buy_in_amount } = await req.json()

  // Verify membership
  const membership = await prisma.groupMember.findUnique({
    where: {
      group_id_user_id: {
        group_id: groupId,
        user_id: session.user.id
      }
    }
  })

  if (!membership) {
    return Response.json({ error: "Not a member of this group" }, { status: 403 })
  }

  const market = await prisma.privateGroupMarket.create({
    data: {
      group_id: groupId,
      title,
      description,
      market_type, // "winner_takes_all" or "odd_one_out"
      buy_in_amount,
      created_by: session.user.id
    }
  })

  return Response.json(market)
}
