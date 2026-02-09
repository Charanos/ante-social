"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { IconArrowDownLeft, IconArrowUpRight, IconCalendar, IconCheck, IconClock, IconCurrencyDollar, IconDownload, IconFilter, IconHistory, IconStar, IconTarget, IconTrendingDown, IconTrendingUp, IconX } from '@tabler/icons-react';;


import { mockUser, mockTransactions } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useToast } from "@/components/ui/toast-notification";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { Skeleton } from "@/components/ui/Skeleton";

const TRANSACTION_TYPES = [
  { value: "all", label: "All Transactions" },
  { value: "deposit", label: "Deposits" },
  { value: "withdrawal", label: "Withdrawals" },
  { value: "bet_entry", label: "Bets" },
  { value: "payout", label: "Payouts" },
];

const QUICK_AMOUNTS = [10, 50, 100, 250, 500];

export default function WalletPage() {
  const router = useRouter();
  const toast = useToast();
  const [transactions] = useState(mockTransactions);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 500);
    return () => clearTimeout(timer);
  }, [selectedFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const completed = transactions.filter((t) => t.status === "completed");
    const deposits = completed
      .filter((t) => t.type === "deposit")
      .reduce((sum, t) => sum + t.amount, 0);
    const withdrawals = completed
      .filter((t) => t.type === "withdrawal")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const bets = completed
      .filter((t) => t.type === "bet_entry")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const payouts = completed
      .filter((t) => t.type === "payout")
      .reduce((sum, t) => sum + t.amount, 0);

    return { deposits, withdrawals, bets, payouts, netProfit: payouts - bets };
  }, [transactions]);

  // IconFilter transactions
  const filteredTransactions = useMemo(() => {
    if (selectedFilter === "all") return transactions;
    return transactions.filter((t) => t.type === selectedFilter);
  }, [transactions, selectedFilter]);

  const getTransactionIcon = (type: string) => {
    const icons = {
      deposit: <IconArrowDownLeft className="w-4 h-4 text-green-600" />,
      withdrawal: <IconArrowUpRight className="w-4 h-4 text-red-600" />,
      bet_entry: <IconCurrencyDollar className="w-4 h-4 text-blue-600" />,
      payout: <IconTrendingUp className="w-4 h-4 text-purple-600" />,
    };
    return (
      icons[type as keyof typeof icons] || (
        <IconHistory className="w-4 h-4 text-black/40" />
      )
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
          <IconCheck className="w-3 h-3 text-green-600" />
          <span className="text-[10px] font-medium uppercase tracking-wide text-green-700">
            Done
          </span>
        </div>
      ),
      pending: (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
          <IconClock className="w-3 h-3 text-orange-600" />
          <span className="text-[10px] font-medium uppercase tracking-wide text-orange-700">
            Pending
          </span>
        </div>
      ),
      failed: (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
          <IconX className="w-3 h-3 text-red-600" />
          <span className="text-[10px] font-medium uppercase tracking-wide text-red-700">
            Failed
          </span>
        </div>
      ),
    };
    return badges[status as keyof typeof badges] || null;
  };

  if (isLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  return (
    <div className="space-y-10 pb-20 pl-0 md:pl-8 w-full">
      <DashboardHeader
        user={mockUser}
        subtitle="Manage your balance and transactions"
      />

      {/* Hero Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-neutral-900 via-neutral-800 to-black text-white shadow-2xl mb-20"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-8 md:p-10 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-white/60 font-normal">
                  Available Balance
                </p>
                <p className="text-4xl font-semibold font-mono">
                  ${mockUser.wallet.balance.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Tier Badge */}
            <div className="px-4 py-1 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-400/30">
              <div className="flex items-center gap-2">
                <IconStar className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-200">
                  Novice Tier
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-white/50 font-normal mb-1">
                Total Deposited
              </p>
              <p className="text-lg font-semibold font-mono text-green-400">
                ${stats.deposits.toFixed(0)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-white/50 font-normal mb-1">
                Total Withdrawn
              </p>
              <p className="text-lg font-semibold font-mono text-red-400">
                ${stats.withdrawals.toFixed(0)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-white/50 font-normal mb-1">
                Total Bets
              </p>
              <p className="text-lg font-semibold font-mono text-blue-400">
                ${stats.bets.toFixed(0)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-white/50 font-normal mb-1">
                Net Profit
              </p>
              <p
                className={cn(
                  "text-lg font-semibold font-mono",
                  stats.netProfit >= 0 ? "text-green-400" : "text-red-400",
                )}
              >
                {stats.netProfit >= 0 ? "+" : ""}${stats.netProfit.toFixed(0)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() =>
                router.push("/dashboard/wallet/checkout?type=deposit")
              }
              className="flex-1 py-2 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <IconArrowDownLeft className="w-4 h-4" />
              Deposit
            </button>
            <button
              onClick={() =>
                router.push("/dashboard/wallet/checkout?type=withdrawal")
              }
              className="flex-1 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <IconArrowUpRight className="w-4 h-4" />
              Withdraw
            </button>
          </div>
        </div>
      </motion.div>

      <SectionHeading title="Performance Analytics" className="my-16 md:my-18" />

      {/* Performance Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardCard className="relative mb-6 overflow-hidden border-none bg-linear-to-br from-green-50/50 via-white/50 to-white/50 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <div className="px-3 py-2 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-normal text-green-900/60">
                    Total Winnings
                  </p>
                  <p className="mt-2 text-3xl font-normal numeric text-green-900">
                    +${mockUser.wallet.total_winnings.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconTrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </DashboardCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardCard className="relative mb-6 overflow-hidden border-none bg-linear-to-br from-red-50/50 via-white/50 to-white/50 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-100/50 blur-2xl transition-all group-hover:bg-red-200/50" />
            <div className="px-3 py-2 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-normal text-red-900/60">
                    Total Losses
                  </p>
                  <p className="mt-2 text-3xl font-normal numeric text-red-900">
                    -${mockUser.wallet.total_losses.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconTrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </DashboardCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DashboardCard className="relative mb-6 overflow-hidden border-none bg-linear-to-br from-purple-50/50 via-white/50 to-white/50 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <div className="px-3 py-2 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-normal text-purple-900/60">
                    Win Rate
                  </p>
                  <p className="mt-2 text-3xl font-normal numeric text-purple-900">
                    {(
                      (mockUser.wallet.total_winnings /
                        (mockUser.wallet.total_winnings +
                          mockUser.wallet.total_losses)) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconTarget className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </DashboardCard>
        </motion.div>
      </div>

      {/* Transaction IconHistory Section */}
      <div className="space-y-6">
        <div className="relative">
          <SectionHeading
            title="Transaction History"
            className="my-16 md:my-18"
            icon={<IconHistory className="w-4 h-4 text-blue-500" />}
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <button className="p-2 hover:bg-black/5 rounded-xl transition-colors cursor-pointer bg-white/50 backdrop-blur-sm border border-black/5">
              <IconDownload className="w-4 h-4 text-black/40" />
            </button>
            <button className="p-2 hover:bg-black/5 rounded-xl transition-colors cursor-pointer bg-white/50 backdrop-blur-sm border border-black/5">
              <IconCalendar className="w-4 h-4 text-black/40" />
            </button>
          </div>
        </div>

        {/* IconFilter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {TRANSACTION_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedFilter(type.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer",
                selectedFilter === type.value
                  ? "bg-black text-white shadow-md"
                  : "bg-white/60 text-black/80 hover:bg-white hover:text-black/80 border border-black/5",
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <motion.div layout className="space-y-3">
          {isFiltering ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
                <IconHistory className="w-8 h-8 text-black/20" />
              </div>
              <h3 className="text-lg font-medium text-black/80 mb-2">
                No transactions found
              </h3>
              <p className="text-sm text-black/40">
                Try adjusting your filter criteria
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                layout
                className="p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white hover:border-black/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-black/90 text-sm">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-normal text-black/40">
                          {new Date(tx.created_date).toLocaleDateString()}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-black/20" />
                        <span className="text-xs font-normal text-black/50 capitalize">
                          {tx.type.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p
                      className={cn(
                        "text-sm font-medium font-mono",
                        tx.amount > 0 ? "text-green-600" : "text-black/90",
                      )}
                    >
                      {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount)}
                    </p>
                    {getStatusBadge(tx.status)}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
