import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const token = getSessionToken(session);
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  if (!body.token) {
    return Response.json({ error: "Missing 2FA code" }, { status: 400 });
  }

  return proxyBackendRequest({
    path: "/api/v1/auth/2fa/disable",
    method: "POST",
    token,
    jsonBody: { token: body.token },
  });
}
