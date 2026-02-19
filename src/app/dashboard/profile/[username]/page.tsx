"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import { LoadingLogo } from "@/components/ui/LoadingLogo"
import { useToast } from "@/components/ui/toast-notification"
import { ProgressChart } from "@/components/charts/ProgressChart"
import { cn } from "@/lib/utils"
import {
  IconTrophy,
  IconClock,
  IconBolt,
  IconCrown,
  IconSparkles,
  IconChartLine,
  IconTrendingUp,
  IconTrendingDown,
  IconCheck,
  IconChartPie3,
  IconCoins,
  IconPercentage,
  IconFlame,
  IconShare,
  IconDots,
  IconUser,
  IconCalendar,
  IconAward,
  IconTarget,
  IconChevronDown,
  IconFilter
} from "@tabler/icons-react"

// Mock user data
const mockPublicProfile = {
  username: "AfricanPredictor",
  full_name: "Amira Mwangi",
  bio: "Professional prediction market trader specializing in sports and politics",
  user_level: "high_roller",
  avatar_url: null,
  joined_date: "2024-01-15",
  stats: {
    totalBets: 234,
    winRate: 68.5,
    totalProfit: 2450.75,
    roi: 24.3,
    accuracy: 88,
    currentStreak: 5,
    longestStreak: 12,
    totalVolume: 12500
  },
  achievements: [
    { id: 1, title: "First Win", category: "beginner", reward: 100, date: "2 days ago", icon: "trophy" },
    { id: 2, title: "Early Bird", category: "time_based", reward: 150, date: "1 week ago", icon: "clock" },
    { id: 3, title: "Lucky Day", category: "performance", reward: 200, date: "3 days ago", icon: "zap" },
    { id: 4, title: "High Roller", category: "prestige", reward: 500, date: "1 month ago", icon: "crown" },
    { id: 5, title: "Winning Streak", category: "performance", reward: 250, date: "5 days ago", icon: "flame" },
    { id: 6, title: "Big Spender", category: "spending", reward: 300, date: "2 weeks ago", icon: "coins" }
  ],
  progressData: [
    { week: "Week 1", points: 450, accuracy: 62 },
    { week: "Week 2", points: 680, accuracy: 68 },
    { week: "Week 3", points: 520, accuracy: 65 },
    { week: "Week 4", points: 890, accuracy: 74 },
    { week: "Week 5", points: 1050, accuracy: 78 },
    { week: "Week 6", points: 1240, accuracy: 82 },
    { week: "Week 7", points: 1380, accuracy: 85 },
    { week: "Week 8", points: 1520, accuracy: 88 }
  ],
  profitabilityData: [
    { month: "Jan", profit: 320, loss: -120, net: 200 },
    { month: "Feb", profit: 450, loss: -150, net: 300 },
    { month: "Mar", profit: 380, loss: -200, net: 180 },
    { month: "Apr", profit: 620, loss: -100, net: 520 },
    { month: "May", profit: 550, loss: -180, net: 370 },
    { month: "Jun", profit: 720, loss: -140, net: 580 }
  ]
}

const getAchievementIcon = (iconName: string) => {
  const iconProps = "w-5 h-5"
  switch (iconName) {
    case "trophy": return <IconTrophy className={iconProps} />
    case "clock": return <IconClock className={iconProps} />
    case "zap": return <IconBolt className={iconProps} />
    case "crown": return <IconCrown className={iconProps} />
    case "flame": return <IconFlame className={iconProps} />
    case "coins": return <IconCoins className={iconProps} />
    default: return <IconTrophy className={iconProps} />
  }
}

const getCategoryBadge = (category: string) => {
  const styles = {
    beginner: "bg-blue-50 text-blue-700 border-blue-200",
    time_based: "bg-purple-50 text-purple-700 border-purple-200",
    performance: "bg-green-50 text-green-700 border-green-200",
    prestige: "bg-amber-50 text-amber-700 border-amber-200",
    spending: "bg-orange-50 text-orange-700 border-orange-200"
  }
  return styles[category as keyof typeof styles] || "bg-black/5 text-black/70 border-black/10"
}

