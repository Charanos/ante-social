import { getServerSession } from "next-auth"
import { NextRequest } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  return proxyBackendRequest({
    path: "/api/v1/notifications",
    method: "GET",
    token,
    searchParams: req.nextUrl.searchParams,
  })
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))

  if (body.id === "all") {
    return proxyBackendRequest({
      path: "/api/v1/notifications/read-all",
      method: "PATCH",
      token,
    })
  }

  if (!body.id) {
    return Response.json({ error: "Missing notification id" }, { status: 400 })
  }

  return proxyBackendRequest({
    path: `/api/v1/notifications/${body.id}/read`,
    method: "PATCH",
    token,
  })
}
