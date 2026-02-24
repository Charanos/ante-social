import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const token = getSessionToken(session);
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  return proxyBackendRequest({
    path: `/api/v1/admin/users/${id}/unban`,
    method: "POST",
    token,
  });
}
