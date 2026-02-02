"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoaderPinwheel, ShieldAlert } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (session?.user?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <LoaderPinwheel className="h-8 w-8 animate-spin text-neutral-500" />
      </div>
    )
  }

  if (!session || session.user.role !== "admin") {
    return null
  }

  return (
    <div className="space-y-6">
      {children}
    </div>
  )
}
