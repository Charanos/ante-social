import { proxyBackendRequest } from "@/lib/backend-api"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  return proxyBackendRequest({
    path: "/api/v1/public/leaderboard",
    method: "GET",
    searchParams,
  })
}
