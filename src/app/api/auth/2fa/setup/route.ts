import { getServerSession } from "next-auth"
import { authOptions } from "../../[...nextauth]/route"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function POST() {
  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  return proxyBackendRequest({
    path: "/api/v1/auth/2fa/setup",
    method: "POST",
    token,
  })
}
