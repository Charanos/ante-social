"use client"

import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface TabOption {
    id: string
    label: string
}

interface SearchFilterBarProps {
    searchQuery: string
    onSearchChange: (value: string) => void
    placeholder?: string
    tabs: TabOption[]
    activeTab: string
    onTabChange: (tabId: string) => void
    rightElement?: React.ReactNode
    className?: string
    sticky?: boolean
}

export function SearchFilterBar({
    searchQuery,
    onSearchChange,
    placeholder = "Search...",
    tabs,
    activeTab,
    onTabChange,
    rightElement,
    className,
    sticky = true
}: SearchFilterBarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
                "z-30 mb-6 md:mb-8",
                sticky && "sticky top-4",
                className
            )}
        >
            <div className="flex flex-col md:flex-row gap-3 p-1.5 md:p-2 bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl ring-1 ring-black/5">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-100/70 hover:bg-neutral-100 focus:bg-white text-sm font-medium text-neutral-900 rounded-xl border-none outline-none ring-1 ring-transparent focus:ring-black/5 transition-all placeholder:text-neutral-600"
                    />
                </div>

                {/* Tabs & Optional Right Element */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 items-center w-full md:w-auto">
                    <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5 md:py-0 px-1 w-full sm:w-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={cn(
                                    "relative px-4 cursor-pointer py-2 rounded-xl text-sm font-medium transition-all capitalize whitespace-nowrap select-none",
                                    activeTab === tab.id
                                        ? "text-neutral-200 bg-black shadow-sm ring-1 ring-black/5"
                                        : "text-neutral-600 hover:text-neutral-700 hover:bg-neutral-100/50"
                                )}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeFilter"
                                        className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-black/5 -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {rightElement && (
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            {rightElement}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
