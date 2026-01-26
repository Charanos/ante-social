"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trophy, AlertCircle, Users, Calendar, DollarSign, X, Check, Shield, Search } from "lucide-react"
import DashboardHeader from "@/components/dashboard/DashboardHeader"

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
        <div className="space-y-10 min-h-screen pb-12 w-full">
            <DashboardHeader
                user={{ username: "HighRoller" }}
                subtitle="Manage your group and active private bets"
            />

            {/* Gradient Group Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-900 via-purple-900 to-black p-8 md:p-12 text-white shadow-[0_20px_50px_-12px_rgba(88,28,135,0.25)]">
                {/* Abstract Background Effects */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md text-5xl font-bold shadow-inner border border-white/20">
                            {groupId.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">High Rollers Club</h1>
                            <div className="flex items-center gap-3 text-purple-200">
                                <span className="flex items-center gap-1.5 text-sm font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                                    <Users className="h-4 w-4" />
                                    12 Members
                                </span>
                                <span className="flex items-center gap-1.5 text-sm font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                                    <Calendar className="h-4 w-4" />
                                    Est. 2024
                                </span>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 1)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsCreateMarketModalOpen(true)}
                        className="group flex cursor-pointer items-center gap-2 rounded-2xl bg-white/90 backdrop-blur-sm px-6 py-4 text-purple-900 shadow-xl transition-all hover:shadow-2xl font-bold"
                    >
                        <div className="p-1.5 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                            <Plus className="h-5 w-5 text-purple-700" />
                        </div>
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
                                className="group relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 hover:border-black/10 hover:bg-white/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)] transition-all duration-500"
                            >
                                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <Link href={`/dashboard/groups/${groupId}/markets/${market.id}`} className="block p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${market.type === 'winner_takes_all' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                                <Trophy className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors">{market.title}</h3>
                                                <div className="mt-2 flex items-center gap-3">
                                                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 uppercase tracking-wide">
                                                        {market.type.replace(/_/g, ' ')}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-medium">Created {new Date(market.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 pl-16 md:pl-0">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pool Size</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold font-mono text-gray-900">${market.pool}</span>
                                                    <span className="text-xs text-gray-500 font-medium">USD</span>
                                                </div>
                                            </div>

                                            <div className="hidden md:block w-px h-10 bg-gray-200" />

                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Entry</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold font-mono text-gray-900">${market.buy_in}</span>
                                                    <span className="text-xs text-gray-500 font-medium">USD</span>
                                                </div>
                                            </div>

                                            <div className="ml-4 h-10 w-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
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
