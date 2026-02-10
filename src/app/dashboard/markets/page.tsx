"use client";

import { motion } from "framer-motion";
import { IconLayoutGrid, IconPhoto, IconTrendingUp, IconUsers } from '@tabler/icons-react';

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockUser } from "@/lib/mockData";
import { MarketCard } from "@/components/markets/MarketCard";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import { useEffect } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";

// Mock markets data with Kenyan context
const mockMarkets = [
  {
    id: "1",
    title: "Best Nairobi Matatu Route",
    description: "Vote for the most reliable and comfortable matatu route",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop",
    type: "poll",
    buyIn: "500 KSH",
    pool: "145,600 KSH",
    participants: 42,
    timeLeft: "2h 15m",
    status: "active",
  },
  {
    id: "2",
    title: "Trust or Betray: Social Experiment",
    description:
      "Cooperate for small win or betray for jackpot - choose wisely",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop",
    type: "betrayal",
    buyIn: "1,000 KSH",
    pool: "66,250 KSH",
    participants: 50,
    timeLeft: "4h 30m",
    status: "active",
  },
  {
    id: "3",
    title: "First Reaction: Group Chat Added",
    description: "5 seconds to predict the crowd's instinct - pure reflex",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
    type: "reflex",
    buyIn: "750 KSH",
    pool: "33,125 KSH",
    participants: 50,
    timeLeft: "45m",
    status: "active",
  },
  {
    id: "4",
    title: "Rank These Nairobi Inconveniences",
    description: "Order items by what you think the majority will choose",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop",
    type: "ladder",
    buyIn: "500 KSH",
    pool: "46,375 KSH",
    participants: 70,
    timeLeft: "6h 20m",
    status: "active",
  },
  {
    id: "5",
    title: "Who Wins the Derby?",
    description: "AFC Leopards vs Gor Mahia - predict Kenya's biggest rivalry",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop",
    type: "poll",
    buyIn: "1,200 KSH",
    pool: "98,750 KSH",
    participants: 93,
    timeLeft: "1d 3h",
    status: "active",
  },
  {
    id: "6",
    title: "Top Kenyan Musician 2024",
    description: "Rank the top 5 based on majority consensus",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop",
    type: "ladder",
    buyIn: "600 KSH",
    pool: "52,100 KSH",
    participants: 78,
    timeLeft: "8h 45m",
    status: "active",
  },
];

const getTypeStyles = (type: string) => {
  switch (type) {
    case "poll":
      return { label: "Poll" };
    case "betrayal":
      return { label: "Betrayal" };
    case "reflex":
      return { label: "Reflex" };
    case "ladder":
      return { label: "Ladder" };
    default:
      return { label: type };
  }
};
export default function MarketsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filterType]);

  const totalParticipants = mockMarkets.reduce(
    (sum, m) => sum + m.participants,
    0,
  );
  const totalPool = mockMarkets.reduce((sum, m) => {
    const poolValue = parseFloat(m.pool.replace(/[^0-9.]/g, ""));
    return sum + poolValue;
  }, 0);

  const filteredMarkets = mockMarkets.filter((market) => {
    const matchesSearch = market.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || market.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto md:pl-8 pl-0 pb-8 space-y-2">
        <DashboardHeader
          user={mockUser}
          subtitle="Explore active betting markets and join the action"
        />

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6"
        >
          {/* Active Markets Card */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-4 md:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">
                    Active
                  </p>
                  <p className="mt-2 text-2xl md:text-3xl font-medium numeric text-blue-900">
                    {mockMarkets.length}
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-2 md:p-3 shadow-sm backdrop-blur-sm">
                  <IconTrendingUp className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Participants Card */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-4 md:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">
                    Participants
                  </p>
                  <p className="mt-2 text-2xl md:text-3xl font-medium numeric text-purple-900">
                    {totalParticipants}
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-2 md:p-3 shadow-sm backdrop-blur-sm">
                  <IconUsers className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <SectionHeading title="Available Markets" className="my-16 md:my-18" />

        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search markets, tags, or pools..."
          tabs={[
            { id: "all", label: "All Markets" },
            { id: "poll", label: "Poll" },
            { id: "betrayal", label: "Betrayal" },
            { id: "reflex", label: "Reflex" },
            { id: "ladder", label: "Ladder" },
          ]}
          activeTab={filterType}
          onTabChange={setFilterType}
        />

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isFiltering ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-neutral-100 bg-white p-4 space-y-4"
              >
                <Skeleton className="h-48 w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex justify-between pt-4">
                  <Skeleton className="h-10 w-24 rounded-xl" />
                  <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
              </div>
            ))
          ) : filteredMarkets.length > 0 ? (
            filteredMarkets.map((market, index) => (
              <MarketCard key={market.id} market={market} index={index} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <p className="text-lg font-semibold text-black/40 mb-2">
                No markets found
              </p>
              <p className="text-sm text-black/30 font-medium">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
