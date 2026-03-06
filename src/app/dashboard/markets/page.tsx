"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  IconLayoutGrid,
  IconRefresh,
  IconCalendarX,
  IconTrendingUp,
  IconUsers,
  IconHistory,
} from "@tabler/icons-react";
import { IoFunnelOutline, IoChevronDownOutline } from "react-icons/io5";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MarketCard } from "@/components/markets/MarketCard";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { Card, CardContent } from "@/components/ui/card";
import { useMarketList } from "@/lib/live-data";
import { useCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { id: "all", label: "All Markets", icon: IconLayoutGrid },
  { id: "recurring", label: "Recurring", icon: IconRefresh },
  { id: "one-time", label: "One-Time", icon: IconCalendarX },
  { id: "past", label: "Past", icon: IconHistory },
];

const FILTER_SORT_OPTIONS = [
  { value: "ending_soon", label: "Ending Soon" },
  { value: "newest", label: "Newest" },
  { value: "highest_pool", label: "Highest Pool" },
  { value: "most_active", label: "Most Active" },
];

export default function MarketsPage() {
  const { markets, isLoading } = useMarketList();
  const { formatCurrency } = useCurrency();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "all";
  const [recurringFilter, setRecurringFilter] = useState(initialTab);
  const [sortBy, setSortBy] = useState("ending_soon");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, filterType, recurringFilter, sortBy]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setRecurringFilter(tab);
    }
  }, [searchParams]);

  const activeMarkets = useMemo(() => markets.filter(m => m.status === "active" && new Date(m.endsAt).getTime() > Date.now()), [markets]);
  const totalPool = markets.reduce((sum, m) => sum + m.poolAmount, 0);

  const filteredMarkets = useMemo(() => {
    let result = markets.filter((market) => {
      const isPast = market.status !== "active" || new Date(market.endsAt).getTime() <= Date.now();
      
      const matchesSearch = market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (market.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType =
        filterType === "all" ||
        market.category?.toLowerCase() === filterType ||
        market.type.toLowerCase() === filterType;
        
      if (!matchesSearch || !matchesType) return false;

      if (recurringFilter === "past") return isPast;
      if (isPast) return false;

      if (recurringFilter === "all") return true;
      if (recurringFilter === "recurring") return !!market.isRecurring;
      if (recurringFilter === "one-time") return !market.isRecurring;
      return true;
    });

    // Sort
    switch (sortBy) {
      case "ending_soon":
        result = [...result].sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
        if (recurringFilter === "all") {
          result.sort((a, b) => {
            if (!!a.isRecurring !== !!b.isRecurring) return a.isRecurring ? -1 : 1;
            return 0;
          });
        }
        break;
      case "newest":
        result = [...result].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case "highest_pool":
        result = [...result].sort((a, b) => (b.poolAmount || 0) - (a.poolAmount || 0));
        break;
      case "most_active":
        result = [...result].sort((a, b) => (b.participantCount || 0) - (a.participantCount || 0));
        break;
    }

    return result;
  }, [markets, searchQuery, filterType, recurringFilter, sortBy]);

  const recurringMarkets = filteredMarkets.filter((m) => m.isRecurring);
  const oneTimeMarkets = filteredMarkets.filter((m) => !m.isRecurring);

  if (isLoading) return <LoadingLogo fullScreen size="lg" />;

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto md:pl-8 pl-0 pb-8 space-y-2">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl group-hover:bg-blue-200/50 transition-all" />
            <CardContent className="p-4 md:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Active</p>
                  <p className="mt-2 text-2xl md:text-3xl font-medium numeric text-blue-900">{activeMarkets.length}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-2 md:p-3 shadow-sm backdrop-blur-sm">
                  <IconTrendingUp className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl group-hover:bg-purple-200/50 transition-all" />
            <CardContent className="p-4 md:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">Total Pool</p>
                  <p className="mt-2 text-2xl md:text-3xl font-medium numeric text-purple-900">{formatCurrency(totalPool, "KSH", { compact: true })}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-2 md:p-3 shadow-sm backdrop-blur-sm">
                  <IconUsers className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl group-hover:bg-green-200/50 transition-all" />
            <CardContent className="p-4 md:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Recurring</p>
                  <p className="mt-2 text-2xl md:text-3xl font-medium numeric text-green-900">{activeMarkets.filter((m) => m.isRecurring).length}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-2 md:p-3 shadow-sm backdrop-blur-sm">
                  <IconRefresh className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-linear-to-br from-amber-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-100/50 blur-2xl group-hover:bg-amber-200/50 transition-all" />
            <CardContent className="p-4 md:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-900/60">One-Time</p>
                  <p className="mt-2 text-2xl md:text-3xl font-medium numeric text-amber-900">{activeMarkets.filter((m) => !m.isRecurring).length}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-2 md:p-3 shadow-sm backdrop-blur-sm">
                  <IconCalendarX className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recurring / One-Time toggle */}
        <div className="flex gap-2 pt-6">
          {SORT_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setRecurringFilter(id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all cursor-pointer",
                recurringFilter === id
                  ? "bg-black text-white border-black shadow-lg"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <SectionHeading title="Available Markets" className="my-16 md:my-18" />

        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search markets, tags, or categories..."
          tabs={[
            { id: "all", label: "All Markets" },
            { id: "consensus", label: "Poll" },
            { id: "betrayal", label: "Betrayal" },
            { id: "reflex", label: "Reflex" },
            { id: "ladder", label: "Ladder" },
            { id: "divergence", label: "Divergence" },
          ]}
          activeTab={filterType}
          onTabChange={setFilterType}
          rightElement={
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="px-4 py-2 rounded-xl bg-neutral-100/70 hover:bg-neutral-100 focus:bg-white text-sm font-semibold text-black/70 flex items-center gap-3 transition-all cursor-pointer min-w-[140px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <IoFunnelOutline className="w-3.5 h-3.5" />
                  <span className="text-xs">
                    {FILTER_SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                  </span>
                </div>
                <IoChevronDownOutline
                  className={cn(
                    "w-3.5 h-3.5 transition-transform",
                    showSortMenu && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 right-0 w-full bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden z-50 min-w-40"
                  >
                    {FILTER_SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortMenu(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left text-sm font-medium transition-colors cursor-pointer",
                          sortBy === option.value
                            ? "bg-black/5 text-black/90"
                            : "text-black/80 hover:bg-black/5",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          }
        />

        {/* Markets Grid */}
        <AnimatePresence mode="wait">
          {isFiltering ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-3xl border border-neutral-100 bg-white p-4 space-y-4">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Past section */}
              {recurringFilter === "past" && filteredMarkets.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-full">
                      <IconHistory className="w-4 h-4 text-neutral-600" />
                      <span className="text-sm font-semibold text-neutral-800">Past Markets</span>
                    </div>
                    <div className="h-px flex-1 bg-neutral-100" />
                    <span className="text-xs text-neutral-400 font-medium">{filteredMarkets.length} markets</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMarkets.map((market, index) => (
                      <MarketCard key={market.id} market={market} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {/* Recurring section */}
              {recurringFilter !== "past" && recurringFilter !== "one-time" && recurringMarkets.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
                      <IconRefresh className="w-4 h-4 text-green-600 animate-spin" style={{ animationDuration: "3s" }} />
                      <span className="text-sm font-semibold text-green-800">Recurring Markets</span>
                    </div>
                    <div className="h-px flex-1 bg-neutral-100" />
                    <span className="text-xs text-neutral-400 font-medium">{recurringMarkets.length} markets</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recurringMarkets.map((market, index) => (
                      <MarketCard key={market.id} market={market} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {/* One-time section */}
              {recurringFilter !== "past" && recurringFilter !== "recurring" && oneTimeMarkets.length > 0 && (
                <div>
                  {recurringFilter === "all" && recurringMarkets.length > 0 && (
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-full">
                        <IconCalendarX className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-800">One-Time Markets</span>
                      </div>
                      <div className="h-px flex-1 bg-neutral-100" />
                      <span className="text-xs text-neutral-400 font-medium">{oneTimeMarkets.length} markets</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {oneTimeMarkets.map((market, index) => (
                      <MarketCard key={market.id} market={market} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {filteredMarkets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-lg font-semibold text-black/40 mb-2">No markets found</p>
                  <p className="text-sm text-black/30 font-medium">Try adjusting your search or filters</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
