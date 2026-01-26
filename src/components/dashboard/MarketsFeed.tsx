"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { MarketCard } from "./MarketCard"

const tabs = [
  { id: "all", label: "All Markets" },
  { id: "recurring", label: "Recurring Weekly Markets" },
  { id: "onetime", label: "One-Time Markets" },
]

const mockMarkets = [
  {
    id: 1,
    title: "Will Bitcoin break $100k before 2026?",
    category: "Crypto",
    volume: "$1.2M",
    participants: 4230,
    endingAt: "24h",
    isLive: true,
    imageGradient: "bg-gradient-to-br from-orange-500 via-yellow-500 to-transparent",
    type: "onetime",
    odds: "2.5x",
    poolProgress: 78,
    tags: ["BTC", "Price Action"]
  },
  {
    id: 2,
    title: "Premier League: Man City vs Liverpool Winner",
    category: "Sports",
    volume: "$450k",
    participants: 1205,
    endingAt: "4h",
    isLive: true,
    imageGradient: "bg-gradient-to-br from-blue-600 via-purple-600 to-transparent",
    type: "recurring",
    odds: "1.8x",
    poolProgress: 92,
    tags: ["Football", "UK"]
  },
  {
    id: 3,
    title: "Next James Bond Actor Announcement",
    category: "Pop Culture",
    volume: "$89k",
    participants: 560,
    endingAt: "3d",
    isLive: false,
    imageGradient: "bg-gradient-to-br from-gray-800 via-gray-600 to-transparent",
    type: "onetime",
    odds: "5.0x",
    poolProgress: 45,
    tags: ["Movies", "Casting"]
  },
  {
    id: 4,
    title: "Weekly Tech Stock Rally: NVDA > $150",
    category: "Finance",
    volume: "$2.1M",
    participants: 8900,
    endingAt: "12h",
    isLive: true,
    imageGradient: "bg-gradient-to-br from-green-500 via-emerald-500 to-transparent",
    type: "recurring",
    odds: "1.2x",
    poolProgress: 88,
    tags: ["Stocks", "Tech"]
  },
  {
    id: 5,
    title: "Global Temperature Rise > 1.5°C in 2025",
    category: "Science",
    volume: "$120k",
    participants: 340,
    endingAt: "6d",
    isLive: false,
    imageGradient: "bg-gradient-to-br from-red-500 via-orange-500 to-transparent",
    type: "onetime",
    odds: "3.1x",
    poolProgress: 25,
    tags: ["Climate", "Data"]
  }
]

export function MarketsFeed() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredMarkets = activeTab === "all" 
    ? mockMarkets 
    : mockMarkets.filter(m => m.type === activeTab)

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "cursor-pointer whitespace-nowrap border-b-2 py-3 px-3 text-sm font-medium transition-all rounded-t-md focus:outline-none",
                activeTab === tab.id
                  ? "border-amber-400 text-zinc-900 bg-white/60 shadow-sm"
                  : "border-transparent text-neutral-500 hover:border-neutral-200 hover:text-zinc-900"
              )}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <span className="select-none">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMarkets.map((market) => (
          <MarketCard key={market.id} {...market} />
        ))}
      </div>
      
      {filteredMarkets.length === 0 && (
        <div className="min-h-[300px] rounded-xl bg-neutral-50 dark:bg-neutral-900/50 flex flex-col items-center justify-center p-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-medium text-black dark:text-white">No markets found.</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Try selecting a different category.</p>
        </div>
      )}
    </div>
  )
}
