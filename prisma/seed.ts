import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Starting seed...")

    // 1. Create Admin User
    const adminPassword = await bcrypt.hash("admin123", 10)
    const admin = await prisma.user.upsert({
        where: { email: "admin@antesocial.com" },
        update: {},
        create: {
            username: "admin_superuser",
            email: "admin@antesocial.com",
            password_hash: adminPassword,
            role: "admin",
            user_level: "high_roller",
            email_verified: true,
            wallet: {
                create: {
                    balance: 1000000,
                    balance_ksh: 100000000,
                    daily_deposit_total: 0,
                    daily_withdrawal_total: 0
                }
            }
        },
    })
    console.log(`✅ Admin created: ${admin.email}`)

    // 2. Create Regular User
    const userPassword = await bcrypt.hash("user123", 10)
    const user = await prisma.user.upsert({
        where: { email: "user@example.com" },
        update: {},
        create: {
            username: "demo_user",
            email: "user@example.com",
            password_hash: userPassword,
            role: "user",
            user_level: "novice",
            wallet: {
                create: {
                    balance: 500,
                    balance_ksh: 50000, // Approx 500 USD
                }
            }
        },
    })
    console.log(`✅ User created: ${user.email}`)

    // 3. Create Sample Public Markets
    const markets = [
        {
            title: "Will Bitcoin hit $100k by Friday?",
            description: "The charts are screaming, but the bears are lurking. Place your bets on the crypto king's next move.",
            bet_type: "poll_style",
            buy_in_amount: 50,
            total_pool: 1500,
            participant_count: 42,
            status: "active",
            close_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // +2 days
            outcomes: [
                { option_text: "Yes, to the moon! 🚀", participant_count: 30, total_amount: 1200 },
                { option_text: "No, correction incoming 🐻", participant_count: 12, total_amount: 300 }
            ]
        },
        {
            title: "Who wins the Super Bowl?",
            description: "The playoffs are heating up. Predict the champion.",
            bet_type: "poll_style",
            buy_in_amount: 100,
            total_pool: 5000,
            participant_count: 128,
            status: "active",
            close_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 days
            outcomes: [
                { option_text: "Chiefs", participant_count: 60, total_amount: 2500 },
                { option_text: "49ers", participant_count: 40, total_amount: 1500 },
                { option_text: "Ravens", participant_count: 28, total_amount: 1000 }
            ]
        },
        {
            title: "What's your vibe right now?",
            description: "Pick the one that matches your brain's current state.",
            bet_type: "poll_style",
            buy_in_amount: 5,
            total_pool: 20,
            participant_count: 1,
            status: "active",
            close_time: new Date(Date.now() + 9 * 60 * 60 * 1000), // +9 hours
            outcomes: [
                { option_text: "Chill", participant_count: 1, total_amount: 20 },
                { option_text: "Chaotic", participant_count: 0, total_amount: 0 }
            ]
        }
    ]

    for (const m of markets) {
        await prisma.publicBetMarket.create({
            data: {
                title: m.title,
                description: m.description,
                bet_type: m.bet_type,
                buy_in_amount: m.buy_in_amount,
                total_pool: m.total_pool,
                participant_count: m.participant_count,
                status: m.status,
                close_time: m.close_time,
                settlement_time: new Date(m.close_time.getTime() + 60 * 60 * 1000), // +1 hour
                outcomes: {
                    create: m.outcomes
                }
            }
        })
    }
    console.log(`✅ Sample markets created: ${markets.length}`)

    console.log("🏁 Seeding complete.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
