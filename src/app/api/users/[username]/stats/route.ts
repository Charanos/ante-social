import { proxyBackendRequest } from "@/lib/backend-api";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  return proxyBackendRequest({
    path: `/api/v1/users/${username}/stats`,
    method: "GET",
  });
}
