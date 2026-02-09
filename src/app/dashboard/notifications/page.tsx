"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { LoadingLogo } from "@/components/ui/LoadingLogo"
import { useToast } from "@/components/ui/toast-notification"
import { cn } from "@/lib/utils"
import {
  IconBell,
  IconCheck,
  IconTrendingUp,
  IconUsers,
  IconMessage,
  IconSettings,
  IconFilter,
  IconChevronDown,
  IconLoader3,
  IconTrash,
  IconMailOpened,
  IconMail,
  IconX
} from "@tabler/icons-react"
import { mockUser } from "@/lib/mockData"

type NotificationType = "bet" | "group" | "social" | "system"
type NotificationFilter = "all" | "unread" | "bet" | "group" | "social" | "system"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  is_read: boolean
  created_date: string
}

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "bet",
    title: "Bet Settled",
    message: "Your bet on 'Will Bitcoin reach $100k?' has been settled. You won $250!",
    is_read: false,
    created_date: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: "2",
    type: "group",
    title: "New Group Post",
    message: "John posted in Premier League Fanatics: 'What are your predictions for the weekend?'",
    is_read: false,
    created_date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: "3",
    type: "social",
    title: "New Follower",
    message: "Sarah started following you",
    is_read: true,
    created_date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: "4",
    type: "bet",
    title: "Bet Expiring Soon",
    message: "Your bet 'NBA Finals Winner' closes in 2 hours",
    is_read: false,
    created_date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
  },
  {
    id: "5",
    type: "system",
    title: "Account Upgraded",
    message: "Congratulations! You've been upgraded to High Roller tier",
    is_read: true,
    created_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: "6",
    type: "group",
    title: "Group Invitation",
    message: "Mike invited you to join 'Crypto Traders'",
    is_read: false,
    created_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  }
]

const FILTER_OPTIONS: { value: NotificationFilter; label: string; icon: any }[] = [
  { value: "all", label: "All", icon: IconBell },
  { value: "unread", label: "Unread", icon: IconMail },
  { value: "bet", label: "Bets", icon: IconTrendingUp },
  { value: "group", label: "Groups", icon: IconUsers },
  { value: "social", label: "Social", icon: IconMessage },
  { value: "system", label: "System", icon: IconSettings }
]

