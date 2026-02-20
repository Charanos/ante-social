import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ positionId: string }> }
) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { positionId } = await params
  return proxyBackendRequest({
    path: `/api/v1/markets/my/predictions/${positionId}`,
    method: "GET",
    token,
  })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ positionId: string }> }
) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { positionId } = await params
  const body = await req.json().catch(() => ({}))

  return proxyBackendRequest({
    path: `/api/v1/markets/my/predictions/${positionId}`,
    method: "PATCH",
    token,
    jsonBody: { outcomeId: body.outcomeId },
  })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ positionId: string }> }
) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { positionId } = await params
  return proxyBackendRequest({
    path: `/api/v1/markets/my/predictions/${positionId}`,
    method: "DELETE",
    token,
  })
}

