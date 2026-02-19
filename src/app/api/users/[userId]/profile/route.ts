import { proxyBackendRequest } from "@/lib/backend-api"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  return proxyBackendRequest({
    path: `/api/v1/users/${userId}/profile`,
    method: "GET",
  })
}

