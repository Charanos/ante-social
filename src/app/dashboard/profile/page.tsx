"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { IconAward, IconBell, IconCheck, IconChevronRight, IconDeviceFloppy, IconGlobe, IconHash, IconInfoCircle, IconMail, IconSettings, IconShield, IconTrendingUp, IconUser } from '@tabler/icons-react';;


import { mockUser } from "@/lib/mockData";
import { IoWalletOutline } from 'react-icons/io5';

export default function ProfilePage() {
  const [timezone, setTimezone] = useState("Africa/Nairobi");
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const handleSave = () => {
    setToast("IconSettings saved successfully!");
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed right-4 top-4 z-50"
          >
            <div className="flex items-center gap-3 rounded-2xl bg-green-500/90 backdrop-blur-sm px-6 py-2 text-white shadow-lg border border-white/20">
              <IconCheck className="h-5 w-5" />
              <p className="font-semibold text-sm">{toast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <DashboardHeader
        user={mockUser}
        subtitle="Manage your account and preferences"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
        >
          {/* Top border accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <IconUser className="h-5 w-5 text-black/40" />
              <h2 className="text-lg font-semibold text-black/90">
                Personal Information
              </h2>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
              <div className="h-16 w-16 rounded-full bg-linear-to-br from-black/10 to-black/5 flex items-center justify-center text-2xl font-semibold text-black/70 border border-black/10">
                {mockUser.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-semibold text-black/90">
                  {mockUser.full_name}
                </p>
                <p className="text-sm text-black/50 font-medium">
                  @{mockUser.username}
                </p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
              <div className="group p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5 hover:bg-white/60 hover:border-black/10 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-black/5 group-hover:bg-black/10 transition-colors">
                    <IconMail className="h-4 w-4 text-black/60" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-black/90">
                      {mockUser.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5 hover:bg-white/60 hover:border-black/10 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-black/5 group-hover:bg-black/10 transition-colors">
                    <IconHash className="h-4 w-4 text-black/60" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                      IconUser ID
                    </p>
                    <p className="text-sm font-mono font-semibold text-black/90">
                      {mockUser.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status & Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <IconShield className="h-5 w-5 text-black/40" />
              <h2 className="text-lg font-semibold text-black/90">
                Status & Limits
              </h2>
            </div>

            {/* Tier Badge */}
            <div className="relative overflow-hidden p-6 rounded-2xl bg-linear-to-br from-black/5 to-black/10 border border-black/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-black/50 uppercase tracking-wider mb-1">
                    Current Tier
                  </p>
                  <p className="text-2xl font-semibold text-black/90 capitalize">
                    {mockUser.user_level.replace("_", " ")}
                  </p>
                </div>
                {mockUser.user_level === "high_roller" ? (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <IconAward className="h-10 w-10 text-amber-500" />
                  </motion.div>
                ) : (
                  <div className="px-3 py-2 rounded-full bg-black/10 text-xs font-semibold text-black/70 uppercase tracking-wider">
                    Standard
                  </div>
                )}
              </div>
            </div>

            {/* Achievements Link */}
            <Link href="/dashboard/profile/achievements">
              <div className="group flex items-center justify-between p-4 my-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5 hover:bg-white/60 hover:border-black/10 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-black/5 group-hover:bg-black/10 transition-colors">
                    <IconAward className="h-5 w-5 text-black/60" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black/90">
                      Achievements & Rewards
                    </p>
                    <p className="text-xs text-black/50 font-medium">
                      View badges and bonuses
                    </p>
                  </div>
                </div>
                <IconChevronRight className="h-5 w-5 text-black/40 group-hover:text-black/60 transition-colors" />
              </div>
            </Link>

            {/* Daily Limits */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-black/70">
                Daily Transaction Limits
              </p>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                <div className="flex items-center gap-2">
                  <IconTrendingUp className="w-4 h-4 text-black/40" />
                  <span className="text-sm font-semibold text-black/70">
                    Deposits
                  </span>
                </div>
                <span className="font-mono font-semibold text-black/90">
                  {mockUser.user_level === "high_roller" ? "662,250" : "66,225"}{" "}
                  KSH
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                <div className="flex items-center gap-2">
                  <IoWalletOutline className="w-4 h-4 text-black/40" />
                  <span className="text-sm font-semibold text-black/70">
                    Withdrawals
                  </span>
                </div>
                <span className="font-mono font-semibold text-black/90">
                  {mockUser.user_level === "high_roller" ? "132,450" : "33,113"}{" "}
                  KSH
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preferences - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

          <div className="p-6 md:p-8 space-y-8">
            <div className="flex items-center gap-2">
              <IconSettings className="h-5 w-5 text-black/40" />
              <h2 className="text-lg font-semibold text-black/90">
                Preferences
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Timezone */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-black/70">
                  Timezone
                </label>
                <div className="relative">
                  <IconGlobe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 pointer-events-none" />
                  <select
                    className="w-full appearance-none rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 pl-11 pr-4 py-2 text-sm font-semibold text-black/90 focus:border-black/30 focus:bg-white/80 outline-none transition-all cursor-pointer"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="UTC">
                      UTC (Coordinated Universal Time)
                    </option>
                    <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                    <option value="America/New_York">
                      America/New_York (EST)
                    </option>
                    <option value="America/Los_Angeles">
                      America/Los_Angeles (PST)
                    </option>
                  </select>
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-black/70">
                  Notifications
                </label>

                <div className="space-y-3">
                  {/* Email Toggle */}
                  <div
                    className="flex items-center justify-between p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white/80 transition-all cursor-pointer"
                    onClick={() => setEmailNotif(!emailNotif)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg transition-colors ${emailNotif ? "bg-black/10" : "bg-black/5"}`}
                      >
                        <IconMail                           className={`h-4 w-4 ${emailNotif ? "text-black/70" : "text-black/40"}`}
                        />
                      </div>
                      <span className="text-sm font-semibold text-black/90">
                        Email Notifications
                      </span>
                    </div>
                    <div
                      className={`h-6 w-11 rounded-full transition-colors relative ${emailNotif ? "bg-black" : "bg-black/20"}`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${emailNotif ? "left-6" : "left-1"}`}
                      />
                    </div>
                  </div>

                  {/* Push Toggle */}
                  <div
                    className="flex items-center justify-between p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white/80 transition-all cursor-pointer"
                    onClick={() => setPushNotif(!pushNotif)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg transition-colors ${pushNotif ? "bg-black/10" : "bg-black/5"}`}
                      >
                        <IconBell                           className={`h-4 w-4 ${pushNotif ? "text-black/70" : "text-black/40"}`}
                        />
                      </div>
                      <span className="text-sm font-semibold text-black/90">
                        Push Notifications
                      </span>
                    </div>
                    <div
                      className={`h-6 w-11 rounded-full transition-colors relative ${pushNotif ? "bg-black" : "bg-black/20"}`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${pushNotif ? "left-6" : "left-1"}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-black/5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-2 bg-black text-white rounded-xl font-semibold text-sm shadow-lg hover:bg-black/90 transition-colors cursor-pointer"
              >
                <IconCheck className="h-4 w-4" />
                Save Changes
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
