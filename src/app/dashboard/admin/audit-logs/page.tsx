"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, RefreshCw, Download, Shield, Search, Eye, ChevronDown, User, Wallet, Clock, Database, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { Card, CardContent } from "@/components/ui/card"

// Mock Data
const mockAuditLogs = [
  {
    id: 4,
    eventType: "REFUND",
    actor: "USER",
    timestamp: "Dec 2, 2025 1:04:33 PM",
    description: "Received refund of $20.00 from What's your vibe right now?",
    userId: "68c4f5b78b8c01840e69f208",
    wallet: "58ee625f...",
    amount: "$20.00",
    previousHash: "514e45d153db8b97...",
    currentHash: "0d83bc864b659284..."
  },
  {
    id: 3,
    eventType: "BET PLACEMENT",
    actor: "USER",
    timestamp: "Oct 3, 2025 2:05:12 PM",
    description: "Placed 3 bet(s) of $100.00 each",
    userId: "68d4f1b8210f5449ad003ed8a",
    participant: "68dfdad4...",
    amount: "$300.00",
    previousHash: "858eea78a8928b4d...",
    currentHash: "514e45d153db8b97..."
  },
  {
    id: 2,
    eventType: "DEPOSIT",
    actor: "USER",
    timestamp: "Oct 3, 2025 2:02:41 PM",
    description: "deposit of $1000.00",
    userId: "68c4f14802506f442...",
    transaction: "65dcff61...",
    amount: "$1000.00",
    previousHash: "a7b2c8d9e3f4g5h6...",
    currentHash: "858eea78a8928b4d..."
  },
  {
    id: 1,
    eventType: "USER REGISTRATION",
    actor: "SYSTEM",
    timestamp: "Oct 1, 2025 9:15:00 AM",
    description: "New user registered",
    userId: "68c4f14802506f442",
    email: "user@example.com",
    amount: null,
    previousHash: "0000000000000000...",
    currentHash: "a7b2c8d9e3f4g5h6..."
  }
]

export default function AuditLogsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [eventFilter, setEventFilter] = useState("all")
  const [actorFilter, setActorFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const getEventBadgeStyles = (eventType: string) => {
    switch (eventType) {
      case "REFUND":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "BET PLACEMENT":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "DEPOSIT":
        return "bg-green-50 text-green-700 border-green-200"
      case "USER REGISTRATION":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200"
    }
  }

  const getActorBadgeStyles = (actor: string) => {
    return actor === "USER"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-neutral-100 text-neutral-700 border-neutral-200"
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleExportCSV = () => {
    console.log("Exporting CSV...")
  }

  const handleVerifyIntegrity = () => {
    console.log("Verifying blockchain integrity...")
  }

  const totalLogs = mockAuditLogs.length
  const verifiedLogs = mockAuditLogs.length
  const lastSync = "2 minutes ago"

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        <DashboardHeader
          subtitle="Cryptographically secured audit trail"
        />

        <div className="flex items-center justify-end gap-3 -mt-6 mb-8">
          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleVerifyIntegrity}
            className="px-4 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center gap-2 cursor-pointer transition-all"
          >
            <Shield className="w-4 h-4" />
            Verify Integrity
          </button>
        </div>

        {/* Visual Separator - Overview */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Overview</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {/* Total Logs Card */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Total Logs</p>
                  <p className="mt-2 text-2xl font-medium font-mono text-blue-900">{totalLogs}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verified Logs Card */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Verified</p>
                  <p className="mt-2 text-2xl font-medium font-mono text-green-900">{verifiedLogs}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Sync Card */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">Last Sync</p>
                  <p className="mt-2 text-xl font-medium font-mono text-purple-900">{lastSync}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visual Separator - Filters */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Filters</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardCard className="p-5 mb-10">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>

              <div className="relative">
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 appearance-none cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                >
                  <option value="all">All Events</option>
                  <option value="refund">Refund</option>
                  <option value="bet">Bet Placement</option>
                  <option value="deposit">Deposit</option>
                  <option value="registration">User Registration</option>
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={actorFilter}
                  onChange={(e) => setActorFilter(e.target.value)}
                  className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 appearance-none cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                >
                  <option value="all">All Actors</option>
                  <option value="user">User</option>
                  <option value="system">System</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </DashboardCard>
        </motion.div>

        {/* Visual Separator - Audit Logs */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Audit Logs ({mockAuditLogs.length})</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Audit Logs */}
        <div className="space-y-8">
          {mockAuditLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
            >
              <DashboardCard className="p-0 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-neutral-500">#{log.id}</span>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border uppercase tracking-wide ${getEventBadgeStyles(log.eventType)}`}>
                      {log.eventType}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border uppercase tracking-wide ${getActorBadgeStyles(log.actor)}`}>
                      {log.actor}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-600 font-mono flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {log.timestamp}
                  </span>
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                  <p className="text-sm text-neutral-900 font-medium mb-4">{log.description}</p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                      <User className="w-4 h-4 text-neutral-600 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-neutral-600 font-medium">User ID</p>
                        <p className="text-xs font-mono text-neutral-900 truncate">{log.userId}</p>
                      </div>
                    </div>

                    {log.wallet && (
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                        <Wallet className="w-4 h-4 text-neutral-600 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-neutral-600 font-medium">Wallet</p>
                          <p className="text-xs font-mono text-neutral-900 truncate">{log.wallet}</p>
                        </div>
                      </div>
                    )}

                    {log.amount && (
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-50 border border-green-100">
                        <div className="w-4 h-4 flex items-center justify-center shrink-0">
                          <span className="text-green-600 font-medium text-xs">$</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-green-600 font-medium">Amount</p>
                          <p className="text-xs font-mono text-green-700 font-medium">{log.amount}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hash Information */}
                  <div className="bg-neutral-50 rounded-lg border border-neutral-100 p-4 mb-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="text-xs text-neutral-600 font-medium w-20 shrink-0 pt-0.5">Previous:</span>
                        <span className="text-xs font-mono text-neutral-700 break-all">{log.previousHash}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-xs text-neutral-600 font-medium w-20 shrink-0 pt-0.5">Current:</span>
                        <span className="text-xs font-mono text-neutral-700 break-all">{log.currentHash}</span>
                      </div>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </DashboardCard>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {mockAuditLogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <DashboardCard className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No audit logs found</h3>
              <p className="text-sm text-neutral-600">Audit logs will appear here as events occur in the system</p>
            </DashboardCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}