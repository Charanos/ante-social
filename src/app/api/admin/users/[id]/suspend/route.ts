import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const token = getSessionToken(session);
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  return proxyBackendRequest({
    path: `/api/v1/admin/users/${id}/ban`,
    method: "POST",
    token,
    jsonBody: { reason: body.reason || "Manual admin suspension" },
  });
}
