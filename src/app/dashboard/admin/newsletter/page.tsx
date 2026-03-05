"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { LoadingLogo } from "@/components/ui/LoadingLogo"
import { useToast } from "@/components/ui/toast-notification"
import { SearchFilterBar } from "@/components/ui/SearchFilterBar"
import { IconMail, IconUsers } from "@tabler/icons-react"

type Subscriber = {
  _id: string
  email: string
  status: string
  subscribedAt?: string
  createdAt?: string
}

export default function AdminNewsletterPage() {
  const toast = useToast()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const loadSubscribers = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/newsletter/subscribers?limit=200")
      const data = await res.json()
      setSubscribers(data.data || [])
    } catch {
      toast.error("Failed to load subscribers")
    }
    setIsLoading(false)
  }

  useEffect(() => {
    void loadSubscribers()
  }, [])

  const filtered = subscribers.filter((s) => {
    if (!searchQuery) return true
    return s.email.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (isLoading) return <LoadingLogo fullScreen size="lg" />

  return (
    <div className="space-y-10 pb-20 pl-0 md:pl-8">
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search subscribers by email..."
        activeTab="all"
        onTabChange={() => {}}
        tabs={[]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-50 p-3">
              <IconUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-black/50">Total Subscribers</p>
              <p className="text-2xl font-medium font-mono text-black/90">{subscribers.length}</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-green-50 p-3">
              <IconMail className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-black/50">Active</p>
              <p className="text-2xl font-medium font-mono text-black/90">
                {subscribers.filter((s) => s.status === "active").length}
              </p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-red-50 p-3">
              <IconMail className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-black/50">Unsubscribed</p>
              <p className="text-2xl font-medium font-mono text-black/90">
                {subscribers.filter((s) => s.status === "unsubscribed").length}
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* List */}
      <DashboardCard className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5">
                <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase tracking-wider">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-sm text-black/40">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub._id} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-black/80">{sub.email}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                        sub.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-black/50">
                      {sub.subscribedAt
                        ? new Date(sub.subscribedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  )
}
