"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { ArrowLeft, Users, Clock, DollarSign, TrendingUp, CheckCircle } from "lucide-react"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"

// Mock market data - will be replaced with API call
const getMockMarket = (id: string) => ({
  id,
  title: "What's your vibe right now?",
  description: "Pick the one that matches your brain's current state. Trust your gut — your mood might just make you money today.",
  market_type: "poll",
  buy_in_amount: 1,
  total_pool: 1100,
  participant_count: 42,
  status: "active",
  close_date: new Date(Date.now() + 86400000 * 2), // 2 days from now
  options: [
    { id: "opt1", option_text: "Chaotic energy", media_url: null },
    { id: "opt2", option_text: "Zen mode", media_url: null },
    { id: "opt3", option_text: "Procrastination nation", media_url: null },
    { id: "opt4", option_text: "Hustling hard", media_url: null }
  ],
  participants: [
    { username: "@lucky_fool", total_stake: 50, timestamp: new Date(Date.now() - 7200000) },
    { username: "@vibe_king", total_stake: 25, timestamp: new Date(Date.now() - 3600000) },
    { username: "@chaos_rider", total_stake: 100, timestamp: new Date(Date.now() - 1800000) }
  ]
})

export default function MarketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const marketId = params.id as string

  const market = getMockMarket(marketId)

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [stakeAmount, setStakeAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePlaceBet = async () => {
    if (!selectedOption || !stakeAmount || parseFloat(stakeAmount) < market.buy_in_amount) {
      toast.error("Invalid Bet", `Minimum stake is ${market.buy_in_amount} MP`)
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast.success("Bet Placed!", `You bet ${stakeAmount} MP on "${market.options.find(o => o.id === selectedOption)?.option_text}"`)
      setIsSubmitting(false)
      setSelectedOption(null)
      setStakeAmount("")
    }, 1000)
  }

  const getTimeRemaining = () => {
    const diff = market.close_date.getTime() - Date.now()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return `${days}d ${hours}h`
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        <DashboardHeader 
          subtitle={market.description} 
        />

        <div className="flex items-center gap-2 -mt-16 mb-8 relative z-10 px-2 justify-end">
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
          {/* Buy-in Amount */}
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Buy-in</p>
                  <p className="mt-2 text-2xl font-medium font-mono text-blue-900">{market.buy_in_amount} MP</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Pool */}
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Total Pool</p>
                  <p className="mt-2 text-2xl font-medium font-mono text-green-900">{market.total_pool} MP</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">Participants</p>
                  <p className="mt-2 text-2xl font-medium font-mono text-purple-900">{market.participant_count}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Remaining */}
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

        {/* Visual Separator */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Select Your Choice</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Options Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
        >
          {market.options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => setSelectedOption(option.id)}
              className={`
                relative overflow-hidden rounded-xl border-2 p-6 cursor-pointer transition-all
                ${selectedOption === option.id 
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]' 
                  : 'border-neutral-200 bg-white hover:border-blue-300 hover:shadow-md'
                }
              `}
            >
              {selectedOption === option.id && (
                <div className="absolute top-3 right-3">
                  <div className="rounded-full bg-blue-500 p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
              <p className="text-lg font-medium text-neutral-900">{option.option_text}</p>
              {option.media_url && (
                <div className="mt-4 rounded-lg overflow-hidden">
                  <img src={option.media_url} alt={option.option_text} className="w-full h-48 object-cover" />
                </div>
              )}
            </motion.div>
          ))}
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
                  placeholder={`Minimum ${market.buy_in_amount} MP`}
                  className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none transition-colors font-mono text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">MP</span>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Your stake will be added to the prize pool. Winner(s) split the pool pro-rata.
              </p>
            </div>

            <button
              onClick={handlePlaceBet}
              disabled={!selectedOption || isSubmitting}
              className={`
                w-full py-3 rounded-lg font-medium text-white transition-all cursor-pointer
                ${!selectedOption || isSubmitting
                  ? 'bg-neutral-300 cursor-not-allowed'
                  : 'bg-neutral-900 hover:bg-neutral-800 shadow-lg hover:shadow-xl'
                }
              `}
            >
              {isSubmitting ? 'Placing Bet...' : 'Place Bet'}
            </button>
          </div>
        </DashboardCard>

        {/* Visual Separator */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Participants ({market.participants.length})</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Participants List */}
        <DashboardCard className="p-6">
          <div className="space-y-3">
            {market.participants.map((participant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                    {participant.username.charAt(1).toUpperCase()}
                  </div>
                  <span className="font-medium text-neutral-900">{participant.username}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-mono font-medium text-neutral-700">{participant.total_stake} MP</span>
                  <span className="text-xs text-neutral-500">
                    {new Date(participant.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
