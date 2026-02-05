"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IconLayoutGrid } from "@tabler/icons-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { cn } from "@/lib/utils";
import { mockUser, mockGroups } from "@/lib/mockData";
import { getJoinedGroups } from "@/lib/membership";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { GroupCard } from "@/components/groups/GroupCard";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/toast-notification";
import { useEffect } from "react";
import {
  IoPeopleOutline,
  IoSearchOutline,
  IoChevronDownOutline,
  IoFunnelOutline,
} from "react-icons/io5";

const allGroups = mockGroups;

const categories = [
  { name: "All", count: allGroups.length },
  {
    name: "Sports",
    count: allGroups.filter((g) => g.category === "Sports").length,
  },
  {
    name: "Finance",
    count: allGroups.filter((g) => g.category === "Finance").length,
  },
  {
    name: "Tech",
    count: allGroups.filter((g) => g.category === "Tech").length,
  },
  {
    name: "Entertainment",
    count: allGroups.filter((g) => g.category === "Entertainment").length,
  },
  {
    name: "Politics",
    count: allGroups.filter((g) => g.category === "Politics").length,
  },
  {
    name: "Gaming",
    count: allGroups.filter((g) => g.category === "Gaming").length,
  },
  {
    name: "Social",
    count: allGroups.filter((g) => g.category === "Social").length,
  },
];

const sortOptions = [
  { value: "trending", label: "Trending" },
  { value: "members", label: "Most Members" },
  { value: "active", label: "Most Active" },
  { value: "newest", label: "Newest" },
];

export default function DiscoverGroupsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("trending");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);
  const toast = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    setJoinedGroupIds(getJoinedGroups());
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 600);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, sortBy]);

  const filteredAndSortedGroups = useMemo(() => {
    let filtered = allGroups.filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || group.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort
    switch (sortBy) {
      case "trending":
        filtered.sort((a, b) => {
          const aTrending = (a as any).trending || false;
          const bTrending = (b as any).trending || false;
          if (aTrending && !bTrending) return -1;
          if (!aTrending && bTrending) return 1;

          const aGrowth = parseInt(
            (a as any).growth?.replace(/[^0-9-]/g, "") || "0",
          );
          const bGrowth = parseInt(
            (b as any).growth?.replace(/[^0-9-]/g, "") || "0",
          );
          return bGrowth - aGrowth;
        });
        break;
      case "members":
        filtered.sort((a, b) => (b.member_count || 0) - (a.member_count || 0));
        break;
      case "active":
        filtered.sort((a, b) => (b.active_bets || 0) - (a.active_bets || 0));
        break;
      case "newest":
        filtered.sort((a, b) =>
          b.id.localeCompare(a.id, undefined, { numeric: true }),
        );
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const trendingGroups = allGroups.filter((g) => g.trending).slice(0, 3);

  if (isLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  return (
    <div className="space-y-10 pb-20 pl-0 md:pl-8 w-full">
      <DashboardHeader
        user={mockUser}
        subtitle="Discover communities and join the conversation"
      />

      <SearchFilterBar
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="IconSearch groups by name or description..."
        tabs={categories.map((c) => ({ id: c.name, label: c.name }))}
        activeTab={selectedCategory}
        onTabChange={setSelectedCategory}
        rightElement={
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="px-4 py-2 rounded-xl bg-neutral-100/70 hover:bg-neutral-100 focus:bg-white text-sm font-semibold text-black/70 flex items-center gap-3 transition-all cursor-pointer min-w-[140px] justify-between"
            >
              <div className="flex items-center gap-2">
                <IoFunnelOutline className="w-3.5 h-3.5" />
                <span className="text-xs">
                  {sortOptions.find((o) => o.value === sortBy)?.label}
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
                  {sortOptions.map((option) => (
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
                          : "text-black/60 hover:bg-black/5",
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

      {/* Trending Section */}
      {selectedCategory === "All" && !searchTerm && (
        <div className="space-y-6">
          <SectionHeading title="Trending Now" />

          <div className="grid md:grid-cols-3 gap-5">
            {isFiltering
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-black/5 bg-white/40 p-5 space-y-4"
                  >
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="flex justify-between pt-4 border-t border-black/5">
                      <Skeleton className="h-8 w-24 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                ))
              : trendingGroups.map((group, index) => (
                  <GroupCard
                    key={group.id}
                    group={{
                      ...group,
                      members: group.member_count || 0,
                      activeBets: group.active_bets || 0,
                      isPublic: group.is_public ?? true,
                      category: group.category || "Community",
                    }}
                    featured={true}
                    index={index}
                    isJoined={joinedGroupIds.includes(group.id.toString())}
                  />
                ))}
          </div>
        </div>
      )}

      {/* All Groups Grid */}
      <div className="space-y-6">
        <SectionHeading
          title={
            searchTerm
              ? `IconSearch Results for "${searchTerm}"`
              : selectedCategory === "All"
                ? `${sortOptions.find((o) => o.value === sortBy)?.label} Community Groups`
                : `${selectedCategory} Groups (${sortOptions.find((o) => o.value === sortBy)?.label})`
          }
          icon={<IoPeopleOutline className="w-4 h-4 text-black/40" />}
        />

        {filteredAndSortedGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
              <IoSearchOutline className="w-8 h-8 text-black/20" />
            </div>
            <h3 className="text-lg font-semibold text-black/60 mb-2">
              No groups found
            </h3>
            <p className="text-sm text-black/40 max-w-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {isFiltering
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-black/5 bg-white/40 p-5 space-y-4"
                  >
                    <Skeleton className="h-28 w-full rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="flex justify-between pt-4 border-t border-black/5">
                      <Skeleton className="h-8 w-24 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                ))
              : filteredAndSortedGroups.map((group, index) => (
                  <GroupCard
                    key={group.id}
                    group={{
                      ...group,
                      members: group.member_count || 0,
                      activeBets: group.active_bets || 0,
                      isPublic: group.is_public ?? true,
                      category: group.category || "Community",
                    }}
                    index={index}
                    isJoined={joinedGroupIds.includes(group.id.toString())}
                  />
                ))}
          </div>
        )}
      </div>
    </div>
  );
}
