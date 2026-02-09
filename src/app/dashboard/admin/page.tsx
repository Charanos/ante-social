"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { LoadingLogo } from "@/components/ui/LoadingLogo"
import { useToast } from "@/components/ui/toast-notification"
import { cn } from "@/lib/utils"
import {
  IconActivity,
  IconAward,
  IconCurrencyDollar,
  IconEdit,
  IconEye,
  IconFileText,
  IconPlus,
  IconSearch,
  IconSettings,
  IconShield,
  IconTarget,
  IconTrendingUp,
  IconUser,
  IconUsers,
  IconTool,
  IconChevronDown,
  IconFilter,
  IconX,
  IconCheck,
  IconLoader3
} from "@tabler/icons-react"
import { mockAdminStats, mockMarkets } from "@/lib/mockData"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import RecurringMarketModal from "@/components/admin/RecurringMarketModal"
import { SearchFilterBar } from "@/components/ui/SearchFilterBar"

export default function AdminPage() {
  const toast = useToast()
  
  // Loading states
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false)
  
  // Filters and search
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)

  // Page load simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-status-menu]')) setShowStatusMenu(false)
      if (!target.closest('[data-type-menu]')) setShowTypeMenu(false)
      if (!target.closest('[data-sort-menu]')) setShowSortMenu(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowStatusMenu(false)
        setShowTypeMenu(false)
        setShowSortMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  // Filter markets
  const filteredMarkets = useMemo(() => {
    let filtered = mockMarkets

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter (mock - assuming all are active for now)
    // if (statusFilter !== "all") {
    //   filtered = filtered.filter(m => m.status === statusFilter)
    // }

    // Flagged filter
    // if (showFlaggedOnly) {
    //   filtered = filtered.filter(m => m.is_flagged)
    // }

    return filtered
  }, [mockMarkets, searchQuery, statusFilter, showFlaggedOnly])

  const quickActions = [
    {
      category: "Market Management",
      icon: IconTrendingUp,
      color: "blue",
      actions: [
        { name: "Create New Market", icon: IconPlus, href: "/dashboard/admin/create-market" },
        { name: "Set Up Recurring Market", icon: IconSettings, action: () => setIsRecurringModalOpen(true) },
        { name: "Manage Markets", icon: IconFileText, href: "/dashboard/admin/markets" }
      ]
    },
    {
      category: "User and Compliance",
      icon: IconUsers,
      color: "purple",
      actions: [
        { name: "User Management", icon: IconUsers, href: "/dashboard/admin/users" },
        { name: "Admin Management", icon: IconShield, href: "/dashboard/admin/admins" }
      ]
    },
    {
      category: "System Oversight",
      icon: IconActivity,
      color: "orange",
      actions: [
        { name: "Audit Logs", icon: IconFileText, href: "/dashboard/admin/audit-logs" },
        { name: "Cron Monitor", icon: IconActivity, href: "/dashboard/admin/cron-monitor" }
      ]
    },
    {
      category: "Gamification",
      icon: IconAward,
      color: "yellow",
      actions: [
        { name: "Daily Spin Logs", icon: IconAward, href: "/dashboard/admin/daily-spin-logs" },
        { name: "Leaderboard & Rankings", icon: IconAward, href: "/dashboard/admin/leaderboard" },
        { name: "Achievement Manager", icon: IconTarget, href: "/dashboard/admin/achievements" }
      ]
    }
  ]

  const filteredQuickActions = useMemo(() => {
    if (!searchQuery) return quickActions;

    return quickActions
      .map(section => ({
        ...section,
        actions: section.actions.filter(action => 
          action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }))
      .filter(section => section.actions.length > 0);
  }, [searchQuery, quickActions]);

  const getColorClasses = (color: string) => {
    const colors: any = {
      blue: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
      purple: "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100",
      orange: "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100"
    }
    return colors[color] || colors.blue
  }

  const handleClearFilters = useCallback(() => {
    setSearchQuery("")
    setStatusFilter("all")
    setTypeFilter("all")
    setSortBy("newest")
    setShowFlaggedOnly(false)
    toast.info("Filters Cleared", "All filters have been reset")
  }, [toast])

  const hasActiveFilters = searchQuery || statusFilter !== "all" || typeFilter !== "all" || sortBy !== "newest" || showFlaggedOnly

  if (isPageLoading) {
    return <LoadingLogo fullScreen size="lg" />
  }

  return (
    <div className="space-y-10 pb-20 pl-0 md:pl-8">
      <DashboardHeader subtitle="Manage public betting markets and platform operations" />

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search for markets, tools, or actions..."
        activeTab={statusFilter}
        onTabChange={setStatusFilter}
        tabs={[]} // No filters at the top as requested
        sticky={false}
        rightElement={
          <Link href="/dashboard/admin/create-market">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-black px-5 text-white shadow-md transition-all hover:bg-black/90 hover:shadow-lg"
            >
              <IconPlus className="h-4 w-4" />
              <span className="font-medium text-sm">Create Market</span>
            </motion.button>
          </Link>
        }
      />

      {/* Visual Separator - Overview */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        <h2 className="text-xs font-medium text-black/40 uppercase tracking-wider">
          Platform Overview
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Active Markets - Blue */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Active Markets</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-blue-900">{mockAdminStats.activeMarkets}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <IconTrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Users - Purple */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">Total Users</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-purple-900">{mockAdminStats.totalUsers}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <IconUsers className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Volume - Green */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Total Volume</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-green-900">${mockAdminStats.totalVolume.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <IconCurrencyDollar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Flagged Markets - Red/Orange */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-red-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-100/50 blur-2xl transition-all group-hover:bg-red-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-900/60">Flagged Markets</p>
                  <div className="flex items-baseline gap-2">
                    <p className="mt-2 text-3xl font-medium font-mono text-red-900">{mockAdminStats.flaggedMarkets}</p>
                    {mockAdminStats.flaggedMarkets === 0 && (
                      <span className="text-xs text-red-500/60 font-medium">All clear</span>
                    )}
                  </div>
                </div>
                <div className={cn(
                  "rounded-xl p-3 shadow-sm backdrop-blur-sm group-hover:scale-110 transition-transform",
                  mockAdminStats.flaggedMarkets > 0 ? "bg-white/80" : "bg-white/60"
                )}>
                  <IconShield className={cn(
                    "h-6 w-6",
                    mockAdminStats.flaggedMarkets > 0 ? "text-red-600" : "text-red-400"
                  )} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Visual Separator - Quick Actions */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        <h2 className="text-xs font-medium text-black/40 uppercase tracking-wider">
          Quick Actions
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredQuickActions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border-2 border-dashed border-black/5 bg-black/5 mx-auto max-w-2xl">
            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-3">
              <IconSearch className="w-6 h-6 text-black/20" />
            </div>
            <h3 className="text-base font-medium text-black/60 mb-1">No actions found</h3>
            <p className="text-xs text-black/40">No tools or actions match "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredQuickActions.map((section, index) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <DashboardCard className="h-full hover:shadow-lg transition-all p-0">
                  <CardHeader className="pb-3 border-b border-black/5">
                    <CardTitle className="flex items-center gap-2 text-base font-medium text-black/90">
                      {section.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    {section.actions.map((action) => {
                      if (action.href) {
                        return (
                          <Link key={action.name} href={action.href} className="block w-full">
                            <motion.button
                              whileHover={{ scale: 1.02, x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              className={cn(
                                "flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm",
                                getColorClasses(section.color)
                              )}
                            >
                              <action.icon className="h-4 w-4" />
                              <span className="text-sm font-medium">{action.name}</span>
                            </motion.button>
                          </Link>
                        )
                      } else if (action.action) {
                        return (
                          <motion.button
                            key={action.name}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={action.action}
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm",
                              getColorClasses(section.color)
                            )}
                          >
                            <action.icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{action.name}</span>
                          </motion.button>
                        )
                      }
                      return null
                    })}
                  </CardContent>
                </DashboardCard>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Visual Separator - System Maintenance */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        <h2 className="text-xs font-medium text-black/40 uppercase tracking-wider">
          System Maintenance
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* Data Maintenance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <DashboardCard className="p-8 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="rounded-xl bg-black/5 p-3 border border-black/10">
                <IconTool className="h-6 w-6 text-black/60" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-black/90">Data Maintenance</h3>
                <p className="mt-1 text-sm font-medium text-black/60">System Maintenance</p>
                <p className="text-xs text-black/40 mt-1">
                  Data repair, integrity checks, and reconciliation tools
                </p>
              </div>
            </div>
            <Link href="/dashboard/admin/maintenance">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer rounded-xl bg-black px-8 py-2 text-white shadow-md transition-all hover:shadow-lg hover:bg-black/90"
              >
                <span className="font-medium text-sm">Open Maintenance Hub</span>
              </motion.button>
            </Link>
          </div>
        </DashboardCard>
      </motion.div>

      {/* Visual Separator - Recent Markets */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        <h2 className="text-xs font-medium text-black/40 uppercase tracking-wider">
          Recent Markets ({filteredMarkets.length})
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* Recent Markets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <DashboardCard className="p-0">
          <CardHeader className="border-b border-black/5 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-medium text-black/90">Market Overview</CardTitle>
              <Link href="/dashboard/admin/markets">
                <button className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  View All
                </button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Filters */}
            <div className="mb-8 flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="relative" data-status-menu>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 hover:bg-white hover:border-black/20 transition-all cursor-pointer"
                >
                  <span className="text-sm font-medium text-black/70">
                    {statusFilter === "all" ? "All Status" : statusFilter}
                  </span>
                  <IconChevronDown className={cn(
                    "w-4 h-4 text-black/40 transition-transform",
                    showStatusMenu && "rotate-180"
                  )} />
                </motion.button>

                <AnimatePresence>
                  {showStatusMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 left-0 w-40 bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      {["all", "active", "settled", "pending"].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status)
                            setShowStatusMenu(false)
                          }}
                          className={cn(
                            "w-full px-4 py-2 text-left transition-colors cursor-pointer text-sm font-medium capitalize",
                            statusFilter === status ? "bg-black/5 text-black/90" : "text-black/60 hover:bg-black/5"
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

                {/* Type Filter */}
                <div className="relative" data-type-menu>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowTypeMenu(!showTypeMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 hover:bg-white hover:border-black/20 transition-all cursor-pointer"
                  >
                    <span className="text-sm font-medium text-black/70">
                      {typeFilter === "all" ? "All Types" : typeFilter}
                    </span>
                    <IconChevronDown className={cn(
                      "w-4 h-4 text-black/40 transition-transform",
                      showTypeMenu && "rotate-180"
                    )} />
                  </motion.button>

                  <AnimatePresence>
                    {showTypeMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 left-0 w-48 bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden z-50"
                      >
                        {["all", "poll-style", "betrayal-game"].map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setTypeFilter(type)
                              setShowTypeMenu(false)
                            }}
                            className={cn(
                              "w-full px-4 py-2.5 text-left transition-colors cursor-pointer text-sm font-medium capitalize",
                              typeFilter === type ? "bg-black/5 text-black/90" : "text-black/60 hover:bg-black/5"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sort Filter */}
                <div className="relative" data-sort-menu>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 hover:bg-white hover:border-black/20 transition-all cursor-pointer"
                  >
                    <span className="text-sm font-medium text-black/70">
                      {sortBy === "newest" ? "Newest First" : sortBy === "oldest" ? "Oldest First" : "Highest Volume"}
                    </span>
                    <IconChevronDown className={cn(
                      "w-4 h-4 text-black/40 transition-transform",
                      showSortMenu && "rotate-180"
                    )} />
                  </motion.button>

                  <AnimatePresence>
                    {showSortMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 right-0 w-44 bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden z-50"
                      >
                        {[
                          { value: "newest", label: "Newest First" },
                          { value: "oldest", label: "Oldest First" },
                          { value: "volume", label: "Highest Volume" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value)
                              setShowSortMenu(false)
                            }}
                            className={cn(
                              "w-full px-4 py-2.5 text-left transition-colors cursor-pointer text-sm font-medium",
                              sortBy === option.value ? "bg-black/5 text-black/90" : "text-black/60 hover:bg-black/5"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showFlaggedOnly}
                    onChange={(e) => setShowFlaggedOnly(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-black/20 text-black focus:ring-black"
                  />
                  <span className="text-sm font-medium text-black/60">Show only flagged</span>
                </label>

                {hasActiveFilters && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearFilters}
                    className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer text-sm font-medium"
                  >
                    <IconX className="w-4 h-4" />
                    Clear Filters
                  </motion.button>
                )}
              </div>

            {/* Market Cards */}
            <div className="space-y-4">
              {filteredMarkets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
                    <IconSearch className="w-8 h-8 text-black/20" />
                  </div>
                  <h3 className="text-lg font-medium text-black/60 mb-2">No markets found</h3>
                  <p className="text-sm text-black/40">Try adjusting your filters</p>
                </div>
              ) : (
                filteredMarkets.map((market, index) => (
                  <motion.div
                    key={market.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group rounded-2xl border border-black/5 bg-white/40 backdrop-blur-sm p-6 transition-all hover:border-blue-100 hover:shadow-lg hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-black/90 group-hover:text-blue-600 transition-colors">
                            {market.title}
                          </h3>
                          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-green-700">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-black/60 leading-relaxed max-w-2xl">
                          {market.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {market.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-black/5 border border-black/10 px-3 py-1 text-xs font-medium text-black/60"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-black/40 font-medium">Buy-in</span>
                            <span className="font-mono font-medium text-black/90">${market.buy_in_amount}</span>
                          </div>
                          <div className="h-4 w-px bg-black/10" />
                          <div className="flex items-center gap-2">
                            <span className="text-black/40 font-medium">Participants</span>
                            <span className="font-mono font-medium text-black/90">{market.participant_count}</span>
                          </div>
                          <div className="h-4 w-px bg-black/10" />
                          <div className="flex items-center gap-2">
                            <span className="text-black/40 font-medium">Total Pool</span>
                            <span className="font-mono font-medium text-green-600">${market.total_pool}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex cursor-pointer items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/70 transition-all hover:bg-black/5 hover:border-black/20"
                        >
                          <IconEdit className="h-4 w-4" />
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 shadow-sm hover:shadow"
                        >
                          <IconEye className="h-4 w-4" />
                          View
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </DashboardCard>
      </motion.div>

      {/* Recurring Market Modal */}
      <RecurringMarketModal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
      />
    </div>
  )
}