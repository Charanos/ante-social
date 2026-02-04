"use client"

import { motion } from "framer-motion"
import { Trophy, TrendingUp, Crown, Medal, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { leaderboardData } from "@/lib/mockData"

const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1) {
        return (
            <div className="relative flex items-center justify-center w-10 h-10">
                <div className="absolute inset-0 bg-linear-to-br from-yellow-400 to-amber-500 rounded-xl blur-md opacity-50" />
                <div className="relative flex items-center justify-center w-full h-full bg-linear-to-br from-yellow-400 to-amber-500 rounded-xl">
                    <Crown className="w-5 h-5 text-white" />
                </div>
            </div>
        )
    }
    if (rank === 2) {
        return (
            <div className="relative flex items-center justify-center w-10 h-10">
                <div className="absolute inset-0 bg-linear-to-br from-slate-300 to-slate-400 rounded-xl blur-md opacity-50" />
                <div className="relative flex items-center justify-center w-full h-full bg-linear-to-br from-slate-300 to-slate-400 rounded-xl">
                    <Medal className="w-5 h-5 text-white" />
                </div>
            </div>
        )
    }
    if (rank === 3) {
        return (
            <div className="relative flex items-center justify-center w-10 h-10">
                <div className="absolute inset-0 bg-linear-to-br from-orange-400 to-orange-500 rounded-xl blur-md opacity-50" />
                <div className="relative flex items-center justify-center w-full h-full bg-linear-to-br from-orange-400 to-orange-500 rounded-xl">
                    <Award className="w-5 h-5 text-white" />
                </div>
            </div>
        )
    }
    return (
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm border border-black/5">
            <span className="text-sm font-semibold font-mono text-black/60">#{rank}</span>
        </div>
    )
}

const TrendIndicator = ({ trend }: { trend: string }) => {
    if (trend === "up") {
        return (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-[10px] font-semibold text-green-700">UP</span>
            </div>
        )
    }
    if (trend === "down") {
        return (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />
                <span className="text-[10px] font-semibold text-red-700">DOWN</span>
            </div>
        )
    }
    return (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/5 border border-black/5">
            <span className="text-[10px] font-semibold text-black/40">SAME</span>
        </div>
    )
}

