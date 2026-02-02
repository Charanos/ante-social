"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Users, Trophy, Filter, ArrowUpRight } from "lucide-react"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { cn } from "@/lib/utils"

const featuredGroups = [
    {
        id: 1,
        name: "Premier League Fanatics",
        members: 1240,
        activeBets: 15,
        category: "Sports",
        image: "bg-linear-to-br from-blue-600 to-indigo-700"
    },
    {
        id: 2,
        name: "Crypto Whales KE",
        members: 850,
        activeBets: 32,
        category: "Finance",
        image: "bg-linear-to-br from-orange-400 to-red-500"
    },
    {
        id: 3,
        name: "Nairobi Tech Community",
        members: 2100,
        activeBets: 8,
        category: "Social",
        image: "bg-linear-to-br from-emerald-500 to-teal-600"
    }
]

export default function DiscoverGroupsPage() {
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <div className="space-y-8 pb-20">
            <DashboardHeader
                user={{ username: "Explorer" }}
                subtitle="Find your tribe and start betting"
            />

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for groups..."
                        className="w-full rounded-2xl bg-white border border-gray-200 pl-12 pr-4 py-4 md:py-5 outline-none focus:ring-4 focus:ring-gray-100 transition-all font-medium text-lg placeholder:text-gray-400 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="px-6 py-4 rounded-2xl bg-white border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
                    <Filter className="w-5 h-5" />
                    Filters
                </button>
            </div>

            {/* Featured Section */}
            <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Trending Groups
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {featuredGroups.map((group) => (
                        <motion.div
                            key={group.id}
                            whileHover={{ y: -5 }}
                            className="group relative overflow-hidden rounded-4xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className={cn("h-32 w-full relative", group.image)}>
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-white uppercase tracking-wider">
                                    {group.category}
                                </div>
                            </div>

                            <div className="p-6 relative">
                                <div className="-mt-12 mb-4 h-16 w-16 rounded-2xl bg-white p-1 shadow-lg">
                                    <div className={cn("w-full h-full rounded-xl flex items-center justify-center text-white font-semibold text-xl", group.image)}>
                                        {group.name.charAt(0)}
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                                    {group.name}
                                </h3>

                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-4 h-4" />
                                        {group.members.toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Trophy className="w-4 h-4" />
                                        {group.activeBets} Active Bets
                                    </div>
                                </div>

                                <Link
                                    href={`/dashboard/groups/${group.id}`}
                                    className="flex items-center justify-center w-full py-3.5 rounded-xl bg-gray-50 font-semibold text-gray-900 group-hover:bg-black group-hover:text-white transition-all"
                                >
                                    View Group
                                    <ArrowUpRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Categories Grid */}
            <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Browse Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Sports", "Politics", "Entertainment", "Crypto", "Tech", "Music", "Gaming", "Misc"].map((cat) => (
                        <button
                            key={cat}
                            className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all text-left group"
                        >
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{cat}</h3>
                            <p className="text-xs text-gray-400 mt-1 font-medium group-hover:text-gray-500">240+ Groups</p>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    )
}
