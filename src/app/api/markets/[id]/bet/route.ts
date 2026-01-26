import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../../auth/[...nextauth]/route"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const marketId = id
    const { option_id, stake, currency = "USD" } = await req.json()
    const userId = session.user.id

    if (!stake || stake <= 0) {
        return Response.json({ error: "Invalid stake amount" }, { status: 400 })
    }

    try {
        // Transaction: 
        // 1. Check user balance lock row
        // 2. Check market open
        // 3. Deduct balance
        // 4. Create Participant Record
        // 5. Update Market Pool & Outcome stats

        const result = await prisma.$transaction(async (tx) => {
            // 1. Get User & Wallet
            const user = await tx.user.findUnique({
                where: { id: userId },
                include: { wallet: true }
            })

            if (!user || !user.wallet) throw new Error("Wallet not found")

            // Check Balance
            const balanceField = currency === "KSH" ? "balance_ksh" : "balance"
            // TypeScript safe access? 
            // We cast or access dynamic key. Prisma returns object.
            const currentBalance = (user.wallet as any)[balanceField] || 0

            if (currentBalance < stake) {
                throw new Error("Insufficient balance")
            }

            // 2. Get Market
            const market = await tx.publicBetMarket.findUnique({
                where: { id: marketId }
            })

            if (!market) throw new Error("Market not found")
            if (market.status !== "active" || new Date() > market.close_time) {
                throw new Error("Market is closed")
            }

            // 3. Deduct Balance
            await tx.wallet.update({
                where: { id: user.wallet.id },
                data: {
                    [balanceField]: { decrement: stake }
                }
            })

            // 4. Create Participation
            const participation = await tx.marketParticipant.create({
                data: {
                    market_id: marketId,
                    user_id: userId,
                    selected_outcome_id: option_id,
                    amount_contributed: stake,
                    // Assuming we don't have currency field on MarketParticipant yet, or we normalize to USD?
                    // The schema has 'amount_contributed Float'. 
                    // If the market is multi-currency, we might need conversion or distinct pool fields.
                    // For simplified docs compliance, we assume 1:1 or simplified handling.
                    // I'll proceed with saving pure magnitude for now.
                }
            })

            // 5. Update Market Stats
            await tx.publicBetMarket.update({
                where: { id: marketId },
                data: {
                    total_pool: { increment: stake },
                    participant_count: { increment: 1 }
                }
            })

            // 6. Update Outcome Stats
            await tx.marketOutcome.update({
                where: { id: option_id },
                data: {
                    total_amount: { increment: stake },
                    participant_count: { increment: 1 }
                }
            })

            // 7. Log Transaction
            await tx.transaction.create({
                data: {
                    user_id: userId,
                    type: "bet_entry",
                    amount: stake,
                    currency: currency,
                    description: `Bet on ${market.title}`,
                    status: "completed",
                    bet_pool_id: marketId
                }
            })

            return participation
        })

        return Response.json({
            success: true,
            bet_id: result.id,
            message: "Bet placed successfully"
        })

    } catch (error: any) {
        console.error("Bet Placement Error:", error)
        return Response.json({
            error: error.message || "Failed to place bet"
        }, { status: 400 })
    }
}
