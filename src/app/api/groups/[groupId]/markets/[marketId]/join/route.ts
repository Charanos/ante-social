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

  return proxyBackendRequest({
    path: `/api/v1/groups/bets/${marketId}/join`,
    method: "POST",
    token,
    jsonBody: {
      selectedOption: body.selectedOption,
    },
  })
}


