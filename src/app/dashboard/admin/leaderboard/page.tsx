"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, RefreshCw, Search, Trophy, Award, Medal, User, TrendingUp, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import DashboardHeader from "@/components/dashboard/DashboardHeader"

// Mock Data
const mockLeaderboard = [
  {
    rank: 1,
    user: {
      name: "Unknown",
      email: "N/A",
      id: "68d41b8210f5449ed003ed8a"
    },
    balance: "4,175 MP",
    totalWinnings: "+65 MP",
    totalLosses: "-0 MP",
    joined: "N/A"
  },
  {
    rank: 2,
    user: {
      name: "@zanyfool",
      email: "grayvector22@gmail.com",
      id: "68c4f5b78b8c01840e69f208",
      badge: "Admin"
    },
    balance: "1,769.12 MP",
    totalWinnings: "+187 MP",
    totalLosses: "-0 MP",
    joined: "Sep 13, 2025"
  },
  {
    rank: 3,
    user: {
      name: "@highpriestess",
      email: "gabyprusli@gmail.com",
      id: "692b1b32e5adb5d87832e53a"
    },
    balance: "566 MP",
    totalWinnings: "+51 MP",
    totalLosses: "-0 MP",
    joined: "Nov 29, 2025"
  },
  {
    rank: 4,
    user: {
      name: "@ulysses",
      email: "livia@mycounsely.com",
      id: "68e4f3b8b8a79a5e5f43f405a"
    },
    balance: "450 MP",
    totalWinnings: "+0 MP",
    totalLosses: "-0 MP",
    joined: "Oct 15, 2025"
  }
]

export default function LeaderboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-amber-500" />
      case 2:
        return <Award className="w-5 h-5 text-neutral-400" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-700" />
      default:
        return <span className="text-sm font-medium text-neutral-500">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
      case 2:
        return "bg-gradient-to-br from-neutral-50 to-neutral-100 border-neutral-300"
      case 3:
        return "bg-gradient-to-br from-amber-50/50 to-orange-50 border-orange-200"
      default:
        return "bg-neutral-50 border-neutral-200"
    }
  }

  const totalUsers = 14
  const totalMPInCirculation = "7,867.12 MP"
  const avgBalance = "562 MP"

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        <DashboardHeader 
          subtitle="View all users ranked by MP balance" 
        />

        <div className="flex justify-end -mt-6 mb-8">
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
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Overview</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {/* Total Users - Blue */}
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Total Users</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-blue-900">{totalUsers}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total MP in Circulation - Green */}
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Total MP in Circulation</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-green-900">{totalMPInCirculation}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Balance - Purple */}
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">Average Balance</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-purple-900">{avgBalance}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visual Separator - Search */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Search</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardCard className="p-5 mb-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by username, name, email, or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>
          </DashboardCard>
        </motion.div>

        {/* Visual Separator - Rankings */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Rankings ({mockLeaderboard.length})</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Leaderboard Table */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Total Winnings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Total Losses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {mockLeaderboard.map((entry) => (
                    <tr key={entry.rank} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${getRankBadgeColor(entry.rank)}`}>
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-neutral-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-neutral-900">{entry.user.name}</p>
                              {entry.user.badge && (
                                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-neutral-900 text-white">
                                  {entry.user.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-500">{entry.user.email}</p>
                            <p className="text-xs text-neutral-400 font-mono">{entry.user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-green-600 font-mono">{entry.balance}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-blue-600 font-mono">{entry.totalWinnings}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-red-600 font-mono">{entry.totalLosses}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600">{entry.joined}</span>
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
