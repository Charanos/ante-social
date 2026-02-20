import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  return proxyBackendRequest({
    path: "/api/v1/groups",
    method: "GET",
    token,
    searchParams: url.searchParams,
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  return proxyBackendRequest({
    path: "/api/v1/groups",
    method: "POST",
    token,
    jsonBody: {
      name: body.name,
      description: body.description,
      isPublic: body.isPublic,
    },
  })
}

