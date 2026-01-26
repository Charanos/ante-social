import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const type = searchParams.get("type")

    const where: any = {
        user_id: session.user.id
    }

    if (type) {
        where.type = type
    }

    try {
        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                take: limit,
                skip: offset,
                orderBy: {
                    created_date: 'desc'
                }
            }),
            prisma.transaction.count({ where })
        ])

        return Response.json({
            activities: transactions.map(tx => ({
                activity_id: tx.id,
                type: tx.type,
                description: tx.description,
                amount: tx.amount,
                currency: (tx as any).currency || "USD", // Handle potentially missing field on type until generation
                market_id: tx.bet_pool_id,
                timestamp: tx.created_date
            })),
            pagination: {
                total,
                limit,
                offset
            }
        })

    } catch (error) {
        console.error("Activity API Error:", error)
        return Response.json({ error: "Failed to fetch activity" }, { status: 500 })
    }
}
