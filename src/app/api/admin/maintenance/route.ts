import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getSessionToken, proxyBackendRequest } from "@/lib/backend-api";

export async function GET() {
  const session = await getServerSession(authOptions);
  const token = getSessionToken(session);
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  return proxyBackendRequest({
    path: "/api/v1/admin/maintenance/tasks",
    method: "GET",
    token,
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const token = getSessionToken(session);
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const taskId = typeof body?.taskId === "string" ? body.taskId.trim() : "";
  if (!taskId) {
    return Response.json({ error: "Missing taskId" }, { status: 400 });
  }

  return proxyBackendRequest({
    path: `/api/v1/admin/maintenance/${encodeURIComponent(taskId)}/run`,
    method: "POST",
    token,
  });
}
