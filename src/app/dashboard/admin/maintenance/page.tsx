"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, RefreshCw, Database, Shield, AlertTriangle, CheckCircle, Download, Wrench, Activity } from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import DashboardHeader from "@/components/dashboard/DashboardHeader"

export default function DataMaintenancePage() {
  const router = useRouter()
  const [isRunning, setIsRunning] = useState<string | null>(null)

  const handleRunTask = (taskId: string) => {
    setIsRunning(taskId)
    setTimeout(() => setIsRunning(null), 2000)
  }

  const maintenanceTasks = [
    {
      id: "integrity-check",
      title: "Data Integrity Check",
      description: "Scan for and optionally repair orphaned participants in markets",
      icon: Database,
      color: "blue",
      action: "Run Task"
    },
    {
      id: "fix-threshold",
      title: "Fix Sub-Threshold Markets",
      description: "Repair markets that were settled despite having fewer than required participants",
      icon: AlertTriangle,
      color: "orange",
      action: "Run Task"
    },
    {
      id: "reconciliation",
      title: "Financial Reconciliation",
      description: "Verify all wallet balances and transaction totals match",
      icon: RefreshCw,
      color: "green",
      action: "Run Task"
    },
    {
      id: "health-check",
      title: "Data Health Check",
      description: "Comprehensive system-wide data validation and consistency check",
      icon: Shield,
      color: "purple",
      action: "Run Task"
    },
    {
      id: "audit-chain",
      title: "Verify Audit Chain",
      description: "Check audit log integrity and hash chain continuity",
      icon: Shield, // Using Shield as a lock alternative or similar security icon
      color: "blue",
      action: "Run Task"
    },
    {
      id: "backup",
      title: "Export Backup",
      description: "Download JSON backup of critical entities and audit logs",
      icon: Download,
      color: "neutral",
      action: "Run Task"
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: any = {
      blue: "bg-blue-50 text-blue-700 border-blue-100",
      orange: "bg-orange-50 text-orange-700 border-orange-100",
      green: "bg-green-50 text-green-700 border-green-100",
      purple: "bg-purple-50 text-purple-700 border-purple-100",
      neutral: "bg-neutral-50 text-neutral-700 border-neutral-100"
    }
    return colors[color] || colors.neutral
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        <DashboardHeader
          subtitle="Data repair, integrity checks, and system reconciliation"
        />

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {maintenanceTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DashboardCard className={`p-6 border ${task.color === 'blue' ? 'bg-blue-50/30 border-blue-100' : task.color === 'orange' ? 'bg-orange-50/30 border-orange-100' : task.color === 'green' ? 'bg-green-50/30 border-green-100' : task.color === 'purple' ? 'bg-purple-50/30 border-purple-100' : 'bg-white border-neutral-200'}`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getColorClasses(task.color)}`}>
                    <task.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-neutral-900 mb-1">{task.title}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">{task.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleRunTask(task.id)}
                  disabled={isRunning === task.id}
                  className="w-full py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isRunning === task.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Wrench className="w-4 h-4" />
                      {task.action}
                    </>
                  )}
                </button>
              </DashboardCard>
            </motion.div>
          ))}
        </div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DashboardCard className="p-6 bg-blue-50/50 border-blue-100">
            <h3 className="text-base font-medium text-blue-900 mb-4">Important Notes</h3>
            <ul className="space-y-4">
              {[
                "All destructive actions require confirmation before execution",
                "Concurrent execution is prevented - only one admin can run each task at a time",
                "All maintenance actions are logged to audit logs and system maintenance logs",
                "Backups are exported as JSON files for manual import if needed",
                "Review audit logs after each operation for detailed results"
              ].map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                  {note}
                </li>
              ))}
            </ul>
          </DashboardCard>
        </motion.div>
      </div>
    </div>
  )
}
