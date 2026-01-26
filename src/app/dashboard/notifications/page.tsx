"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { Bell, Check, CheckCheck, Filter, TrendingUp, AlertCircle, DollarSign, Settings } from "lucide-react"

// Mock data
const mockNotifications = [
  {
    id: "1",
    title: "Payment Received",
    message: "Your payment from John Doe has been processed successfully.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    is_read: false,
    icon: <DollarSign className="h-4 w-4" />,
    amount: 1250.00,
    type: "payment"
  },
  {
    id: "2",
    title: "Account Alert",
    message: "Unusual activity detected on your account. Please review your recent transactions.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    is_read: false,
    icon: <AlertCircle className="h-4 w-4" />,
    type: "alert"
  },
  {
    id: "3",
    title: "Portfolio Update",
    message: "Your portfolio has increased by 5.2% this week.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    is_read: true,
    icon: <TrendingUp className="h-4 w-4" />,
    type: "update"
  },
  {
    id: "4",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 2-4 AM EST.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    is_read: true,
    icon: <Settings className="h-4 w-4" />,
    type: "system"
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState("all")
  const [selectedNotification, setSelectedNotification] = useState<typeof mockNotifications[0] | null>(null)

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, is_read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  const filteredNotifications = filter === "all"
    ? notifications
    : notifications.filter(n => n.type === filter)

  const getTimeAgo = (timestamp: string) => {
    const now = Date.now()
    const time = new Date(timestamp).getTime()
    const diff = now - time

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "payment": return "bg-emerald-50 text-emerald-600 border-emerald-100"
      case "alert": return "bg-amber-50 text-amber-600 border-amber-100"
      case "update": return "bg-gray-50 text-gray-600 border-gray-100"
      case "system": return "bg-slate-50 text-slate-600 border-slate-100"
      default: return "bg-gray-50 text-gray-600 border-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        subtitle={unreadCount > 0 ? `${unreadCount} new notifications waiting for you` : "You're all caught up!"}
      />

      {unreadCount > 0 && (
        <div className="flex justify-end mb-6 z-10 px-2">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={markAllAsRead}
            className="group flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-gray-900 px-4 text-white shadow-sm transition-all hover:bg-black"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span className="font-medium text-xs">Mark all read</span>
          </motion.button>
        </div>
      )}

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {["all", "payment", "alert", "update", "system"].map((filterType) => (
          <motion.button
            key={filterType}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(filterType)}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${filter === filterType
              ? "bg-gray-900 text-white shadow-md shadow-gray-900/20"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DashboardCard className="p-0 overflow-hidden border-0 shadow-xl">
          <div className="divide-y divide-gray-100">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center py-20 text-center px-4"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-gray-100 blur-2xl opacity-50" />
                    <div className="relative rounded-full bg-linear-to-br from-gray-50 to-gray-100 p-8 border border-gray-200">
                      <Bell className="h-12 w-12 text-gray-300" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-500 max-w-sm">
                    {filter !== "all"
                      ? `No ${filter} notifications at the moment`
                      : "You're all caught up! We'll notify you when something new happens."}
                  </p>
                </motion.div>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`group relative flex items-start gap-5 px-6 py-6 transition-all ${!notification.is_read
                      ? 'bg-linear-to-r from-gray-50/50 to-transparent hover:from-gray-50'
                      : 'hover:bg-gray-50/50'
                      }`}
                    onClick={() => {
                      markAsRead(notification.id)
                      setSelectedNotification(notification)
                    }}
                  >
                    {/* Unread Indicator Bar */}
                    {!notification.is_read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-500 to-indigo-500" />
                    )}

                    {/* Icon */}
                    <div className={`relative flex-shrink-0 rounded-xl p-3.5 transition-all border ${!notification.is_read
                      ? getTypeColor(notification.type) + ' shadow-sm'
                      : 'bg-white border-gray-200 group-hover:shadow-md group-hover:border-gray-300'
                      }`}>
                      {notification.icon}
                      {!notification.is_read && (
                        <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-gray-500 border-2 border-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-base ${!notification.is_read
                              ? 'font-medium text-gray-900'
                              : 'font-medium text-gray-700'
                              }`}>
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="inline-flex items-center rounded-md bg-gray-500 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white shadow-sm"
                              >
                                New
                              </motion.span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed pr-4">
                            {notification.message}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs font-medium text-gray-400 whitespace-nowrap font-mono">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                            className="cursor-pointer opacity-0 group-hover:opacity-100 text-xs text-gray-400 hover:text-red-600 transition-all"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>

                      {/* Amount Badge */}
                      {'amount' in notification && notification.amount && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5"
                        >
                          <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-700 font-mono">
                            {notification.amount.toFixed(2)}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Action Button */}
                    {!notification.is_read && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(notification.id)
                        }}
                        className="cursor-pointer flex-shrink-0 self-center rounded-full bg-white border-2 border-gray-200 p-1 transition-all hover:bg-gray-50 hover:border-gray-400"
                      >
                        <Check className="h-3.5 w-3.5 text-gray-600" />
                      </motion.button>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </DashboardCard>
      </motion.div>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNotification(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedNotification(null)}
                className="cursor-pointer absolute right-4 top-4 rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors z-10"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="p-8">
                {/* Icon and Type Badge */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-medium text-gray-900">{selectedNotification.title}</h2>
                      <span className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium uppercase border ${getTypeColor(selectedNotification.type)}`}>
                        {selectedNotification.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 font-mono">
                      {getTimeAgo(selectedNotification.timestamp)} • {new Date(selectedNotification.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Amount Display (if present) */}
                {'amount' in selectedNotification && selectedNotification.amount && (
                  <div className="mb-6 rounded-xl bg-emerald-50 border-2 border-emerald-200 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-emerald-900">Amount</span>
                    </div>
                    <p className="text-3xl font-medium text-emerald-700 font-mono">
                      ${selectedNotification.amount.toFixed(2)}
                    </p>
                  </div>
                )}

                {/* Message */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2 uppercase tracking-wider">Message</h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {selectedNotification.message}
                  </p>
                </div>

                {/* Actions */}
                {/* <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedNotification(null)}
                    className="cursor-pointer flex-1 rounded-xl bg-linear-to-r from-gray-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-gray-500/25 hover:shadow-xl hover:shadow-gray-500/30 transition-all"
                  >
                    Got it
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      deleteNotification(selectedNotification.id)
                      setSelectedNotification(null)
                    }}
                    className="cursor-pointer rounded-xl bg-white border-2 border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    Dismiss
                  </motion.button>
                </div> */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}