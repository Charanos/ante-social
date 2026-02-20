import { getServerSession } from "next-auth"
import { NextRequest } from "next/server"
import { authOptions } from "@/lib/auth-options"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const response = await proxyBackendRequest({
    path: "/api/v1/notifications",
    method: "GET",
    token,
    searchParams: req.nextUrl.searchParams,
    suppressTargetErrors: true,
  })

  if (response.status === 502 || response.status === 503 || response.status === 504) {
    const limit = Number(req.nextUrl.searchParams.get("limit") || 20)
    const offset = Number(req.nextUrl.searchParams.get("offset") || 0)
    return Response.json({
      data: [],
      meta: { total: 0, unreadCount: 0, limit, offset },
      degraded: true,
      message: "Notification service temporarily unavailable",
    })
  }

  return response
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

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const id = req.nextUrl.searchParams.get("id")
  if (!id) {
    return Response.json({ error: "Missing notification id" }, { status: 400 })
  }

  return proxyBackendRequest({
    path: `/api/v1/notifications/${id}`,
    method: "DELETE",
    token,
  })
}

