"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, RefreshCw, RotateCcw, Search, Filter, ChevronDown, User, TrendingUp, Award, Gift } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { DashboardCard } from "@/components/dashboard/DashboardCard"

// Mock Data
const mockSpinLogs = [
  {
    id: 1,
    user: {
      name: "zanyfool",
      email: "grayvector22@gmail.com",
      avatar: null
    },
    userId: "68c4f5b78b8c...",
    date: "Dec 1, 2025 11:51 PM",
    amount: "+75 MP",
    type: "Normal"
  },
  {
    id: 2,
    user: {
      name: "highpriestess",
      email: "gabyprusli@gmail.com",
      avatar: null
    },
    userId: "692b1b32e5ad...",
    date: "Dec 1, 2025 3:32 PM",
    amount: "+0 MP",
    type: "Normal"
  },
  {
    id: 3,
    user: {
      name: "zanyfool",
      email: "grayvector22@gmail.com",
      avatar: null
    },
    userId: "68c4f5b78b8c...",
    date: "Nov 30, 2025 6:29 AM",
    amount: "+1 MP",
    type: "Normal"
  },
  {
    id: 4,
    user: {
      name: "zanyfool",
      email: "grayvector22@gmail.com",
      avatar: null
    },
    userId: "68c4f5b78b8c...",
    date: "Nov 29, 2025 4:19 PM",
    amount: "+50 MP",
    type: "Normal"
  },
  {
    id: 5,
    user: {
      name: "highpriestess",
      email: "gabyprusli@gmail.com",
      avatar: null
    },
    userId: "692b1b32e5ad...",
    date: "Nov 29, 2025 4:12 PM",
    amount: "+1 MP",
    type: "Normal"
  },
  {
    id: 6,
    user: {
      name: "zanyfool",
      email: "grayvector22@gmail.com",
      avatar: null
    },
    userId: "68c4f5b78b8c...",
    date: "Nov 28, 2025 6:06 AM",
    amount: "+1 MP",
    type: "Normal"
  }
]

export default function DailySpinLogsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleResetUserSpin = () => {
    console.log("Resetting user spin...")
  }

  const totalSpins = 17
  const totalAwarded = "258 MP"
  const jackpots = 0
  const avgReward = "15.2 MP"

  const getAmountColor = (amount: string) => {
    const value = parseInt(amount.replace(/[^0-9]/g, ""))
    if (value >= 50) return "text-purple-600 font-medium"
    if (value >= 10) return "text-green-600 font-medium"
    if (value > 0) return "text-blue-600 font-medium"
    return "text-neutral-500"
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        {/* Header */}
        <DashboardHeader
          subtitle="Monitor and manage the Wheel of Delusion spins"
        />

        <div className="flex items-center justify-end gap-3 -mt-6 mb-8">
          <button
            onClick={handleResetUserSpin}
            className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset User Spin
          </button>
          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Visual Separator - Overview */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Overview</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
        >
          {/* Total Spins - Blue */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Total Spins</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-blue-900">{totalSpins}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <RotateCcw className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Awarded - Green */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Total Awarded</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-green-900">{totalAwarded}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Gift className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jackpots - Purple */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">Jackpots (50 MP)</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-purple-900">{jackpots}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Reward - Amber */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-amber-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-100/50 blur-2xl transition-all group-hover:bg-amber-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-900/60">Average Reward</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-amber-900">{avgReward}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visual Separator - Filters */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Filters</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardCard className="p-5 mb-10">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by user ID, username, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>

              <div className="relative">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 appearance-none cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </DashboardCard>
        </motion.div>

        {/* Visual Separator - Spin Logs */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Spin Logs ({mockSpinLogs.length})</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Spin Logs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <DashboardCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {mockSpinLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center text-neutral-600 flex-shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{log.user.name}</p>
                            <p className="text-xs text-neutral-500">{log.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-neutral-600">{log.userId}</td>
                      <td className="px-6 py-4 text-sm font-mono text-neutral-600">{log.date}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-mono ${getAmountColor(log.amount)}`}>{log.amount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                          {log.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </motion.div>
      </div>
    </div>
  )
}
