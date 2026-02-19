"use client";

import { motion } from "framer-motion";
import {
  IconAccessPoint,
  IconArrowLeft,
  IconAward,
  IconBell,
  IconChevronRight,
  IconHome,
} from "@tabler/icons-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MobileHeader } from "./MobileHeader";
import { UserAvatar } from "../ui/UserAvatar";

import { UserProfile } from "@/types/user";
import { EMPTY_USER, useLiveUser, useUnreadNotificationsCount } from "@/lib/live-data";

interface DashboardHeaderProps {
  user?: UserProfile;
  subtitle?: string;
}

export default function DashboardHeader({
  user: initialUser,
  subtitle,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user: liveUser } = useLiveUser();
  const unreadCount = useUnreadNotificationsCount();
  const user = initialUser || liveUser || EMPTY_USER;
  
  // Back button logic: go up one level if possible
  const handleBack = () => {
    const parts = pathname?.split("/").filter(Boolean) || [];
    if (parts.length > 2) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  const isHome = pathname === "/dashboard";
  const title = pathname?.split("/").filter(Boolean).pop() || "Dashboard";

  return (
    <>
      <MobileHeader user={user} />
      
      <div className="hidden md:flex md:items-center justify-between gap-4 px-1 mb-16">
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-6">
          {!isHome && (
            <motion.button
              onClick={handleBack}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white hover:border-black/10 hover:shadow-sm transition-all cursor-pointer group"
            >
              <IconArrowLeft className="w-5 h-5 text-neutral-600 group-hover:-translate-x-0.5 transition-transform" />
            </motion.button>
          )}
          <div className="space-y-0.5">
            <h1 className="text-2xl font-medium tracking-tight text-neutral-900 capitalize leading-none">
              {title}
            </h1>
            <p className="text-sm text-neutral-500 font-medium">
              {subtitle || "Track forecasts, manage wallet, explore markets"}
            </p>
          </div>
        </div>

        {/* Right: Pills & Badges */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Win Streak Badge - Mocked for now as it's not in UserProfile yet, can be added later */}
          <motion.div
              className="flex items-center gap-2 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-full px-3 py-1.5 shadow-sm cursor-pointer hover:shadow-md transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconAccessPoint className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 font-mono tracking-wide uppercase">
                {user.signalAccuracy}%
              </span> <span className="text-xs text-amber-700 font-semibold tracking-wide uppercase">Accuracy</span>
            </motion.div>

          {/* Balance / Tier Pill */}
          <motion.div
            className="flex items-center bg-white/80 backdrop-blur-sm border border-neutral-200/60 rounded-full p-1 pl-4 cursor-pointer hover:bg-white hover:shadow-md transition-all shadow-sm group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 mr-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-semibold font-mono text-neutral-900">
                ${user.balance.toLocaleString()}
              </span>
            </div>
            <div className="bg-neutral-900 text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider group-hover:bg-black transition-colors">
              {user.tier}
            </div>
          </motion.div>

          {/* Reputation Pill */}
           <motion.div
            className="flex items-center bg-white/80 backdrop-blur-sm border border-neutral-200/60 rounded-full p-1 px-3 gap-2 cursor-pointer hover:bg-white hover:shadow-md transition-all shadow-sm group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
             <IconAward className="w-4 h-4 text-purple-600" />
             <span className="text-xs font-mono font-semibold text-purple-900">
                {user.reputationScore} Rep
             </span>
          </motion.div>


          {/* Notifications IconBell */}
          <motion.button
            className="relative flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm border border-neutral-200/60 rounded-full hover:bg-white hover:shadow-md transition-all shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconBell className="w-4 h-4 text-neutral-700" />
            {unreadCount > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-linear-to-br from-red-500 to-red-600 text-white text-[10px] font-semibold font-mono rounded-full border-2 border-white shadow-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          {/* Profile Avatar */}
          <Link href="/dashboard/profile">
            <motion.button
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-neutral-200/60 rounded-full p-1 pr-4 cursor-pointer hover:bg-white hover:shadow-md transition-all shadow-sm group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserAvatar 
                src={user.avatarUrl} 
                name={user.username} 
                size="xs" 
                border={false}
                className="group-hover:scale-105 transition-transform"
              />

              <span className="block text-xs font-semibold text-neutral-700 tracking-wide uppercase">
                {user.username || "Guest"}
              </span>

              <IconChevronRight className="block w-3 h-3 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </Link>
        </div>
      </div>
    </>
  );
}
