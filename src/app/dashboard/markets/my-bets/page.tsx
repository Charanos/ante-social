"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Trophy, Clock, Check, X, ArrowRight, TrendingUp, DollarSign, Wallet, Filter, Search, Dot, LoaderPinwheel } from "lucide-react"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { cn } from "@/lib/utils"
import { mockMyBets, mockUser } from "@/lib/mockData"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingLogo } from "@/components/ui/LoadingLogo"
import { Skeleton } from "@/components/ui/Skeleton"
import { useEffect } from "react"

export default function MyBetsPage() {
    const [filter, setFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200)
        return () => clearTimeout(timer)
    }, [])

    // Calculate stats
    const totalWagered = mockMyBets.reduce((acc, bet) => acc + bet.amount, 0);
    const netProfit = mockMyBets.reduce((acc, bet) => {
        if (bet.status === 'won') return acc + (bet.potentialWin - bet.amount);
        if (bet.status === 'lost') return acc - bet.amount;
        return acc;
    }, 0);
    const winRate = Math.round((mockMyBets.filter(b => b.status === 'won').length / mockMyBets.filter(b => b.status === 'won' || b.status === 'lost').length) * 100) || 0;

    const filteredBets = mockMyBets.filter(bet => {
        const matchesFilter = filter === "all" || bet.status === filter;
        const matchesSearch = bet.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (isLoading) {
        return <LoadingLogo fullScreen size="lg" />
    }

    return (
        <div className="min-h-screen pb-20">
            <div className="max-w-full mx-auto pl-8 pb-8 space-y-8">
                <DashboardHeader
                    user={mockUser}
                    subtitle="Track your active wagers and betting history"
                />

                {/* Stats Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Wagered */}
                    <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-900/60">Total Wagered</p>
                                    <p className="mt-2 text-2xl font-medium numeric text-blue-900">${totalWagered.toLocaleString()}</p>
                                </div>
                                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                                    <Wallet className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Net Profit */}
                    <Card className="relative overflow-hidden border-none bg-linear-to-br from-emerald-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-100/50 blur-2xl transition-all group-hover:bg-emerald-200/50" />
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-900/60">Net Profit</p>
                                    <p className={cn("mt-2 text-2xl font-medium numeric", netProfit >= 0 ? "text-emerald-700" : "text-red-600")}>
                                        {netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString()}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Win Rate */}
                    <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-900/60">Win Rate</p>
                                    <p className="mt-2 text-2xl font-medium numeric text-purple-900">{winRate}%</p>
                                </div>
                                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                                    <Trophy className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Visual Separator */}
                <div className="flex items-center gap-4 my-18">
                    <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
                    <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Active & History</h2>
                    <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
                </div>

                {/* Filter & Search */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="sticky top-4 z-30 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-3 p-2 bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl ring-1 ring-black/5">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <input
                                type="text"
                                placeholder="Search your bets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-neutral-100/70 hover:bg-neutral-100 focus:bg-white text-sm font-medium text-neutral-900 rounded-xl border-none outline-none ring-1 ring-transparent focus:ring-black/5 transition-all placeholder:text-neutral-600"
                            />
                        </div>

                        <div className="flex gap-1 overflow-x-auto no-scrollbar py-1 md:py-0 px-1">
                            {["all", "active", "won", "lost"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={cn(
                                        "relative px-4 cursor-pointer py-2 rounded-xl text-sm font-medium transition-all capitalize whitespace-nowrap select-none",
                                        filter === tab
                                            ? "text-neutral-200 bg-black shadow-sm ring-1 ring-black/5"
                                            : "text-neutral-600 hover:text-neutral-700 hover:bg-neutral-100/50"
                                    )}
                                >
                                    {tab}
                                    {filter === tab && (
                                        <motion.div
                                            layoutId="activeFilter"
                                            className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-black/5 -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Bets List */}
                <div className="grid gap-4">
                    {filteredBets.length > 0 ? (
                        filteredBets.map((bet, index) => (
                            <Link href={`/dashboard/markets/my-bets/${bet.id}`} key={bet.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                    className="group relative overflow-hidden rounded-2xl bg-white/60 hover:bg-white border border-white/50 hover:border-black/5 shadow-sm hover:shadow-md transition-all p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                                            bet.status === 'active' ? 'text-blue-500' :
                                                bet.status === 'won' ? 'text-green-500' :
                                                    'text-red-500'
                                        )}>
                                            {bet.status === 'active' && <LoaderPinwheel className="w-6 h-6" />}
                                            {bet.status === 'won' && <LoaderPinwheel className="w-6 h-6" />}
                                            {bet.status === 'lost' && <LoaderPinwheel className="w-6 h-6" />}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {bet.title}
                                                </h3>
                                                {bet.status === 'active' && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <span className="capitalize px-2 py-0.5 rounded-md bg-gray-100/50 text-xs font-medium border border-gray-200/50">
                                                    {bet.type.replace(/_/g, " ")}
                                                </span>
                                                <span className="text-gray-400">•</span>
                                                <span>{new Date(bet.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 pl-18 md:pl-0">
                                        <div className="min-w-[80px]">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Wager</p>
                                            <p className="text-xl font-semibold text-gray-900 numeric">${bet.amount}</p>
                                        </div>

                                        <div className="w-px h-10 bg-gray-200 hidden md:block" />

                                        <div className="min-w-[80px]">
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

                                        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-black/5 transition-colors">
                                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-lg font-medium text-gray-400">No bets found</p>
                            <p className="text-sm text-gray-400/60">Try adjusting your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
