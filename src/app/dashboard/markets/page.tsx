"use client";

import { motion } from "framer-motion";
import { IconLayoutGrid, IconPhoto, IconTrendingUp, IconUsers } from '@tabler/icons-react';

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { MarketCard } from "@/components/markets/MarketCard";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import { useEffect } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { useLiveUser, useMarketList } from "@/lib/live-data";
export default function MarketsPage() {
  const { user } = useLiveUser();
  const { markets, isLoading } = useMarketList();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filterType]);

  const totalParticipants = markets.reduce(
    (sum, m) => sum + m.participantCount,
    0,
  );
  const totalPool = markets.reduce((sum, market) => sum + market.poolAmount, 0);

  const filteredMarkets = markets.filter((market) => {
    const matchesSearch = market.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      market.category.toLowerCase() === filterType ||
      market.type.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto md:pl-8 pl-0 pb-8 space-y-2">
        <DashboardHeader
          user={user}
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
                    {markets.length}
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
            { id: "consensus", label: "Poll" },
            { id: "prisoner_dilemma", label: "Betrayal" },
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
