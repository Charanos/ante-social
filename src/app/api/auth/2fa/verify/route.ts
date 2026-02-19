import { getServerSession } from "next-auth"
import { authOptions } from "../../[...nextauth]/route"
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const code = body.token || body.code

  if (!code) {
    return Response.json({ error: "Missing 2FA code" }, { status: 400 })
  }

  const session = await getServerSession(authOptions)
  const token = getSessionToken(session)

  // Authenticated flow: enable 2FA for current user
  if (token) {
    return proxyBackendRequest({
      path: "/api/v1/auth/2fa/enable",
      method: "POST",
      token,
      jsonBody: { token: code },
    })
  }

  // Login completion flow: verify 2FA with userId + code
  if (!body.userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 })
  }

  return proxyBackendRequest({
    path: "/api/v1/auth/2fa/verify",
    method: "POST",
    jsonBody: { userId: body.userId, token: code },
  })
}
