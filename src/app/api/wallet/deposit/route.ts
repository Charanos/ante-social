import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_URL = "https://api.nowpayments.io/v1";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { amount, currency = "USD" } = await req.json()
  const userId = session.user.id

  // 1. Check limits
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true }
  })

  if (!user || !user.wallet) {
    return Response.json({ error: "Wallet not found" }, { status: 404 })
  }

  const limit = user.user_level === 'high_roller' ? 5000 : 500;

  // Reset daily total if 24h passed (simplified logic, ideally use a scheduled job or check on every access)
  const now = new Date();
  const lastReset = new Date(user.wallet.last_reset_date);
  let currentDailyTotal = user.wallet.daily_deposit_total;

  if (now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000) {
    currentDailyTotal = 0;
    await prisma.wallet.update({
      where: { id: user.wallet.id },
      data: {
        daily_deposit_total: 0,
        last_reset_date: now
      }
    });
  }

  if (currentDailyTotal + amount > limit) {
    return Response.json({ error: `Daily deposit limit exceeded. Your limit is $${limit}` }, { status: 400 })
  }

  // 2. Branch by Payment Type
  if (currency === "KSH") {
    // M-Pesa Logic (Mocked)
    // In reality, trigger STK Push here
    await prisma.wallet.update({
      where: { id: user.wallet.id },
      data: { daily_deposit_total: { increment: amount / 130 } } // Normalize for limit
    });

    return Response.json({
      success: true,
      message: "M-Pesa STK Push sent to your phone",
      payment_type: "mpesa"
    });
  }

  // Crypto Logic (NOWPayments)
  try {
    const response = await fetch(`${NOWPAYMENTS_API_URL}/invoice`, {
      method: 'POST',
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: 'usd',
        pay_currency: 'usdttrc20', // USDT on TRON
        ipn_callback_url: `${process.env.NEXTAUTH_URL}/api/webhooks/nowpayments`,
        order_id: `deposit_${userId}_${Date.now()}`,
        order_description: `Deposit for user ${userId}`
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create invoice");
    }

    // 3. Update daily total
    await prisma.wallet.update({
      where: { id: user.wallet.id },
      data: { daily_deposit_total: { increment: amount } }
    });

    return Response.json(data);

  } catch (error: any) {
    console.error("NOWPayments Error:", error);
    return Response.json({ error: "Payment service unavailable" }, { status: 500 })
  }
}
