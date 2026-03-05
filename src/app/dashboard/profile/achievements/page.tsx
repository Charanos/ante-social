"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconAccessPoint,
  IconArrowRight,
  IconAward,
  IconCheck,
  IconClock,
  IconCurrencyDollar,
  IconGift,
  IconStar,
  IconTarget,
  IconUsers,
  IconX,
  IconLoader3,
} from "@tabler/icons-react";

import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { useToast } from "@/components/ui/toast-notification";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLiveUser } from "@/lib/live-data";
import { useCurrency } from "@/lib/utils/currency";

const ACHIEVEMENT_LIBRARY = [
  {
    title: "First Win",
    description: "Win your first market",
    category: "Beginner",
    reward: 100,
  },
  {
    title: "Early Bird",
    description: "Place a forecast early in market lifecycle",
    category: "Time Based",
    reward: 150,
  },
  {
    title: "Lucky Day",
    description: "Win 3 markets in one day",
    category: "Performance",
    reward: 200,
  },
  {
    title: "High Roller",
    description: "Reach high-roller tier",
    category: "Prestige",
    reward: 500,
  },
  {
    title: "10-Win Streak",
    description: "Win 10 markets in a row",
    category: "Performance",
    reward: 1000,
  },
  {
    title: "Big Spender",
    description: "Deposit over significant amounts",
    category: "Risk",
    reward: 750,
  },
  {
    title: "Social Butterfly",
    description: "Refer 5 friends",
    category: "Social",
    reward: 500,
  },
  {
    title: "Perfect Week",
    description: "Win every bet for 7 days",
    category: "Performance",
    reward: 2000,
  },
  {
    title: "Market Master",
    description: "Win 50 different markets",
    category: "Prestige",
    reward: 1500,
  },
  {
    title: "Night Owl",
    description: "Place a forecast after midnight",
    category: "Time Based",
    reward: 100,
  },
] as const;

function buildAchievementData(user: any) {
  const reputation = Number(user?.reputationScore || 0);
  const accuracy = Number(user?.signalAccuracy || 0);
  const totalWinnings = Number(user?.totalWinnings || 0);
  const totalLosses = Number(user?.totalLosses || 0);
  const totalPnl = totalWinnings - totalLosses;
  const total = ACHIEVEMENT_LIBRARY.length;

  const progressSignal = reputation + accuracy + Math.max(0, totalPnl) / 10;
  const unlockedCount = Math.max(0, Math.min(total, Math.floor(progressSignal / 40)));

  const unlocked = ACHIEVEMENT_LIBRARY.slice(0, unlockedCount).map((item, index) => ({
    ...item,
    date: `${index + 1} ${index === 0 ? "day" : "weeks"} ago`,
  }));
  const locked = ACHIEVEMENT_LIBRARY.slice(unlockedCount);

  const winProgress = Math.max(5, Math.min(100, Math.round(accuracy)));
  const streakProgress = Math.max(5, Math.min(100, Math.round(reputation / 8)));

  const inProgress = [
    {
      title: "Win 10 Markets",
      description: "Win 10 different betting markets",
      progress: winProgress,
      reward: 500,
      category: "Performance",
    },
    {
      title: "7-Day Streak",
      description: "Login for 7 consecutive days",
      progress: streakProgress,
      reward: 300,
      category: "Consistency",
    },
  ];

  const currentStreak = Math.max(1, Math.min(30, Math.round(accuracy / 10)));
  const maxClaimedDay = Math.min(7, currentStreak);
  const dailyRewards = [100, 150, 200, 300, 400, 600, 1000];
  const dailyBonus = dailyRewards.map((reward, index) => ({
    day: index + 1,
    reward,
    claimed: index + 1 < maxClaimedDay,
  }));

  const earned = unlocked.reduce((sum, item) => sum + item.reward, 0);

  return {
    stats: {
      balance: Math.max(0, Math.round(totalWinnings)),
      unlocked: unlocked.length,
      total,
      earned,
      streak: currentStreak,
    },
    dailyBonus,
    inProgress,
    unlocked,
    locked,
  };
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "beginner":
      return <IconStar className="w-4 h-4" />;
    case "time based":
      return <IconClock className="w-4 h-4" />;
    case "performance":
      return <IconAward className="w-4 h-4" />;
    case "prestige":
      return <IconAward className="w-4 h-4" />;
    case "risk":
      return <IconAccessPoint className="w-4 h-4" />;
    case "social":
      return <IconUsers className="w-4 h-4" />;
    case "consistency":
      return <IconTarget className="w-4 h-4" />;
    default:
      return <IconTarget className="w-4 h-4" />;
  }
};

