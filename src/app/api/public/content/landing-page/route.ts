import { proxyBackendRequest } from "@/lib/backend-api"

export async function GET() {
  return proxyBackendRequest({
    path: "/api/v1/public/content/landing-page",
    method: "GET",
  })
}
