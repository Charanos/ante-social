import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json().catch(() => ({}))

  return proxyBackendRequest({
    path: `/api/v1/markets/${id}/settle`,
    method: "POST",
    token,
    jsonBody: {
      winningOptionId: body.winningOptionId || body.outcomeId || body.winnerId,
    },
  })
}
