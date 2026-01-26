"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Trophy, 
  Users, 
  DollarSign, 
  AlertCircle, 
  Shield, 
  Check, 
  X,
  MessageSquare,
  TrendingUp
} from "lucide-react"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"

import DashboardHeader from "@/components/dashboard/DashboardHeader"

export default function PrivateMarketDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  
  const groupId = params.id as string
  const marketId = params.marketId as string

  // Mock data - would normally fetch based on marketId
  const [market, setMarket] = useState({
    id: marketId,
    title: marketId === "1" ? "Who wins the FIFA tournament?" : "Will John be late for standup?",
    type: marketId === "1" ? "winner_takes_all" : "odd_one_out",
    buy_in: marketId === "1" ? 50 : 10,
    pool: marketId === "1" ? 250 : 40,
    status: "active", // active, pending_confirmation, settled
    created_at: new Date(),
    creator: "AdminUser",
    participants: [
      { id: "u1", name: "Alpha", selected: "Option A", joined: "2h ago" },
      { id: "u2", name: "Bravo", selected: "Option B", joined: "1h ago" },
      { id: "u3", name: "Charlie", selected: "Option A", joined: "30m ago" },
    ]
  })

  const [selectedWinner, setSelectedWinner] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDeclareWinner = () => {
    if (!selectedWinner) return
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setMarket({ ...market, status: "pending_confirmation" })
      setIsSubmitting(false)
      toast.success("Winner Declared!", "Waiting for group confirmation.")
    }, 1000)
  }

  const handleConfirm = () => {
    setMarket({ ...market, status: "settled" })
    toast.success("Payout Processed!", "The winner has been credited.")
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <DashboardHeader 
          subtitle={market.title} 
        />

        <div className="flex items-center gap-2 -mt-16 mb-8 relative z-10 px-2 justify-end">
              <span className={`px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider border shadow-sm ${
                market.type === 'winner_takes_all' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {market.type.replace(/_/g, ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider border shadow-sm ${
                market.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                {market.status}
              </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <DashboardCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">Prize Pool</p>
                <p className="mt-1 text-3xl font-medium numeric text-green-600">${market.pool}</p>
                <p className="text-xs text-neutral-400 mt-1">incl. 5% platform fee</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">Buy-in</p>
                <p className="mt-1 text-3xl font-medium numeric text-neutral-900">${market.buy_in}</p>
                <p className="text-xs text-neutral-400 mt-1">{market.participants.length} Players joined</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Conditional Content based on status */}
        <AnimatePresence mode="wait">
          {market.status === "active" && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {market.type === "winner_takes_all" ? (
                /* Winner Selection (for admin/creator) */
                <DashboardCard className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-medium text-neutral-900">Declare Result</h2>
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-6">
                    As the creator, you are responsible for declaring the outcome. Misleading declarations may lead to account suspension.
                  </p>

                  <div className="grid gap-3 mb-8">
                    {market.participants.map((player) => (
                      <button
                        key={player.id}
                        onClick={() => setSelectedWinner(player.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          selectedWinner === player.id 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-neutral-100 hover:border-purple-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center font-bold text-neutral-600">
                            {player.name.charAt(0)}
                          </div>
                          <span className="font-medium text-neutral-900">{player.name}</span>
                        </div>
                        {selectedWinner === player.id && <Check className="h-5 w-5 text-purple-600" />}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={!selectedWinner || isSubmitting}
                    onClick={handleDeclareWinner}
                    className="w-full py-4 rounded-xl bg-neutral-900 text-white font-medium shadow-lg hover:bg-black transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Declare Winner"}
                  </button>
                </DashboardCard>
              ) : (
                /* Odd One Out Interaction */
                <DashboardCard className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-medium text-neutral-900">Make Your Global Guess</h2>
                  </div>

                  <p className="text-sm text-neutral-600 mb-6">
                    Pick an option. If your choice is the <strong>least popular</strong> among all participants, you win!
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {["Option A", "Option B", "Option C", "Option D"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedWinner(opt)}
                        className={`p-6 rounded-2xl border-2 transition-all text-center ${
                          selectedWinner === opt 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-neutral-100 bg-neutral-50 hover:bg-white hover:border-blue-200'
                        }`}
                      >
                        <span className="font-bold text-lg">{opt}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={!selectedWinner || isSubmitting}
                    onClick={() => {
                        setIsSubmitting(true)
                        setTimeout(() => {
                            setMarket({ ...market, status: "settled" })
                            setIsSubmitting(false)
                            toast.success("Choice Locked!", "Result calculated automatically.")
                        }, 1500)
                    }}
                    className="w-full py-4 rounded-xl bg-blue-600 text-white font-medium shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Calculating..." : "Lock Choice & Settle"}
                  </button>
                </DashboardCard>
              )}

              {/* Chat/Info */}
              <DashboardCard className="p-6 bg-neutral-50 border-dashed border-neutral-200">
                <div className="flex items-center gap-3 text-neutral-500">
                  <MessageSquare className="h-5 w-5" />
                  <p className="text-sm font-medium">Discuss the outcome in the group chat before declaring.</p>
                </div>
              </DashboardCard>
            </motion.div>
          )}

          {market.status === "pending_confirmation" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <DashboardCard className="p-8 border-2 border-yellow-500/20 bg-yellow-50/50">
                <div className="flex flex-col items-center text-center space-y-8">
                  <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center animate-pulse">
                    <AlertCircle className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">Confirmation Required</h2>
                    <p className="text-neutral-600 mt-2">
                       Group members must confirm the declared winner.
                    </p>
                  </div>
                  <div className="flex gap-4 w-full pt-4">
                    <button 
                      onClick={handleConfirm}
                      className="flex-1 py-3 rounded-xl bg-green-600 text-white font-medium shadow-md hover:bg-green-700 transition-all"
                    >
                      Confirm
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-red-50 text-red-600 border border-red-100 font-medium hover:bg-red-100 transition-all">
                      Disapprove
                    </button>
                  </div>
                </div>
              </DashboardCard>
            </motion.div>
          )}

          {market.status === "settled" && (
            <motion.div
              key="settled"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <DashboardCard className="p-12 text-center">
                <div className="h-20 w-20 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
                  <TrendingUp className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-neutral-900">Market Settled</h2>
                <p className="text-neutral-500 mt-2 mb-8">All rewards have been distributed to the winners.</p>
                <div className="max-w-xs mx-auto p-4 rounded-2xl bg-neutral-50">
                  <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest">Winning Payout</p>
                  <p className="text-4xl font-bold text-neutral-900 numeric mt-1">${market.pool * 0.95}</p>
                </div>
              </DashboardCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Participant List */}
        <div className="mt-12">
            <h3 className="text-lg font-medium text-neutral-900 mb-6">Participants</h3>
            <div className="grid gap-4">
                {market.participants.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-400">
                                {player.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-neutral-900">{player.name}</p>
                                <p className="text-xs text-neutral-500">Joined {player.joined}</p>
                            </div>
                        </div>
                        <div className="px-3 py-1 bg-neutral-50 rounded-lg text-xs font-medium text-neutral-600 italic">
                            Picked: {player.selected}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}
