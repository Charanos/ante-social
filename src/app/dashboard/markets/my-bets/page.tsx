"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Trophy, Clock, Check, X, ArrowRight, TrendingUp, DollarSign } from "lucide-react"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { cn } from "@/lib/utils"

// Mock data
const myBets = [
    {
        id: 1,
        title: "Who wins the Premier League?",
        amount: 50,
        status: "active",
        potentialWin: 250,
        type: "winner_takes_all",
        date: "2024-03-15"
    },
    {
        id: 2,
        title: "Bitcoin hits $100k by Q3",
        amount: 100,
        status: "won",
        potentialWin: 180,
        type: "binary",
        date: "2024-01-10"
    },
    {
        id: 3,
        title: "Will it rain on Saturday?",
        amount: 20,
        status: "lost",
        potentialWin: 40,
        type: "binary",
        date: "2024-02-28"
    },
]

export default function MyBetsPage() {
    const [filter, setFilter] = useState("all")

    return (
        <div className="space-y-8 pb-20">
            <DashboardHeader
                user={{ username: "User" }}
                subtitle="Track your participation and history"
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-3xl border-white/50 bg-white/40 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Wagered</p>
                        <p className="text-2xl font-semibold text-gray-900 numeric">$1,250</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <DollarSign className="w-6 h-6" />
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-3xl border-white/50 bg-white/40 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Net Profit</p>
                        <p className="text-2xl font-semibold text-green-600 numeric">+$420</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-3xl border-white/50 bg-white/40 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Win Rate</p>
                        <p className="text-2xl font-semibold text-gray-900 numeric">68%</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Trophy className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100/50 backdrop-blur-sm rounded-xl w-fit">
                {["all", "active", "won", "lost"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                            filter === tab
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Bets List */}
            <div className="grid gap-4">
                {myBets
                    .filter(bet => filter === "all" || bet.status === filter)
                    .map((bet) => (
                        <motion.div
                            key={bet.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group glass-panel p-6 rounded-3xl border-white/50 bg-white/60 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                                    bet.status === 'active' ? 'bg-blue-50 text-blue-600' :
                                        bet.status === 'won' ? 'bg-green-50 text-green-600' :
                                            'bg-red-50 text-red-600'
                                )}>
                                    {bet.status === 'active' && <Clock className="w-6 h-6" />}
                                    {bet.status === 'won' && <Trophy className="w-6 h-6" />}
                                    {bet.status === 'lost' && <X className="w-6 h-6" />}
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                        {bet.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <span className="capitalize px-2 py-0.5 rounded-md bg-gray-100 text-xs font-medium border border-gray-200">
                                            {bet.type.replace(/_/g, " ")}
                                        </span>
                                        <span>Placed on {new Date(bet.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 pl-16 md:pl-0">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Wager</p>
                                    <p className="text-xl font-semibold text-gray-900 numeric">${bet.amount}</p>
                                </div>

                                <div className="w-px h-10 bg-gray-200 hidden md:block" />

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                        {bet.status === 'won' ? 'Won' : 'Potential'}
                                    </p>
                                    <p className={cn(
                                        "text-xl font-semibold numeric",
                                        bet.status === 'won' ? "text-green-600" : "text-gray-900"
                                    )}>
                                        ${bet.potentialWin}
                                    </p>
                                </div>

                                <Link href={`/dashboard/markets/${bet.id}`} className="ml-auto md:ml-0 p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
            </div>
        </div>
    )
}
