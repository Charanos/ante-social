import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ groupId: string; marketId: string }> }
) {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { marketId } = await params
  const body = await req.json().catch(() => ({}))

  if (body.action === "declare_winner") {
    return proxyBackendRequest({
      path: `/api/v1/groups/bets/${marketId}/declare`,
      method: "POST",
      token,
      jsonBody: { winnerId: body.winnerId },
    })
  }

  if (body.action === "confirm") {
    return proxyBackendRequest({
      path: `/api/v1/groups/bets/${marketId}/confirm`,
      method: "POST",
      token,
    })
  }

  if (body.action === "disagree") {
    return proxyBackendRequest({
      path: `/api/v1/groups/bets/${marketId}/disagree`,
      method: "POST",
      token,
    })
  }

  return Response.json({ error: "Invalid action" }, { status: 400 })
}

