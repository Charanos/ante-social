import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../auth/[...nextauth]/route"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ groupId: string; memberId: string }> }
) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { groupId, memberId } = await params
  return proxyBackendRequest({
    path: `/api/v1/groups/${groupId}/members/${memberId}/remove`,
    method: "POST",
    token,
  })
}
