const configuredBackendApiUrl =
  process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL
const BACKEND_API_URL = configuredBackendApiUrl
  ? configuredBackendApiUrl.replace(/\/+$/, "")
  : process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:3001"
const isLocalGateway =
  BACKEND_API_URL.includes("localhost") || BACKEND_API_URL.includes("127.0.0.1")
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL ||
  (isLocalGateway ? "http://localhost:3002" : "")
const AUTH_REQUEST_TIMEOUT_MS = Number(process.env.AUTH_REQUEST_TIMEOUT_MS || 3000)
const AUTH_TOTAL_TIMEOUT_MS = Number(process.env.AUTH_TOTAL_TIMEOUT_MS || 7000)

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))

  const payload = {
    email: body.email,
    token: body.otp, // Mapping frontend 'otp' to backend 'token'
  }

  const gatewayCandidate = BACKEND_API_URL ? `${BACKEND_API_URL}/api/v1/auth/verify-email` : null
  const authCandidate = AUTH_SERVICE_URL
    ? `${AUTH_SERVICE_URL}/auth/verify-email`
    : null
  const candidates = isLocalGateway
    ? [authCandidate, gatewayCandidate].filter(Boolean) as string[]
    : [gatewayCandidate, authCandidate].filter(Boolean) as string[]

  if (candidates.length === 0) {
    return Response.json(
      {
        success: false,
        error: { code: "BACKEND_URL_NOT_CONFIGURED", message: "Set BACKEND_API_URL for this environment" },
      },
      { status: 503 },
    )
  }

  let lastError: string | null = null
  const startedAt = Date.now()

  for (const url of candidates) {
    const elapsedMs = Date.now() - startedAt
    const remainingMs = AUTH_TOTAL_TIMEOUT_MS - elapsedMs
    if (remainingMs <= 200) {
      break
    }

    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(),
      Math.max(500, Math.min(AUTH_REQUEST_TIMEOUT_MS, remainingMs)),
    )
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: controller.signal,
      })
      clearTimeout(timeout)

      const text = await response.text()
      const contentType = response.headers.get("content-type") || "application/json"

      if (response.ok) {
        return new Response(text, {
          status: response.status,
          headers: { "content-type": contentType },
        })
      }

      if (
        response.status < 500 &&
        response.status !== 404 &&
        response.status !== 502 &&
        response.status !== 408
      ) {
        return new Response(text, {
          status: response.status,
          headers: { "content-type": contentType },
        })
      }

      lastError = text
    } catch (e) {
      clearTimeout(timeout)
      lastError = (e as Error).message
      continue
    }
  }

  if (lastError) {
    return new Response(JSON.stringify({ success: false, message: lastError }), {
      status: 502,
      headers: { "content-type": "application/json" },
    })
  }

  return Response.json(
    { success: false, error: { code: "UPSTREAM_UNAVAILABLE", message: "Auth service unavailable" } },
    { status: 502 },
  )
}
