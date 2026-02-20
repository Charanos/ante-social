import { getServerSession } from "next-auth"
import { NextRequest } from "next/server"
import { authOptions } from "@/lib/auth-options"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  return proxyBackendRequest({
    path: "/api/v1/admin/compliance/flags",
    method: "GET",
    token,
    searchParams: req.nextUrl.searchParams,
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  if (!body.userId || !body.action) {
    return Response.json({ error: "Missing userId or action" }, { status: 400 })
  }

  if (body.action === "freeze") {
    return proxyBackendRequest({
      path: "/api/v1/admin/compliance/freeze",
      method: "POST",
      token,
      jsonBody: { userId: body.userId, reason: body.reason || "Manual review" },
    })
  }

  if (body.action === "unfreeze") {
    return proxyBackendRequest({
      path: "/api/v1/admin/compliance/unfreeze",
      method: "POST",
      token,
      jsonBody: { userId: body.userId },
    })
  }

  return Response.json({ error: "Invalid action" }, { status: 400 })
}

