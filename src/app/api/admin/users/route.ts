import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
  }

  const users = await prisma.user.findMany({
      select: {
          id: true,
          email: true,
          username: true,
          role: true,
          user_level: true,
          created_date: true
      }
  })

  return Response.json(users)
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
        return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { userId, user_level } = await req.json()

    await prisma.user.update({
        where: { id: userId },
        data: { user_level }
    })

    return Response.json({ success: true })
}
