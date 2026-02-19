"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { MarketCard } from "./MarketCard"
import { useMarketList } from "@/lib/live-data"

const tabs = [
  { id: "all", label: "All Markets" },
  { id: "recurring", label: "Recurring Weekly Markets" },
  { id: "onetime", label: "One-Time Markets" },
]

function toEndingLabel(endsAt: string, referenceTime: number) {
  const ends = new Date(endsAt)
  const diffMs = ends.getTime() - referenceTime
  const diffHours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)))
  if (diffHours >= 24) return `${Math.floor(diffHours / 24)}d`
  return `${diffHours}h`
}

export function MarketsFeed() {
  const { markets } = useMarketList()
  const [activeTab, setActiveTab] = useState("all")

  const cardMarkets = useMemo(() => {
    const referenceTime = markets.reduce((latest, market) => {
      const createdAt = new Date(market.createdAt || 0).getTime()
      if (!Number.isFinite(createdAt)) return latest
      return Math.max(latest, createdAt)
    }, 0)

    return markets.map((market) => {
      const endingAt = toEndingLabel(market.endsAt, referenceTime)
      const mappedType =
        new Date(market.endsAt).getTime() - referenceTime > 7 * 24 * 60 * 60 * 1000
          ? "recurring"
          : "onetime"
      const impliedOdds = Number(
        (100 / Math.max(1, market.probability || 50)).toFixed(1),
      )

      return {
        id: market.id,
        title: market.title,
        category: market.category || "General",
        volume: `$${(market.poolAmount || 0).toLocaleString()}`,
        participants: market.participantCount || 0,
        endingAt,
        isLive: market.status === "active",
        imageGradient:
          mappedType === "recurring"
            ? "bg-linear-to-br from-blue-600 via-purple-600 to-transparent"
            : "bg-linear-to-br from-orange-500 via-yellow-500 to-transparent",
        type: mappedType,
        odds: `${Math.max(1, impliedOdds)}x`,
        poolProgress: market.signalStrength || 0,
        tags: market.tags || [],
      }
    })
  }, [markets])

  const filteredMarkets =
    activeTab === "all"
      ? cardMarkets
      : cardMarkets.filter((market) => market.type === activeTab)

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
                  : "border-transparent text-neutral-600 hover:border-neutral-200 hover:text-zinc-900",
              )}
              aria-current={activeTab === tab.id ? "page" : undefined}
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
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-500">Try selecting a different category.</p>
        </div>
      )}
    </div>
  )
}
