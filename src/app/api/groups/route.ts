import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const groups = await prisma.group.findMany({
    include: {
      _count: {
        select: { members: true }
      }
    }
  })

  return Response.json(groups)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { name, description, avatar_url } = await req.json()

  const group = await prisma.group.create({
    data: {
      name,
      description,
      avatar_url,
      created_by: session.user.id,
      members: {
        create: {
          user_id: session.user.id,
          role: 'admin'
        }
      }
    }
  })

  return Response.json(group)
}
