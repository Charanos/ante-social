"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { Users, Clock, TrendingUp, CheckCircle2, Shield, ArrowRight, Zap, ScanEye } from "lucide-react"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { useToast } from "@/hooks/useToast"
import { mockUser } from "@/lib/mockData"
import Image from "next/image"

// Mock reflex market data
const getMockReflexMarket = (id: string) => ({
  id,
  title: "First Reaction: Group Chat Dilemma",
  description: "When suddenly added to a new group chat, what will the majority do in the first 5 seconds? Predict the crowd's instinct!",
  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop",
  category: "Reflex",
  scenario: "You're suddenly added to a group chat with 50 unknown people. What's your FIRST reaction?",
  market_type: "reflex",
  buy_in_amount: 500,
  total_pool: 98750,
  participant_count: 156,
  status: "active",
  close_date: new Date(Date.now() + 2700000), // 45 min
  options: [
    { id: "opt1", option_text: "Leave immediately", emoji: "🏃", votes: 45, percentage: 29 },
    { id: "opt2", option_text: "Mute notifications", emoji: "🔕", votes: 52, percentage: 33 },
    { id: "opt3", option_text: "Ask \"who's this?\"", emoji: "❓", votes: 38, percentage: 24 },
    { id: "opt4", option_text: "Pretend not seeing it", emoji: "🙈", votes: 15, percentage: 10 },
    { id: "opt5", option_text: "Participate for fun", emoji: "🎉", votes: 6, percentage: 4 }
  ],
  participants: [
    { username: "@quick_exit", total_stake: 1000, timestamp: new Date(Date.now() - 1200000) },
    { username: "@social_master", total_stake: 2500, timestamp: new Date(Date.now() - 900000) },
    { username: "@mute_gang", total_stake: 1500, timestamp: new Date(Date.now() - 600000) },
    { username: "@shy_one", total_stake: 500, timestamp: new Date(Date.now() - 300000) }
  ]
})

