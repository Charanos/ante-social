import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    access_token?: string
    accessToken?: string
    error?: string
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
    email_verified?: boolean
    user_level: string
    access_token?: string
    refresh_token?: string
    access_token_expires_at?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    username: string | null
    user_level: string
    email_verified?: boolean
    access_token?: string
    refresh_token?: string
    access_token_expires_at?: number
    error?: string
  }
}