export default function AchievementsPage() {
  const toast = useToast();
  const { user } = useLiveUser();
  const { formatCurrency } = useCurrency();
  const achievementData = useMemo(() => buildAchievementData(user), [user]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Simulate Page Load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClaimBonus = () => {
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
      setShowBonusModal(false);
      toast.success(
        "Daily Bonus Claimed!",
        `You've received ${formatCurrency(nextBonusReward)}. Come back tomorrow for more!`
      );
    }, 1500);
  };

  // Filter Logic
  const filterItems = (items: any[]) => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab =
        activeTab === "All" ||
        item.category?.toLowerCase() === activeTab.toLowerCase();
      return matchesSearch && matchesTab;
    });
  };

  const filteredInProgress = filterItems(achievementData.inProgress);
  const filteredUnlocked = filterItems(achievementData.unlocked);
  const filteredLocked = filterItems(achievementData.locked);

  const tabs = [
    { id: "All", label: "All" },
    { id: "Performance", label: "Performance" },
    { id: "Time Based", label: "Time Based" },
    { id: "Prestige", label: "Prestige" },
    { id: "Social", label: "Social" },
  ];
  const nextBonusReward =
    achievementData.dailyBonus.find((day) => !day.claimed)?.reward ||
    achievementData.dailyBonus[achievementData.dailyBonus.length - 1]?.reward ||
    0;

  if (isPageLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  return (
    <div className="space-y-6 md:space-y-16 pl-0 md:pl-6 pb-12 md:pb-16 px-1 md:px-0">
      {/* Header */}
      {/* Visual Separator */}
      <div className="hidden md:flex items-center gap-4 my-8">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
          Overview
        </h2>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
      </div>

      {/* Stats Cards - Keep Original Design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mt-4 md:mt-0">
        {/* Cash Balance - Green */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group rounded-2xl md:rounded-3xl"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
          <div className="p-4 md:p-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <p className="text-xs md:text-sm font-medium text-green-900/60">
                  Cash Earned
                </p>
                <p className="mt-1 md:mt-2 text-xl md:text-3xl font-medium font-mono text-green-900">
                  {formatCurrency(achievementData.stats.balance)}
                </p>
              </div>
              <div className="self-end md:self-auto rounded-xl bg-white/80 p-2 md:p-3 shadow-sm backdrop-blur-sm">
                <IconCurrencyDollar className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Unlocked - Amber */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden border-none bg-linear-to-br from-amber-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group rounded-2xl md:rounded-3xl"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-100/50 blur-2xl transition-all group-hover:bg-amber-200/50" />
          <div className="p-4 md:p-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <p className="text-xs md:text-sm font-medium text-amber-900/60">
                  Unlocked
                </p>
                <p className="mt-1 md:mt-2 text-xl md:text-3xl font-medium font-mono text-amber-900">
                  {achievementData.stats.unlocked}/
                  {achievementData.stats.total}
                </p>
              </div>
              <div className="self-end md:self-auto rounded-xl bg-white/80 p-2 md:p-3 shadow-sm backdrop-blur-sm">
                <IconAward className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Rewards - Blue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group rounded-2xl md:rounded-3xl"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
          <div className="p-4 md:p-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <p className="text-xs md:text-sm font-medium text-blue-900/60">
                  Total Rewards
                </p>
                <p className="mt-1 md:mt-2 text-xl md:text-3xl font-medium font-mono text-blue-900">
                  {formatCurrency(achievementData.stats.earned)}
                </p>
              </div>
              <div className="self-end md:self-auto rounded-xl bg-white/80 p-2 md:p-3 shadow-sm backdrop-blur-sm">
                <IconGift className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Day Streak - Purple */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group rounded-2xl md:rounded-3xl"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
          <div className="p-4 md:p-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <p className="text-xs md:text-sm font-medium text-purple-900/60">
                  Day Streak
                </p>
                <p className="mt-1 md:mt-2 text-xl md:text-3xl font-medium font-mono text-purple-900">
                  {achievementData.stats.streak}
                </p>
              </div>
              <div className="self-end md:self-auto rounded-xl bg-white/80 p-2 md:p-3 shadow-sm backdrop-blur-sm">
                <IconAccessPoint className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

       {/* Daily Bonus Section (Hidden or redesigned for mobile if needed, but keeping commented out code structure if it was there) */}
       {/* ... */}

      {/* Search & Filter */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
        placeholder="Search achievements..."
      />

      {/* In Progress */}
      {filteredInProgress.length > 0 && (
        <div className="space-y-6">
          <SectionHeading title="In Progress" className="my-16 md:my-18" />

          <div className="grid gap-4">
            {filteredInProgress.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + index * 0.05 }}
                className="relative overflow-hidden p-6 rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:bg-white/60 hover:border-black/10 transition-all cursor-pointer"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-black/90 text-base">
                        {item.title}
                      </h4>
                      <p className="text-sm text-black/80 font-medium mt-1">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-green-600 font-mono font-semibold text-sm whitespace-nowrap">
                      +{formatCurrency(item.reward)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: 0.5 + index * 0.05,
                        }}
                        className="h-full bg-black/80 rounded-full"
                      />
                    </div>
                    <div className="text-xs font-mono font-semibold text-black/50">
                      {item.progress}%
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Unlocked */}
      {filteredUnlocked.length > 0 && (
        <div className="space-y-6">
          <SectionHeading title="Unlocked" className="my-16 md:my-18" />

          <div className="grid md:grid-cols-2 gap-4">
            {filteredUnlocked.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="relative overflow-hidden p-6 rounded-3xl bg-linear-to-br from-amber-50/50 to-white/40 backdrop-blur-xl border border-amber-200/50 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] cursor-pointer"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-black/90 text-base">
                      {item.title}
                    </h4>
                    <p className="text-xs text-black/80 font-medium mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-white text-black/80 text-xs font-mono font-semibold px-3 py-1 rounded-lg shadow-sm">
                      +{formatCurrency(item.reward)}
                    </span>
                    <span className="text-xs font-semibold text-black/50">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-xs text-black/40 font-medium">
                    Unlocked {item.date}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {filteredLocked.length > 0 && (
        <div className="space-y-6">
          <SectionHeading title="Locked" className="my-16 md:my-18" />

          <div className="grid md:grid-cols-3 gap-4">
            {filteredLocked.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + index * 0.05 }}
                className="relative overflow-hidden p-6 rounded-3xl bg-white/20 backdrop-blur-sm border border-black/5 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] hover:bg-white/40 transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black/30 mb-4">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-black/80 text-base">
                      {item.title}
                    </h4>
                    <p className="text-xs text-black/40 font-medium mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-black/5 text-black/50 text-xs font-mono font-semibold px-3 py-1 rounded-lg">
                      +{formatCurrency(item.reward)}
                    </span>
                    <span className="text-xs font-semibold text-black/30">
                      {item.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback for Empty Search */}
      {filteredInProgress.length === 0 &&
        filteredUnlocked.length === 0 &&
        filteredLocked.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
              <IconAward className="w-8 h-8 text-neutral-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-neutral-900">
                No achievements found
              </h3>
              <p className="text-sm text-neutral-500 mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          </div>
        )}

      {/* Bonus Claim Modal */}
      <AnimatePresence>
        {showBonusModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBonusModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden p-8 border border-black/5"
            >
              <button
                onClick={() => setShowBonusModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer"
              >
                <IconX className="w-5 h-5 text-black/80" />
              </button>

              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto rounded-full bg-linear-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg"
                >
                  <IconGift className="w-10 h-10 text-white" />
                </motion.div>

                <div>
                  <h3 className="text-2xl font-semibold text-black/90 mb-2">
                    Daily Bonus
                  </h3>
                  <p className="text-base text-black/80 font-medium">
                    Claim your reward for today
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-linear-to-br from-amber-50 to-yellow-50 border border-amber-200">
                  <p className="text-sm font-semibold text-amber-900/60 mb-2">
                    Today's Reward
                  </p>
                  <p className="text-4xl font-semibold font-mono text-amber-900">
                    {formatCurrency(nextBonusReward)}
                  </p>
                </div>

                <motion.button
                  onClick={handleClaimBonus}
                  disabled={isClaiming}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-black text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-black/90 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isClaiming ? (
                    <>
                      <IconLoader3 className="w-5 h-5 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      Claim Reward
                      <IconArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-black/40 font-medium">
                  Come back tomorrow for the next reward
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
