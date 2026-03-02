"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  IconAlertCircle,
  IconCalendar,
  IconCurrencyDollar,
  IconEdit,
  IconEye,
  IconFlag,
  IconPlus,
  IconRepeat,
  IconSearch,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/components/ui/toast-notification";
import { cn } from "@/lib/utils";
import { useMarketList } from "@/lib/live-data";
import { getApiErrorMessage } from "@/lib/api/client";
import { marketsApi } from "@/lib/api";
import { useCurrency } from "@/lib/utils/currency";

type MarketRow = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  buyIn: number;
  participants: number;
  pool: number;
  closeDate: string;
  status: "active" | "cancelled" | "closed";
  isFlagged: boolean;
};

export default function MarketManagerPage() {
  const { formatCurrency } = useCurrency();
  const toast = useToast();
  const { markets: liveMarkets, isLoading, refresh } = useMarketList();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [optimisticStatusMap, setOptimisticStatusMap] = useState<
    Record<string, MarketRow["status"]>
  >({});

  const markets = useMemo<MarketRow[]>(() => {
    return liveMarkets.map((market) => ({
      id: market.id,
      title: market.title,
      description: market.description,
      tags: market.tags || [],
      buyIn: market.minStake || 0,
      participants: market.participantCount || 0,
      pool: market.poolAmount || 0,
      closeDate: new Date(market.endsAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      status:
        optimisticStatusMap[market.id] ||
        (market.status === "active"
          ? "active"
          : market.status === "disputed"
            ? "cancelled"
            : "closed"),
      isFlagged: market.status === "disputed",
    }));
  }, [liveMarkets, optimisticStatusMap]);

  const filteredMarkets = useMemo(() => {
    let result = [...markets];

    if (searchQuery) {
      result = result.filter(
        (market) =>
          market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          market.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((market) => market.status === statusFilter);
    }

    if (flaggedOnly) {
      result = result.filter((market) => market.isFlagged);
    }

    if (sortBy === "oldest") {
      result = [...result].reverse();
    } else if (sortBy === "participants") {
      result.sort((a, b) => b.participants - a.participants);
    } else if (sortBy === "pool") {
      result.sort((a, b) => b.pool - a.pool);
    }

    return result;
  }, [flaggedOnly, markets, searchQuery, sortBy, statusFilter]);

  const handleCloseMarket = useCallback(
    async (marketId: string) => {
      setActionLoadingId(marketId);
      setOptimisticStatusMap((prev) => ({ ...prev, [marketId]: "closed" }));
      try {
        await marketsApi.close(marketId);
        await refresh();
        toast.success("Market Closed", "The market is now closed.");
      } catch (error) {
        setOptimisticStatusMap((prev) => {
          const next = { ...prev };
          delete next[marketId];
          return next;
        });
        toast.error(
          "Action Failed",
          getApiErrorMessage(error, "Unable to close market"),
        );
      } finally {
        setActionLoadingId(null);
      }
    },
    [refresh, toast],
  );

  const handleSettleMarket = useCallback(
    async (marketId: string) => {
      setActionLoadingId(marketId);
      try {
        await marketsApi.settle(marketId, {});
        await refresh();
        toast.success("Settlement Started", "Market settlement has been triggered.");
      } catch (error) {
        toast.error(
          "Action Failed",
          getApiErrorMessage(error, "Unable to settle market"),
        );
      } finally {
        setActionLoadingId(null);
      }
    },
    [refresh, toast],
  );

  const totalMarkets = markets.length;
  const activeMarkets = markets.filter((m) => m.status === "active").length;
  const totalPool = markets.reduce((sum, m) => sum + m.pool, 0);
  const totalParticipants = markets.reduce((sum, m) => sum + m.participants, 0);

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "closed":
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  if (isLoading) {
    return <div className="p-8 text-sm text-black/50">Loading markets...</div>;
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        <DashboardHeader subtitle="Manage all public prediction markets" />

        <div className="flex justify-end -mt-16 mb-4 relative z-10 px-2">
          <Link href="/dashboard/admin/create-market">
            <button className="px-5 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md">
              <IconPlus className="w-4 h-4" />
              Create Market
            </button>
          </Link>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              Overview
            </h2>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900/60">Total Markets</p>
                    <p className="mt-2 text-3xl font-medium font-mono text-blue-900">{totalMarkets}</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                    <IconTrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-900/60">Active Markets</p>
                    <p className="mt-2 text-3xl font-medium font-mono text-green-900">{activeMarkets}</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                    <IconAlertCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-900/60">Total Pool</p>
                    <p className="mt-2 text-3xl font-medium font-mono text-purple-900">{formatCurrency(totalPool, "KSH")}</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                    <IconCurrencyDollar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-none bg-linear-to-br from-orange-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-100/50 blur-2xl transition-all group-hover:bg-orange-200/50" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-900/60">Total Participants</p>
                    <p className="mt-2 text-3xl font-medium font-mono text-orange-900">{totalParticipants}</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                    <IconUsers className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Filters</h2>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          </div>

          <DashboardCard className="p-5">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="participants">Most Participants</option>
                <option value="pool">Highest Pool</option>
              </select>

              <label className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={flaggedOnly}
                  onChange={(e) => setFlaggedOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-2 focus:ring-neutral-900 cursor-pointer"
                />
                <span className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                  <IconFlag className="w-4 h-4 text-red-500" />
                  Flagged Only
                </span>
              </label>
            </div>
          </DashboardCard>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              Markets ({filteredMarkets.length})
            </h2>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          </div>

          <div className="space-y-8">
            {filteredMarkets.map((market, index) => (
              <motion.div
                key={market.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                <DashboardCard className="hover:border-neutral-300 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/admin/markets/${market.id}/edit`}>
                        <button className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
                          <IconEdit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </Link>
                      <Link href={`/dashboard/admin/markets/${market.id}`}>
                        <button className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
                          <IconEye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </Link>
                      {market.status === "active" && (
                        <button
                          disabled={actionLoadingId === market.id}
                          onClick={() => void handleCloseMarket(market.id)}
                          className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <IconAlertCircle className="w-3.5 h-3.5" />
                          Close
                        </button>
                      )}
                      {market.status === "closed" && (
                        <button
                          disabled={actionLoadingId === market.id}
                          onClick={() => void handleSettleMarket(market.id)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <IconTrendingUp className="w-3.5 h-3.5" />
                          Settle
                        </button>
                      )}
                      <button
                        onClick={() => toast.info("Flagging", "Use compliance tools to review this market.")}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <IconFlag className="w-3.5 h-3.5" />
                        Flag
                      </button>
                      {market.status === "cancelled" && (
                        <button
                          onClick={() => toast.info("Repost", "Open market edit page to repost.")}
                          className="px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <IconRepeat className="w-3.5 h-3.5" />
                          Repost
                        </button>
                      )}
                    </div>
                    <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full border", getStatusBadgeStyles(market.status))}>
                      {market.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="px-6 py-5">
                    <h3 className="text-base font-medium text-neutral-900 mb-2">{market.title}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-4">{market.description}</p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {market.tags.map((tag) => (
                        <span
                          key={`${market.id}-${tag}`}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                          <IconCurrencyDollar className="w-4 h-4 text-neutral-600" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600 font-medium">Buy-in</p>
                          <p className="text-sm font-medium text-neutral-900 font-mono">{formatCurrency(market.buyIn, "KSH")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                          <IconUsers className="w-4 h-4 text-neutral-600" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600 font-medium">Participants</p>
                          <p className="text-sm font-medium text-neutral-900 font-mono">{market.participants}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                          <IconTrendingUp className="w-4 h-4 text-neutral-600" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600 font-medium">Pool</p>
                          <p className="text-sm font-medium text-neutral-900 font-mono">{formatCurrency(market.pool, "KSH")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                          <IconCalendar className="w-4 h-4 text-neutral-600" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600 font-medium">Closes</p>
                          <p className="text-sm font-medium text-neutral-900 font-mono">{market.closeDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
