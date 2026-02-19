import { proxyBackendRequest } from "@/lib/backend-api"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const url = new URL(req.url)

  return proxyBackendRequest({
    path: `/api/v1/markets/${id}`,
    method: "GET",
    searchParams: url.searchParams,
  })
}
