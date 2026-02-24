import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const token = getSessionToken(session);
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const searchParams = new URL(req.url).searchParams;
  return proxyBackendRequest({
    path: `/api/v1/admin/users/${id}`,
    method: "GET",
    token,
    searchParams,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const token = getSessionToken(session);
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  return proxyBackendRequest({
    path: `/api/v1/admin/users/${id}`,
    method: "DELETE",
    token,
  });
}
