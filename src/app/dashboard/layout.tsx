"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileNav } from "@/components/layout/MobileNav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`p-4 pb-24 md:pb-4 transition-all duration-300 ${sidebarCollapsed ? 'sm:ml-20' : 'sm:ml-64'}`}>
        <div className="mt-0 rounded-lg p-4 pl-6">
          {children}
        </div>
      </div>
      <MobileNav user={null} />
    </div>
  )
}
