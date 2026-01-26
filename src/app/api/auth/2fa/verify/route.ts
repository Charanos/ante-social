import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
// @ts-ignore
import { authenticator } from "otplib"
import { authOptions } from "../../[...nextauth]/route"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const { token } = await req.json()

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user || !user.two_factor_secret) {
        return Response.json({ error: "2FA setup not initiated" }, { status: 400 })
    }

    // Verify Token
    const isValid = authenticator.verify({
        token,
        secret: user.two_factor_secret
    })

    if (!isValid) {
        return Response.json({ error: "Invalid OTP code" }, { status: 400 })
    }

    // Enable 2FA
    await prisma.user.update({
        where: { id: user.id },
        data: {
            two_factor_enabled: true
        }
    })

    return Response.json({
        success: true,
        message: "2FA enabled successfully"
    })
}
