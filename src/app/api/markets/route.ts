import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const type = searchParams.get("type")
    const status = searchParams.get("status") || "active"
    const limit = parseInt(searchParams.get("limit") || "20")

    // Build filter
    const where: any = {
        status: status
    }

    if (type) {
        where.bet_type = type
    }

    try {
        const markets = await prisma.publicBetMarket.findMany({
            where,
            take: limit,
            orderBy: {
                created_date: 'desc'
            },
            select: {
                id: true,
                title: true,
                description: true,
                bet_type: true,
                status: true,
                total_pool: true,
                participant_count: true,
                close_time: true,
                created_date: true,
                media_url: true
            }
        })

        return Response.json({ markets })
    } catch (error) {
        console.error("Markets API Error:", error)
        return Response.json({ error: "Failed to fetch markets" }, { status: 500 })
    }
}
