import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"

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
const ACCESS_TOKEN_REFRESH_BUFFER_MS = Number(
  process.env.ACCESS_TOKEN_REFRESH_BUFFER_MS || 60_000,
)

type AuthUser = {
  id: string
  email: string
  username: string | null
  role: string
  user_level: string
  email_verified: boolean
  access_token?: string
  refresh_token?: string
  access_token_expires_at?: number
}

type AuthToken = JWT & Partial<AuthUser>
type AuthSession = Session & {
  access_token?: string
  accessToken?: string
  error?: string
}
type AuthCredentials = {
  email?: string
  password?: string
  userId?: string
  twoFactorCode?: string
}

type BackendErrorPayload = {
  error?: { message?: string } | string
  message?: string
}

function getErrorMessage(payload: BackendErrorPayload | null, fallback: string) {
  const message =
    (typeof payload?.error === "object" ? payload.error?.message : payload?.error) ||
    payload?.message
  return typeof message === "string" && message.trim() ? message : fallback
}

type BackendAuthPayload = {
  user?: {
    id?: string
    _id?: string
    email?: string
    username?: string | null
    role?: string
    tier?: string
    user_level?: string
    emailVerified?: boolean
    email_verified?: boolean
  }
  userId?: string
  access_token?: string
  refresh_token?: string
  requires_2fa?: boolean
  session_token?: string
}

function getJwtExpiryMs(token?: string): number | undefined {
  if (!token) return undefined
  const parts = token.split(".")
  if (parts.length < 2) return undefined

  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as {
      exp?: unknown
    }
    if (typeof payload.exp === "number" && Number.isFinite(payload.exp)) {
      return payload.exp * 1000
    }
  } catch {
    return undefined
  }

  return undefined
}

function mapAuthUser(payload: BackendAuthPayload, fallbackEmail?: string): AuthUser {
  const id = payload?.user?.id || payload?.user?._id || payload?.userId

  if (!id) {
    throw new Error("AUTH_RESPONSE_INVALID")
  }

  return {
    id: String(id),
    email: payload?.user?.email || fallbackEmail || "",
    username: payload?.user?.username || null,
    role: payload?.user?.role || "user",
    user_level: payload?.user?.tier || payload?.user?.user_level || "novice",
    email_verified: Boolean(payload?.user?.emailVerified || payload?.user?.email_verified),
    access_token: payload?.access_token,
    refresh_token: payload?.refresh_token,
    access_token_expires_at:
      getJwtExpiryMs(payload?.access_token) || Date.now() + 10 * 60 * 1000,
  }
}

async function postToBackend(
  gatewayPath: string,
  body: Record<string, unknown>,
  authServicePath: string,
) {
  const gatewayCandidate = BACKEND_API_URL ? `${BACKEND_API_URL}${gatewayPath}` : null
  const authCandidate = AUTH_SERVICE_URL
    ? `${AUTH_SERVICE_URL}${authServicePath}`
    : null
  const candidates = isLocalGateway
    ? [authCandidate, gatewayCandidate].filter(Boolean) as string[]
    : [gatewayCandidate, authCandidate].filter(Boolean) as string[]

  if (candidates.length === 0) {
    throw new Error("AUTH_BACKEND_NOT_CONFIGURED")
  }

  let fallbackError: string | null = null
  let sawNetworkFailure = false
  const startedAt = Date.now()

  for (const url of candidates) {
    const elapsedMs = Date.now() - startedAt
    const remainingMs = AUTH_TOTAL_TIMEOUT_MS - elapsedMs
    if (remainingMs <= 200) {
      break
    }

    let response: Response
    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(),
      Math.max(500, Math.min(AUTH_REQUEST_TIMEOUT_MS, remainingMs)),
    )

    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: controller.signal,
      })
    } catch {
      sawNetworkFailure = true
      clearTimeout(timeout)
      continue
    }
    clearTimeout(timeout)

    const payload = await response.json().catch(() => null)

    if (response.ok) {
      return payload as BackendAuthPayload
    }

    const message = getErrorMessage(payload as BackendErrorPayload | null, "Authentication failed")

    if (
      response.status >= 500 ||
      response.status === 404 ||
      response.status === 502 ||
      response.status === 408
    ) {
      fallbackError = message
      continue
    }

    throw new Error(message)
  }

  if (sawNetworkFailure && !fallbackError) {
    throw new Error("AUTH_SERVICE_UNAVAILABLE")
  }

  throw new Error(fallbackError || "Authentication failed")
}