export default function PublicProfilePage() {
  const params = useParams()
  const toast = useToast()
  const username = params?.username as string
  
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  
  const profile = mockPublicProfile

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-share-menu]')) setShowShareMenu(false)
      if (!target.closest('[data-category-menu]')) setShowCategoryMenu(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowShareMenu(false)
        setShowCategoryMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const filteredAchievements = useMemo(() => {
    if (categoryFilter === "all") return profile.achievements
    return profile.achievements.filter(a => a.category === categoryFilter)
  }, [categoryFilter])

  const handleShare = (platform: string) => {
    toast.success("Link Copied", `Profile link copied to clipboard`)
    setShowShareMenu(false)
  }

  const categories = ["all", "beginner", "time_based", "performance", "prestige", "spending"]

  if (isPageLoading) {
    return <LoadingLogo fullScreen size="lg" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-black/[0.02] py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-black/95 to-black/90 shadow-2xl"
        >
          {/* Background Orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-[120px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-[120px]" />

          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-5xl md:text-6xl font-semibold text-white shadow-2xl shrink-0 border-2 border-white/10"
              >
                {profile.username.charAt(0).toUpperCase()}
              </motion.div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                    {profile.username}
                  </h1>
                  <p className="text-lg text-white/60 font-medium mt-2">
                    {profile.full_name}
                  </p>
                  <p className="text-sm text-white/50 mt-3 max-w-2xl leading-relaxed">
                    {profile.bio}
                  </p>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                  <span className="px-3 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 text-xs font-semibold text-amber-200 capitalize flex items-center gap-1.5">
                    <IconCrown className="w-3.5 h-3.5" />
                    {profile.user_level.replace("_", " ")}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-white/70 flex items-center gap-1.5">
                    <IconCalendar className="w-3.5 h-3.5" />
                    Joined {new Date(profile.joined_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Share Button */}
              <div className="relative" data-share-menu>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white transition-all cursor-pointer"
                >
                  <IconShare className="w-5 h-5" />
                </motion.button>

                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 right-0 w-40 bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      {["Twitter", "Facebook", "Copy Link"].map((platform) => (
                        <button
                          key={platform}
                          onClick={() => handleShare(platform)}
                          className="w-full px-4 py-2.5 text-left text-sm font-medium text-black/70 hover:bg-black/5 transition-colors cursor-pointer"
                        >
                          {platform}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Visual Separator */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">Performance Metrics</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Win Rate", value: `${profile.stats.winRate}%`, icon: IconTrendingUp, color: "green" },
            { label: "Total Profit", value: `$${profile.stats.totalProfit.toLocaleString()}`, icon: IconCoins, color: "blue" },
            { label: "ROI", value: `${profile.stats.roi}%`, icon: IconPercentage, color: "purple" },
            { label: "Current Streak", value: `${profile.stats.currentStreak} days`, icon: IconFlame, color: "orange" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl bg-white/40 backdrop-blur-xl border border-black/5 p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "p-2.5 rounded-xl border group-hover:scale-110 transition-transform",
                    stat.color === "green" && "bg-green-50 border-green-100",
                    stat.color === "blue" && "bg-blue-50 border-blue-100",
                    stat.color === "purple" && "bg-purple-50 border-purple-100",
                    stat.color === "orange" && "bg-orange-50 border-orange-100"
                  )}>
                    <stat.icon className={cn(
                      "w-5 h-5",
                      stat.color === "green" && "text-green-600",
                      stat.color === "blue" && "text-blue-600",
                      stat.color === "purple" && "text-purple-600",
                      stat.color === "orange" && "text-orange-600"
                    )} />
                  </div>
                  <IconTrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-black font-mono tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-black/50 font-semibold uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Visual Separator */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">
            Achievements ({filteredAchievements.length})
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </div>

        {/* Achievement Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex justify-center"
        >
          <div className="relative" data-category-menu>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 hover:bg-white hover:border-black/20 transition-all cursor-pointer"
            >
              <IconFilter className="w-4 h-4 text-black/60" />
              <span className="text-sm font-semibold text-black/70 capitalize">
                {categoryFilter === "all" ? "All Categories" : categoryFilter.replace("_", " ")}
              </span>
              <IconChevronDown className={cn(
                "w-4 h-4 text-black/40 transition-transform",
                showCategoryMenu && "rotate-180"
              )} />
            </motion.button>

            <AnimatePresence>
              {showCategoryMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoryFilter(cat)
                        setShowCategoryMenu(false)
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 text-left transition-colors cursor-pointer text-sm font-semibold capitalize",
                        categoryFilter === cat ? "bg-black/5 text-black/90" : "text-black/60 hover:bg-black/5"
                      )}
                    >
                      {cat === "all" ? "All Categories" : cat.replace("_", " ")}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Achievement Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.05 }}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-black/5 p-6 shadow-sm bg-white/40 backdrop-blur-xl hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-black/5 border border-black/10 group-hover:bg-black/10 transition-colors">
                    <div className="text-black/70">
                      {getAchievementIcon(achievement.icon)}
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-1 rounded-full border uppercase tracking-wider",
                    getCategoryBadge(achievement.category)
                  )}>
                    {achievement.category.replace("_", " ")}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-black mb-1 line-clamp-1">
                    {achievement.title}
                  </h3>
                  <p className="text-xs text-black/40 mb-3">{achievement.date}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-black/50">Reward:</span>
                    <span className="text-sm font-mono font-semibold text-green-600">
                      +{achievement.reward} pts
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Visual Separator */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">Performance Over Time</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-sm p-6 md:p-8"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />

          <ProgressChart
            data={profile.progressData}
            xAxisKey="week"
            lines={[
              { dataKey: "points", name: "Points", color: "#000000", yAxisId: "left" },
              { dataKey: "accuracy", name: "Accuracy %", color: "#737373", yAxisId: "right" }
            ]}
            yAxisLabels={{ left: "Points", right: "Accuracy %" }}
            height={300}
            className="md:h-[400px]"
          />
        </motion.div>

        {/* Visual Separator */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">Profitability Breakdown</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </div>

        {/* Profitability Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-sm p-6 md:p-8"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />

          <ProgressChart
            data={profile.profitabilityData}
            xAxisKey="month"
            lines={[
              { dataKey: "net", name: "Net Profit", color: "#000000" }
            ]}
            yAxisLabels={{ left: "Net Profit ($)" }}
            height={300}
            className="md:h-[350px]"
          />
        </motion.div>

        {/* Visual Separator */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">Additional Statistics</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </div>

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { label: "Total Bets", value: profile.stats.totalBets, icon: IconCheck, color: "blue" },
            { label: "Accuracy", value: `${profile.stats.accuracy}%`, icon: IconTarget, color: "green" },
            { label: "Total Volume", value: `$${profile.stats.totalVolume.toLocaleString()}`, icon: IconCoins, color: "purple" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 + index * 0.05 }}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl bg-white/40 backdrop-blur-xl border border-black/5 p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
              
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-xl border group-hover:scale-110 transition-transform",
                  stat.color === "blue" && "bg-blue-50 border-blue-100",
                  stat.color === "green" && "bg-green-50 border-green-100",
                  stat.color === "purple" && "bg-purple-50 border-purple-100"
                )}>
                  <stat.icon className={cn(
                    "w-6 h-6",
                    stat.color === "blue" && "text-blue-600",
                    stat.color === "green" && "text-green-600",
                    stat.color === "purple" && "text-purple-600"
                  )} />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-black font-mono tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-black/50 font-semibold uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}