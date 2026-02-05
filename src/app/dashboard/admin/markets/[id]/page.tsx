"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconAward, IconCalendar, IconChartBar, IconClock, IconCurrencyDollar, IconEdit, IconLayoutGrid, IconShare2, IconTrendingUp, IconUsers } from '@tabler/icons-react';;

import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Link from "next/link";

export default function ViewMarketPage() {
  const router = useRouter();

  const marketData = {
    id: 1,
    title: "What's your vibe right now?",
    description:
      "Pick the one that matches your brain's current state. Trust your gut — your mood might just make you money today.",
    status: "active",
    totalPool: 20,
    participants: 1,
    buyIn: 1,
    minParticipants: 5,
    maxParticipants: 1000,
    closeDate: "Dec 2, 2025 08:30",
    settlementDate: "Dec 2, 2025 10:00",
    createdDate: "Nov 28, 2025",
    tags: ["memes", "mood", "wager", "bet"],
    outcomes: [
      {
        id: 1,
        name: "Barely holding it together",
        bets: 0,
        amount: 0,
        percentage: 0,
      },
      { id: 2, name: "Not bad actually", bets: 1, amount: 20, percentage: 100 },
      {
        id: 3,
        name: "I thrive off of chaos",
        bets: 0,
        amount: 0,
        percentage: 0,
      },
      {
        id: 4,
        name: "Does it matter anymore?",
        bets: 0,
        amount: 0,
        percentage: 0,
      },
      { id: 5, name: "I'm fine...", bets: 0, amount: 0, percentage: 0 },
    ],
  };

  const getStatusStyles = (status: string) => {
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

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-full mx-auto px-6">
        {/* Header */}
        {/* Header */}
        <DashboardHeader subtitle="View market information and betting activity" />

        <div className="flex items-center justify-end gap-2 -mt-16 mb-8 relative z-10 px-2">
          <Link href={`/dashboard/admin/markets/${marketData.id}/edit`}>
            <button className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm">
              <IconEdit className="w-4 h-4" />
              IconEdit Market
            </button>
          </Link>
          <button className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm">
            <IconShare2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Market Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-neutral-200 p-8 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-medium text-neutral-900 mb-3">
                {marketData.title}
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                {marketData.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {marketData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span
              className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusStyles(marketData.status)}`}
            >
              {marketData.status.toUpperCase()}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-100">
            <div className="p-4 rounded-lg bg-green-50/50 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <IconCurrencyDollar className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">
                  Total Pool
                </span>
              </div>
              <p className="text-2xl font-medium text-green-900">
                ${marketData.totalPool.toFixed(2)}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <IconUsers className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">
                  Participants
                </span>
              </div>
              <p className="text-2xl font-medium text-blue-900">
                {marketData.participants}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Min: {marketData.minParticipants} / Max:{" "}
                {marketData.maxParticipants}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-purple-50/50 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <IconTrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">
                  Buy-in
                </span>
              </div>
              <p className="text-2xl font-medium text-purple-900">
                {marketData.buyIn} MP
              </p>
            </div>

            <div className="p-4 rounded-lg bg-orange-50/50 border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <IconAward className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-orange-700">
                  Status
                </span>
              </div>
              <p className="text-lg font-medium text-orange-900">Pending</p>
            </div>
          </div>
        </motion.div>

        {/* Timeline Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-neutral-200 p-8 mb-6"
        >
          <h3 className="text-lg font-medium text-neutral-900 mb-6">
            Timeline
          </h3>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-neutral-100">
                <IconCalendar className="w-5 h-5 text-neutral-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Created</p>
                <p className="text-sm text-neutral-600">
                  {marketData.createdDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-red-100">
                <IconClock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Closes</p>
                <p className="text-sm text-neutral-600">
                  {marketData.closeDate}
                </p>
                <p className="text-xs text-red-600 mt-0.5">in 7 hours</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-100">
                <IconChartBar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Settlement
                </p>
                <p className="text-sm text-neutral-600">
                  {marketData.settlementDate}
                </p>
                <p className="text-xs text-blue-600 mt-0.5">in 8 hours</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Outcomes Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-neutral-200 p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-neutral-900">Outcomes</h3>
            <span className="text-sm text-neutral-600">
              {marketData.outcomes.length} options
            </span>
          </div>

          <div className="space-y-8">
            {marketData.outcomes.map((outcome) => (
              <div
                key={outcome.id}
                className="p-6 rounded-lg border border-neutral-200 bg-neutral-50/30 hover:bg-neutral-50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-medium text-neutral-900">
                    {outcome.name}
                  </h4>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      outcome.percentage > 0
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                    }`}
                  >
                    {outcome.percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-neutral-200 rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-green-500 to-green-600 transition-all duration-500"
                    style={{ width: `${outcome.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-neutral-600">
                      <span className="font-medium text-neutral-900">
                        {outcome.bets}
                      </span>{" "}
                      bet(s)
                    </span>
                    <span className="text-neutral-600">
                      <span className="font-medium text-neutral-900">
                        ${outcome.amount.toFixed(2)}
                      </span>{" "}
                      staked
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