export default function LeaderboardSection() {
    return (
        <div className="space-y-6 my-18">
            {/* Section Header */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h2 className="text-lg font-semibold text-black/90">Top Players</h2>
                </div>
                <button className="text-sm font-semibold text-black/40 hover:text-black/60 transition-colors cursor-pointer">
                    View All
                </button>
            </div>

            {/* Leaderboard Container */}
            <div className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-sm border border-black/5 shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />

                {/* Top 3 Podium */}
                <div className="grid grid-cols-3 gap-4 p-4 md:p-6 border-b border-black/5 bg-linear-to-b from-amber-500/5 to-transparent">
                    {/* Second Place */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center pt-8"
                    >
                        <div className="relative mb-3">
                            <div className="absolute inset-0 bg-linear-to-br from-slate-300/50 to-slate-400/50 rounded-full blur-xl" />
                            <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center text-sm md:text-lg font-semibold text-slate-700 border-4 border-white shadow-lg">
                                {leaderboardData[1].avatar}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-linear-to-br from-slate-300 to-slate-400 flex items-center justify-center border-2 border-white">
                                <span className="text-[8px] md:text-[10px] font-semibold text-white">2</span>
                            </div>
                        </div>
                        <h3 className="font-semibold text-xs md:text-sm text-black/90 mb-1 text-center truncate w-full">{leaderboardData[1].username}</h3>
                        <p className="text-[10px] md:text-xs font-mono font-semibold text-black/60">
                            {(leaderboardData[1].totalWinnings / 1000).toFixed(0)}K KSH
                        </p>
                        <p className="hidden md:block text-[10px] text-black/40 font-semibold mt-1">{leaderboardData[1].winRate}% Win Rate</p>
                    </motion.div>

                    {/* First Place */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0 }}
                        className="flex flex-col items-center"
                    >
                        <div className="relative mb-3">
                            <div className="absolute inset-0 bg-linear-to-br from-yellow-400/50 to-amber-500/50 rounded-full blur-2xl" />
                            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-linear-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-base md:text-xl font-semibold text-white border-4 border-white shadow-2xl">
                                {leaderboardData[0].avatar}
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-linear-to-br from-yellow-400 to-amber-500 flex items-center justify-center border-2 border-white shadow-lg">
                                <Crown className="w-3 h-3 md:w-4 md:h-4 text-white" />
                            </div>
                        </div>
                        <h3 className="font-semibold text-sm md:text-base text-black/90 mb-1 text-center truncate w-full">{leaderboardData[0].username}</h3>
                        <p className="text-xs md:text-sm font-mono font-semibold text-amber-600">
                            {(leaderboardData[0].totalWinnings / 1000).toFixed(0)}K KSH
                        </p>
                        <p className="hidden md:block text-[10px] text-black/40 font-semibold mt-1">{leaderboardData[0].winRate}% Win Rate</p>
                    </motion.div>

                    {/* Third Place */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center pt-12"
                    >
                        <div className="relative mb-3">
                            <div className="absolute inset-0 bg-linear-to-br from-orange-400/50 to-orange-500/50 rounded-full blur-xl" />
                            <div className="relative w-11 h-11 md:w-14 md:h-14 rounded-full bg-linear-to-br from-orange-300 to-orange-400 flex items-center justify-center text-xs md:text-base font-semibold text-orange-800 border-4 border-white shadow-lg">
                                {leaderboardData[2].avatar}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-linear-to-br from-orange-400 to-orange-500 flex items-center justify-center border-2 border-white">
                                <span className="text-[8px] md:text-[10px] font-semibold text-white">3</span>
                            </div>
                        </div>
                        <h3 className="font-semibold text-xs md:text-sm text-black/90 mb-1 text-center truncate w-full">{leaderboardData[2].username}</h3>
                        <p className="text-[10px] md:text-xs font-mono font-semibold text-black/60">
                            {(leaderboardData[2].totalWinnings / 1000).toFixed(0)}K KSH
                        </p>
                        <p className="hidden md:block text-[10px] text-black/40 font-semibold mt-1">{leaderboardData[2].winRate}% Win Rate</p>
                    </motion.div>
                </div>

                {/* Remaining Rankings */}
                <div className="divide-y divide-black/5">
                    {leaderboardData.slice(3).map((player, index) => (
                        <motion.div
                            key={player.rank}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            className="flex items-center justify-between p-4 hover:bg-white/40 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                <RankBadge rank={player.rank} />

                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/5 flex items-center justify-center text-xs md:text-sm font-semibold text-black/70 group-hover:scale-110 transition-transform">
                                    {player.avatar}
                                </div>

                                <div className="flex flex-col min-w-0">
                                    <h4 className="font-semibold text-xs md:text-sm text-black/90 truncate">
                                        {player.username}
                                    </h4>
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <span className="text-[10px] md:text-xs text-black/50 font-mono">
                                            {player.activeBets} bets
                                        </span>
                                        <span className="text-black/20">•</span>
                                        <span className="text-[10px] md:text-xs text-black/50 font-semibold">
                                            {player.winRate}% wins
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 md:gap-4 ml-4">
                                <TrendIndicator trend={player.trend} />
                                <div className="text-right min-w-[40px] md:min-w-[50px]">
                                    <p className="text-xs md:text-sm font-semibold font-mono text-black/90">
                                        {(player.totalWinnings / 1000).toFixed(0)}K
                                    </p>
                                    <p className="text-[8px] md:text-[10px] text-black/40 font-semibold uppercase">KSH</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="p-4 bg-black/5 border-t border-black/5">
                    <button className="w-full py-3 rounded-xl bg-white/60 hover:bg-white border border-black/5 hover:border-black/10 font-semibold text-sm text-black/70 hover:text-black transition-all cursor-pointer">
                        View Full Leaderboard
                    </button>
                </div>
            </div>
        </div>
    )
}
