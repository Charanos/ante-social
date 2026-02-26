"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { IconDownload, IconLoader3 } from "@tabler/icons-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { adminApi } from "@/lib/api";

type AdminOverview = {
  totalUsers?: number;
  totalRevenue?: number;
  activeMarkets?: number;
  totalVolume?: number;
  participants?: number;
  pendingPayouts?: number;
  pendingSettlements?: number;
  pendingWithdrawals?: number;
  flaggedMarkets?: number;
};

type RevenueMetrics = {
  totals?: {
    deposits?: number;
    withdrawals?: number;
    volume?: number;
    revenue?: number;
  };
};

type UserMetrics = {
  totals?: {
    users?: number;
    usersInRange?: number;
    verifiedUsers?: number;
    bannedUsers?: number;
  };
};

type MarketMetrics = {
  totals?: {
    markets?: number;
    marketsInRange?: number;
    activeMarkets?: number;
    settledMarkets?: number;
  };
};

export default function AdminAnalyticsPage() {
  const defaultTo = new Date();
  const defaultFrom = new Date();
  defaultFrom.setDate(defaultFrom.getDate() - 30);

  const [fromDate, setFromDate] = useState(defaultFrom.toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(defaultTo.toISOString().slice(0, 10));

  const rangeParams = useMemo(
    () => ({ from: fromDate, to: toDate }),
    [fromDate, toDate],
  );

  const { data: overview, isLoading: isOverviewLoading, isFetching } = useQuery({
    queryKey: ["admin-analytics-overview"],
    queryFn: () => adminApi.getAnalyticsOverview() as Promise<AdminOverview>,
    refetchInterval: 30_000,
  });

  const { data: revenueMetrics, isLoading: isRevenueLoading } = useQuery({
    queryKey: ["admin-analytics-revenue", fromDate, toDate],
    queryFn: () =>
      adminApi.getAnalyticsRevenue(rangeParams) as Promise<RevenueMetrics>,
    staleTime: 30_000,
  });

  const { data: userMetrics, isLoading: isUsersLoading } = useQuery({
    queryKey: ["admin-analytics-users", fromDate, toDate],
    queryFn: () =>
      adminApi.getAnalyticsUsers(rangeParams) as Promise<UserMetrics>,
    staleTime: 30_000,
  });

  const { data: marketMetrics, isLoading: isMarketsLoading } = useQuery({
    queryKey: ["admin-analytics-markets", fromDate, toDate],
    queryFn: () =>
      adminApi.getAnalyticsMarkets(rangeParams) as Promise<MarketMetrics>,
    staleTime: 30_000,
  });

  const isLoading =
    isOverviewLoading || isRevenueLoading || isUsersLoading || isMarketsLoading;

  const totalUsers = Number(
    userMetrics?.totals?.users ?? overview?.totalUsers ?? 0,
  );
  const usersInRange = Number(userMetrics?.totals?.usersInRange ?? 0);
  const activeMarkets = Number(
    marketMetrics?.totals?.activeMarkets ?? overview?.activeMarkets ?? 0,
  );
  const marketsInRange = Number(marketMetrics?.totals?.marketsInRange ?? 0);
  const totalVolume = Number(
    revenueMetrics?.totals?.volume ?? overview?.totalVolume ?? 0,
  );
  const totalRevenue = Number(
    revenueMetrics?.totals?.revenue ?? overview?.totalRevenue ?? 0,
  );
  const pendingWithdrawals = Number(overview?.pendingWithdrawals ?? 0);
  const pendingSettlements = Number(overview?.pendingSettlements ?? 0);

  const exportCsv = () => {
    const lines = [
      ["Metric", "Value"].join(","),
      ["Date From", fromDate].join(","),
      ["Date To", toDate].join(","),
      ["Total Users (All Time)", String(totalUsers)].join(","),
      ["Users Registered (Range)", String(usersInRange)].join(","),
      ["Active Markets (All Time)", String(activeMarkets)].join(","),
      ["Markets Created (Range)", String(marketsInRange)].join(","),
      ["Total Volume", String(totalVolume)].join(","),
      ["Total Revenue", String(totalRevenue)].join(","),
      ["Participants", String(overview?.participants || 0)].join(","),
      ["Pending Withdrawals", String(pendingWithdrawals)].join(","),
      ["Pending Settlements", String(pendingSettlements)].join(","),
    ];
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admin-analytics-${format(new Date(), "yyyyMMdd-HHmm")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      <DashboardHeader subtitle="Live platform analytics with exportable operational metrics." />

      <DashboardCard>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-xs font-medium uppercase tracking-wide text-black/50">
              From
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="mt-1 block rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm text-black/70 outline-none focus:border-black/30"
              />
            </label>
            <label className="text-xs font-medium uppercase tracking-wide text-black/50">
              To
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="mt-1 block rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm text-black/70 outline-none focus:border-black/30"
              />
            </label>
          </div>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-black/70 hover:bg-black/5 cursor-pointer"
          >
            <IconDownload className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </DashboardCard>

      {isLoading ? (
        <DashboardCard>
          <div className="flex items-center justify-center py-12">
            <IconLoader3 className="h-8 w-8 animate-spin text-black/40" />
          </div>
        </DashboardCard>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardCard>
              <p className="text-xs uppercase tracking-wide text-black/50">Users (All Time)</p>
              <p className="mt-2 text-3xl font-mono font-semibold text-black/90">
                {totalUsers.toLocaleString()}
              </p>
            </DashboardCard>
            <DashboardCard>
              <p className="text-xs uppercase tracking-wide text-black/50">Users (Range)</p>
              <p className="mt-2 text-3xl font-mono font-semibold text-black/90">
                {usersInRange.toLocaleString()}
              </p>
            </DashboardCard>
            <DashboardCard>
              <p className="text-xs uppercase tracking-wide text-black/50">Active Markets</p>
              <p className="mt-2 text-3xl font-mono font-semibold text-black/90">
                {activeMarkets.toLocaleString()}
              </p>
            </DashboardCard>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <DashboardCard>
              <p className="text-xs uppercase tracking-wide text-black/50">Total Volume</p>
              <p className="mt-2 text-3xl font-mono font-semibold text-black/90">
                ${totalVolume.toLocaleString()}
              </p>
            </DashboardCard>
            <DashboardCard>
              <p className="text-xs uppercase tracking-wide text-black/50">Total Revenue</p>
              <p className="mt-2 text-3xl font-mono font-semibold text-black/90">
                ${totalRevenue.toLocaleString()}
              </p>
            </DashboardCard>
            <DashboardCard>
              <p className="text-xs uppercase tracking-wide text-black/50">Markets (Range)</p>
              <p className="mt-2 text-3xl font-mono font-semibold text-black/90">
                {marketsInRange.toLocaleString()}
              </p>
            </DashboardCard>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <DashboardCard>
              <p className="text-xs uppercase tracking-wide text-black/50">Pending Withdrawals</p>
              <p className="mt-2 text-3xl font-mono font-semibold text-black/90">
                {pendingWithdrawals.toLocaleString()}
              </p>
            </DashboardCard>
            <DashboardCard>
              <p className="text-xs uppercase tracking-wide text-black/50">Pending Settlements</p>
              <p className="mt-2 text-3xl font-mono font-semibold text-black/90">
                {pendingSettlements.toLocaleString()}
              </p>
            </DashboardCard>
            <DashboardCard>
              <p className="text-xs uppercase tracking-wide text-black/50">Sync Status</p>
              <p className="mt-2 text-sm font-medium text-black/70">
                {isFetching ? "Refreshing metrics..." : "Updated"}
              </p>
            </DashboardCard>
          </div>
        </>
      )}
    </div>
  );
}
