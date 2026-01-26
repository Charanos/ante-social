import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { username, email, password, phone, dob, currency } = await req.json()

        // 1. Basic Validation
        if (!email || !password || !username) {
            return Response.json({ error: "Missing required fields" }, { status: 400 })
        }

        // 2. Check existence
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        })

        if (existingUser) {
            return Response.json({ error: "User already exists" }, { status: 409 })
        }

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10)

        // 4. Create User
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password_hash: hashedPassword,
                // Map other fields from register page if schema supports them
                // Assuming we might need to add phone/dob to schema later, but for now critical auth is done.
                // We do have currency pref, usually stored in a preferences JSON or similar.
                // The schema had 'balance' on Wallet model. We should create a wallet too.
            }
        })

        // 5. Create Wallet
        await prisma.wallet.create({
            data: {
                user_id: user.id,
                balance: 0,
                balance_ksh: 0,
            }
        })

        return Response.json({
            success: true,
            user_id: user.id,
            message: "Account created successfully"
        }, { status: 201 })

    } catch (error) {
        console.error("Registration error:", error)
        return Response.json({ error: "Server error" }, { status: 500 })
    }
}
