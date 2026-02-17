"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProgressChart } from "@/components/charts/ProgressChart";
import { cn } from "@/lib/utils";
import {
  IconTrophy,
  IconClock,
  IconBolt,
  IconCrown,
  IconSparkles,
  IconChartLine,
  IconArrowRight,
  IconTrendingUp,
  IconTrendingDown,
  IconCheck,
  IconChartPie3,
  IconCoins,
  IconPercentage,
  IconFlame,
} from "@tabler/icons-react";

// Mock user data
const mockPublicProfile = {
  username: "AfricanPredictor",
  full_name: "Amira Mwangi",
  bio: "Professional prediction market trader specializing in sports and politics",
  user_level: "high_roller",
  avatar_url: null,
  joined_date: "2024-01-15",
  stats: {
    totalBets: 234,
    winRate: 68.5,
    totalProfit: 2450.75,
    roi: 24.3,
    accuracy: 88,
    currentStreak: 5,
    longestStreak: 12,
    totalVolume: 12500,
  },
  achievements: [
    {
      title: "First Win",
      category: "Beginner",
      reward: 100,
      date: "2 days ago",
      icon: "trophy",
    },
    {
      title: "Early Bird",
      category: "Time Based",
      reward: 150,
      date: "1 week ago",
      icon: "clock",
    },
    {
      title: "Lucky Day",
      category: "Performance",
      reward: 200,
      date: "3 days ago",
      icon: "zap",
    },
    {
      title: "High Roller",
      category: "Prestige",
      reward: 500,
      date: "1 month ago",
      icon: "crown",
    },
  ],
  progressData: [
    { week: "Week 1", points: 450, accuracy: 62 },
    { week: "Week 2", points: 680, accuracy: 68 },
    { week: "Week 3", points: 520, accuracy: 65 },
    { week: "Week 4", points: 890, accuracy: 74 },
    { week: "Week 5", points: 1050, accuracy: 78 },
    { week: "Week 6", points: 1240, accuracy: 82 },
    { week: "Week 7", points: 1380, accuracy: 85 },
    { week: "Week 8", points: 1520, accuracy: 88 },
  ],
  profitabilityData: [
    { month: "Jan", profit: 320, loss: -120, net: 200 },
    { month: "Feb", profit: 450, loss: -150, net: 300 },
    { month: "Mar", profit: 380, loss: -200, net: 180 },
    { month: "Apr", profit: 620, loss: -100, net: 520 },
    { month: "May", profit: 550, loss: -180, net: 370 },
    { month: "Jun", profit: 720, loss: -140, net: 580 },
  ],
};

