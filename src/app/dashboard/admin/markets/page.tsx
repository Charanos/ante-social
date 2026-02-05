"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconAlertCircle, IconCalendar, IconCurrencyDollar, IconEdit, IconEye, IconFilter, IconFlag, IconLayoutGrid, IconPlus, IconRepeat, IconSearch, IconTrendingUp, IconUsers } from '@tabler/icons-react';;

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

interface Market {
  id: number;
  title: string;
  description: string;
  tags: string[];
  buyIn: number;
  participants: number;
  pool: number;
  closeDate: string;
  status: "active" | "cancelled" | "closed";
  isFlagged: boolean;
}

const mockMarkets: Market[] = [
  {
    id: 1,
    title: "What's your vibe right now?",
    description:
      "Pick the one that matches your brain's current state. Trust your gut — your mood might just make you money today.",
    tags: ["memes", "mood", "wager", "bet"],
    buyIn: 1,
    participants: 1,
    pool: 20,
    closeDate: "Dec 2",
    status: "active",
    isFlagged: false,
  },
  {
    id: 2,
    title: "What's your vibe right now?",
    description:
      "Pick the one that matches your brain's current state. Trust your gut — your mood might just make you money today.",
    tags: ["memes", "mood", "wager", "bet"],
    buyIn: 1,
    participants: 0,
    pool: 0,
    closeDate: "Dec 1",
    status: "cancelled",
    isFlagged: false,
  },
  {
    id: 3,
    title: "What's your vibe right now?",
    description:
      "Pick the one that matches your brain's current state. Trust your gut — your mood might just make you money today.",
    tags: ["memes", "mood", "wager", "bet"],
    buyIn: 1,
    participants: 3,
    pool: 1100,
    closeDate: "Oct 16",
    status: "active",
    isFlagged: false,
  },
  {
    id: 4,
    title: "Most favorite meme so far",
    description:
      "Select which of the two memes you believe is the best of 2025. The meme with the most votes wins, and payouts will be distributed among the voters based on the stakes they placed.",
    tags: ["Memes", "Most favorite meme so far", "Social media"],
    buyIn: 1,
    participants: 1,
    pool: 10,
    closeDate: "Oct 7",
    status: "active",
    isFlagged: false,
  },
];

export default function MarketManagerPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [flaggedOnly, setFlaggedOnly] = useState(false);

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

  const totalMarkets = mockMarkets.length;
  const activeMarkets = mockMarkets.filter((m) => m.status === "active").length;
  const totalPool = mockMarkets.reduce((sum, m) => sum + m.pool, 0);
  const totalParticipants = mockMarkets.reduce(
    (sum, m) => sum + m.participants,
    0,
  );

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        {/* Header */}
        <DashboardHeader subtitle="Manage all public betting markets" />

        <div className="flex justify-end -mt-16 mb-4 relative z-10 px-2">
          <Link href="/dashboard/admin/create-market">
            <button className="px-5 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md">
              <IconPlus className="w-4 h-4" />
              Create Market
            </button>
          </Link>
        </div>

        {/* Stats Overview Section */}
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
            {/* Total Markets - Blue */}
            <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900/60">
                      Total Markets
                    </p>
                    <p className="mt-2 text-3xl font-medium font-mono text-blue-900">
                      {totalMarkets}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                    <IconTrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Markets - Green */}
            <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-900/60">
                      Active Markets
                    </p>
                    <p className="mt-2 text-3xl font-medium font-mono text-green-900">
                      {activeMarkets}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                    <IconAlertCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Pool - Purple */}
            <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-900/60">
                      Total Pool
                    </p>
                    <p className="mt-2 text-3xl font-medium font-mono text-purple-900">
                      {totalPool} MP
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                    <IconCurrencyDollar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Participants - Orange */}
            <Card className="relative overflow-hidden border-none bg-linear-to-br from-orange-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-100/50 blur-2xl transition-all group-hover:bg-orange-200/50" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-900/60">
                      Total Participants
                    </p>
                    <p className="mt-2 text-3xl font-medium font-mono text-orange-900">
                      {totalParticipants}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                    <IconUsers className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              Filters
            </h2>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <DashboardCard className="p-5">
              <div className="grid md:grid-cols-4 gap-4">
                {/* IconSearch */}
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="IconSearch markets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  />
                </div>

                {/* Status IconFilter */}
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

                {/* Sort */}
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

                {/* Flagged Only */}
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
          </motion.div>
        </div>

        {/* Markets List Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              Markets ({mockMarkets.length})
            </h2>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          </div>

          <div className="space-y-8">
            {mockMarkets.map((market, index) => (
              <motion.div
                key={market.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                <DashboardCard className="hover:border-neutral-300 hover:shadow-sm transition-all">
                  {/* Header with Actions & Status */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/admin/markets/${market.id}/edit`}>
                        <button className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
                          <IconEdit className="w-3.5 h-3.5" />
                          IconEdit
                        </button>
                      </Link>
                      <Link href={`/dashboard/admin/markets/${market.id}`}>
                        <button className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
                          <IconEye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </Link>
                      {market.status === "active" && (
                        <button className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
                          <IconFilter className="w-3.5 h-3.5" />
                          Unpublish
                        </button>
                      )}
                      <button className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
                        <IconFlag className="w-3.5 h-3.5" />
                        IconFlag
                      </button>
                      {market.status === "cancelled" && (
                        <button className="px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
                          <IconRepeat className="w-3.5 h-3.5" />
                          Repost
                        </button>
                      )}
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadgeStyles(market.status)}`}
                    >
                      {market.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Market Content */}
                  <div className="px-6 py-5">
                    <h3 className="text-base font-medium text-neutral-900 mb-2">
                      {market.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                      {market.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {market.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                          <IconCurrencyDollar className="w-4 h-4 text-neutral-600" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600 font-medium">
                            Buy-in
                          </p>
                          <p className="text-sm font-medium text-neutral-900 font-mono">
                            {market.buyIn} MP
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                          <IconUsers className="w-4 h-4 text-neutral-600" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600 font-medium">
                            Participants
                          </p>
                          <p className="text-sm font-medium text-neutral-900 font-mono">
                            {market.participants}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                          <IconTrendingUp className="w-4 h-4 text-neutral-600" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600 font-medium">
                            Pool
                          </p>
                          <p className="text-sm font-medium text-neutral-900 font-mono">
                            {market.pool} MP
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                          <IconCalendar className="w-4 h-4 text-neutral-600" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-600 font-medium">
                            Closes
                          </p>
                          <p className="text-sm font-medium text-neutral-900 font-mono">
                            {market.closeDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty State (optional) */}
        {mockMarkets.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <DashboardCard className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <IconTrendingUp className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No markets found
              </h3>
              <p className="text-sm text-neutral-600 mb-6">
                Get started by creating your first market
              </p>
              <Link href="/dashboard/admin/create-market">
                <button className="px-5 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all flex items-center gap-2 mx-auto cursor-pointer">
                  <IconPlus className="w-4 h-4" />
                  Create Market
                </button>
              </Link>
            </DashboardCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
