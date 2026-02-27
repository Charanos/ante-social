import { proxyBackendRequest } from "@/lib/backend-api"
import { NextRequest } from "next/server"

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  return proxyBackendRequest({
    path: `/api/v1/public/blogs/${slug}/view`,
    method: "POST",
  })
}
