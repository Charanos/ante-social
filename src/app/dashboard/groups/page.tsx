"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { Users, Plus, TrendingUp, Calendar, Activity, X } from "lucide-react"
import { mockGroups } from "@/lib/mockData"

export default function GroupsPage() {
  const [groups, setGroups] = useState(mockGroups)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDesc, setNewGroupDesc] = useState("")

  const handleCreateGroup = () => {
    const newGroup = {
      id: `group${groups.length + 1}`,
      name: newGroupName,
      description: newGroupDesc,
      avatar_url: null,
      member_count: 1,
      created_at: new Date(),
      active_bets: 0
    }
    setGroups([...groups, newGroup])
    setIsCreateModalOpen(false)
    setNewGroupName("")
    setNewGroupDesc("")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <div className="space-y-10">
      <DashboardHeader
        user={{ username: "HighRoller" }}
        subtitle="Join communities and create private betting markets"
      />

      <div className="flex justify-end  z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="group flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-gray-900 px-4 text-white shadow-sm transition-all hover:bg-black"
        >
          <Plus className="h-4 w-4" />
          <span className="font-medium text-sm">Create Group</span>
        </motion.button>
      </div>

      {/* Visual Separator - Overview */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Overview</h2>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 md:grid-cols-3"
      >
        {/* Total Groups - Blue */}
        <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900/60">My Groups</p>
                <p className="mt-2 text-3xl font-medium numeric text-blue-900">{groups.length}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Bets - Green */}
        <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900/60">Active Bets</p>
                <p className="mt-2 text-3xl font-medium numeric text-green-900">{groups.reduce((sum, g) => sum + g.active_bets, 0)}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Members - Purple */}
        <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900/60">Total Members</p>
                <p className="mt-2 text-3xl font-medium numeric text-purple-900">{groups.reduce((sum, g) => sum + g.member_count, 0)}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Visual Separator - Your Groups */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Your Groups</h2>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
      </div>

      {/* Groups Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {groups.map((group) => (
          <motion.div key={group.id} variants={item}>
            <Link href={`/dashboard/groups/${group.id}`}>
              <div className="group h-full cursor-pointer relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 hover:border-black/10 hover:bg-white/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)] transition-all duration-500">
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent opacity-50" />

                <div className="p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-xl font-semibold text-white shadow-md group-hover:scale-110 transition-transform duration-500">
                        {group.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-black/90 group-hover:text-black transition-colors">
                          {group.name}
                        </h3>
                        <p className="text-xs font-medium text-black/40 mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Created {new Date(group.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-black/60 font-medium leading-relaxed line-clamp-2 min-h-10">
                    {group.description}
                  </p>

                  <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-black/10" />
                        ))}
                      </div>
                      <span className="font-semibold text-black/70 ml-1">{group.member_count}</span>
                      <span className="text-black/40 text-xs font-semibold uppercase tracking-wider">members</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-green-700">
                        {group.active_bets} Live
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-0 shadow-2xl"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Create New Group</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-full p-1 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Group Name</label>
                  <input
                    type="text"
                    placeholder="e.g., High Rollers Club"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-gray-900 font-medium placeholder:text-gray-400 outline-none transition-all focus:border-gray-900 focus:bg-white focus:ring-0"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    placeholder="What's the group about?"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-gray-900 font-medium placeholder:text-gray-400 outline-none transition-all focus:border-gray-900 focus:bg-white focus:ring-0 resize-none"
                    rows={3}
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 cursor-pointer rounded-full border border-gray-200 bg-white py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateGroup}
                    disabled={!newGroupName.trim()}
                    className="flex-1 cursor-pointer rounded-full bg-gray-900 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-black hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Group
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