// Get achievement icon component
const getAchievementIcon = (iconName: string) => {
  const iconProps = "w-6 h-6";
  switch (iconName) {
    case "trophy":
      return <IconTrophy className={iconProps} />;
    case "clock":
      return <IconClock className={iconProps} />;
    case "zap":
      return <IconBolt className={iconProps} />;
    case "crown":
      return <IconCrown className={iconProps} />;
    default:
      return <IconTrophy className={iconProps} />;
  }
};

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const [isPageLoading, setIsPageLoading] = useState(true);
  const profile = mockPublicProfile;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl"
        >
          <div className="absolute inset-0 bg-linear-to-br from-neutral-800 via-neutral-900 to-neutral-900" />

          <div className="relative z-10 p-8 md:p-12 space-y-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-linear-to-br from-neutral-600 to-neutral-800 flex items-center justify-center text-5xl md:text-6xl font-semibold text-white shadow-lg shrink-0">
                {profile.username.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <h1 className="text-3xl md:text-4xl font-medium text-white">
                    {profile.username}
                  </h1>
                  <p className="text-lg text-white/70 font-normal mt-2">
                    {profile.full_name}
                  </p>
                  <p className="text-sm text-white/60 font-normal mt-3 max-w-2xl">
                    {profile.bio}
                  </p>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                  <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-white capitalize">
                    {profile.user_level.replace("_", " ")}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-white/70">
                    Joined {new Date(profile.joined_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SectionHeading
            title="Performance Metrics"
            icon={<IconChartPie3 className="w-5 h-5 text-neutral-500" />}
            className="mb-6"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Win Rate",
                value: `${profile.stats.winRate}%`,
                icon: IconTrendingUp,
                positive: true,
              },
              {
                label: "Total Profit",
                value: `$${profile.stats.totalProfit.toLocaleString()}`,
                icon: IconCoins,
                positive: true,
              },
              {
                label: "ROI",
                value: `${profile.stats.roi}%`,
                icon: IconPercentage,
                positive: profile.stats.roi > 0,
              },
              {
                label: "Current Streak",
                value: `${profile.stats.currentStreak} days`,
                icon: IconFlame,
                positive: true,
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl border border-black/5 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-neutral-100 border border-black/5">
                      <stat.icon className="w-5 h-5 text-neutral-700" />
                    </div>
                    {stat.positive ? (
                      <IconTrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <IconTrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-black font-mono">
                      {stat.value}
                    </p>
                    <p className="text-xs text-black/50 font-medium uppercase tracking-wider mt-1">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievement Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionHeading
            title="Recent Achievements"
            icon={<IconSparkles className="w-5 h-5 text-neutral-500" />}
            className="mb-6"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="relative overflow-hidden rounded-2xl border border-black/5 p-6 shadow-sm bg-white/40 backdrop-blur-xl hover:shadow-md transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-neutral-100 border border-black/5 group-hover:bg-neutral-200 transition-colors">
                      <div className="text-neutral-700">
                        {getAchievementIcon(achievement.icon)}
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-neutral-100 border border-black/5">
                      {achievement.date}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-black mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm font-medium text-black/50 mb-2">
                      {achievement.category}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-black/50">Reward:</span>
                      <span className="text-sm font-mono font-semibold text-neutral-700">
                        +{achievement.reward} pts
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SectionHeading
            title="Performance Over Time"
            icon={<IconChartLine className="w-5 h-5 text-neutral-500" />}
            className="mb-6"
          />

          <div className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-sm p-6 md:p-8">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

            <ProgressChart
              data={profile.progressData}
              xAxisKey="week"
              lines={[
                { dataKey: "points", name: "Points", color: "#404040", yAxisId: "left" },
                { dataKey: "accuracy", name: "Accuracy %", color: "#737373", yAxisId: "right" },
              ]}
              yAxisLabels={{ left: "Points", right: "Accuracy %" }}
              height={300}
              className="md:h-[400px]"
            />
          </div>
        </motion.div>

        {/* Profitability Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <SectionHeading
            title="Profitability Breakdown"
            icon={<IconCoins className="w-5 h-5 text-neutral-500" />}
            className="mb-6"
          />

          <div className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-sm p-6 md:p-8">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

            <ProgressChart
              data={profile.profitabilityData}
              xAxisKey="month"
              lines={[
                { dataKey: "net", name: "Net Profit", color: "#404040" },
              ]}
              yAxisLabels={{ left: "Net Profit ($)" }}
              height={300}
              className="md:h-[350px]"
            />
          </div>
        </motion.div>

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              label: "Total Bets",
              value: profile.stats.totalBets,
              icon: IconCheck,
            },
            {
              label: "Accuracy",
              value: `${profile.stats.accuracy}%`,
              icon: IconPercentage,
            },
            {
              label: "Total Volume",
              value: `$${profile.stats.totalVolume.toLocaleString()}`,
              icon: IconCoins,
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl bg-white/40 backdrop-blur-xl border border-black/5 p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-neutral-100 border border-black/5">
                  <stat.icon className="w-6 h-6 text-neutral-700" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-black font-mono">
                    {stat.value}
                  </p>
                  <p className="text-xs text-black/50 font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
