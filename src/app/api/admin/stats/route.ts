import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
  }

  const totalUsers = await prisma.user.count()
  const totalMarkets = await prisma.publicBetMarket.count()
  const pendingWithdrawals = await prisma.transaction.count({
      where: { type: 'withdrawal', status: 'pending' }
  })

  // Calculate revenue (sum of platform fees from settled markets)
  // Simplified: just summing a field, in real app might be more complex
  const revenue = await prisma.publicBetMarket.aggregate({
      _sum: { platform_fee_collected: true }
  })

  return Response.json({
      totalUsers,
      totalMarkets,
      pendingWithdrawals,
      revenue: revenue._sum.platform_fee_collected || 0
  })
}
