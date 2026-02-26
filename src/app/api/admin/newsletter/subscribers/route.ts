import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)

  return proxyBackendRequest({
    path: "/api/v1/admin/newsletter/subscribers",
    method: "GET",
    token,
    searchParams,
  })
}
