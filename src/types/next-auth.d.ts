import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      username: string | null
      email_verified: boolean
      user_level: string
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    username: string | null
    emailVerified: Date | null
    user_level: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    username: string | null
    user_level: string
  }
}
