import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const url = new URL(req.url)

  return proxyBackendRequest({
    path: `/api/v1/markets/${id}`,
    method: "GET",
    searchParams: url.searchParams,
  })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json().catch(() => ({}))

  return proxyBackendRequest({
    path: `/api/v1/markets/${id}`,
    method: "PATCH",
    token,
    jsonBody: body,
  })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  return proxyBackendRequest({
    path: `/api/v1/markets/${id}`,
    method: "DELETE",
    token,
  })
}

