"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  IconAward,
  IconChevronDown,
  IconGift,
  IconRefresh,
  IconSearch,
  IconTrendingUp,
  IconUser,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useToast } from "@/components/ui/toast-notification";
import { useCurrency } from "@/lib/utils/currency";

type AuditLog = {
  _id?: string;
  action?: string;
  eventType?: string;
  timestamp?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  amountCents?: number;
};

type AuditLogResponse = {
  data?: AuditLog[];
};

type SpinRow = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  userId: string;
  date: string;
  amountRaw: number;
  amount: string;
  type: string;
};

function formatDateTime(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString();
}

function withinRange(timestamp: string | undefined, range = "all") {
  if (range === "all") return true;
  if (!timestamp) return false;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  if (range === "today") {
    return now.toDateString() === date.toDateString();
  }
  if (range === "week") {
    return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000;
  }
  if (range === "month") {
    return now.getTime() - date.getTime() <= 30 * 24 * 60 * 60 * 1000;
  }
  return true;
}

export default function DailySpinLogsPage() {
  const { formatCurrency } = useCurrency();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const { data, isLoading, isFetching, refetch } = useQuery<AuditLogResponse>({
    queryKey: ["admin-daily-spin-logs"],
    queryFn: async () => {
      const response = await fetch("/api/admin/audit-logs?limit=500&offset=0", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch audit logs");
      return response.json();
    },
  });

  const spinLogs = useMemo<SpinRow[]>(() => {
    const raw = data?.data || [];
    const spinLike = raw.filter((log) => {
      const action = String(log.action || log.eventType || "").toLowerCase();
      return action.includes("spin");
    });
    const source = spinLike.length > 0 ? spinLike : raw.slice(0, 100);

    return source
      .filter((log) => withinRange(log.timestamp, timeFilter))
      .map((log, index) => {
        const amountFromCents = typeof log.amountCents === "number" ? log.amountCents / 100 : null;
        const metadataAmount = Number(log.metadata?.amount || 0);
        const amountRaw = amountFromCents ?? metadataAmount;

        const userId = String(log.entityId || log.metadata?.userId || "");
        const username = String(log.metadata?.username || log.metadata?.userName || "Unknown");
        const email = String(log.metadata?.email || "N/A");
        const spinType = String(log.metadata?.spinType || "Normal");

        return {
          id: log._id || `${index}`,
          user: { name: username, email },
          userId: userId ? `${userId.slice(0, 12)}...` : "N/A",
          date: formatDateTime(log.timestamp),
          amountRaw,
          amount: `${amountRaw >= 0 ? "+" : ""}${formatCurrency(amountRaw, "KSH")}`,
          type: spinType,
        };
      })
      .filter((log) => {
        if (!searchQuery) return true;
        const text = `${log.user.name} ${log.user.email} ${log.userId}`.toLowerCase();
        return text.includes(searchQuery.toLowerCase());
      });
  }, [data?.data, searchQuery, timeFilter]);

  const totalSpins = spinLogs.length;
  const totalAwardedValue = spinLogs.reduce((sum, log) => sum + Math.max(0, log.amountRaw), 0);
  const jackpots = spinLogs.filter((log) => log.amountRaw >= 50).length;
  const avgReward = totalSpins > 0 ? totalAwardedValue / totalSpins : 0;

  const getAmountColor = (amount: number) => {
    if (amount >= 50) return "text-purple-600 font-medium";
    if (amount >= 10) return "text-green-600 font-medium";
    if (amount > 0) return "text-blue-600 font-medium";
    return "text-neutral-600";
  };

  const handleRefresh = async () => {
    await refetch();
    toast.success("Refreshed", "Spin logs reloaded");
  };

  const handleResetUserSpin = () => {
    toast.info("Not available", "Spin reset endpoint is not enabled in this environment");
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        <DashboardHeader subtitle="Monitor and manage the Wheel of Delusion spins" />

        <div className="flex items-center justify-end gap-3 -mt-6 mb-8">
          <button
            onClick={handleResetUserSpin}
            className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-all"
          >
            <IconRefresh className="w-4 h-4" />
            Reset User Spin
          </button>
          <button
            onClick={() => void handleRefresh()}
            className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-all"
          >
            <IconRefresh className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Overview</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
        >
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Total Spins</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-blue-900">{totalSpins}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconRefresh className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Total Awarded</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-green-900">{formatCurrency(totalAwardedValue, "KSH")}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconGift className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">Jackpots ({formatCurrency(50, "KSH")})</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-purple-900">{jackpots}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconAward className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-linear-to-br from-amber-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-100/50 blur-2xl transition-all group-hover:bg-amber-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-900/60">Average Reward</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-amber-900">{formatCurrency(avgReward, "KSH")}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconTrendingUp className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Filters</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <DashboardCard className="p-5 mb-10">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search by user ID, username, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>

              <div className="relative">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 appearance-none cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <IconChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </DashboardCard>
        </motion.div>

        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Spin Logs ({spinLogs.length})</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <DashboardCard className="p-0 overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-sm text-neutral-500">Loading spin logs...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">User ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {spinLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center text-neutral-600 shrink-0">
                              <IconUser className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-neutral-900">{log.user.name}</p>
                              <p className="text-xs text-neutral-600">{log.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-neutral-600">{log.userId}</td>
                        <td className="px-6 py-4 text-sm font-mono text-neutral-600">{log.date}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-mono ${getAmountColor(log.amountRaw)}`}>{log.amount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                            {log.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {spinLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-sm text-neutral-500 text-center">
                          No spin logs in this filter window.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardCard>
        </motion.div>
      </div>
    </div>
  );
}
