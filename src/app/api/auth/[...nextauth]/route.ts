import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "http://localhost:3001"

type AuthUser = {
  id: string
  email: string
  username: string | null
  role: string
  user_level: string
  email_verified: boolean
  access_token?: string
}

type AuthToken = JWT & Partial<AuthUser>
type AuthSession = Session & { access_token?: string }
type AuthCredentials = {
  email?: string
  password?: string
  userId?: string
  twoFactorCode?: string
}

function getErrorMessage(payload: any, fallback: string) {
  const message = payload?.error?.message || payload?.message || payload?.error
  return typeof message === "string" && message.trim() ? message : fallback
}

function mapAuthUser(payload: any, fallbackEmail?: string): AuthUser {
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
  }
}

async function postToBackend(path: string, body: Record<string, unknown>) {
  let response: Response

  try {
    response = await fetch(`${BACKEND_API_URL}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })
  } catch {
    throw new Error("AUTH_SERVICE_UNAVAILABLE")
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Authentication failed"))
  }

  return payload
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

          const payload = await postToBackend("/api/v1/auth/2fa/verify", {
            userId,
            token: twoFactorCode,
          })

          return mapAuthUser(payload)
        }

        const email = authCredentials?.email?.trim().toLowerCase()
        const password = authCredentials?.password

        if (!email || !password) {
          throw new Error("Missing credentials")
        }

        const payload = await postToBackend("/api/v1/auth/login", {
          email,
          password,
        })

        if (payload?.requires_2fa) {
          const pendingUserId = payload?.userId || payload?.session_token
          if (!pendingUserId) {
            throw new Error("2FA_REQUIRED")
          }
          throw new Error(`2FA_REQUIRED:${pendingUserId}`)
        }

        return mapAuthUser(payload, email)
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      const authToken = token as AuthToken
      if (user) {
        const authUser = user as unknown as AuthUser
        authToken.id = authUser.id
        authToken.role = authUser.role
        authToken.username = authUser.username
        authToken.user_level = authUser.user_level
        authToken.email_verified = authUser.email_verified
        authToken.access_token = authUser.access_token
      }
      return authToken
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
      return authSession
    },
  },
  pages: {
    signIn: '/login',
    verifyRequest: '/verify-email',
    error: '/auth/error',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
