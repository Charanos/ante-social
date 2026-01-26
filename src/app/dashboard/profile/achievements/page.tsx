'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Lock,
  Zap,
  Gift,
  Star,
  Medal,
  Clock,
  Users,
  DollarSign,
  Target,
  Check,
  X,
  ArrowRight
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const mockUser = {
  username: "HighRoller",
  user_level: "high_roller",
  balance: 165432.50
};

const mockAchievements = {
  stats: {
    balance: 2450,
    unlocked: 12,
    total: 28,
    earned: 3800,
    streak: 7
  },
  dailyBonus: [
    { day: 1, reward: 100, claimed: false },
    { day: 2, reward: 150, claimed: false },
    { day: 3, reward: 200, claimed: false },
    { day: 4, reward: 300, claimed: false },
    { day: 5, reward: 400, claimed: false },
    { day: 6, reward: 600, claimed: false },
    { day: 7, reward: 1000, claimed: false },
  ],
  inProgress: [
    { title: "Win 10 Markets", description: "Win 10 different betting markets", progress: 60, reward: 500 },
    { title: "7-Day Streak", description: "Login for 7 consecutive days", progress: 85, reward: 300 },
  ],
  unlocked: [
    { title: "First Win", description: "Won your first market", category: "Beginner", reward: 100, date: "2 days ago" },
    { title: "Early Bird", description: "Placed bet within first hour", category: "Time Based", reward: 150, date: "1 week ago" },
    { title: "Lucky Day", description: "Won 3 markets in one day", category: "Performance", reward: 200, date: "3 days ago" },
    { title: "High Roller", description: "Reached High Roller tier", category: "Prestige", reward: 500, date: "1 month ago" },
  ],
  locked: [
    { title: "10-Win Streak", description: "Win 10 markets in a row", category: "Performance", reward: 1000 },
    { title: "Big Spender", description: "Deposit over 100,000 KSH", category: "Risk", reward: 750 },
    { title: "Social Butterfly", description: "Refer 5 friends", category: "Social", reward: 500 },
    { title: "Perfect Week", description: "Win every bet for 7 days", category: "Performance", reward: 2000 },
    { title: "Market Master", description: "Win 50 different markets", category: "Prestige", reward: 1500 },
    { title: "Night Owl", description: "Place bet after midnight", category: "Time Based", reward: 100 },
  ]
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'beginner': return <Star className="w-4 h-4" />;
    case 'time based': return <Clock className="w-4 h-4" />;
    case 'performance': return <Trophy className="w-4 h-4" />;
    case 'prestige': return <Medal className="w-4 h-4" />;
    case 'risk': return <Zap className="w-4 h-4" />;
    case 'social': return <Users className="w-4 h-4" />;
    default: return <Target className="w-4 h-4" />;
  }
};

