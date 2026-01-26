"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { User, Shield, Settings, Award, Check, Mail, Hash, Globe, Bell, Trophy, ChevronRight } from "lucide-react"
import { mockUser } from "@/lib/mockData"

export default function ProfilePage() {
  const [timezone, setTimezone] = useState("Africa/Nairobi")
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  const handleSave = () => {
    setToast("Settings saved successfully!")
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed right-4 top-4 z-50"
          >
            <div className="flex items-center gap-3 rounded-2xl bg-green-500/90 px-6 py-4 text-white shadow-2xl backdrop-blur-md border border-white/20">
              <Check className="h-5 w-5" />
              <p className="font-medium">{toast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DashboardHeader 
        subtitle="Manage your account and preferences" 
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardCard className="h-full p-0">
            <CardHeader className="border-b border-gray-50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <User className="h-5 w-5 text-gray-400" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-4 rounded-xl bg-gray-50/50 p-4 border border-gray-100">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-2xl font-medium text-blue-600 shadow-inner">
                  {mockUser.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">{mockUser.full_name}</p>
                  <p className="text-sm text-gray-500">@{mockUser.username}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="group rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-blue-100 hover:shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-50 p-2 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</p>
                      <p className="text-sm font-medium text-gray-900">{mockUser.email}</p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-blue-100 hover:shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-50 p-2 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      <Hash className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">User ID</p>
                      <p className="text-sm font-mono font-medium text-gray-900">{mockUser.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </DashboardCard>
        </motion.div>

        {/* Status & Limits */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardCard className="h-full p-0">
            <CardHeader className="border-b border-gray-50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <Shield className="h-5 w-5 text-gray-400" />
                Status & Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-white p-6 border border-purple-100 shadow-sm">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl" />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium text-purple-900/60">Current Tier</p>
                    <p className="mt-1 text-2xl font-medium capitalize text-purple-900">
                      {mockUser.user_level.replace('_', ' ')}
                    </p>
                  </div>
                  {mockUser.user_level === 'high_roller' ? (
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Award className="h-10 w-10 text-yellow-500 drop-shadow-sm" />
                    </motion.div>
                  ) : (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 uppercase tracking-wide">
                      Standard
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 mb-6">
                <Link href="/dashboard/profile/achievements">
                  <div className="group flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4 transition-all hover:bg-amber-100 hover:shadow-md cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-amber-100 p-2 text-amber-600 group-hover:bg-amber-200 transition-colors">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-amber-900">Achievements & Rewards</p>
                        <p className="text-xs font-medium text-amber-700">View badges, progress, and bonuses</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-amber-400 group-hover:text-amber-600 transition-colors" />
                  </div>
                </Link>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900">Daily Transaction Limits</p>
                <div className="flex items-center justify-between rounded-xl bg-green-50/50 p-4 border border-green-100">
                  <span className="text-sm font-medium text-green-900">Deposits</span>
                  <span className="font-mono font-medium text-green-700">
                    {mockUser.user_level === 'high_roller' ? '$5,000' : '$500'}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-red-50/50 p-4 border border-red-100">
                  <span className="text-sm font-medium text-red-900">Withdrawals</span>
                  <span className="font-mono font-medium text-red-700">
                    {mockUser.user_level === 'high_roller' ? '$1,000' : '$250'}
                  </span>
                </div>
              </div>
            </CardContent>
          </DashboardCard>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2"
        >
          <DashboardCard className="border-none bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-0">
            <CardHeader className="border-b border-gray-50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <Settings className="h-5 w-5 text-gray-400" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-8">
                  <label className="block text-sm font-medium text-gray-700">Timezone</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select 
                      className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-10 text-gray-900 font-medium transition-all focus:border-gray-900 focus:bg-white focus:ring-0 outline-none"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <label className="block text-sm font-medium text-gray-700">Notifications</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setEmailNotif(!emailNotif)}>
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 transition-colors ${emailNotif ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                      </div>
                      <div className={`h-6 w-11 rounded-full transition-colors relative ${emailNotif ? 'bg-gray-900' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${emailNotif ? 'left-6' : 'left-1'}`} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setPushNotif(!pushNotif)}>
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 transition-colors ${pushNotif ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                          <Bell className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Push Notifications</span>
                      </div>
                      <div className={`h-6 w-11 rounded-full transition-colors relative ${pushNotif ? 'bg-gray-900' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${pushNotif ? 'left-6' : 'left-1'}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end border-t border-gray-50 pt-6">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="group flex h-11 cursor-pointer items-center gap-2 rounded-full bg-gray-900 px-8 text-white shadow-md transition-all hover:bg-black hover:shadow-lg"
                >
                  <Check className="h-4 w-4" />
                  <span className="font-medium text-sm">Save Changes</span>
                </motion.button>
              </div>
            </CardContent>
          </DashboardCard>
        </motion.div>
      </div>
    </div>
  )
}
