"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconAccessPoint,
  IconArrowRight,
  IconAward,
  IconCheck,
  IconCurrencyDollar,
  IconGift,
  IconStar,
  IconTarget,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLiveUser } from "@/lib/live-data";
import { useToast } from "@/components/ui/toast-notification";
import { useCurrency } from "@/lib/utils/currency";

type AdminStats = {
  totalUsers?: number;
  totalRevenue?: number;
  activeMarkets?: number;
  totalVolume?: number;
  pendingWithdrawals?: number;
};

type UserRow = {
  _id: string;
  reputationScore?: number;
  isVerified?: boolean;
  isFlagged?: boolean;
  totalPositions?: number;
};

type UsersResponse = {
  data?: UserRow[];
};

function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case "beginner":
      return <IconStar className="w-4 h-4" />;
    case "performance":
      return <IconAward className="w-4 h-4" />;
    case "prestige":
      return <IconAward className="w-4 h-4" />;
    case "risk":
      return <IconAccessPoint className="w-4 h-4" />;
    case "social":
      return <IconUsers className="w-4 h-4" />;
    default:
      return <IconTarget className="w-4 h-4" />;
  }
}

export default function AchievementsPage() {
  const { user } = useLiveUser();
  const { formatCurrency } = useCurrency();
  const toast = useToast();
  const [showBonusModal, setShowBonusModal] = useState(false);

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ["admin-achievements-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/stats", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load stats");
      return response.json();
    },
  });

  const { data: usersResponse } = useQuery<UsersResponse>({
    queryKey: ["admin-achievements-users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users?limit=500&offset=0", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load users");
      return response.json();
    },
  });

  const users = usersResponse?.data || [];

  const achievementData = useMemo(() => {
    const totalUsers = Number(stats?.totalUsers || users.length);
    const totalRevenue = Number(stats?.totalRevenue || 0);
    const activeMarkets = Number(stats?.activeMarkets || 0);
    const totalVolume = Number(stats?.totalVolume || 0);

    const verifiedUsers = users.filter((u) => u.isVerified).length;
    const flaggedUsers = users.filter((u) => u.isFlagged).length;
    const highRepUsers = users.filter((u) => Number(u.reputationScore || 0) >= 500).length;

    const unlocked = [
      {
        title: "Platform Launch",
        description: "Core market and wallet flows are active",
        category: "Beginner",
        reward: 1000,
        date: "Live",
      },
      {
        title: "User Growth",
        description: `${totalUsers} users onboarded`,
        category: "Social",
        reward: 1500,
        date: "Current",
      },
      {
        title: "Revenue Milestone",
        description: `${totalRevenue.toFixed(2)} total platform revenue`,
        category: "Performance",
        reward: 1200,
        date: "Current",
      },
    ];

    const inProgress = [
      {
        title: "High Reputation Cohort",
        description: "Grow users with reputation >= 500",
        progress: Math.min(100, totalUsers > 0 ? Math.round((highRepUsers / totalUsers) * 100) : 0),
        reward: 1800,
        category: "Performance",
      },
      {
        title: "Verification Coverage",
        description: "Increase verified user percentage",
        progress: Math.min(100, totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0),
        reward: 1400,
        category: "Prestige",
      },
      {
        title: "Risk Control",
        description: "Reduce flagged users below 2%",
        progress: Math.min(100, totalUsers > 0 ? Math.max(0, 100 - Math.round((flaggedUsers / totalUsers) * 100)) : 0),
        reward: 1100,
        category: "Risk",
      },
    ];

    const locked = [
      {
        title: "1M Volume Club",
        description: "Reach cumulative volume of 1,000,000",
        category: "Performance",
        reward: 5000,
      },
      {
        title: "500 Active Markets",
        description: "Maintain 500 active markets concurrently",
        category: "Prestige",
        reward: 3500,
      },
      {
        title: "Zero Pending Withdrawals",
        description: "Keep pending withdrawal queue at 0",
        category: "Risk",
        reward: 2200,
      },
    ];

    return {
      stats: {
        balance: Math.round(totalRevenue),
        unlocked: unlocked.length,
        total: unlocked.length + inProgress.length + locked.length,
        earned: unlocked.reduce((sum, item) => sum + item.reward, 0),
        streak: activeMarkets,
      },
      dailyBonus: [100, 150, 200, 300, 400, 600, 1000].map((reward, index) => ({
        day: index + 1,
        reward,
        claimed: index < 2,
      })),
      inProgress,
      unlocked,
      locked,
      metrics: {
        totalVolume,
        pendingWithdrawals: Number(stats?.pendingWithdrawals || 0),
      },
    };
  }, [stats, users]);

  const handleClaimBonus = () => {
    toast.info("Admin action", "Bonus simulation completed for monitoring");
    setTimeout(() => {
      setShowBonusModal(false);
    }, 800);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-16">
      <div className="hidden md:flex items-center gap-4 my-8 md:my-18">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Overview</h2>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-4 md:mt-0">
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
                <p className="text-xs md:text-sm font-medium text-green-900/60">Cash Earned</p>
                <p className="mt-1 md:mt-2 text-xl md:text-3xl font-medium font-mono text-green-900">
                  {formatCurrency(achievementData.stats.balance, "KSH")}
                </p>
              </div>
              <div className="self-end md:self-auto rounded-xl bg-white/80 p-2 md:p-3 shadow-sm backdrop-blur-sm">
                <IconCurrencyDollar className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
            </div>
          </div>
        </motion.div>

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
                <p className="text-xs md:text-sm font-medium text-amber-900/60">Unlocked</p>
                <p className="mt-1 md:mt-2 text-xl md:text-3xl font-medium font-mono text-amber-900">
                  {achievementData.stats.unlocked}/{achievementData.stats.total}
                </p>
              </div>
              <div className="self-end md:self-auto rounded-xl bg-white/80 p-2 md:p-3 shadow-sm backdrop-blur-sm">
                <IconAward className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </motion.div>

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
                <p className="text-xs md:text-sm font-medium text-blue-900/60">Total Rewards</p>
                <p className="mt-1 md:mt-2 text-xl md:text-3xl font-medium font-mono text-blue-900">
                  {formatCurrency(achievementData.stats.earned, "KSH")}
                </p>
              </div>
              <div className="self-end md:self-auto rounded-xl bg-white/80 p-2 md:p-3 shadow-sm backdrop-blur-sm">
                <IconGift className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>

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
                <p className="text-xs md:text-sm font-medium text-purple-900/60">Active Markets</p>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden my-18 rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] p-6 md:p-8"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full grid grid-cols-7 gap-2 md:gap-4">
            {achievementData.dailyBonus.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                    day.claimed
                      ? "bg-amber-100 border-amber-200 text-amber-700"
                      : day.day === 3
                        ? "bg-amber-500 border-amber-500 text-white shadow-lg scale-110"
                        : "bg-white/40 backdrop-blur-sm border-black/10 text-black/40"
                  }`}
                >
                  {day.claimed ? <IconCheck className="w-4 h-4" /> : day.day}
                </div>
                <span className={`text-xs font-mono font-semibold ${day.claimed || day.day === 3 ? "text-amber-600" : "text-black/40"}`}>
                  {formatCurrency(day.reward, "KSH")}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={() => setShowBonusModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold px-8 py-2 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <IconGift className="w-5 h-5" />
            Claim Daily Bonus
          </motion.button>
        </div>
      </motion.div>

      <div className="space-y-6">
        <SectionHeading title="In Progress" className="my-18" />
        <div className="grid gap-4">
          {achievementData.inProgress.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.05 }}
              className="relative overflow-hidden p-6 rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:bg-white/60 hover:border-black/10 transition-all cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-black/90 text-base">{item.title}</h4>
                    <p className="text-sm text-black/80 font-medium mt-1">{item.description}</p>
                  </div>
                  <span className="text-green-600 font-mono font-semibold text-sm whitespace-nowrap">+{formatCurrency(item.reward, "KSH")}</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.5 + index * 0.05 }}
                      className="h-full bg-black/80 rounded-full"
                    />
                  </div>
                  <div className="text-xs font-mono font-semibold text-black/50">{item.progress}%</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <SectionHeading title="Unlocked" className="my-18" />
        <div className="grid md:grid-cols-2 gap-4">
          {achievementData.unlocked.map((item, index) => (
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
                  <h4 className="font-semibold text-black/90 text-base">{item.title}</h4>
                  <p className="text-xs text-black/80 font-medium mt-1">{item.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white text-black/80 text-xs font-mono font-semibold px-3 py-1 rounded-lg shadow-sm">+{formatCurrency(item.reward, "KSH")}</span>
                  <span className="text-xs font-semibold text-black/50">{item.category}</span>
                </div>
                <span className="text-xs text-black/40 font-medium">Unlocked {item.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <SectionHeading title="Locked" className="my-18" />
        <div className="grid md:grid-cols-3 gap-4">
          {achievementData.locked.map((item, index) => (
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
                  <h4 className="font-semibold text-black/80 text-base">{item.title}</h4>
                  <p className="text-xs text-black/40 font-medium mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-black/5 text-black/50 text-xs font-mono font-semibold px-3 py-1 rounded-lg">+{formatCurrency(item.reward, "KSH")}</span>
                  <span className="text-xs font-semibold text-black/30">{item.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
                  <h3 className="text-2xl font-semibold text-black/90 mb-2">Daily Bonus</h3>
                  <p className="text-base text-black/80 font-medium">Claim your reward for today</p>
                </div>

                <div className="p-6 rounded-2xl bg-linear-to-br from-amber-50 to-yellow-50 border border-amber-200">
                  <p className="text-sm font-semibold text-amber-900/60 mb-2">Today's Reward</p>
                    {formatCurrency(achievementData.dailyBonus.find((day) => !day.claimed)?.reward || 100, "KSH")}
                </div>

                <motion.button
                  onClick={handleClaimBonus}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-black text-white font-semibold py-2 rounded-xl shadow-lg hover:bg-black/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Claim Reward
                  <IconArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

