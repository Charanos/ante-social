import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function GET() {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  return proxyBackendRequest({
    path: "/api/v1/user/profile",
    method: "GET",
    token,
  })
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))

  return proxyBackendRequest({
    path: "/api/v1/user/profile",
    method: "PATCH",
    token,
    jsonBody: body,
  })
}

