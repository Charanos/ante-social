"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  IconAlertTriangle,
  IconCheck,
  IconDatabase,
  IconDownload,
  IconRefresh,
  IconShield,
  IconTool,
} from "@tabler/icons-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useToast } from "@/components/ui/toast-notification";

type MaintenanceTask = {
  id: string;
  title: string;
  description: string;
  destructive: boolean;
  lastRun?: { timestamp: string; status: string } | null;
};

const FALLBACK_TASKS: MaintenanceTask[] = [
  {
    id: "integrity-check",
    title: "Data Integrity Check",
    description: "Scan market outcome and participant consistency anomalies.",
    destructive: false,
  },
  {
    id: "fix-threshold",
    title: "Fix Sub-Threshold Markets",
    description: "Cancel settled markets that did not meet participation minimums.",
    destructive: true,
  },
  {
    id: "reconciliation",
    title: "Financial Reconciliation",
    description: "Compare wallet balances to transaction ledger totals.",
    destructive: false,
  },
  {
    id: "health-check",
    title: "Data Health Check",
    description: "Run integrity, audit-chain, and stale-transaction checks.",
    destructive: false,
  },
  {
    id: "audit-chain",
    title: "Verify Audit Chain",
    description: "Validate audit sequence continuity and timestamp ordering.",
    destructive: false,
  },
  {
    id: "backup",
    title: "Export Backup",
    description: "Download JSON backup of critical entities and audit logs.",
    destructive: false,
  },
];

const taskIcons: Record<string, any> = {
  "integrity-check": IconDatabase,
  "fix-threshold": IconAlertTriangle,
  reconciliation: IconRefresh,
  "health-check": IconShield,
  "audit-chain": IconCheck,
  backup: IconDownload,
};

const taskColors: Record<string, string> = {
  "integrity-check": "bg-blue-50 text-blue-700 border-blue-100",
  "fix-threshold": "bg-orange-50 text-orange-700 border-orange-100",
  reconciliation: "bg-green-50 text-green-700 border-green-100",
  "health-check": "bg-purple-50 text-purple-700 border-purple-100",
  "audit-chain": "bg-indigo-50 text-indigo-700 border-indigo-100",
  backup: "bg-neutral-50 text-neutral-700 border-neutral-100",
};

function formatTimestamp(value?: string | null) {
  if (!value) return "Never";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Unknown";
  return parsed.toLocaleString();
}

export default function DataMaintenancePage() {
  const toast = useToast();
  const [tasks, setTasks] = useState<MaintenanceTask[]>(FALLBACK_TASKS);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isRunning, setIsRunning] = useState<string | null>(null);
  const [taskResults, setTaskResults] = useState<Record<string, any>>({});

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) => {
        const aDestructive = a.destructive ? 1 : 0;
        const bDestructive = b.destructive ? 1 : 0;
        return aDestructive - bDestructive;
      }),
    [tasks],
  );

  const fetchTasks = async () => {
    setIsLoadingTasks(true);
    try {
      const response = await fetch("/api/admin/maintenance", { cache: "no-store" });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !Array.isArray(payload?.data)) {
        throw new Error(payload?.error || "Failed to fetch maintenance tasks");
      }
      setTasks(payload.data);
    } catch (error: any) {
      setTasks(FALLBACK_TASKS);
      toast.error("Task Sync Failed", error?.message || "Using local fallback task list.");
    } finally {
      setIsLoadingTasks(false);
    }
  };

  useEffect(() => {
    void fetchTasks();
  }, []);

  const handleRunTask = async (task: MaintenanceTask) => {
    if (task.destructive) {
      const confirmed = window.confirm(
        "This task can mutate production data. Continue?",
      );
      if (!confirmed) return;
    }

    setIsRunning(task.id);
    try {
      const response = await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ taskId: task.id }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || payload?.message || "Task execution failed");
      }

      setTaskResults((prev) => ({ ...prev, [task.id]: payload?.result || {} }));
      toast.success("Task Completed", `${task.title} finished successfully.`);

      if (task.id === "backup" && payload?.result) {
        const blob = new Blob([JSON.stringify(payload.result, null, 2)], {
          type: "application/json",
        });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `maintenance-backup-${new Date()
          .toISOString()
          .replace(/[:.]/g, "-")}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);
      }

      await fetchTasks();
    } catch (error: any) {
      toast.error("Task Failed", error?.message || "Unable to run maintenance task.");
    } finally {
      setIsRunning(null);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {sortedTasks.map((task, index) => {
            const Icon = taskIcons[task.id] || IconTool;
            const resultPreview = taskResults[task.id]
              ? JSON.stringify(taskResults[task.id], null, 2).slice(0, 220)
              : null;

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DashboardCard className="p-6 border bg-white border-neutral-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        taskColors[task.id] || taskColors.backup
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-medium text-neutral-900">{task.title}</h3>
                        {task.destructive && (
                          <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full bg-orange-100 text-orange-700">
                            Destructive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed">{task.description}</p>
                      <p className="text-xs text-neutral-500 mt-2">
                        Last run: {formatTimestamp(task.lastRun?.timestamp)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => void handleRunTask(task)}
                    disabled={isLoadingTasks || isRunning === task.id}
                    className="w-full py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isRunning === task.id ? (
                      <>
                        <IconRefresh className="w-4 h-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <IconTool className="w-4 h-4" />
                        Run Task
                      </>
                    )}
                  </button>

                  {resultPreview && (
                    <pre className="mt-4 p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-700 overflow-x-auto whitespace-pre-wrap break-all">
                      {resultPreview}
                    </pre>
                  )}
                </DashboardCard>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DashboardCard className="p-6 bg-blue-50/50 border-blue-100">
            <h3 className="text-base font-medium text-blue-900 mb-4">Operational Notes</h3>
            <ul className="space-y-4">
              {[
                "Destructive maintenance tasks require explicit confirmation before execution.",
                "All maintenance runs are audited under RUN_MAINTENANCE_TASK.",
                "Backup exports are downloaded locally as JSON snapshots.",
                "Re-run health checks after any repair operation.",
                "Use audit logs for post-run diagnostics and change traces.",
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
  );
}
