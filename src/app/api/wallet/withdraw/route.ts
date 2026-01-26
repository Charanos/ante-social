import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { amount, currency = "USD", address, otp } = await req.json()
  const userId = session.user.id

  if (amount < 10) {
    return Response.json({ error: "Minimum withdrawal is $10" }, { status: 400 })
  }

  // 1. Check limits and balance
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true }
  })

  if (!user || !user.wallet) {
    return Response.json({ error: "Wallet not found" }, { status: 404 })
  }

  // Extract wallet fields into local variables so TypeScript narrowing survives into closures
  const walletId = user.wallet.id
  const walletBalance = user.wallet.balance
  const walletLastReset = user.wallet.last_reset_date ? new Date(user.wallet.last_reset_date) : new Date(0)
  let currentDailyTotal = user.wallet.daily_withdrawal_total ?? 0

  if (walletBalance < amount) {
    return Response.json({ error: "Insufficient balance" }, { status: 400 })
  }

  const limit = user.user_level === 'high_roller' ? 1000 : 250;

  // Reset daily total if 24h passed
  const now = new Date();
  if (now.getTime() - walletLastReset.getTime() > 24 * 60 * 60 * 1000) {
    currentDailyTotal = 0;
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        daily_withdrawal_total: 0,
        last_reset_date: now
      }
    });
  }

  if (currentDailyTotal + amount > limit) {
    return Response.json({ error: `Daily withdrawal limit exceeded. Your limit is $${limit}` }, { status: 400 })
  }

  // 2. High-Volume 2FA Check (Specs: 2FA required for high-volume transactions)
  // Threshold: > $100 (or equivalent in KSH)
  const amountInUSD = currency === "KSH" ? amount / 130 : amount; // Simple mock rate
  if (amountInUSD > 100 && !otp) {
    return Response.json({ error: "2FA Required", requires_2fa: true }, { status: 403 })
  }

  // 3. Create Pending Transaction
  await prisma.$transaction(async (tx) => {
    // Deduct from correct balance
    const balanceField = currency === "KSH" ? "balance_ksh" : "balance";

    await tx.wallet.update({
      where: { id: walletId },
      data: {
        [balanceField]: { decrement: amount },
        daily_withdrawal_total: { increment: amountInUSD } // Track normalized limit
      }
    });

    // Create transaction record
    await tx.transaction.create({
      data: {
        user_id: userId,
        type: 'withdrawal',
        currency: currency,
        amount: amount,
        description: `Withdrawal to ${address} (${currency})`,
        status: 'pending' // Requires admin approval
      }
    });
  });

  return Response.json({ success: true, message: "Withdrawal request submitted for approval" });
}
