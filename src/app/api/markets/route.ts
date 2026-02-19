import { NextRequest } from "next/server"
import { proxyBackendRequest } from "@/lib/backend-api"

export async function GET(req: NextRequest) {
  return proxyBackendRequest({
    path: "/api/v1/markets",
    method: "GET",
    searchParams: req.nextUrl.searchParams,
  })
}
