import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
// @ts-ignore
import { authenticator } from "otplib"
import { authOptions } from "../../[...nextauth]/route"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) return Response.json({ error: "User not found" }, { status: 404 })

    // Generate Secret
    const secret = authenticator.generateSecret()

    // Save temp secret (or handle purely client side - but better to save pending secret?)
    // For simplicity complying with specs "POST /auth/2fa/setup", 
    // we return secret/details. Verification step will confirm it.

    // Note: Usually we verify BEFORE saving to 'two_factor_secret' column to avoid locking out.
    // But here we might just return it. 
    // Ideally, we'd store "two_factor_secret_pending" in DB. 
    // For this implementation, we will assume client sends secret back with code, or we store it.

    // Let's store it directly but mark enabled=false
    await prisma.user.update({
        where: { id: user.id },
        data: {
            two_factor_secret: secret,
            two_factor_enabled: false
        }
    })

    return Response.json({
        secret,
        otpauth_url: authenticator.keyuri(user.email, "Ante Social", secret),
        message: "Scan QR code and verify to enable"
    })
}
