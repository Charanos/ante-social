"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Users, Clock, DollarSign, Zap, TrendingUp } from "lucide-react"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"

// Mock market data
const getMockReflexMarket = (id: string) => ({
  id,
  title: "First Reaction: Group Chat Dilemma",
  description: "When suddenly added to a new group chat, what will the majority do in the first 5 seconds? Predict the crowd's instinct!",
  scenario: "You're suddenly added to a group chat with 50 unknown people. What's your FIRST reaction?",
  market_type: "reflex",
  buy_in_amount: 5,
  total_pool: 250,
  participant_count: 50,
  status: "active",
  close_date: new Date(Date.now() + 86400000), // 1 day
  options: [
    { id: "opt1", option_text: "Leave immediately", emoji: "🏃" },
    { id: "opt2", option_text: "Mute notifications", emoji: "🔕" },
    { id: "opt3", option_text: "Ask \"who's this?\"", emoji: "❓" },
    { id: "opt4", option_text: "Pretend not seeing it", emoji: "🙈" },
    { id: "opt5", option_text: "Participate for fun", emoji: "🎉" }
  ]
})

export default function ReflexMarketPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const marketId = params.id as string

  const market = getMockReflexMarket(marketId)

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [stakeAmount, setStakeAmount] = useState("")
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

 const startCountdown = () => {
    setIsCountingDown(true)
    setCountdown(5)
  }

  useEffect(() => {
    if (countdown === null || countdown === 0) return

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    if (countdown === 0 && !hasSubmitted) {
      toast.warning("Time's Up!", "Make your choice now!")
    }
  }, [countdown, hasSubmitted, toast])

  const handleSubmitBet = () => {
    if (!selectedOption || !stakeAmount || parseFloat(stakeAmount) < market.buy_in_amount) {
      toast.error("Invalid Bet", `Minimum stake is $${market.buy_in_amount}`)
      return
    }

    if (!isCountingDown) {
      toast.error("Not Started", "Start the countdown first!")
      return
    }

    setHasSubmitted(true)
    toast.success("Prediction Locked!", `You bet $${stakeAmount} on "${market.options.find(o => o.id === selectedOption)?.option_text}"`)
  }

  const getTimeRemaining = () => {
    const diff = market.close_date.getTime() - Date.now()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return `${hours}h`
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        <DashboardHeader 
          subtitle={market.description} 
        />

        <div className="flex items-center gap-2 -mt-16 mb-8 relative z-10 px-2 justify-end">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium uppercase tracking-wide border border-amber-200 shadow-sm">
                Reflex Test
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
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
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

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Total Pool</p>
                  <p className="mt-2 text-2xl font-medium numeric text-green-900">${market.total_pool}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
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

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-amber-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
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

        {/* Scenario Card */}
        <DashboardCard className="p-8 mb-10 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-neutral-900 mb-4">Scenario</h2>
            <p className="text-lg text-neutral-700">{market.scenario}</p>
          </div>
        </DashboardCard>

        {/* Countdown Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-10"
        >
          <DashboardCard className={`p-12 text-center ${isCountingDown ? 'bg-gradient-to-br from-red-50 to-amber-50 border-2 border-amber-400' : 'bg-neutral-50'}`}>
            <AnimatePresence mode="wait">
              {!isCountingDown ? (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Zap className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-3xl font-medium text-neutral-900 mb-4">Ready to Test Your Instincts?</h3>
                  <p className="text-neutral-600 mb-6">You'll have 5 seconds to predict what most people will choose</p>
                  <button
                    onClick={startCountdown}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer"
                  >
                    Start Countdown
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="countdown"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <motion.div
                    animate={{
                      scale: countdown === 0 ? [1, 1.2, 1] : 1,
                      rotate: countdown === 0 ? [0, 10, -10, 0] : 0
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className={`text-9xl font-medium ${countdown === 0 ? 'text-red-600' : (countdown ?? 5) <= 2 ? 'text-amber-600' : 'text-green-600'}`}>
                      {countdown ?? 0}
                    </div>
                  </motion.div>
                  <p className="text-2xl font-medium text-neutral-700 mt-4">
                    {countdown === 0 ? "Time's up! Submit now!" : "Choose your prediction..."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </DashboardCard>
        </motion.div>

        {/* Visual Separator */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Quick Choose</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Options Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10"
        >
          {market.options.map((option, index) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedOption(option.id)}
              disabled={!isCountingDown || hasSubmitted}
              className={`
                relative p-6 rounded-xl border-2 transition-all cursor-pointer
                ${selectedOption === option.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-neutral-200 bg-white hover:border-blue-300'
                }
                ${!isCountingDown || hasSubmitted ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="text-5xl mb-3">{option.emoji}</div>
              <p className="text-sm font-medium text-neutral-900">{option.option_text}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Stake & Submit */}
        <DashboardCard className="p-6">
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
                  disabled={hasSubmitted}
                  className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none transition-colors numeric text-lg disabled:opacity-50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">USD</span>
              </div>
            </div>

            <button
              onClick={handleSubmitBet}
              disabled={!selectedOption || hasSubmitted || !isCountingDown}
              className={`
                w-full py-3 rounded-lg font-medium text-white transition-all cursor-pointer
                ${!selectedOption || hasSubmitted || !isCountingDown
                  ? 'bg-neutral-300 cursor-not-allowed'
                  : 'bg-neutral-900 hover:bg-neutral-800 shadow-lg hover:shadow-xl'
                }
              `}
            >
              {hasSubmitted ? 'Prediction Locked ✓' : 'Lock In Prediction'}
            </button>

            <p className="text-xs text-center text-neutral-500">
              Multiplier revealed after market settles. Fortune favors the absurd!
            </p>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
