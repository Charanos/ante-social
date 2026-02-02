"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, RefreshCw, Play, Activity, CheckCircle, XCircle, Clock, TrendingUp, Code, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { Card, CardContent } from "@/components/ui/card"

// Mock Data
const mockCronJobs = [
  {
    id: 1,
    name: "Market Settlement",
    schedule: "*/15 * * * *",
    lastRun: "2 minutes ago",
    nextRun: "in 13 minutes",
    status: "success",
    duration: "1.2s",
    description: "Settles completed markets and distributes rewards"
  },
  {
    id: 2,
    name: "User Notifications",
    schedule: "*/5 * * * *",
    lastRun: "4 minutes ago",
    nextRun: "in 1 minute",
    status: "success",
    duration: "0.8s",
    description: "Sends pending notifications to users"
  },
  {
    id: 3,
    name: "Market Cleanup",
    schedule: "0 */6 * * *",
    lastRun: "3 hours ago",
    nextRun: "in 3 hours",
    status: "running",
    duration: "—",
    description: "Archives old markets and cleans up expired data"
  }
]

const mockExecutionHistory = [
  { id: 1, job: "Market Settlement", timestamp: "Dec 2, 2025 3:01 PM", status: "success", duration: "1.2s" },
  { id: 2, job: "User Notifications", timestamp: "Dec 2, 2025 2:59 PM", status: "success", duration: "0.7s" },
  { id: 3, job: "Market Settlement", timestamp: "Dec 2, 2025 2:46 PM", status: "success", duration: "1.1s" },
  { id: 4, job: "User Notifications", timestamp: "Dec 2, 2025 2:54 PM", status: "failed", duration: "0.3s" },
  { id: 5, job: "Market Cleanup", timestamp: "Dec 2, 2025 12:00 PM", status: "success", duration: "2.5s" }
]

export default function CronMonitorPage() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleTriggerNow = () => {
    console.log("Triggering cron jobs manually...")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200"
      case "failed":
        return "text-red-600 bg-red-50 border-red-200"
      case "running":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-neutral-600 bg-neutral-50 border-neutral-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4" />
      case "failed":
        return <XCircle className="w-4 h-4" />
      case "running":
        return <Activity className="w-4 h-4 animate-pulse" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const totalRuns = 145
  const successfulRuns = 142
  const failedRuns = 3
  const avgDuration = "1.2s"

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        {/* Header */}
        <DashboardHeader
          subtitle="Automated task execution and health monitoring"
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
            onClick={handleTriggerNow}
            className="px-4 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center gap-2 cursor-pointer transition-all"
          >
            <Play className="w-4 h-4" />
            Trigger Now
          </button>
        </div>

        {/* Visual Separator - Overview */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Overview (24h)</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
        >
          {/* Total Runs Card */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Total Runs (24h)</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-blue-900">{totalRuns}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Successful Runs Card */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Successful</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-green-900">{successfulRuns}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Failed Runs Card */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-red-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-100/50 blur-2xl transition-all group-hover:bg-red-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-900/60">Failed</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-red-900">{failedRuns}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avg Duration Card */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">Avg Duration</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-purple-900">{avgDuration}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visual Separator - Current Jobs */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Current Job Status</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Current Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="grid gap-4">
            {mockCronJobs.map((job, index) => (
              <DashboardCard key={job.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-medium text-neutral-900">{job.name}</h3>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(job.status)} flex items-center gap-1.5`}>
                        {getStatusIcon(job.status)}
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">{job.description}</p>

                    <div className="flex items-center gap-6 text-xs">
                      <div className="flex items-center gap-2">
                        <Code className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-neutral-600 font-medium">Schedule:</span>
                        <span className="font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">{job.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-neutral-600 font-medium">Last run:</span>
                        <span className="font-mono text-neutral-700">{job.lastRun}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-neutral-600 font-medium">Next run:</span>
                        <span className="font-mono text-neutral-700">{job.nextRun}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-600 font-medium">Duration:</span>
                        <span className="font-mono text-neutral-700 font-medium">{job.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            ))}
          </div>
        </motion.div>

        {/* Visual Separator - Execution History */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Execution History</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {/* Execution History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <DashboardCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Job Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {mockExecutionHistory.map((execution) => (
                    <tr key={execution.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900">{execution.job}</td>
                      <td className="px-6 py-4 text-sm font-mono text-neutral-600">{execution.timestamp}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(execution.status)}`}>
                          {getStatusIcon(execution.status)}
                          {execution.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-neutral-700 font-medium">{execution.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </motion.div>

        {/* Setup Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardCard className="p-6 bg-blue-50/30 border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-neutral-900 mb-2">Cron Setup Instructions</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  To ensure automated tasks run consistently, set up a cron trigger:
                </p>

                <div className="space-y-8">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 mb-2">Option 1: Vercel Cron (Recommended)</p>
                    <p className="text-xs text-neutral-600 mb-2">Add to vercel.json:</p>
                    <div className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-neutral-100 font-mono">
                        {`{
  "crons": [{
    "path": "/functions/cronOrchestrator",
    "schedule": "*/5 * * * *"
  }]
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-neutral-900 mb-2">Option 2: External Service</p>
                    <p className="text-xs text-neutral-600 mb-2">Use a service like cron-job.org to ping:</p>
                    <div className="bg-neutral-900 rounded-lg p-4">
                      <pre className="text-xs text-neutral-100 font-mono">
                        {`POST https://yourdomain.com/api/cron
Authorization: Bearer YOUR_SECRET_TOKEN`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </motion.div>
      </div>
    </div>
  )
}
