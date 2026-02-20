import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { groupId } = await params
  const url = new URL(req.url)
  return proxyBackendRequest({
    path: `/api/v1/groups/${groupId}`,
    method: "GET",
    token,
    searchParams: url.searchParams,
  })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { groupId } = await params
  const body = await req.json().catch(() => ({}))

  return proxyBackendRequest({
    path: `/api/v1/groups/${groupId}`,
    method: "PATCH",
    token,
    jsonBody: body,
  })
}