async function refreshAccessToken(authToken: AuthToken): Promise<AuthToken> {
  if (!authToken.refresh_token) {
    return {
      ...authToken,
      error: "MISSING_REFRESH_TOKEN",
    }
  }

  try {
    const payload = await postToBackend(
      "/api/v1/auth/refresh",
      { refreshToken: authToken.refresh_token },
      "/auth/refresh",
    )

    const mapped = mapAuthUser(
      {
        ...payload,
        user: {
          ...payload.user,
          id: payload.user?.id || payload.user?._id || authToken.id,
          email:
            payload.user?.email ||
            (typeof authToken.email === "string" ? authToken.email : undefined),
          username:
            payload.user?.username !== undefined
              ? payload.user.username
              : authToken.username || null,
          role: payload.user?.role || authToken.role || "user",
          tier: payload.user?.tier || authToken.user_level || "novice",
          emailVerified:
            payload.user?.emailVerified !== undefined
              ? payload.user.emailVerified
              : Boolean(authToken.email_verified),
        },
      },
      typeof authToken.email === "string" ? authToken.email : undefined,
    )

    return {
      ...authToken,
      ...mapped,
      error: undefined,
    }
  } catch {
    return {
      ...authToken,
      error: "REFRESH_ACCESS_TOKEN_ERROR",
    }
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        userId: { label: "User ID", type: "text" },
        twoFactorCode: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials) {
        const authCredentials = credentials as AuthCredentials | undefined
        const userId = authCredentials?.userId?.trim()
        const twoFactorCode = authCredentials?.twoFactorCode?.trim()

        if (userId || twoFactorCode) {
          if (!userId || !twoFactorCode) {
            throw new Error("2FA_INPUT_INCOMPLETE")
          }

          const payload = await postToBackend(
            "/api/v1/auth/2fa/verify",
            { userId, token: twoFactorCode },
            "/auth/2fa/verify",
          )

          return mapAuthUser(payload)
        }

        const email = authCredentials?.email?.trim().toLowerCase()
        const password = authCredentials?.password

        if (!email || !password) {
          throw new Error("Missing credentials")
        }

        const payload = await postToBackend(
          "/api/v1/auth/login",
          { email, password },
          "/auth/login",
        )

        if (payload?.requires_2fa) {
          const pendingUserId = payload?.userId || payload?.session_token
          if (!pendingUserId) {
            throw new Error("2FA_REQUIRED")
          }
          throw new Error(`2FA_REQUIRED:${pendingUserId}`)
        }

        return mapAuthUser(payload, email)
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const authToken = token as AuthToken
      if (user) {
        const authUser = user as unknown as AuthUser
        authToken.id = authUser.id
        authToken.role = authUser.role
        authToken.username = authUser.username
        authToken.user_level = authUser.user_level
        authToken.email_verified = authUser.email_verified
        authToken.access_token = authUser.access_token
        authToken.refresh_token = authUser.refresh_token
        authToken.access_token_expires_at = authUser.access_token_expires_at
        authToken.error = undefined
      }

      if (trigger === "update" && session && typeof session === "object") {
        const sessionUser = (session as { user?: Record<string, unknown> }).user || {}
        const nextUsername = sessionUser.username
        const nextRole = sessionUser.role
        const nextUserLevel = sessionUser.user_level
        const nextVerified = sessionUser.email_verified

        if (typeof nextUsername === "string" || nextUsername === null) {
          authToken.username = nextUsername
        }
        if (typeof nextRole === "string" && nextRole.trim()) {
          authToken.role = nextRole
        }
        if (typeof nextUserLevel === "string" && nextUserLevel.trim()) {
          authToken.user_level = nextUserLevel
        }
        if (typeof nextVerified === "boolean") {
          authToken.email_verified = nextVerified
        }
      }

      if (!authToken.access_token) {
        return authToken
      }

      const expiresAt = Number(authToken.access_token_expires_at || 0)
      const needsRefresh =
        !expiresAt || Date.now() >= expiresAt - ACCESS_TOKEN_REFRESH_BUFFER_MS

      if (!needsRefresh) {
        return authToken
      }

      return refreshAccessToken(authToken)
    },
    async session({ session, token }) {
      const authToken = token as AuthToken
      const authSession = session as AuthSession

      if (authSession.user) {
        authSession.user.id = authToken.id || ""
        authSession.user.role = authToken.role || "user"
        authSession.user.username = authToken.username || null
        authSession.user.user_level = authToken.user_level || "novice"
        authSession.user.email_verified = Boolean(authToken.email_verified)
      }
      authSession.access_token = authToken.access_token
      authSession.accessToken = authToken.access_token
      if (typeof authToken.error === "string" && authToken.error) {
        authSession.error = authToken.error
      }
      return authSession
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-email",
    error: "/auth/error",
  },
}
