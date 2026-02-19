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

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const response = await fetch(`${BACKEND_API_URL}/api/v1/auth/login`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
          cache: "no-store",
        })

        const payload = await response.json().catch(() => null)

        if (!response.ok) {
          const message =
            payload?.error?.message ||
            payload?.message ||
            "Invalid email or password"
          throw new Error(message)
        }

        if (payload?.requires_2fa) {
          throw new Error("2FA required")
        }

        const authUser: AuthUser = {
          id: payload?.user?.id || payload?.user?._id || payload?.userId,
          email: payload?.user?.email || credentials.email,
          username: payload?.user?.username || null,
          role: payload?.user?.role || "user",
          user_level: payload?.user?.tier || payload?.user?.user_level || "novice",
          email_verified: Boolean(payload?.user?.emailVerified),
          access_token: payload?.access_token,
        }

        return authUser
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
