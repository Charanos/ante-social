import { getServerSession } from "next-auth"
import { NextRequest } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  return proxyBackendRequest({
    path: "/api/v1/admin/withdrawals",
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
  if (!body.transactionId || !body.action) {
    return Response.json({ error: "Missing transactionId or action" }, { status: 400 })
  }

  if (body.action === "approve") {
    return proxyBackendRequest({
      path: `/api/v1/admin/withdrawals/${body.transactionId}/approve`,
      method: "POST",
      token,
    })
  }

  if (body.action === "reject") {
    return proxyBackendRequest({
      path: `/api/v1/admin/withdrawals/${body.transactionId}/reject`,
      method: "POST",
      token,
      jsonBody: { reason: body.reason },
    })
  }

  return Response.json({ error: "Invalid action" }, { status: 400 })
}
