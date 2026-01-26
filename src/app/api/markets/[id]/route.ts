import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const marketId = id

    try {
        const market = await prisma.publicBetMarket.findUnique({
            where: { id: marketId },
            include: {
                outcomes: true, // Include betting options
                // We might want to include simplified participant list or simplify it due to volume
                participants: {
                    take: 10,
                    orderBy: { created_date: 'desc' },
                    include: {
                        user: {
                            select: { username: true, avatar_url: true }
                        }
                    }
                }
            }
        })

        if (!market) {
            return Response.json({ error: "Market not found" }, { status: 404 })
        }

        // Calculate platform fee context (display only)
        const platform_fee = market.total_pool * 0.05
        const prize_pool = market.total_pool - platform_fee

        return Response.json({
            ...market,
            platform_fee,
            prize_pool_after_fees: prize_pool
        })

    } catch (error) {
        console.error("Market Details Error:", error)
        return Response.json({ error: "Failed to fetch market details" }, { status: 500 })
    }
}
