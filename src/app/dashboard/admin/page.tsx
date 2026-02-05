"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
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
} from "@tabler/icons-react";

import { mockAdminStats, mockMarkets } from "@/lib/mockData";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RecurringMarketModal from "@/components/admin/RecurringMarketModal";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);

  const quickActions = [
    {
      category: "Market Management",
      icon: IconTrendingUp,
      color: "blue",
      actions: [
        { name: "Create New Market", icon: IconPlus },
        { name: "Set Up Recurring Market", icon: IconSettings },
        { name: "Manage Markets", icon: IconFileText },
      ],
    },
    {
      category: "IconUser and Compliance",
      icon: IconUsers,
      color: "purple",
      actions: [
        { name: "IconUser Management", icon: IconUsers },
        { name: "Admin Management", icon: IconShield },
      ],
    },
    {
      category: "System Oversight",
      icon: IconActivity,
      color: "orange",
      actions: [
        { name: "Audit Logs", icon: IconFileText },
        { name: "Cron Monitor", icon: IconActivity },
      ],
    },
    {
      category: "Gamification",
      icon: IconAward,
      color: "yellow",
      actions: [
        { name: "Daily Spin Logs", icon: IconAward },
        { name: "Leaderboard & Rankings", icon: IconAward },
        { name: "Achievement Manager", icon: IconTarget },
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: any = {
      blue: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
      purple:
        "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100",
      orange:
        "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100",
      yellow:
        "bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <DashboardHeader subtitle="Manage public betting markets and platform operations" />

      <div className="flex justify-end z-10 px-2">
        <Link href="/dashboard/admin/create-market">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-neutral-900 px-5 text-white shadow-md transition-all hover:bg-black hover:shadow-lg"
          >
            <IconPlus className="h-4 w-4" />
            <span className="font-medium text-xs">Create Market</span>
          </motion.button>
        </Link>
      </div>

      {/* Visual Separator - Overview */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Platform Overview
        </h2>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10"
      >
        {/* Active Markets - Blue */}
        <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900/60">
                  Active Markets
                </p>
                <p className="mt-2 text-3xl font-medium font-mono text-blue-900">
                  {mockAdminStats.activeMarkets}
                </p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <IconTrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total IconUsers - Purple */}
        <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900/60">
                  Total IconUsers
                </p>
                <p className="mt-2 text-3xl font-medium font-mono text-purple-900">
                  {mockAdminStats.totalUsers}
                </p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <IconUsers className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Volume - Green */}
        <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900/60">
                  Total Volume
                </p>
                <p className="mt-2 text-3xl font-medium font-mono text-green-900">
                  ${mockAdminStats.totalVolume.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <IconCurrencyDollar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flagged Markets - Red/Orange */}
        <Card className="relative overflow-hidden border-none bg-linear-to-br from-red-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-100/50 blur-2xl transition-all group-hover:bg-red-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-900/60">
                  Flagged Markets
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="mt-2 text-3xl font-medium font-mono text-red-900">
                    {mockAdminStats.flaggedMarkets}
                  </p>
                  {mockAdminStats.flaggedMarkets === 0 && (
                    <span className="text-xs text-red-500/60 font-medium">
                      All clear
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`rounded-xl p-3 shadow-sm backdrop-blur-sm ${mockAdminStats.flaggedMarkets > 0 ? "bg-white/80" : "bg-white/60"}`}
              >
                <IconShield
                  className={`h-6 w-6 ${mockAdminStats.flaggedMarkets > 0 ? "text-red-600" : "text-red-400"}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Visual Separator - Quick Actions */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Quick Actions
        </h2>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((section, index) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <DashboardCard className="h-full hover:shadow-lg transition-all p-0">
                <CardHeader className="pb-3 border-b border-gray-50">
                  <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-900">
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {section.actions.map((action) =>
                    action.name === "Create New Market" ? (
                      <Link
                        key={action.name}
                        href="/dashboard/admin/create-market"
                        className="block w-full"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm ${getColorClasses(section.color)}`}
                        >
                          <action.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {action.name}
                          </span>
                        </motion.button>
                      </Link>
                    ) : action.name === "Set Up Recurring Market" ? (
                      <motion.button
                        key={action.name}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsRecurringModalOpen(true)}
                        className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm ${getColorClasses(section.color)}`}
                      >
                        <action.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {action.name}
                        </span>
                      </motion.button>
                    ) : action.name === "Manage Markets" ? (
                      <Link
                        key={action.name}
                        href="/dashboard/admin/markets"
                        className="block w-full"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm ${getColorClasses(section.color)}`}
                        >
                          <action.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {action.name}
                          </span>
                        </motion.button>
                      </Link>
                    ) : action.name === "IconUser Management" ? (
                      <Link
                        key={action.name}
                        href="/dashboard/admin/users"
                        className="block w-full"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm ${getColorClasses(section.color)}`}
                        >
                          <action.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {action.name}
                          </span>
                        </motion.button>
                      </Link>
                    ) : action.name === "Admin Management" ? (
                      <Link
                        key={action.name}
                        href="/dashboard/admin/admins"
                        className="block w-full"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm ${getColorClasses(section.color)}`}
                        >
                          <action.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {action.name}
                          </span>
                        </motion.button>
                      </Link>
                    ) : action.name === "Audit Logs" ? (
                      <Link
                        key={action.name}
                        href="/dashboard/admin/audit-logs"
                        className="block w-full"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm ${getColorClasses(section.color)}`}
                        >
                          <action.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {action.name}
                          </span>
                        </motion.button>
                      </Link>
                    ) : action.name === "Cron Monitor" ? (
                      <Link
                        key={action.name}
                        href="/dashboard/admin/cron-monitor"
                        className="block w-full"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm ${getColorClasses(section.color)}`}
                        >
                          <action.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {action.name}
                          </span>
                        </motion.button>
                      </Link>
                    ) : action.name === "Daily Spin Logs" ? (
                      <Link
                        key={action.name}
                        href="/dashboard/admin/daily-spin-logs"
                        className="block w-full"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm ${getColorClasses(section.color)}`}
                        >
                          <action.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {action.name}
                          </span>
                        </motion.button>
                      </Link>
                    ) : action.name === "Leaderboard & Rankings" ? (
                      <Link
                        key={action.name}
                        href="/dashboard/admin/leaderboard"
                        className="block w-full"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm ${getColorClasses(section.color)}`}
                        >
                          <action.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {action.name}
                          </span>
                        </motion.button>
                      </Link>
                    ) : action.name === "Achievement Manager" ? (
                      <Link
                        key={action.name}
                        href="/dashboard/admin/achievements"
                        className="block w-full"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm ${getColorClasses(section.color)}`}
                        >
                          <action.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {action.name}
                          </span>
                        </motion.button>
                      </Link>
                    ) : (
                      <motion.button
                        key={action.name}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm ${getColorClasses(section.color)}`}
                      >
                        <action.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {action.name}
                        </span>
                      </motion.button>
                    ),
                  )}
                </CardContent>
              </DashboardCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Visual Separator - System Maintenance */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          System Maintenance
        </h2>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
      </div>

      {/* Data Maintenance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <DashboardCard className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
                <IconTool className="h-8 w-8 text-neutral-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900">
                  Data Maintenance
                </h3>
                <p className="mt-1 text-sm font-medium text-neutral-600">
                  System Maintenance
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Data repair, integrity checks, and reconciliation tools
                </p>
              </div>
            </div>
            <Link href="/dashboard/admin/maintenance">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer rounded-lg bg-neutral-900 px-8 py-3 text-white shadow-md transition-all hover:shadow-lg hover:bg-black"
              >
                <span className="font-medium text-sm">
                  Open Maintenance Hub
                </span>
              </motion.button>
            </Link>
          </div>
        </DashboardCard>
      </motion.div>

      {/* Visual Separator - Recent Markets */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Recent Markets ({mockMarkets.length})
        </h2>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
      </div>

      {/* Recent Markets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <DashboardCard className="p-0">
          <CardHeader className="border-b border-neutral-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-medium text-neutral-900">
                Market Overview
              </CardTitle>
              <Link href="/dashboard/admin/markets">
                <button className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  View All
                </button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* IconSearch and Filters */}
            <div className="mb-8 space-y-8">
              <div className="relative">
                <IconSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="IconSearch markets..."
                  className="w-full cursor-text rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 font-medium outline-none transition-all focus:border-gray-900 focus:bg-white focus:ring-0 placeholder:text-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all hover:bg-white hover:border-gray-300 focus:border-gray-900">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Settled</option>
                  <option>Pending</option>
                </select>

                <select className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all hover:bg-white hover:border-gray-300 focus:border-gray-900">
                  <option>All Types</option>
                  <option>Poll-Style</option>
                  <option>Betrayal Game</option>
                </select>

                <select className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all hover:bg-white hover:border-gray-300 focus:border-gray-900">
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Highest Volume</option>
                </select>

                <label className="flex cursor-pointer items-center gap-2 ml-auto">
                  <input
                    type="checkbox"
                    checked={showFlaggedOnly}
                    onChange={(e) => setShowFlaggedOnly(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm font-medium text-gray-600">
                    Show only flagged markets
                  </span>
                </label>
              </div>
            </div>

            {/* Market Cards */}
            <div className="space-y-8">
              {mockMarkets.map((market, index) => (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="group rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-blue-100 hover:shadow-md hover:bg-blue-50/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {market.title}
                        </h3>
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-green-700">
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                        {market.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {market.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-gray-50 border border-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-medium">
                            Buy-in
                          </span>
                          <span className="font-mono font-medium text-gray-900">
                            ${market.buy_in_amount}
                          </span>
                        </div>
                        <div className="h-4 w-px bg-gray-200" />
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-medium">
                            Participants
                          </span>
                          <span className="font-mono font-medium text-gray-900">
                            {market.participant_count}
                          </span>
                        </div>
                        <div className="h-4 w-px bg-gray-200" />
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-medium">
                            Total Pool
                          </span>
                          <span className="font-mono font-medium text-green-600">
                            ${market.total_pool}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300"
                      >
                        <IconEdit className="h-4 w-4" />
                        IconEdit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex cursor-pointer items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 shadow-sm hover:shadow"
                      >
                        <IconEye className="h-4 w-4" />
                        View
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
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
  );
}
