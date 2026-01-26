"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trophy, AlertCircle, Users, Calendar, DollarSign, X, Check } from "lucide-react"

export default function GroupDetailsPage() {
  const params = useParams()
  const groupId = params.id as string
  
  // Mock data for demonstration
  const [markets, setMarkets] = useState<any[]>([
    { id: 1, title: "Who wins the FIFA tournament?", type: "winner_takes_all", buy_in: 50, pool: 250, participants: 5, created_at: new Date() },
    { id: 2, title: "Will John be late for standup?", type: "odd_one_out", buy_in: 10, pool: 40, participants: 4, created_at: new Date() }
  ])
  
  const [isCreateMarketModalOpen, setIsCreateMarketModalOpen] = useState(false)
  
  // Market Form State
  const [title, setTitle] = useState("")
  const [buyIn, setBuyIn] = useState("")
  const [type, setType] = useState("winner_takes_all")

  useEffect(() => {
    // Fetch markets (mock for now, need API route for listing group markets)
    // In real implementation: fetch(`/api/groups/${groupId}/markets`)
  }, [groupId])

  const handleCreateMarket = async () => {
    // Mock creation
    const newMarket = {
        id: markets.length + 1,
        title,
        type,
        buy_in: parseFloat(buyIn),
        pool: parseFloat(buyIn), // Initial pool is just the creator's buy-in
        participants: 1,
        created_at: new Date()
    }
    setMarkets([newMarket, ...markets])
    setIsCreateMarketModalOpen(false)
    setTitle("")
    setBuyIn("")
    setType("winner_takes_all")
  }

  return (
    <div className="space-y-8">
      {/* Gradient Group Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 p-8 text-white shadow-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-4xl font-medium shadow-inner border border-white/20">
                    {groupId.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl font-medium tracking-tight">High Rollers Club</h1>
                    <div className="mt-2 flex items-center gap-4 text-purple-100">
                        <span className="flex items-center gap-1.5 text-sm font-medium bg-white/10 px-3 py-1 rounded-full border border-white/10">
                            <Users className="h-4 w-4" />
                            12 Members
                        </span>
                        <span className="flex items-center gap-1.5 text-sm font-medium bg-white/10 px-3 py-1 rounded-full border border-white/10">
                            <Calendar className="h-4 w-4" />
                            Est. 2024
                        </span>
                    </div>
                </div>
            </div>
            
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreateMarketModalOpen(true)}
                className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-purple-900 shadow-lg transition-all hover:bg-purple-50 hover:shadow-xl font-medium"
            >
                <Plus className="h-5 w-5" />
                Create Private Bet
            </motion.button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">Active Private Bets</h2>
            <div className="text-sm text-gray-500 font-medium">{markets.length} active</div>
        </div>
        
        {markets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Trophy className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No active bets in this group.</p>
                <button 
                    onClick={() => setIsCreateMarketModalOpen(true)}
                    className="mt-2 text-sm font-medium text-purple-600 hover:underline"
                >
                    Start the first one!
                </button>
            </div>
        ) : (
            <div className="grid gap-4">
                {markets.map((market) => (
                    <motion.div 
                        key={market.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] transition-all hover:shadow-lg hover:-translate-y-0.5 border border-transparent hover:border-purple-100"
                    >
                        <Link href={`/dashboard/groups/${groupId}/markets/${market.id}`} className="block p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full ${market.type === 'winner_takes_all' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>
                                        <Trophy className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-700 transition-colors uppercase tracking-tight">{market.title}</h3>
                                        <div className="mt-1 flex items-center gap-3 text-xs font-medium text-gray-500">
                                            <span className="uppercase tracking-wide">{market.type.replace(/_/g, ' ')}</span>
                                            <span className="h-1 w-1 rounded-full bg-gray-300" />
                                            <span>{new Date(market.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Pool</p>
                                        <p className="text-lg font-medium text-green-600 numeric">${market.pool}</p>
                                    </div>
                                    <div className="h-8 w-px bg-gray-100" />
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Buy-in</p>
                                        <p className="text-lg font-medium text-gray-900 numeric">${market.buy_in}</p>
                                    </div>
                                    <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                        <Check className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        )}
      </div>

      <AnimatePresence>
        {isCreateMarketModalOpen && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-0 shadow-2xl"
            >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Create Private Bet</h2>
                    <button 
                        onClick={() => setIsCreateMarketModalOpen(false)}
                        className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
                
                <div className="p-6 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Bet Title</label>
                        <input
                        type="text"
                        placeholder="e.g., Who wins the FIFA match?"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 font-medium placeholder:text-gray-400 outline-none transition-all focus:border-gray-900 focus:bg-white focus:ring-0"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Bet Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setType("winner_takes_all")}
                                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all ${type === "winner_takes_all" ? "border-purple-600 bg-purple-50 text-purple-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                            >
                                <Trophy className="h-5 w-5" />
                                <span className="text-xs font-medium">Winner Takes All</span>
                            </button>
                            <button
                                onClick={() => setType("odd_one_out")}
                                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all ${type === "odd_one_out" ? "border-purple-600 bg-purple-50 text-purple-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                            >
                                <AlertCircle className="h-5 w-5" />
                                <span className="text-xs font-medium">Odd One Out</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Buy-in Amount ($)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                            type="number"
                            placeholder="0.00"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-gray-900 font-mono font-medium placeholder:text-gray-400 outline-none transition-all focus:border-gray-900 focus:bg-white focus:ring-0"
                            value={buyIn}
                            onChange={(e) => setBuyIn(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            onClick={() => setIsCreateMarketModalOpen(false)}
                            className="flex-1 cursor-pointer rounded-full border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateMarket}
                            disabled={!title.trim() || !buyIn}
                            className="flex-1 cursor-pointer rounded-full bg-gray-900 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-black hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Create Bet
                        </button>
                    </div>
                </div>
            </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
