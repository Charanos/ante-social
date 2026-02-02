"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Search, Crown, Shield, Activity, ChevronDown, Mail, Calendar, User, Users, TrendingUp, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import DashboardHeader from "@/components/dashboard/DashboardHeader"

// Mock Data
const mockUsers = [
  {
    id: 1,
    name: "Gaby Rusli",
    email: "gabyprusli@gmail.com",
    joinedDate: "November 29th, 2025",
    level: "Novice",
    avatar: null
  },
  {
    id: 2,
    name: "Ryan Goodwin",
    email: "wingoodfool@gmail.com",
    joinedDate: "November 26th, 2025",
    level: "High Roller",
    avatar: null
  },
  {
    id: 3,
    name: "Dennis Munge",
    email: "dennismunge960@gmail.com",
    joinedDate: "November 5th, 2025",
    level: "Novice",
    avatar: null
  },
  {
    id: 4,
    name: "Livia Rusli",
    email: "livia@mycounsely.com",
    joinedDate: "October 15th, 2025",
    level: "High Roller",
    avatar: null
  },
  {
    id: 5,
    name: "Gaby Rusli",
    email: "gaby.rusli.label@gmail.com",
    joinedDate: "October 15th, 2025",
    level: "Novice",
    avatar: null
  }
]

const tabs = [
  { id: "lookup", label: "User Lookup", icon: Search },
  { id: "levels", label: "User Levels", icon: Crown },
  { id: "kyc", label: "KYC Review", icon: Shield },
  { id: "aml", label: "AML & Clusters", icon: Activity },
]

export default function UserManagementPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("levels")
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  const filteredUsers = levelFilter === "all"
    ? mockUsers
    : mockUsers.filter(user => user.level === levelFilter)

  const handleLevelChange = (userId: number, newLevel: string) => {
    console.log(`Changing user ${userId} to ${newLevel}`)
    setOpenDropdown(null)
  }

  const totalUsers = mockUsers.length
  const noviceUsers = mockUsers.filter(u => u.level === "Novice").length
  const highRollerUsers = mockUsers.filter(u => u.level === "High Roller").length

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        {/* Header */}
        <DashboardHeader
          subtitle="User lookup, tier management, KYC review, and fraud detection"
        />

        {/* Main Content Card */}
        <DashboardCard className="overflow-hidden p-0">
          {/* Tabs */}
          <div className="flex items-center border-b border-neutral-100 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap cursor-pointer ${isActive
                    ? "text-neutral-900"
                    : "text-neutral-600 hover:text-neutral-700 hover:bg-neutral-50"
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-neutral-900" : "text-neutral-500"}`} />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900"
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6 min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === "lookup" && (
                <motion.div
                  key="lookup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="max-w-3xl">
                    <h3 className="text-sm font-medium text-neutral-900 mb-4">Search for a user</h3>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="text"
                          placeholder="Enter user ID, email, or username..."
                          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                        />
                      </div>
                      <button className="px-6 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all cursor-pointer">
                        Search
                      </button>
                    </div>
                    <p className="text-xs text-neutral-600 mt-2">Search by user ID, email address, or username to view detailed information</p>
                  </div>
                </motion.div>
              )}

              {activeTab === "levels" && (
                <motion.div
                  key="levels"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-neutral-50 rounded-lg border border-neutral-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-600">Total Users</span>
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center">
                          <Users className="w-4 h-4 text-neutral-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-medium text-neutral-900 font-mono">{totalUsers}</p>
                    </div>

                    <div className="bg-neutral-50 rounded-lg border border-neutral-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-600">Novice</span>
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center">
                          <UserCheck className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-medium text-neutral-900 font-mono">{noviceUsers}</p>
                    </div>

                    <div className="bg-neutral-50 rounded-lg border border-neutral-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-600">High Roller</span>
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center">
                          <Crown className="w-4 h-4 text-amber-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-medium text-neutral-900 font-mono">{highRollerUsers}</p>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="relative">
                      <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 appearance-none cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                      >
                        <option value="all">All Levels</option>
                        <option value="Novice">Novice</option>
                        <option value="High Roller">High Roller</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <span className="text-sm text-neutral-600 font-mono">{filteredUsers.length} users</span>
                  </div>

                  {/* Users List */}
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-neutral-100 to-neutral-200 flex items-center justify-center text-neutral-600 flex-shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-neutral-900">{user.name}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-neutral-600 flex items-center gap-1.5">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </span>
                              <span className="text-xs text-neutral-300">•</span>
                              <span className="text-xs text-neutral-600 flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />
                                Joined {user.joinedDate}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white cursor-pointer hover:bg-neutral-50 transition-all">
                          <span className="text-xs font-medium text-neutral-600">{user.level.toLowerCase()}</span>
                          <div className="h-4 w-px bg-neutral-200"></div>
                          <span className="text-sm font-medium text-neutral-900">{user.level}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-neutral-500 ml-1" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredUsers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-neutral-300" />
                      </div>
                      <h3 className="text-base font-medium text-neutral-900 mb-2">No users found</h3>
                      <p className="text-sm text-neutral-600">Try adjusting your filters</p>
                    </div>
                  )}
                </motion.div>
              )}

              {(activeTab === "kyc" || activeTab === "aml") && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center h-[400px] text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-4">
                    {activeTab === "kyc" ? (
                      <Shield className="w-8 h-8 text-neutral-300" />
                    ) : (
                      <Activity className="w-8 h-8 text-neutral-300" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    {activeTab === "kyc" ? "KYC Review" : "AML & Clusters"}
                  </h3>
                  <p className="text-sm text-neutral-600 max-w-sm">
                    This module is currently under development. Check back later for updates.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}