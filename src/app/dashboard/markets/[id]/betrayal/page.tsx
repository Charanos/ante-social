"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { Users, Clock, TrendingUp, Shield, Swords, CheckCircle2, ArrowRight, ScanEye, Handshake, Scale, Skull } from "lucide-react"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { useToast } from "@/hooks/useToast"
import { mockUser } from "@/lib/mockData"
import Image from "next/image"

// Mock betrayal market data
const getMockBetrayalMarket = (id: string) => ({
  id,
  title: "Betrayal Game: Trust or Cash",
  description: "Will you cooperate for a small win, or betray for the chance at it all? Choose wisely — the crowd's decision determines your fate.",
  image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&auto=format&fit=crop",
  category: "Betrayal",
  market_type: "betrayal",
  buy_in_amount: 2000,
  total_pool: 324100,
  participant_count: 121,
  status: "active",
  close_date: new Date(Date.now() + 13500000), // 3h 45m
  participants: [
    { username: "@trust_builder", total_stake: 5000, timestamp: new Date(Date.now() - 10800000) },
    { username: "@betrayer_001", total_stake: 8000, timestamp: new Date(Date.now() - 7200000) },
    { username: "@gambler_pro", total_stake: 3000, timestamp: new Date(Date.now() - 3600000) },
    { username: "@risk_taker", total_stake: 6000, timestamp: new Date(Date.now() - 1800000) }
  ]
})

export default function BetrayalMarketPage() {
  const params = useParams()
  const toast = useToast()
  const marketId = params.id as string

  const market = getMockBetrayalMarket(marketId)

  const [selectedChoice, setSelectedChoice] = useState<"cooperate" | "betray" | null>(null)
  const [stakeAmount, setStakeAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOutcomes, setShowOutcomes] = useState(false)

  const handlePlaceBet = async () => {
    if (!selectedChoice || !stakeAmount || parseFloat(stakeAmount) < market.buy_in_amount) {
      toast.error("Invalid Bet", `Minimum stake is ${market.buy_in_amount.toLocaleString()} KSH`)
      return
    }

    setIsSubmitting(true)

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

            {/* Visual Separator */}
            <div className="flex items-center gap-4 my-18">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Choose Your Strategy</h2>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
            </div>

            {/* Choice Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Cooperate */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => setSelectedChoice("cooperate")}
                className={`
                  relative overflow-hidden rounded-3xl border-2 p-8 cursor-pointer transition-all
                  ${selectedChoice === "cooperate"
                    ? 'border-green-500/50 bg-green-50/60 backdrop-blur-xl shadow-[0_16px_48px_-8px_rgba(34,197,94,0.3)]'
                    : 'border-black/10 bg-white/40 backdrop-blur-sm hover:border-green-300/50 hover:bg-green-50/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]'
                  }
                `}
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
                    <Handshake className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-black/90">COOPERATE</h3>
                  <p className="text-sm text-black/60 font-medium">Play it safe. Share the reward.</p>
                  <div className="space-y-2 text-left">
                    <p className="text-xs text-green-700 font-medium">✓ Guaranteed small win if others cooperate</p>
                    <p className="text-xs text-green-700 font-medium">✓ Lower risk strategy</p>
                    <p className="text-xs text-red-600 font-medium">✗ Betrayers take your share</p>
                  </div>
                </div>
                {selectedChoice === "cooperate" && (
                  <div className="absolute top-4 right-4">
                    <div className="rounded-full bg-green-500 p-2">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Betray */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => setSelectedChoice("betray")}
                className={`
                  relative overflow-hidden rounded-3xl border-2 p-8 cursor-pointer transition-all
                  ${selectedChoice === "betray"
                    ? 'border-red-500/50 bg-red-50/60 backdrop-blur-xl shadow-[0_16px_48px_-8px_rgba(239,68,68,0.3)]'
                    : 'border-black/10 bg-white/40 backdrop-blur-sm hover:border-red-300/50 hover:bg-red-50/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]'
                  }
                `}
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
                    <Swords className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-black/90">BETRAY</h3>
                  <p className="text-sm text-black/60 font-medium">Risk it all. Take the prize.</p>
                  <div className="space-y-2 text-left">
                    <p className="text-xs text-green-700 font-medium">✓ Win big if minority betrays</p>
                    <p className="text-xs text-green-700 font-medium">✓ Maximum potential payout</p>
                    <p className="text-xs text-red-600 font-medium">✗ Everyone loses if majority betrays</p>
                  </div>
                </div>
                {selectedChoice === "betray" && (
                  <div className="absolute top-4 right-4">
                    <div className="rounded-full bg-red-500 p-2">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Outcomes Explanation */}
            {showOutcomes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6 rounded-3xl bg-white/40 backdrop-blur-sm border border-black/5"
              >
                <h3 className="text-lg font-semibold text-black/90 mb-4">How Payouts Work</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-green-50/60 border border-green-200/50">
                    <Handshake className="w-6 h-6 text-green-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-900">All Cooperate</p>
                      <p className="text-sm text-green-700 font-medium">Everyone wins a small amount. Prize pool divided equally.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/50">
                    <Scale className="w-6 h-6 text-amber-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-amber-900">Majority Cooperate, Minority Betray</p>
                      <p className="text-sm text-amber-700 font-medium">Betrayers win BIG. They split the entire prize pool.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50/60 border border-red-200/50">
                    <Swords className="w-6 h-6 text-red-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-900">Majority Betray</p>
                      <p className="text-sm text-red-700 font-medium">Everyone loses. No payouts. Greed destroyed the pool.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-black border border-black/20">
                    <Skull className="w-6 h-6 text-white shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-white">All Betray</p>
                      <p className="text-sm text-white/70 font-medium">Zero for everyone. Complete mutual destruction.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="text-center">
              <button
                onClick={() => setShowOutcomes(!showOutcomes)}
                className="px-6 py-2 text-sm text-black/60 hover:text-black/90 font-medium cursor-pointer transition-colors underline"
              >
                {showOutcomes ? 'Hide' : 'Show'} Possible Outcomes
              </button>
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
                        <p className="text-xs text-black/50 font-medium">Made choice</p>
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
                  <p className="text-sm text-white/60 font-medium">Make your choice</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                  {/* Selected Choice */}
                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                    <span className="text-xs font-semibold text-black/40 uppercase tracking-wider block mb-2">
                      Selected Strategy
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedChoice ? (
                        <>
                          <span className={`text-base font-semibold ${selectedChoice === "cooperate" ? "text-green-700" : "text-red-700"
                            }`}>
                            {selectedChoice.toUpperCase()}
                          </span>
                          <CheckCircle2 className={`w-4 h-4 ${selectedChoice === "cooperate" ? "text-green-600" : "text-red-600"
                            }`} />
                        </>
                      ) : (
                        <span className="text-base text-black/40 italic">No choice selected</span>
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
                    disabled={isSubmitting || !selectedChoice || !stakeAmount}
                    className={`w-full py-2 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${isSubmitting || !selectedChoice || !stakeAmount
                      ? "bg-black/10 text-black/30 cursor-not-allowed"
                      : "bg-black text-white hover:bg-black/90 shadow-lg cursor-pointer"
                      }`}
                    whileHover={!isSubmitting && selectedChoice && stakeAmount ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting && selectedChoice && stakeAmount ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Locking In...
                      </>
                    ) : (
                      <>
                        Lock In Choice
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
                    <p className="text-sm font-semibold text-black/90">Your Choice is Secret</p>
                    <p className="text-xs text-black/60 font-medium leading-relaxed">
                      No one knows what you picked until the market settles. Results revealed simultaneously to all participants.
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
