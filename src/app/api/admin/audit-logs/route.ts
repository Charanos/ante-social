import { getServerSession } from "next-auth"
import { NextRequest } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  return proxyBackendRequest({
    path: "/api/v1/admin/audit-logs",
    method: "GET",
    token,
    searchParams: req.nextUrl.searchParams,
  })
}
