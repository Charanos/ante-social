"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  IconAccessPoint,
  IconCircleCheckFilled,
  IconCircleX,
  IconClock,
  IconCode,
  IconInfoCircle,
  IconPlayerPlay,
  IconRefresh,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-notification";

type AuditLog = {
  _id?: string;
  action?: string;
  eventType?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
};

type AuditLogResponse = {
  data?: AuditLog[];
};

function formatRelative(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

function formatDateTime(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString();
}

export default function CronMonitorPage() {
  const toast = useToast();

  const {
    data: logsData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<AuditLogResponse>({
    queryKey: ["admin-cron-logs"],
    queryFn: async () => {
      const response = await fetch("/api/admin/audit-logs?limit=500&offset=0", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch audit logs");
      return response.json();
    },
  });

  const executionHistory = useMemo(() => {
    const list = logsData?.data || [];
    return list.slice(0, 30).map((log, index) => {
      const action = String(log.action || log.eventType || "SYSTEM_TASK");
      const statusRaw = String(log.metadata?.status || "");
      const isFailed = action.toLowerCase().includes("fail") || statusRaw.toLowerCase() === "failed";
      const isRunning = statusRaw.toLowerCase() === "running";
      const status = isRunning ? "running" : isFailed ? "failed" : "success";
      const durationMs = Number(log.metadata?.durationMs || 0);
      return {
        id: log._id || `${index}`,
        job: action,
        timestamp: log.timestamp,
        status,
        duration: durationMs > 0 ? `${(durationMs / 1000).toFixed(2)}s` : "N/A",
      };
    });
  }, [logsData?.data]);

  const jobs = useMemo(() => {
    const grouped = new Map<
      string,
      {
        name: string;
        count: number;
        lastRun?: string;
        status: string;
        duration: string;
      }
    >();

    executionHistory.forEach((entry) => {
      if (!grouped.has(entry.job)) {
        grouped.set(entry.job, {
          name: entry.job,
          count: 0,
          lastRun: entry.timestamp,
          status: entry.status,
          duration: entry.duration,
        });
      }
      const current = grouped.get(entry.job)!;
      current.count += 1;
      if (!current.lastRun || (entry.timestamp && new Date(entry.timestamp).getTime() > new Date(current.lastRun).getTime())) {
        current.lastRun = entry.timestamp;
        current.status = entry.status;
        current.duration = entry.duration;
      }
    });

    return Array.from(grouped.values()).slice(0, 8).map((job) => ({
      id: job.name,
      name: job.name,
      schedule: "N/A (event-driven)",
      lastRun: formatRelative(job.lastRun),
      nextRun: "on trigger",
      status: job.status,
      duration: job.duration,
      description: `Observed ${job.count} execution event(s) in recent logs`,
    }));
  }, [executionHistory]);

  const totalRuns = executionHistory.length;
  const successfulRuns = executionHistory.filter((entry) => entry.status === "success").length;
  const failedRuns = executionHistory.filter((entry) => entry.status === "failed").length;
  const durationSamples = executionHistory
    .map((entry) => Number(entry.duration.replace("s", "")))
    .filter((value) => Number.isFinite(value) && value > 0);
  const avgDuration =
    durationSamples.length > 0
      ? `${(durationSamples.reduce((sum, value) => sum + value, 0) / durationSamples.length).toFixed(2)}s`
      : "N/A";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "running":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-neutral-600 bg-neutral-50 border-neutral-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <IconCircleCheckFilled className="w-4 h-4" />;
      case "failed":
        return <IconCircleX className="w-4 h-4" />;
      case "running":
        return <IconAccessPoint className="w-4 h-4 animate-pulse" />;
      default:
        return <IconClock className="w-4 h-4" />;
    }
  };

  const handleRefresh = async () => {
    await refetch();
    toast.success("Refreshed", "Execution logs reloaded");
  };

  const handleTriggerNow = () => {
    toast.info("Trigger unavailable", "No manual cron trigger endpoint is configured");
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        <DashboardHeader subtitle="Automated task execution and health monitoring" />

        <div className="flex items-center justify-end gap-3 -mt-6 mb-8">
          <button
            onClick={() => void handleRefresh()}
            className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-all"
          >
            <IconRefresh className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleTriggerNow}
            className="px-4 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center gap-2 cursor-pointer transition-all"
          >
            <IconPlayerPlay className="w-4 h-4" />
            Trigger Now
          </button>
        </div>

        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Overview (24h)</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
        >
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Total Runs (24h)</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-blue-900">{totalRuns}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconAccessPoint className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Successful</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-green-900">{successfulRuns}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconCircleCheckFilled className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-linear-to-br from-red-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-100/50 blur-2xl transition-all group-hover:bg-red-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-900/60">Failed</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-red-900">{failedRuns}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconCircleX className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">Avg Duration</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-purple-900">{avgDuration}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconClock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Current Job Status</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="grid gap-4">
            {jobs.map((job) => (
              <DashboardCard key={job.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-medium text-neutral-900">{job.name}</h3>
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(job.status)} flex items-center gap-1.5`}
                      >
                        {getStatusIcon(job.status)}
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">{job.description}</p>

                    <div className="flex items-center gap-6 text-xs">
                      <div className="flex items-center gap-2">
                        <IconCode className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-neutral-600 font-medium">Schedule:</span>
                        <span className="font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">{job.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconClock className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-neutral-600 font-medium">Last run:</span>
                        <span className="font-mono text-neutral-700">{job.lastRun}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconTrendingUp className="w-3.5 h-3.5 text-neutral-500" />
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
            {jobs.length === 0 && (
              <DashboardCard className="p-6 text-sm text-neutral-500">No execution activity found.</DashboardCard>
            )}
          </div>
        </motion.div>

        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Execution History</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

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
                  {executionHistory.map((execution) => (
                    <tr key={execution.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900">{execution.job}</td>
                      <td className="px-6 py-4 text-sm font-mono text-neutral-600">{formatDateTime(execution.timestamp)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(execution.status)}`}
                        >
                          {getStatusIcon(execution.status)}
                          {execution.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-neutral-700 font-medium">{execution.duration}</td>
                    </tr>
                  ))}
                  {executionHistory.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-sm text-neutral-500 text-center">
                        No execution records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardCard className="p-6 bg-blue-50/30 border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <IconInfoCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-neutral-900 mb-2">Cron Setup Instructions</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Configure scheduled triggers in your hosting provider or queue worker to drive recurring tasks.
                </p>

                <div className="space-y-8">
                  <div>
                    <p className="text-sm font-medium text-neutral-900 mb-2">Option 1: Vercel Cron (Recommended)</p>
                    <p className="text-xs text-neutral-600 mb-2">Add to vercel.json:</p>
                    <div className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-neutral-100 font-mono">{`{
  "crons": [{
    "path": "/functions/cronOrchestrator",
    "schedule": "*/5 * * * *"
  }]
}`}</pre>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-neutral-900 mb-2">Option 2: External Service</p>
                    <p className="text-xs text-neutral-600 mb-2">Use a service like cron-job.org to ping:</p>
                    <div className="bg-neutral-900 rounded-lg p-4">
                      <pre className="text-xs text-neutral-100 font-mono">{`POST https://yourdomain.com/api/cron
Authorization: Bearer YOUR_SECRET_TOKEN`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </motion.div>
      </div>
    </div>
  );
}

