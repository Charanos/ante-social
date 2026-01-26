"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { Card, CardContent } from "@/components/ui/card"

// Mock markets data
const mockMarkets = [
  {
    id: "1",
    title: "What's your vibe right now?",
    type: "poll",
    buy_in: 1,
    pool: 1100,
    participants: 42,
    status: "active"
  },
  {
    id: "2",
    title: "Trust or Betray: Social Experiment",
    type: "betrayal",
    buy_in: 10,
    pool: 500,
    participants: 50,
    status: "active"
  },
  {
    id: "3",
    title: "First Reaction: Group Chat",
    type: "reflex",
    buy_in: 5,
    pool: 250,
    participants: 50,
    status: "active"
  },
  {
    id: "4",
    title: "Rank These Inconveniences",
    type: "ladder",
    buy_in: 5,
    pool: 350,
    participants: 70,
    status: "active"
  }
]

const getTypeStyles = (type: string) => {
  switch (type) {
    case "poll":
      return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" }
    case "betrayal":
      return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" }
    case "reflex":
      return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" }
    case "ladder":
      return { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" }
    default:
      return { bg: "bg-neutral-100", text: "text-neutral-700", border: "border-neutral-200" }
  }
}

const getTypeName = (type: string) => {
  switch (type) {
    case "poll": return "Poll"
    case "betrayal": return "Betrayal"
    case "reflex": return "Reflex"
    case "ladder": return "Ladder"
    default: return type
  }
}

export default function MarketsPage() {
  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        <div className="mb-16">
        <DashboardHeader 
          subtitle="Explore available betting markets and join the action" 
        />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Active Markets</p>
                  <p className="mt-2 text-3xl font-medium numeric text-blue-900">{mockMarkets.length}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">Total Participants</p>
                  <p className="mt-2 text-3xl font-medium numeric text-purple-900">
                    {mockMarkets.reduce((sum, m) => sum + m.participants, 0)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visual Separator */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Available Markets</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockMarkets.map((market, index) => {
            const styles = getTypeStyles(market.type)
            const routePath = market.type === "poll" ? "" : `/${market.type}`
            
            return (
              <motion.div
                key={market.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link href={`/dashboard/markets/${market.id}${routePath}`}>
                  <DashboardCard className="p-6 hover:shadow-xl transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide border ${styles.bg} ${styles.text} ${styles.border}`}>
                            {getTypeName(market.type)}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium uppercase tracking-wide border border-green-200">
                            {market.status}
                          </span>
                        </div>
                        <h3 className="font-medium text-neutral-900 text-lg group-hover:text-blue-600 transition-colors">
                          {market.title}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                        <p className="text-xs text-neutral-500 mb-1">Buy-in</p>
                        <p className="font-mono font-medium text-neutral-900">${market.buy_in}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                        <p className="text-xs text-neutral-500 mb-1">Pool</p>
                        <p className="font-mono font-medium text-neutral-900">${market.pool}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                        <p className="text-xs text-neutral-500 mb-1">Players</p>
                        <p className="font-mono font-medium text-neutral-900">{market.participants}</p>
                      </div>
                    </div>

                    <button className="w-full mt-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors">
                      Join Market
                    </button>
                  </DashboardCard>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