export default function AchievementsPage() {
  const [showBonusModal, setShowBonusModal] = useState(false);

  const handleClaimBonus = () => {
    // Handle claim logic here
    setTimeout(() => {
      setShowBonusModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-16">

      {/* Header */}
      <DashboardHeader
        user={mockUser}
        subtitle="Track your progress and unlock exclusive rewards"
      />

      {/* Visual Separator */}
      <div className="flex items-center gap-4 my-18">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Overview</h2>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
      </div>

      {/* Stats Cards - Keep Original Design */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {/* Cash Balance - Green */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group rounded-3xl"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900/60">Cash Earned</p>
                <p className="mt-2 text-3xl font-medium font-mono text-green-900">{mockAchievements.stats.balance} KSH</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Unlocked - Amber */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden border-none bg-linear-to-br from-amber-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group rounded-3xl"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-100/50 blur-2xl transition-all group-hover:bg-amber-200/50" />
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-900/60">Unlocked</p>
                <p className="mt-2 text-3xl font-medium font-mono text-amber-900">{mockAchievements.stats.unlocked}/{mockAchievements.stats.total}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Rewards - Blue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group rounded-3xl"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900/60">Total Rewards</p>
                <p className="mt-2 text-3xl font-medium font-mono text-blue-900">{mockAchievements.stats.earned} KSH</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <Gift className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Day Streak - Purple */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group rounded-3xl"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900/60">Day Streak</p>
                <p className="mt-2 text-3xl font-medium font-mono text-purple-900">{mockAchievements.stats.streak}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Daily Bonus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden my-18 rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] p-6 md:p-8"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full grid grid-cols-7 gap-2 md:gap-4">
            {mockAchievements.dailyBonus.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${day.claimed
                  ? "bg-amber-100 border-amber-200 text-amber-700"
                  : day.day === 1
                    ? "bg-amber-500 border-amber-500 text-white shadow-lg scale-110"
                    : "bg-white/40 backdrop-blur-sm border-black/10 text-black/40"
                  }`}>
                  {day.claimed ? <Check className="w-4 h-4" /> : day.day}
                </div>
                <span className={`text-xs font-mono font-semibold ${day.claimed || day.day === 1 ? "text-amber-600" : "text-black/40"}`}>
                  {day.reward} KSH
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
            <Gift className="w-5 h-5" />
            Claim Daily Bonus
          </motion.button>
        </div>
      </motion.div>

      {/* In Progress */}
      <div className="space-y-6">
        {/* Visual Separator */}
        <div className="flex items-center gap-4 my-18">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">In Progress</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        <div className="grid gap-4">
          {mockAchievements.inProgress.map((item, index) => (
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
                    <h4 className="font-semibold text-black/90 text-base">{item.title}</h4>
                    <p className="text-sm text-black/60 font-medium mt-1">{item.description}</p>
                  </div>
                  <span className="text-green-600 font-mono font-bold text-sm whitespace-nowrap">+{item.reward} KSH</span>
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

      {/* Unlocked */}
      <div className="space-y-6">
        {/* Visual Separator */}
        <div className="flex items-center gap-4 my-18">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Unlocked</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {mockAchievements.unlocked.map((item, index) => (
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
                  <p className="text-xs text-black/60 font-medium mt-1">{item.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white text-black/80 text-xs font-mono font-semibold px-3 py-1 rounded-lg shadow-sm">+{item.reward} KSH</span>
                  <span className="text-xs font-semibold text-black/50">{item.category}</span>
                </div>
                <span className="text-xs text-black/40 font-medium">Unlocked {item.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Locked */}
      <div className="space-y-6">
        {/* Visual Separator */}
        <div className="flex items-center gap-4 my-18">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Locked</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {mockAchievements.locked.map((item, index) => (
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
                  <h4 className="font-semibold text-black/60 text-base">{item.title}</h4>
                  <p className="text-xs text-black/40 font-medium mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-black/5 text-black/50 text-xs font-mono font-semibold px-3 py-1 rounded-lg">+{item.reward} KSH</span>
                  <span className="text-xs font-semibold text-black/30">{item.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
                <X className="w-5 h-5 text-black/60" />
              </button>

              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto rounded-full bg-linear-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg"
                >
                  <Gift className="w-10 h-10 text-white" />
                </motion.div>

                <div>
                  <h3 className="text-2xl font-semibold text-black/90 mb-2">Daily Bonus</h3>
                  <p className="text-base text-black/60 font-medium">
                    Claim your reward for today
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-linear-to-br from-amber-50 to-yellow-50 border border-amber-200">
                  <p className="text-sm font-semibold text-amber-900/60 mb-2">Today's Reward</p>
                  <p className="text-4xl font-bold font-mono text-amber-900">
                    100 <span className="text-2xl">KSH</span>
                  </p>
                </div>

                <motion.button
                  onClick={handleClaimBonus}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-black text-white font-semibold py-2 rounded-xl shadow-lg hover:bg-black/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Claim Reward
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <p className="text-xs text-black/40 font-medium">
                  Come back tomorrow for 150 KSH
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}