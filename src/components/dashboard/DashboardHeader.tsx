"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  IconAccessPoint,
  IconArrowLeft,
  IconAward,
  IconBell,
  IconChevronRight,
  IconRotate,
  IconWallet,
  IconTrendingUp,
  IconLoader3,
} from "@tabler/icons-react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useQueryClient, useIsFetching } from "@tanstack/react-query"
import { MobileHeader } from "./MobileHeader"
import { UserAvatar } from "../ui/UserAvatar"
import { cn } from "@/lib/utils"

import { UserProfile } from "@/types/user"
import { 
  EMPTY_USER, 
  useLiveUser, 
  useUnreadNotificationsCount, 
  emitGlobalRefresh 
} from "@/lib/live-data"
import { useCurrency } from "@/lib/utils/currency"

interface DashboardHeaderProps {
  user?: UserProfile
  subtitle?: string
}

export default function DashboardHeader({
  user: initialUser,
  subtitle,
}: DashboardHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user: liveUser } = useLiveUser()
  const unreadCount = useUnreadNotificationsCount()
  const user = initialUser || liveUser || EMPTY_USER
  const { preferredCurrency, formatCurrency, toggleCurrency, isToggling } = useCurrency()
  
  const queryClient = useQueryClient()
  const isFetching = useIsFetching() > 0

  // Back button logic
  const handleBack = () => {
    const parts = pathname?.split("/").filter(Boolean) || []
    if (parts.length > 2) {
      router.back()
    } else {
      router.push("/dashboard")
    }
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries()
    emitGlobalRefresh()
  }

  const isHome = pathname === "/dashboard"
  
  // Get clean title from pathname
  const getTitle = () => {
    const parts = pathname?.split("/").filter(Boolean) || []
    const lastPart = parts[parts.length - 1] || "Dashboard"
    return lastPart
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const title = getTitle()

  // Navigate to notifications
  const handleNotifications = () => {
    router.push("/dashboard/notifications")
  }

  // Navigate to wallet
  const handleWallet = () => {
    router.push("/dashboard/wallet")
  }

  return (
    <>
      <MobileHeader 
        user={user} 
        onRefresh={handleRefresh} 
        isRefreshing={isFetching} 
      />
      
      <div className="hidden md:flex md:items-center justify-between gap-4 px-1 mb-12">
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            {!isHome && (
              <motion.button
                key="back-button"
                onClick={handleBack}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white hover:border-black/10 hover:shadow-sm transition-all cursor-pointer group"
              >
                <IconArrowLeft className="w-4 h-4 text-black/60 group-hover:-translate-x-0.5 transition-transform" />
              </motion.button>
            )}
          </AnimatePresence>
          
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-black/90 capitalize leading-none mb-1">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-black/50 font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Compact Stats & Actions */}
        <div className="flex items-center gap-2">
          {/* Accuracy Badge */}
          <motion.div
            className="flex items-center gap-1.5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/60 rounded-lg px-2.5 py-1.5 shadow-sm"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <IconTrendingUp className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-semibold text-green-700 font-mono">
              {user.signalAccuracy}%
            </span>
          </motion.div>

          {/* Reputation Badge */}
          <motion.div
            className="flex items-center gap-1.5 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/60 rounded-lg px-2.5 py-1.5 shadow-sm"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <IconAward className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-xs font-semibold text-purple-700 font-mono">
              {user.reputationScore}
            </span>
          </motion.div>

          {/* Divider */}
          <div className="h-6 w-px bg-black/10" />

          {/* Balance Pill - Clickable */}
          <motion.button
            onClick={handleWallet}
            className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/60 rounded-lg px-3 py-1.5 cursor-pointer hover:shadow-md transition-all shadow-sm group"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <IconWallet className="w-3.5 h-3.5 text-blue-600" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold font-mono text-blue-900">
                {formatCurrency(user.balance)}
              </span>
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
            </div>
          </motion.button>

          {/* Currency Toggle */}
          <motion.button
            onClick={toggleCurrency}
            disabled={isToggling}
            className="flex items-center gap-2 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/60 rounded-lg px-2.5 py-1.5 cursor-pointer hover:shadow-md transition-all shadow-sm group disabled:opacity-50"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            title="Toggle Currency"
          >
            <span className="text-[10px] font-semibold text-orange-700 font-mono tracking-wider">
              {isToggling ? (
                <IconLoader3 className="w-3 h-3 animate-spin text-orange-600" />
              ) : (
                preferredCurrency
              )}
            </span>
          </motion.button>

          {/* Tier Badge */}
          <div className="bg-black/5 text-black/70 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg uppercase tracking-wider border border-black/10">
            {user.tier}
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-black/10" />

          {/* Refresh Button */}
          <motion.button
            onClick={handleRefresh}
            className="flex items-center justify-center w-9 h-9 bg-white/60 backdrop-blur-sm border border-black/5 rounded-lg hover:bg-white hover:border-black/10 hover:shadow-sm transition-all cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Refresh data"
            disabled={isFetching}
          >
            <IconRotate className={cn(
              "w-4 h-4 text-black/60 transition-transform",
              isFetching && "animate-spin"
            )} />
          </motion.button>

          {/* Notifications Bell */}
          <motion.button
            onClick={handleNotifications}
            className="relative flex items-center justify-center w-9 h-9 bg-white/60 backdrop-blur-sm border border-black/5 rounded-lg hover:bg-white hover:border-black/10 hover:shadow-sm transition-all cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Notifications"
          >
            <IconBell className="w-4 h-4 text-black/60" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-[16px] px-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-[9px] font-semibold font-mono rounded-full border-2 border-white shadow-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Profile Button */}
          <Link href="/dashboard/profile">
            <motion.button
              className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-black/5 rounded-lg px-2 py-1 cursor-pointer hover:bg-white hover:border-black/10 hover:shadow-sm transition-all group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserAvatar 
                src={user.avatarUrl} 
                name={user.username} 
                size="xs" 
                border={false}
                className="group-hover:scale-105 transition-transform"
              />

              <span className="hidden lg:block text-xs font-semibold text-black/70">
                {user.username || "Guest"}
              </span>

              <IconChevronRight className="hidden lg:block w-3 h-3 text-black/40 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </Link>
        </div>
      </div>
    </>
  )
}