export default function ReflexMarketPage() {
  const params = useParams()
  const toast = useToast()
  const marketId = params.id as string

  const market = getMockReflexMarket(marketId)

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [stakeAmount, setStakeAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [isCountingDown, setIsCountingDown] = useState(false)

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setIsCountingDown(false)
      setCountdown(5)
    }
  }, [countdown, isCountingDown])

  const handlePlaceBet = () => {
    if (!selectedOption || !stakeAmount || parseFloat(stakeAmount) < market.buy_in_amount) {
      toast.error("Invalid Bet", `Minimum stake is ${market.buy_in_amount.toLocaleString()} KSH`)
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      const selectedOptionText = market.options.find((o: any) => o.id === selectedOption)?.option_text
      toast.success("Prediction Locked!", `You predicted "${selectedOptionText}"`)
      setIsSubmitting(false)
    }, 1000)
  }

  const getTimeRemaining = () => {
    const diff = market.close_date.getTime() - Date.now()
    const minutes = Math.floor(diff / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const platformFee = stakeAmount ? parseFloat(stakeAmount) * 0.05 : 0
  const totalAmount = stakeAmount ? parseFloat(stakeAmount) + platformFee : 0

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">

        {/* Dashboard Header */}
        <DashboardHeader user={mockUser} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

              {/* Hero Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <Image
                  src={market.image}
                  alt={market.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                {/* Badges on Image */}
                <div className="absolute top-6 left-6 flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full flex items-center bg-white/90 backdrop-blur-sm border border-black/10">
                    <span className="text-xs font-semibold text-black/70 uppercase tracking-wider">
                      {market.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/90 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      {market.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-black/90 tracking-tight mb-3">
                    {market.title}
                  </h2>
                  <p className="text-base text-black/60 font-medium leading-relaxed">
                    {market.description}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-black/40" />
                      <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">Pool</span>
                    </div>
                    <p className="text-xl font-semibold font-mono text-black/90">
                      {market.total_pool.toLocaleString()}
                    </p>
                    <p className="text-xs font-medium text-black/40 mt-1">KSH</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-black/40" />
                      <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">Players</span>
                    </div>
                    <p className="text-xl font-semibold font-mono text-black/90">
                      {market.participant_count}
                    </p>
                    <p className="text-xs font-medium text-black/40 mt-1">Active</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5 col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-black/40" />
                      <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">Closes In</span>
                    </div>
                    <p className="text-xl font-semibold font-mono text-black/90">
                      {getTimeRemaining()}
                    </p>
                    <p className="text-xs font-medium text-black/40 mt-1">Remaining</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Scenario Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 rounded-3xl bg-amber-50/60 backdrop-blur-sm border border-amber-200/50"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-amber-900/80 uppercase tracking-wider mb-2">The Scenario</h3>
                  <p className="text-lg font-medium text-amber-900 leading-relaxed">
                    {market.scenario}
                  </p>
                  <p className="text-sm text-amber-700 mt-3 font-medium">
                    ⚡ You have 5 seconds to decide. What will the majority choose?
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Visual Separator */}
            <div className="flex items-center gap-4 my-18">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Quick Reactions</h2>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
            </div>

            {/* Options */}
            <div className="space-y-4 my-18">
              {market.options.map((option: any, index: number) => {
                const isSelected = selectedOption === option.id

                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    onClick={() => setSelectedOption(option.id)}
                    className={`group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 ${isSelected
                      ? "bg-white/60 backdrop-blur-xl border-2 border-black/20 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)]"
                      : "bg-white/40 backdrop-blur-sm border border-black/5 hover:bg-white/60 hover:border-black/10 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{option.emoji}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-semibold text-black/90">
                            {option.option_text}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold font-mono text-black/80">
                              {option.percentage}%
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-black" />
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${option.percentage}%` }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.3 + index * 0.05 }}
                              className={`h-full rounded-full ${isSelected ? 'bg-black/80' : 'bg-black/40'
                                }`}
                            />
                          </div>
                          <span className="text-xs text-black/40 font-medium">{option.votes} predictions</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ScanEye className="w-5 h-5 text-black/40" />
                <h3 className="text-lg font-semibold text-black/90">Recent Activity</h3>
              </div>

              <div className="space-y-3">
                {market.participants.map((participant: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5 hover:bg-white/60 hover:border-black/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-sm font-semibold text-black/70">
                        {participant.username.substring(1, 3).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black/90">{participant.username}</p>
                        <p className="text-xs text-black/50 font-medium">Made prediction</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold font-mono text-black/90">
                        {participant.total_stake.toLocaleString()} KSH
                      </p>
                      <p className="text-xs text-black/40 font-medium">
                        {new Date(participant.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">

              {/* Bet Placement Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border border-black/5 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)]"
              >
                {/* Header */}
                <div className="p-6 bg-black">
                  <h3 className="text-xl font-semibold text-white mb-1">Place Your Bet</h3>
                  <p className="text-sm text-white/60 font-medium">Predict the crowd's reflex</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                  {/* Selected Option */}
                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                    <span className="text-xs font-semibold text-black/40 uppercase tracking-wider block mb-2">
                      Selected Prediction
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedOption ? (
                        <>
                          <span className="text-base font-semibold text-black/90">
                            {market.options.find((o: any) => o.id === selectedOption)?.option_text}
                          </span>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </>
                      ) : (
                        <span className="text-base text-black/40 italic">No option selected</span>
                      )}
                    </div>
                  </div>

                  {/* Stake Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-black/70">Your Stake</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={market.buy_in_amount.toLocaleString()}
                        min={market.buy_in_amount}
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="w-full px-4 py-2 pr-16 bg-white/60 backdrop-blur-sm border border-black/10 rounded-xl text-base font-mono font-semibold text-black/90 focus:border-black/30 focus:bg-white/80 outline-none transition-all placeholder:text-black/30"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-black/40">
                        KSH
                      </span>
                    </div>
                    <div className="flex justify-between text-xs px-1">
                      <span className="text-black/40 font-medium">Minimum buy-in</span>
                      <span className="font-mono font-semibold text-black/70">
                        {market.buy_in_amount.toLocaleString()} KSH
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="pt-6 border-t border-black/5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-black/60 font-medium">Platform Fee (5%)</span>
                      <span className="font-mono font-semibold text-black/80">
                        {platformFee.toLocaleString()} KSH
                      </span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-black/90 font-semibold">Total Amount</span>
                      <span className="font-mono font-semibold text-black/90">
                        {totalAmount.toLocaleString()} KSH
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    onClick={handlePlaceBet}
                    disabled={isSubmitting || !selectedOption || !stakeAmount}
                    className={`w-full py-2 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${isSubmitting || !selectedOption || !stakeAmount
                      ? "bg-black/10 text-black/30 cursor-not-allowed"
                      : "bg-black text-white hover:bg-black/90 shadow-lg cursor-pointer"
                      }`}
                    whileHover={!isSubmitting && selectedOption && stakeAmount ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting && selectedOption && stakeAmount ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Bet
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-5 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5"
              >
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-black/60 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-black/90">How it works</p>
                    <p className="text-xs text-black/60 font-medium leading-relaxed">
                      Winners split the prize pool proportionally based on their stake. All payouts are processed instantly when the market closes.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
