import { proxyBackendRequest } from "@/lib/backend-api"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))

  const payload = {
    username: body.username,
    email: body.email,
    password: body.password,
    phone: body.phone,
    dateOfBirth: body.dateOfBirth || body.dob,
    currency: body.currency,
  }

  return proxyBackendRequest({
    path: "/api/v1/auth/register",
    method: "POST",
    jsonBody: payload,
  })
}
