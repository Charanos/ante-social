import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const notifications = await prisma.userNotification.findMany({
    where: { user_id: session.user.id },
    orderBy: { created_date: 'desc' }
  })

  return Response.json(notifications)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await req.json()

  if (id === 'all') {
      await prisma.userNotification.updateMany({
          where: { user_id: session.user.id, is_read: false },
          data: { is_read: true }
      })
  } else {
      await prisma.userNotification.update({
          where: { id },
          data: { is_read: true }
      })
  }

  return Response.json({ success: true })
}
