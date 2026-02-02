"use client";

import { motion } from "framer-motion";
import { Bell, Trophy, ChevronRight, TrendingUp, Zap, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardHeaderProps {
  user?: {
    username?: string | null;
    image?: string | null;
    balance?: number; // Optional if we want to pass it
  };
  subtitle?: string;
}

export default function DashboardHeader({ user, subtitle }: DashboardHeaderProps) {
  const pathname = usePathname();
  // Generate breadcrumbs from pathname, e.g., /dashboard/markets -> Dashboard > Markets
  const paths = pathname?.split('/').filter(Boolean) || [];

  // Mock data for things not in session yet
  const stats = {
    balance: 1659.00, // This could come from a prop or context
    currency: "USD",
    tier: "high_roller",
    unreadNotifications: 2,
    activeMarkets: 12,
    winStreak: 3
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 mb-14">

      {/* Left: Breadcrumbs & Title */}
      <div className="space-y-1">
        <nav className="flex items-center gap-1 text-xs text-neutral-600 font-medium mb-1">
          <Link href="/" className="hover:text-neutral-900 transition-colors"><Home className="w-3 h-3" /></Link>
          {paths.map((path, idx) => (
            <div key={path} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-neutral-500" />
              <Link
                href={`/${paths.slice(0, idx + 1).join('/')}`}
                className={`capitalize text-2xl hover:text-neutral-900 transition-colors ${idx === paths.length - 1 ? "text-neutral-900 font-semibold" : ""}`}
              >
                {path}
              </Link>
            </div>
          ))}
        </nav>
        <p className="text-md text-neutral-600 font-medium hidden md:block">
          {subtitle || "Track bets, manage wallet, explore markets"}
        </p>
      </div>

      {/* Right: Pills & Badges */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">

        {/* Win Streak Badge */}
        {stats.winStreak > 0 && (
          <motion.div
            className="hidden lg:flex items-center gap-2 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-full px-3 py-1.5 shadow-sm cursor-pointer hover:shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700 tracking-wide uppercase">
              {stats.winStreak}x Streak
            </span>
          </motion.div>
        )}

        {/* Balance / Cashier Pill */}
        <motion.div
          className="flex items-center bg-white/80 backdrop-blur-sm border border-neutral-200/60 rounded-full p-1 pl-4 cursor-pointer hover:bg-white hover:shadow-md transition-all shadow-sm group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2 mr-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold font-mono text-neutral-900">
              ${stats.balance.toLocaleString()}
            </span>
          </div>
          <div className="bg-neutral-900 text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider group-hover:bg-black transition-colors">
            Novice
          </div>
        </motion.div>

        {/* Notifications Bell */}
        <motion.button
          className="relative flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm border border-neutral-200/60 rounded-full hover:bg-white hover:shadow-md transition-all shadow-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-4 h-4 text-neutral-700" />

          {/* Notification Badge */}
          {stats.unreadNotifications > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-linear-to-br from-red-500 to-red-600 text-white text-[10px] font-semibold font-mono rounded-full border-2 border-white shadow-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {stats.unreadNotifications > 9 ? '9+' : stats.unreadNotifications}
            </motion.span>
          )}
        </motion.button>

        {/* Profile Avatar */}
        <motion.button
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-neutral-200/60 rounded-full p-1 pr-3 cursor-pointer hover:bg-white hover:shadow-md transition-all shadow-sm group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Avatar */}
          <div className="relative w-6 h-6 rounded-full bg-linear-to-br from-neutral-900 to-neutral-700 flex items-center justify-center text-white text-sm font-semibold overflow-hidden border-2 border-white shadow-sm">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.username || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <span>{(user?.username || "G").charAt(0).toUpperCase()}</span>
            )}

            {/* Tier Badge Indicator */}
            {stats.tier === "high_roller" && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-linear-to-br from-amber-400 to-amber-600 rounded-full border-2 border-white flex items-center justify-center">
                <Trophy className="w-2 h-2 text-white" />
              </div>
            )}
          </div>

          {/* Username */}
          <span className="hidden sm:block text-xs font-semibold text-neutral-700 tracking-wide uppercase">
            {user?.username || "Guest"}
          </span>

          <ChevronRight className="w-3 h-3 text-neutral-500" />
        </motion.button>
      </div>
    </div>
  );
}
