"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { ArrowLeft, Users, Clock, DollarSign, Shield, Swords } from "lucide-react"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"

// Mock market data
const getMockBetrayalMarket = (id: string) => ({
  id,
  title: "Trust or Betray: The Ultimate Social Experiment",
  description: "Will you cooperate for a small win, or betray for the chance at it all? Choose wisely — the crowd's decision determines your fate.",
  market_type: "betrayal",
  buy_in_amount: 10,
  total_pool: 500,
  participant_count: 50,
  status: "active",
  close_date: new Date(Date.now() + 86400000), // 1 day from now
})

export default function BetrayalMarketPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const marketId = params.id as string

  const market = getMockBetrayalMarket(marketId)

  const [selectedChoice, setSelectedChoice] = useState<"cooperate" | "betray" | null>(null)
  const [stakeAmount, setStakeAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOutcomes, setShowOutcomes] = useState(false)

  const handlePlaceBet = async () => {
    if (!selectedChoice || !stakeAmount || parseFloat(stakeAmount) < market.buy_in_amount) {
      toast.error("Invalid Bet", `Minimum stake is $${market.buy_in_amount}`)
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast.success("Choice Locked In!", `You chose to ${selectedChoice}`)
      setIsSubmitting(false)
    }, 1000)
  }

  const getTimeRemaining = () => {
    const diff = market.close_date.getTime() - Date.now()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        <DashboardHeader
          subtitle={market.description}
        />

        <div className="flex items-center gap-2 -mt-16 mb-8 relative z-10 px-2 justify-end">
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium uppercase tracking-wide border border-red-200 shadow-sm">
            Betrayal Game
          </span>
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium uppercase tracking-wide border border-green-200 shadow-sm">
            {market.status}
          </span>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
        >
          {/* Buy-in */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Buy-in</p>
                  <p className="mt-2 text-2xl font-medium numeric text-blue-900">${market.buy_in_amount}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Pool */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Total Pool</p>
                  <p className="mt-2 text-2xl font-medium numeric text-green-900">${market.total_pool}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">Players</p>
                  <p className="mt-2 text-2xl font-medium font-mono text-purple-900">{market.participant_count}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Remaining */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-amber-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-100/50 blur-2xl transition-all group-hover:bg-amber-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-900/60">Closes In</p>
                  <p className="mt-2 text-2xl font-medium font-mono text-amber-900">{getTimeRemaining()}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visual Separator */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Choose Your Strategy</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Choice Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          {/* Cooperate */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => setSelectedChoice("cooperate")}
            className={`
              relative overflow-hidden rounded-2xl border-2 p-8 cursor-pointer transition-all
              ${selectedChoice === "cooperate"
                ? 'border-green-500 bg-linear-to-br from-green-50 to-white shadow-2xl'
                : 'border-neutral-200 bg-white hover:border-green-300 hover:shadow-lg'
              }
            `}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                <span className="text-4xl">🤝</span>
              </div>
              <h3 className="text-2xl font-medium text-neutral-900 mb-2">COOPERATE</h3>
              <p className="text-sm text-neutral-600 mb-4">Play it safe. Share the reward.</p>
              <div className="space-y-4">
                <p className="text-xs text-green-700 font-medium">✓ Guaranteed small win if others cooperate</p>
                <p className="text-xs text-green-700 font-medium">✓ Lower risk strategy</p>
                <p className="text-xs text-red-600 font-medium">✗ Betrayers take your share</p>
              </div>
            </div>
            {selectedChoice === "cooperate" && (
              <div className="absolute top-4 right-4">
                <div className="rounded-full bg-green-500 p-2">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>

          {/* Betray */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => setSelectedChoice("betray")}
            className={`
              relative overflow-hidden rounded-2xl border-2 p-8 cursor-pointer transition-all
              ${selectedChoice === "betray"
                ? 'border-red-500 bg-linear-to-br from-red-50 to-white shadow-2xl'
                : 'border-neutral-200 bg-white hover:border-red-300 hover:shadow-lg'
              }
            `}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
                <Swords className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-medium text-neutral-900 mb-2">BETRAY</h3>
              <p className="text-sm text-neutral-600 mb-4">Risk it all. Take the prize.</p>
              <div className="space-y-4">
                <p className="text-xs text-green-700 font-medium">✓ Win big if minority betrays</p>
                <p className="text-xs text-green-700 font-medium">✓ Maximum potential payout</p>
                <p className="text-xs text-red-600 font-medium">✗ Everyone loses if majority betrays</p>
              </div>
            </div>
            {selectedChoice === "betray" && (
              <div className="absolute top-4 right-4">
                <div className="rounded-full bg-red-500 p-2">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Stake Input & Submit */}
        <DashboardCard className="p-6 mb-10">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Your Stake Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  min={market.buy_in_amount}
                  step="1"
                  placeholder={`Minimum $${market.buy_in_amount}`}
                  className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none transition-colors numeric text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">USD</span>
              </div>
            </div>

            <button
              onClick={handlePlaceBet}
              disabled={!selectedChoice || isSubmitting}
              className={`
                w-full py-3 rounded-lg font-medium text-white transition-all cursor-pointer
                ${!selectedChoice || isSubmitting
                  ? 'bg-neutral-300 cursor-not-allowed'
                  : 'bg-neutral-900 hover:bg-neutral-800 shadow-lg hover:shadow-xl'
                }
              `}
            >
              {isSubmitting ? 'Locking In...' : `Lock In: ${selectedChoice ? selectedChoice.toUpperCase() : 'Make Your Choice'}`}
            </button>

            <button
              onClick={() => setShowOutcomes(!showOutcomes)}
              className="w-full py-2 text-sm text-neutral-600 hover:text-neutral-900 font-medium cursor-pointer transition-colors"
            >
              {showOutcomes ? 'Hide' : 'Show'} Possible Outcomes
            </button>
          </div>
        </DashboardCard>

        {/* Outcomes Explanation */}
        {showOutcomes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <DashboardCard className="p-6 mb-10">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">How Payouts Work</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                  <span className="text-2xl">🤝</span>
                  <div className="flex-1">
                    <p className="font-medium text-green-900">All Cooperate</p>
                    <p className="text-sm text-green-700">Everyone wins a small amount. Prize pool divided equally.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="text-2xl">⚖️</span>
                  <div className="flex-1">
                    <p className="font-medium text-amber-900">Majority Cooperate, Minority Betray</p>
                    <p className="text-sm text-amber-700">Betrayers win BIG. They split the entire prize pool.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                  <span className="text-2xl">⚔️</span>
                  <div className="flex-1">
                    <p className="font-medium text-red-900">Majority Betray</p>
                    <p className="text-sm text-red-700">Everyone loses. No payouts. Greed destroyed the pool.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-neutral-900 border border-neutral-700">
                  <span className="text-2xl">💀</span>
                  <div className="flex-1">
                    <p className="font-medium text-white">All Betray</p>
                    <p className="text-sm text-neutral-300">Zero for everyone. Complete mutual destruction. Dramatic.</p>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </motion.div>
        )}

        {/* Info Card */}
        <DashboardCard className="p-6 bg-linear-to-br from-blue-50 to-white border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">Your Choice is Secret</h4>
              <p className="text-sm text-blue-700">
                No one knows what you picked until the market settles. Results revealed simultaneously to all participants.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
