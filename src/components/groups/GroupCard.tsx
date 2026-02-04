"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Users, Shield, ArrowRight, TrendingUp, Globe, Lock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface GroupCardProps {
    group: {
        id: number | string
        name: string
        description: string
        members: number
        activeBets: number
        category: string
        isPublic: boolean
        trending?: boolean
        growth?: string
        image?: string
    }
    featured?: boolean
    index?: number
    showVisibilityBadge?: boolean
    isJoined?: boolean
    hideJoinedBadge?: boolean
}

export function GroupCard({
    group,
    featured,
    index = 0,
    showVisibilityBadge = false,
    isJoined = false,
    hideJoinedBadge = false
}: GroupCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="h-full"
        >
            <Link href={`/dashboard/groups/${group.id}`}>
                <div className={cn(
                    "group relative overflow-hidden rounded-3xl transition-all duration-300 cursor-pointer h-full flex flex-col",
                    featured
                        ? "bg-white/60 backdrop-blur-sm border border-black/5 hover:border-black/10 hover:bg-white shadow-lg hover:shadow-xl"
                        : "bg-white/40 backdrop-blur-sm border border-black/5 hover:border-black/10 hover:bg-white/60 shadow-sm hover:shadow-lg"
                )}>
                    {group.trending && featured && (
                        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-orange-500/50 to-transparent z-10" />
                    )}

                    {/* Image Header */}
                    {group.image && (
                        <div className={cn(
                            "w-full relative overflow-hidden",
                            featured ? "h-36" : "h-28"
                        )}>
                            <img
                                src={group.image}
                                alt={group.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-semibold text-white uppercase tracking-wider">
                                {group.category}
                            </div>

                            {showVisibilityBadge && (
                                <div className={cn(
                                    "absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm",
                                    group.isPublic
                                        ? "bg-blue-600/40 text-white border-blue-400/30"
                                        : "bg-red-600/40 text-white border-red-400/30"
                                )}>
                                    {group.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                    {group.isPublic ? "Public" : "Private"}
                                </div>
                            )}

                            {isJoined && !hideJoinedBadge && (
                                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-600/40 backdrop-blur-md border border-green-400/30 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Joined
                                </div>
                            )}
                        </div>
                    )}

                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex flex-col gap-2 mb-2">
                                    {showVisibilityBadge && !group.image && (
                                        <div className={cn(
                                            "w-fit flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                            group.isPublic
                                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                                : "bg-red-50 text-red-600 border-red-100"
                                        )}>
                                            {group.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                            {group.isPublic ? "Public" : "Private"}
                                        </div>
                                    )}
                                    {isJoined && !group.image && !hideJoinedBadge && (
                                        <div className="w-fit flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100 text-[10px] font-bold uppercase tracking-wider">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Joined
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <h3 className={cn(
                                            "font-semibold text-black/90 group-hover:text-black transition-colors",
                                            featured ? "text-lg" : "text-base"
                                        )}>
                                            {group.name}
                                        </h3>
                                        {!group.isPublic && !showVisibilityBadge && <Shield className="w-3.5 h-3.5 text-black/30" />}
                                    </div>
                                </div>
                                {!group.image && (
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-black/5 text-[10px] font-semibold text-black/50 uppercase tracking-wider mb-2">
                                        {group.category}
                                    </span>
                                )}
                                <p className={cn(
                                    "text-black/50 font-medium leading-relaxed line-clamp-2",
                                    featured ? "text-sm" : "text-xs"
                                )}>
                                    {group.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
                            <div className="flex items-center gap-6">
                                {/* Avatar Stack & Members */}
                                <div className="flex items-center">
                                    <div className="flex -space-x-2.5">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="h-6 w-6 rounded-full ring-2 ring-white/80 bg-linear-to-br from-neutral-100 to-neutral-200 border border-black/10 flex items-center justify-center overflow-hidden"
                                            >
                                                <div className="w-full h-full bg-black/5" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="ml-2 flex items-baseline">
                                        <span className="text-xs font-semibold text-black/80 font-mono">{group.members.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Live Bets Pill */}
                                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-50 border border-green-500/10 shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                    <span className="text-[10px] font-semibold text-green-700 uppercase tracking-tight">
                                        {group.activeBets} Live
                                    </span>
                                </div>
                            </div>

                            {featured && group.growth ? (
                                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                                    <TrendingUp className="w-3 h-3 text-orange-600" />
                                    <span className="text-[10px] font-semibold text-orange-700 font-mono italic">
                                        {group.growth}
                                    </span>
                                </div>
                            ) : (
                                <ArrowRight className="w-4 h-4 text-black/30 group-hover:text-black/60 group-hover:translate-x-1 transition-all" />
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
