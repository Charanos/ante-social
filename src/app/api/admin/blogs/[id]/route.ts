import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"
import { NextRequest } from "next/server"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  return proxyBackendRequest({
    path: `/api/v1/admin/blogs/${id}`,
    method: "GET",
    token,
  })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  return proxyBackendRequest({
    path: `/api/v1/admin/blogs/${id}`,
    method: "PATCH",
    token,
    jsonBody: body,
  })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  return proxyBackendRequest({
    path: `/api/v1/admin/blogs/${id}`,
    method: "DELETE",
    token,
  })
}
