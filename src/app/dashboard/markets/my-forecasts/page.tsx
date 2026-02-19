"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IconArrowRight,
  IconAward,
  IconShieldCheck,
  IconShieldDollar,
  IconShieldX,
  IconTrendingUp,
} from "@tabler/icons-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { IoWalletOutline } from "react-icons/io5";
import { EmptyState } from "@/components/ui/EmptyState";
import { Position } from "@/types/market";
import { fetchJsonOrNull, normalizePositions, useLiveUser } from "@/lib/live-data";

type EnrichedPosition = Position & {
  marketTitle: string;
  marketType: string;
};

export default function MyBetsPage() {
  const { user, isLoading: isUserLoading } = useLiveUser();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [positions, setPositions] = useState<EnrichedPosition[]>([]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const payload = await fetchJsonOrNull<any>(
        "/api/markets/my/positions?limit=200&offset=0",
      );
      const normalized = normalizePositions(payload).map((position) => ({
        ...position,
        marketTitle: position.title || "Unknown Market",
        marketType: position.type || "unknown",
      }));
      setPositions(normalized);
      setIsLoading(false);
    };
    void load();
  }, []);

  const enrichedPositions = useMemo(() => positions, [positions]);

  // Calculate stats
  const totalVolume = enrichedPositions.reduce((acc, position) => acc + position.stakeAmount, 0);
  const netYield = enrichedPositions.reduce((acc, position) => {
    if (position.status === "settled") {
        return acc + (position.pnl || 0);
    }
    return acc;
  }, 0);
  
  const settledPositions = enrichedPositions.filter(p => p.status === "settled");
  const winningPositions = settledPositions.filter(p => (p.pnl || 0) > 0);
  
  const accuracy = settledPositions.length > 0 
    ? Math.round((winningPositions.length / settledPositions.length) * 100) 
    : 0;

  const filteredPositions = enrichedPositions.filter((position) => {
    const matchesFilter = filter === "all" || 
                         (filter === "active" && position.status === "active") ||
                         (filter === "settled" && position.status === "settled") ||
                         (filter === "won" && (position.pnl || 0) > 0) ||
                         (filter === "lost" && (position.pnl || 0) <= 0);
                         
    const matchesSearch = position.marketTitle
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isUserLoading || isLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-full mx-auto pl-0 md:pl-8 pb-8 space-y-8">
        <DashboardHeader
          user={user}
          subtitle="Track your active positions and market history"
        />

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Volume */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">
                    Total Volume
                  </p>
                  <p className="mt-2 text-2xl font-medium numeric text-blue-900">
                    ${totalVolume.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IoWalletOutline className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Net Yield */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-emerald-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-100/50 blur-2xl transition-all group-hover:bg-emerald-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-900/60">
                    Net Yield
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-2xl font-medium numeric",
                      netYield >= 0 ? "text-emerald-700" : "text-red-600",
                    )}
                  >
                    {netYield >= 0 ? "+" : ""}${netYield.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconTrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accuracy */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">
                    Accuracy
                  </p>
                  <p className="mt-2 text-2xl font-medium numeric text-purple-900">
                    {accuracy}%
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconAward className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <SectionHeading title="Active & History" className="my-16 md:my-18" />

        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search your positions..."
          tabs={[
            { id: "all", label: "all" },
            { id: "active", label: "active" },
            { id: "settled", label: "settled" },
            { id: "won", label: "won" },
            { id: "lost", label: "lost" },
          ]}
          activeTab={filter}
          onTabChange={setFilter}
        />

        {/* Forecasts List */}
        <div className="grid gap-4">
          {filteredPositions.length > 0 ? (
            filteredPositions.map((position, index) => (
              <Link href={`/dashboard/markets/my-forecasts/${position.id}`} key={position.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl bg-white/60 hover:bg-white border border-white/50 hover:border-black/5 shadow-sm hover:shadow-md transition-all p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                        position.status === "active"
                          ? "text-blue-500"
                          : (position.pnl || 0) > 0
                            ? "text-green-500"
                            : "text-red-500",
                      )}
                    >
                      {position.status === "active" && (
                        <IconShieldDollar className="w-6 h-6" />
                      )}
                      {(position.pnl || 0) > 0 && position.status === "settled" && (
                        <IconShieldCheck className="w-6 h-6" />
                      )}
                      {(position.pnl || 0) <= 0 && position.status === "settled" && (
                        <IconShieldX className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {position.marketTitle}
                        </h3>
                        {position.status === "active" && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="capitalize px-2 py-0.5 rounded-md bg-gray-100/50 text-xs font-medium border border-gray-200/50">
                          {position.marketType.replace(/_/g, " ")}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{new Date(position.openedAt || new Date()).toLocaleDateString()}</span>
                        <span className="text-gray-400">•</span>
                        <span className="font-medium text-gray-700">Outcome: {position.outcome}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 pl-18 md:pl-0">
                    <div className="min-w-20">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Stake
                      </p>
                      <p className="text-xl font-semibold text-gray-900 numeric">
                        ${position.stakeAmount}
                      </p>
                    </div>

                    <div className="w-px h-10 bg-gray-200 hidden md:block" />

                    <div className="min-w-20">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        {position.status === "active" ? "Value" : "Result"}
                      </p>
                      <p
                        className={cn(
                          "text-xl font-semibold numeric",
                          (position.pnl || 0) > 0
                            ? "text-green-600"
                            : position.status === 'active' ? "text-blue-600" : "text-gray-900",
                        )}
                      >
                        {position.status === 'active' ? `$${position.currentValue}` : (position.pnl! > 0 ? `+$${position.pnl}` : `-$${Math.abs(position.pnl || 0)}`)}
                      </p>
                    </div>

                    <div className="p-2 rounded-full bg-gray-50 group-hover:bg-black/5 transition-colors">
                      <IconArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="py-8">
              <EmptyState
                icon={IconTrendingUp}
                title="No Active Positions"
                description="You haven't opened any market positions yet. Explore active markets to start building your portfolio."
                actionLabel="Explore Markets"
                actionLink="/dashboard/markets"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
