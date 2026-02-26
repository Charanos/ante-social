import { proxyBackendRequest } from "@/lib/backend-api"

export async function POST(req: Request) {
  const body = await req.json()
  return proxyBackendRequest({
    path: "/api/v1/public/newsletter/subscribe",
    method: "POST",
    jsonBody: body,
  })
}