export default function NotificationsPage() {
  const toast = useToast()
  
  // Loading states
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isMarkingRead, setIsMarkingRead] = useState<string | null>(null)
  const [isDeletingNotif, setIsDeletingNotif] = useState<string | null>(null)
  
  // Data
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedFilter, setSelectedFilter] = useState<NotificationFilter>("all")
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  // Load notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(MOCK_NOTIFICATIONS)
      setIsPageLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications

    if (selectedFilter === "unread") {
      filtered = filtered.filter(n => !n.is_read)
    } else if (selectedFilter !== "all") {
      filtered = filtered.filter(n => n.type === selectedFilter)
    }

    return filtered
  }, [notifications, selectedFilter])

  // Statistics
  const stats = useMemo(() => {
    const unreadCount = notifications.filter(n => !n.is_read).length
    const byType = notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return { unreadCount, byType }
  }, [notifications])

  // Mark as read
  const handleMarkAsRead = useCallback(async (id: string) => {
    setIsMarkingRead(id)
    
    setTimeout(() => {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      )
      setIsMarkingRead(null)
      toast.success("Marked as Read", "Notification marked as read")
    }, 500)
  }, [toast])

  // Mark all as read
  const handleMarkAllAsRead = useCallback(async () => {
    setBulkActionLoading(true)
    
    setTimeout(() => {
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      )
      setBulkActionLoading(false)
      toast.success("All Read", "All notifications marked as read")
    }, 1000)
  }, [toast])

  // Delete notification
  const handleDelete = useCallback(async (id: string) => {
    setIsDeletingNotif(id)
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
      setIsDeletingNotif(null)
      toast.success("Deleted", "Notification removed")
    }, 500)
  }, [toast])

  // Close filter menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showFilterMenu && !target.closest('[data-filter-menu]')) {
        setShowFilterMenu(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showFilterMenu) {
        setShowFilterMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showFilterMenu])

  // Get notification icon and color
  const getNotificationStyle = (type: NotificationType) => {
    const styles = {
      bet: { icon: IconTrendingUp, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
      group: { icon: IconUsers, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
      social: { icon: IconMessage, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
      system: { icon: IconSettings, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" }
    }
    return styles[type]
  }

  // Time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "Just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  if (isPageLoading) {
    return <LoadingLogo fullScreen size="lg" />
  }

  return (
    <div className="space-y-8 pb-20 pl-0 md:pl-8">
      <DashboardHeader
        user={mockUser}
        subtitle="Stay updated with your latest activity"
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header with Actions */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            

            <div className="flex items-center gap-2">
              {/* Filter Dropdown */}
              <div className="relative" data-filter-menu>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white hover:border-black/10 transition-all cursor-pointer"
                >
                  <IconFilter className="w-4 h-4 text-black/60" />
                  <span className="text-sm font-medium text-black/70 capitalize">
                    {FILTER_OPTIONS.find(f => f.value === selectedFilter)?.label}
                  </span>
                  <IconChevronDown className={cn(
                    "w-4 h-4 text-black/40 transition-transform",
                    showFilterMenu && "rotate-180"
                  )} />
                </motion.button>

                <AnimatePresence>
                  {showFilterMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 right-0 w-48 bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      {FILTER_OPTIONS.map((option) => {
                        const Icon = option.icon
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSelectedFilter(option.value)
                              setShowFilterMenu(false)
                            }}
                            className={cn(
                              "w-full px-4 py-3 text-left transition-colors cursor-pointer flex items-center gap-3",
                              selectedFilter === option.value
                                ? "bg-black/5 text-black/90"
                                : "text-black/60 hover:bg-black/5"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{option.label}</span>
                          </button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mark All Read */}
              {stats.unreadCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMarkAllAsRead}
                  disabled={bulkActionLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white font-medium hover:bg-black/90 transition-all cursor-pointer disabled:opacity-50 text-sm"
                >
                  {bulkActionLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <IconLoader3 className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <IconMailOpened className="w-4 h-4" />
                  )}
                  Mark All Read
                </motion.button>
              )}
            </div>
          </div>


          {/* Notifications List */}
          <div className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />

            <div className="divide-y divide-black/5">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
                    <IconBell className="w-8 h-8 text-black/20" />
                  </div>
                  <h3 className="text-lg font-medium text-black/60 mb-2">No notifications</h3>
                  <p className="text-sm text-black/40">
                    {selectedFilter === "unread" 
                      ? "You're all caught up!"
                      : "You don't have any notifications yet"}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification, index) => {
                  const style = getNotificationStyle(notification.type)
                  const Icon = style.icon
                  const isDeleting = isDeletingNotif === notification.id
                  const isMarking = isMarkingRead === notification.id

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setSelectedNotification(notification)
                      }}
                      className={cn(
                        "group relative p-6 hover:bg-white border-b border-black/5 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6",
                        !notification.is_read ? "bg-blue-50/20" : "bg-white/40",
                        isDeleting && "opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">

                        {/* Icon - Styled like my-bets */}
                        <div className={cn(
                          "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all shadow-sm group-hover:scale-105",
                          style.bg,
                          style.border,
                          !notification.is_read && "border-blue-500"
                        )}>
                          <Icon className={cn("w-4 h-4", style.color)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-black/90 text-[15px] group-hover:text-black transition-colors truncate">
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0"></span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-black/40">
                            <span className="capitalize px-2 py-0.5 rounded-md bg-black/5 text-[10px] font-semibold border border-black/5">
                              {notification.type}
                            </span>
                            <span className="text-black/10">•</span>
                            <span className="font-medium">{getTimeAgo(notification.created_date)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right-aligned actions (styled like my-bets wager area) */}
                      <div className="flex items-center gap-6 pl-12 md:pl-0">
                        {/* Short Message Preview */}
                        <div className="hidden lg:block max-w-[200px] text-right">
                          <p className="text-[10px] font-semibold text-black/20 uppercase tracking-widest mb-1">
                            Preview
                          </p>
                          <p className="text-sm text-black/50 truncate font-medium">
                            {notification.message}
                          </p>
                        </div>

                        <div className="w-px h-10 bg-black/5 hidden md:block" />

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 translate-x-2 group-hover:translate-x-0 transition-transform">
                          {!notification.is_read && (
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification.id)
                              }}
                              disabled={isMarking}
                              className="p-2.5 hover:bg-blue-50 rounded-xl transition-all cursor-pointer disabled:opacity-50 text-blue-600 hover:shadow-sm"
                              title="Mark as read"
                            >
                              {isMarking ? (
                                <IconLoader3 className="w-4 h-4 animate-spin" />
                              ) : (
                                <IconCheck className="w-4 h-4" />
                              )}
                            </motion.button>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(notification.id)
                            }}
                            disabled={isDeleting}
                            className="p-2.5 hover:bg-red-50 rounded-xl transition-all cursor-pointer disabled:opacity-50 text-red-500 hover:shadow-sm"
                            title="Delete"
                          >
                            {isDeleting ? (
                              <IconLoader3 className="w-4 h-4 animate-spin" />
                            ) : (
                              <IconTrash className="w-4 h-4" />
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2">
            <IconBell className="h-5 w-5 text-black/40" />
            <h2 className="text-lg font-medium text-black/90">
              Overview
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />

            <div className="p-6 space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Unread</span>
                  <IconMail className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-medium text-blue-900">{stats.unreadCount}</p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

              <div className="space-y-3">
                <p className="text-xs font-medium text-black/40 uppercase tracking-wider">
                  By Category
                </p>

                {FILTER_OPTIONS.slice(2).map((option) => {
                  const Icon = option.icon
                  const count = stats.byType[option.value] || 0
                  
                  return (
                    <div
                      key={option.value}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-black/5"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-black/60" />
                        <span className="text-sm font-medium text-black/90">
                          {option.label}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-black/60">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-white/20"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-black/5 to-transparent" />
              
              <div className="p-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-2xl border transition-all shadow-sm",
                      getNotificationStyle(selectedNotification.type).bg,
                      getNotificationStyle(selectedNotification.type).border
                    )}>
                      {(() => {
                        const style = getNotificationStyle(selectedNotification.type);
                        const Icon = style.icon;
                        return <Icon className={cn("w-4 h-4", style.color)} />
                      })()}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-black/90 tracking-tight">
                        {selectedNotification.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest px-2 py-0.5 rounded-md bg-black/5 border border-black/5">
                          {selectedNotification.type}
                        </span>
                        <span className="text-black/20 text-xs">·</span>
                        <span className="text-xs text-black/40 font-medium">
                          {getTimeAgo(selectedNotification.created_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="p-3 rounded-2xl hover:bg-black/5 text-black/40 hover:text-black/90 transition-all cursor-pointer"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-black/[0.02] border border-black/[0.03] relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-black/[0.02] blur-2xl group-hover:bg-black/[0.04] transition-all" />
                    <p className="text-base text-black/70 leading-relaxed relative z-10">
                      {selectedNotification.message}
                    </p>
                  </div>

                  {/* Actions Area */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        handleMarkAsRead(selectedNotification!.id);
                        setSelectedNotification(null);
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-black text-white font-medium hover:bg-black/90 transition-all cursor-pointer shadow-lg shadow-black/10 active:scale-95"
                    >
                      <IconCheck className="w-5 h-5" />
                      Mark Read
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(selectedNotification!.id);
                        setSelectedNotification(null);
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-all cursor-pointer border border-red-100 active:scale-95"
                    >
                      <IconTrash className="w-5 h-5" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Visual Flair at Bottom */}
                <div className="mt-8 pt-8 border-t border-black/[0.05] flex items-center justify-center">
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-black/40 uppercase tracking-[0.2em]">
                    <IconBell className="w-3 h-3" />
                    Ante Social Notifications
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}