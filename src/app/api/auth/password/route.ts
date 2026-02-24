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
  if (!body.currentPassword || !body.newPassword) {
    return Response.json(
      { error: "currentPassword and newPassword are required" },
      { status: 400 },
    );
  }

  return proxyBackendRequest({
    path: "/api/v1/auth/password",
    method: "POST",
    token,
    jsonBody: {
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    },
  });
}
