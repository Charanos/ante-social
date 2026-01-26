"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Calendar, Lock, Unlock, Zap, Gift, Sparkles, Star, Medal, AlertCircle, Clock, Users, DollarSign, Target } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { mockAchievements } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'beginner': return <Star className="w-4 h-4" />;
      case 'time based': return <Clock className="w-4 h-4" />;
      case 'bad luck': return <AlertCircle className="w-4 h-4" />;
      case 'wheel': return <Sparkles className="w-4 h-4" />;
      case 'performance': return <Trophy className="w-4 h-4" />;
      case 'prestige': return <Medal className="w-4 h-4" />;
      case 'risk': return <Zap className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <DashboardHeader 
        subtitle="View badges, progress, and bonuses" 
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* MP Balance - Green */}
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900/60">MP Balance</p>
                <p className="mt-2 text-3xl font-medium font-mono text-green-900">{mockAchievements.stats.balance}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Unlocked - Amber */}
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-amber-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-100/50 blur-2xl transition-all group-hover:bg-amber-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-900/60">Unlocked</p>
                <p className="mt-2 text-3xl font-medium font-mono text-amber-900">{mockAchievements.stats.unlocked}/{mockAchievements.stats.total}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* MP Earned - Blue */}
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900/60">MP Earned</p>
                <p className="mt-2 text-3xl font-medium font-mono text-blue-900">{mockAchievements.stats.earned}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <Gift className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Day Streak - Purple */}
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900/60">Day Streak</p>
                <p className="mt-2 text-3xl font-medium font-mono text-purple-900">{mockAchievements.stats.streak}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Bonus */}
      <DashboardCard className="p-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 w-full grid grid-cols-7 gap-2 md:gap-4">
            {mockAchievements.dailyBonus.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all
                  ${day.claimed 
                    ? "bg-amber-100 border-amber-200 text-amber-700" 
                    : day.day === 1 // Assuming day 1 is today for visual similarity to screenshot
                      ? "bg-amber-500 border-amber-500 text-white shadow-lg scale-110"
                      : "bg-neutral-50 border-neutral-100 text-neutral-400"
                  }`}
                >
                  {day.claimed ? <CheckIcon /> : day.day}
                </div>
                <span className={`text-xs font-medium ${day.claimed || day.day === 1 ? "text-amber-600" : "text-neutral-400"}`}>
                  +{day.reward}
                </span>
              </div>
            ))}
          </div>
          <Button className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-medium px-8 py-6 rounded-xl shadow-lg shadow-amber-200 cursor-pointer">
            <Gift className="w-5 h-5 mr-2" />
            Claim Daily Bonus
          </Button>
        </div>
      </DashboardCard>

      {/* Spin the Wheel Banner */}
      <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-medium py-6 text-lg rounded-2xl shadow-lg shadow-amber-200/50 cursor-pointer flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5" />
        Spin the Wheel
      </Button>

      {/* In Progress */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-neutral-900 font-medium text-lg">
          <Target className="w-5 h-5" />
          <h3>In Progress</h3>
        </div>
        <div className="grid gap-5">
          {mockAchievements.inProgress.map((item) => (
            <DashboardCard key={item.title} className="p-6">
              <div className="space-y-8">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-black text-base leading-tight">{item.title}</h4>
                    <p className="text-sm text-neutral-500 mt-2 leading-relaxed">{item.description}</p>
                  </div>
                  <span className="text-green-600 font-medium font-mono text-sm whitespace-nowrap">+{item.reward} MP</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black rounded-full transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="text-xs font-medium text-neutral-400">{item.progress}%</div>
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>
      </div>

      {/* Unlocked */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-neutral-900 font-medium text-lg">
          <Trophy className="w-5 h-5" />
          <h3>Unlocked ({mockAchievements.unlocked.length})</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {mockAchievements.unlocked.map((item) => (
            <DashboardCard key={item.title} className="p-6 border-amber-200 bg-amber-50/30">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <h4 className="font-medium text-black text-base">{item.title}</h4>
                  <p className="text-xs text-neutral-500 mt-1">{item.description}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-white text-black text-xs font-medium px-2 py-1 rounded-md shadow-sm">+{item.reward} MP</span>
                  <span className="text-xs font-medium text-neutral-400">{item.category}</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium">Unlocked {item.date}</span>
              </div>
            </DashboardCard>
          ))}
        </div>
      </div>

      {/* Locked */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-neutral-900 font-medium text-lg">
          <Lock className="w-5 h-5" />
          <h3>Locked ({mockAchievements.locked.length})</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {mockAchievements.locked.map((item) => (
            <DashboardCard key={item.title} className="p-6 opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 mb-4">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="mb-4 min-h-[60px] flex flex-col justify-start">
                  <h4 className="font-medium text-neutral-700 text-base leading-tight">{item.title}</h4>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed line-clamp-2">{item.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-neutral-100 text-neutral-600 text-xs font-medium px-3 py-1.5 rounded-lg">+{item.reward} MP</span>
                  <span className="text-xs font-medium text-neutral-400">{item.category}</span>
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
