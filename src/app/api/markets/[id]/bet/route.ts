import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json().catch(() => ({}))

  return proxyBackendRequest({
    path: `/api/v1/markets/${id}/predict`,
    method: "POST",
    token,
    jsonBody: {
      marketId: id,
      outcomeId: body.outcomeId || body.optionId || body.option_id,
      amount: body.amount ?? body.stake,
      rankedOutcomeIds: body.rankedOutcomeIds || body.ranking,
    },
  })
}

