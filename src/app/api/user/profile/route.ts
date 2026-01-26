import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { wallet: true }
  })

  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  return Response.json({
    user_id: user.id,
    username: user.username,
    email: user.email,
    tier: user.user_level,
    two_factor_enabled: user.two_factor_enabled,
    preferences: {
      currency: "KSH", // Default or stored pref
      theme: "dark", // Default or stored
      notifications: {
        email: user.notification_email,
        push: user.notification_push
      }
    },
    wallet_balances: {
      USD: { available: user.wallet?.balance || 0 },
      KSH: { available: user.wallet?.balance_ksh || 0 }
    }
  })
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { timezone, notification_email, notification_push } = await req.json()

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      timezone,
      notification_email,
      notification_push
    }
  })

  return Response.json({ success: true })
}
