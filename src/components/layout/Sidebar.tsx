"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Wallet, Users, User, Bell, LogOut, Shield, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { cn } from "@/lib/utils"
import Image from "next/image"
import { mockNotifications } from "@/lib/mockData"

const navItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Markets", url: "/dashboard/markets", icon: TrendingUp },
  { title: "Groups", url: "/dashboard/groups", icon: Users },
  { title: "Wallet", url: "/dashboard/wallet", icon: Wallet },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "Admin", url: "/dashboard/admin", icon: Shield },
]

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  user?: any
}

export function Sidebar({ collapsed = false, onToggle = () => {}, user }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside 
      className={cn(
        "hidden md:flex fixed left-0 top-0 z-40 h-screen flex-col border-r border-gray-100 bg-white transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Floating Collapse Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-9 z-50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      <div className={cn(
    "flex h-full flex-col px-4 py-6 pt-12",
        collapsed ? "overflow-hidden" : "overflow-y-auto"
      )}>
        {/* Logo/Brand */}
        <div className={cn(
          "flex items-center transition-all duration-300 h-6 pb-12", 
          collapsed ? "justify-center" : "px-2"
        )}>
          {collapsed ? (
            <div className="relative w-40 h-40">
               <Image src="/ante-logo.png" alt="Ante Social" fill className="object-contain" />
            </div>
          ) : (
            <div className="flex items-center gap-3 ">
               <div className="relative w-32 h-32 -mr-10 -ml-10">
                  <Image src="/ante-logo.png" alt="Ante Social" fill className="object-contain" />
               </div>
               <span className="text-xl font-medium tracking-tight text-gray-900">Ante Social</span>
            </div>
          )}
        </div>

        <ul className="space-y-1.5 flex-1">
          {navItems.filter(item => item.title !== "Admin" || (session?.user as any)?.role === "admin").map((item) => {
            const isActive = pathname === item.url
            const isNotifications = item.title === "Notifications"
            const unreadCount = isNotifications ? mockNotifications.filter(n => !n.is_read).length : 0

            return (
              <li key={item.url}>
                <Link
                  href={item.url}
                  className={cn(
                    "flex items-center rounded-xl px-3 py-2.5 transition-all duration-200 group relative",
                    isActive 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                    collapsed ? "justify-center px-2" : "justify-start"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <div className="relative">
                    <item.icon className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                    )} />
                    {isNotifications && unreadCount > 0 && (
                      <span className={cn(
                        "absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white",
                        collapsed && "right-0"
                      )} />
                    )}
                  </div>
                  
                  {!collapsed && (
                    <div className="flex flex-1 items-center justify-between ml-3">
                      <span className={cn(
                        "text-sm font-medium tracking-wide transition-opacity duration-200",
                        isActive ? "text-white" : "text-gray-600 group-hover:text-gray-900"
                      )}>
                        {item.title}
                      </span>
                      {isNotifications && unreadCount > 0 && (
                        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Tooltip for collapsed mode */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 shadow-lg">
                      {item.title}
                      {isNotifications && unreadCount > 0 && ` (${unreadCount})`}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Bottom Controls */}
        <div className="mt-auto pt-6 border-t border-gray-50">
          {/* Sign Out */}
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className={cn(
              "flex w-full cursor-pointer items-center rounded-xl px-3 py-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group",
              collapsed ? "justify-center px-2" : "justify-start"
            )}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="h-5 w-5 transition-colors group-hover:text-red-600" />
            {!collapsed && <span className="ml-3 text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
