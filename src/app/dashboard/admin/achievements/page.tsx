"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Search, Trophy, BarChart3, UserCheck, Edit, Award, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import DashboardHeader from "@/components/dashboard/DashboardHeader"

// Mock Data
const mockAchievements = [
  {
    id: 1,
    name: "First Delusion",
    slug: "first_delusion",
    category: "beginner",
    trigger: "first_bet (1)",
    reward: "+10 MP",
    unlocks: 1,
    status: true
  },
  {
    id: 2,
    name: "Baby Gambler",
    slug: "baby_gambler",
    category: "beginner",
    trigger: "total_bets (5)",
    reward: "+15 MP",
    unlocks: 0,
    status: true
  },
  {
    id: 3,
    name: "You're Getting Into This",
    slug: "youre_getting_into_this",
    category: "time_based",
    trigger: "consecutive_days (3)",
    reward: "+20 MP",
    unlocks: 0,
    status: true
  },
  {
    id: 4,
    name: "Statistical Disaster",
    slug: "statistical_disaster",
    category: "bad_luck",
    trigger: "lost_streak (5)",
    reward: "+25 MP",
    unlocks: 0,
    status: true
  },
  {
    id: 5,
    name: "Universe Hates You",
    slug: "universe_hates_you",
    category: "wheel",
    trigger: "wheel_reward0",
    reward: "+50 MP",
    unlocks: 1,
    status: true
  }
]

export default function AchievementManagerPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const getCategoryBadge = (category: string) => {
    const styles = {
      beginner: "bg-blue-50 text-blue-700 border-blue-200",
      time_based: "bg-purple-50 text-purple-700 border-purple-200",
      bad_luck: "bg-red-50 text-red-700 border-red-200",
      wheel: "bg-amber-50 text-amber-700 border-amber-200"
    }
    return styles[category as keyof typeof styles] || "bg-neutral-50 text-neutral-700 border-neutral-200"
  }

  const totalAchievements = 22
  const totalUnlocks = 3
  const usersWithBadges = 2

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        <DashboardHeader
          subtitle="Manage achievements, rewards, and user progress"
        />

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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {/* Total Achievements - Amber */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-amber-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-100/50 blur-2xl transition-all group-hover:bg-amber-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-900/60">Total Achievements</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-amber-900">{totalAchievements}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Trophy className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Unlocks - Blue */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Total Unlocks</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-blue-900">{totalUnlocks}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users with Badges - Green */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Users with Badges</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-green-900">{usersWithBadges}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visual Separator - Search */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Search User Badge History</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Search */}
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
                  placeholder="Search by email, username, or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
              <button className="px-6 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg cursor-pointer transition-all">
                Search
              </button>
            </div>
          </DashboardCard>
        </motion.div>

        {/* Visual Separator - Achievements */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Achievements ({mockAchievements.length})</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Achievements Table */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Achievement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Trigger</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Reward</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Unlocks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {mockAchievements.map((achievement) => (
                    <tr key={achievement.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{achievement.name}</p>
                          <p className="text-xs text-neutral-500 font-mono">{achievement.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${getCategoryBadge(achievement.category)}`}>
                          {achievement.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-neutral-700 bg-neutral-100 px-2 py-1 rounded">{achievement.trigger}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-green-600 font-mono">{achievement.reward}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-neutral-700">{achievement.unlocks}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${achievement.status ? 'bg-green-50 border border-green-200' : 'bg-neutral-50 border border-neutral-200'}`}>
                          <div className={`w-2 h-2 rounded-full ${achievement.status ? 'bg-green-500' : 'bg-neutral-400'}`}></div>
                          <span className={`text-xs font-medium ${achievement.status ? 'text-green-700' : 'text-neutral-600'}`}>
                            {achievement.status ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer group">
                          <Edit className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                        </button>
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
