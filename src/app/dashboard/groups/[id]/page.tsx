"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trophy, AlertCircle, Users, Calendar, DollarSign, X, Check, Shield, Search, Copy, Share2, Settings, ExternalLink, Activity, ChevronRight } from "lucide-react"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { useToast } from "@/components/ui/toast-notification"
import { LoadingLogo } from "@/components/ui/LoadingLogo"
import { Skeleton } from "@/components/ui/Skeleton"
import { mockUser, mockGroups } from "@/lib/mockData"
import { cn } from "@/lib/utils"

export default function GroupDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const toast = useToast()
    const groupId = params.id as string

    const [isLoading, setIsLoading] = useState(true)
    const [group, setGroup] = useState<any>(null)
    const [markets, setMarkets] = useState<any[]>([])
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        // Simulate fetching group data
        const fetchGroup = () => {
            const foundGroup = mockGroups.find(g => g.id === groupId) || mockGroups[0]
            setGroup(foundGroup)
            setMarkets([
                { id: "m1", title: "Who wins the FIFA tournament?", type: "poll", buyIn: 50, pool: 250, participants: 5, created_at: new Date() },
                { id: "m2", title: "Will John be late for standup?", type: "reflex", buyIn: 10, pool: 40, participants: 4, created_at: new Date() }
            ])
            setIsAdmin(mockUser.managed_groups?.includes(foundGroup.id) || mockUser.role === 'admin')
            setIsLoading(false)
        }
        setTimeout(fetchGroup, 1000)
    }, [groupId])

    const handleCopyInvite = () => {
        const inviteUrl = `${window.location.origin}/invite/${btoa(groupId)}`
        navigator.clipboard.writeText(inviteUrl)
        toast.success("Invite Link Copied!", "Share it with your crew to bring them in.")
    }

    const handleCreateMarket = () => {
        router.push(`/dashboard/markets/create?groupId=${groupId}`)
    }

    if (isLoading) return <LoadingLogo fullScreen size="lg" />
    if (!group) return <div>Group not found</div>

    return (
        <div className="space-y-10 min-h-screen pb-12 w-full pl-6">
            <DashboardHeader
                user={mockUser}
                subtitle={isAdmin ? "Administrative Dashboard" : "Community Hub"}
            />

            {/* Gradient Group Banner */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-neutral-900 via-neutral-800 to-black p-8 md:p-12 text-white shadow-2xl">
                {/* Abstract Background Effects */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

                <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md text-5xl font-semibold shadow-inner border border-white/10">
                            {group.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">{group.name}</h1>
                                <div className="flex gap-2">
                                    {isAdmin && (
                                        <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-[10px] font-semibold uppercase tracking-widest text-white/60">
                                            Admin
                                        </span>
                                    )}
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-widest",
                                        group.is_public
                                            ? "bg-blue-500/20 border border-blue-500/30 text-blue-300"
                                            : "bg-neutral-500/20 border border-neutral-500/30 text-neutral-400"
                                    )}>
                                        {group.is_public ? "Public" : "Private"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-400">
                                <span className="flex items-center gap-1.5 text-xs font-semibold bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
                                    <Users className="h-3 w-3" />
                                    {group.member_count} Members
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-semibold bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
                                    <Calendar className="h-3 w-3" />
                                    Est. {new Date(group.created_at).getFullYear()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCopyInvite}
                                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white cursor-pointer"
                                title="Invite Members"
                            >
                                <Share2 className="w-5 h-5" />
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 1)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCreateMarket}
                            className="group flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-6 py-4 text-black shadow-xl transition-all hover:shadow-2xl font-semibold text-sm"
                        >
                            <Plus className="h-5 w-5" />
                            Create Market
                        </motion.button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content: Markets */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-semibold text-gray-900">Active Pool</h2>
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <div className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">{markets.length} Markets</div>
                    </div>

                    {markets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center rounded-4xl border border-dashed border-gray-200 bg-gray-50/50">
                            <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                                <Trophy className="h-8 w-8 text-neutral-200" />
                            </div>
                            <p className="text-gray-400 font-medium">No active markets yet.</p>
                            <button
                                onClick={handleCreateMarket}
                                className="mt-4 text-sm font-semibold text-black border-b border-black hover:pb-0.5 transition-all"
                            >
                                Launch the first one
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {markets.map((market) => (
                                <motion.div
                                    key={market.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="group relative overflow-hidden rounded-3xl bg-white border border-neutral-100 hover:border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <Link href={`/dashboard/markets/${market.id}`} className="block p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-start gap-4">
                                                <div className={cn(
                                                    "mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                                                    market.type === 'poll' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                                )}>
                                                    {market.type === 'poll' ? <Trophy className="h-6 w-6" /> : <Activity className="h-6 w-6" />}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-black transition-colors">{market.title}</h3>
                                                    <div className="mt-1 flex items-center gap-3">
                                                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.2em]">
                                                            {market.type}
                                                        </span>
                                                        <span className="text-[10px] font-medium text-neutral-300">
                                                            • {market.participants} Joined
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1">Staked</p>
                                                    <p className="text-xl font-semibold text-neutral-900">${market.pool}</p>
                                                </div>
                                                <div className="h-10 w-10 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                                    <ChevronRight className="h-5 w-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar: Admin Tools & Stats */}
                <div className="space-y-8">
                    {isAdmin && (
                        <div className="p-8 rounded-4xl bg-black text-white space-y-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm uppercase tracking-widest text-neutral-400">Admin Tools</h3>
                                <Settings className="w-4 h-4 text-neutral-600" />
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                                    <p className="text-xs font-medium text-neutral-400">Recruitment Link</p>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-black rounded-lg border border-white/10 px-3 py-2 text-[10px] font-mono text-neutral-500 truncate select-all">
                                            {window.location.origin}/invite/{btoa(groupId)}
                                        </div>
                                        <button
                                            onClick={handleCopyInvite}
                                            className="p-2 rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <Link href={`/dashboard/groups/${groupId}/settings`} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">
                                    Group Settings
                                    <ChevronRight className="w-4 h-4 text-neutral-600" />
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="p-8 rounded-4xl bg-neutral-50 border border-neutral-100 space-y-6">
                        <h3 className="font-semibold text-sm uppercase tracking-widest text-neutral-400">Activity</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                                    <Users className="w-4 h-4 text-neutral-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-900">Total Entry</p>
                                    <p className="text-xs text-neutral-400">14.2k Lifetime Volume</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                                    <Trophy className="w-4 h-4 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-900">Resolved</p>
                                    <p className="text-xs text-neutral-400">42 Successfully Markets</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
