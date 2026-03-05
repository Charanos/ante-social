"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  IconChevronDown,
  IconCircleCheckFilled,
  IconClock,
  IconDatabase,
  IconDownload,
  IconEye,
  IconRefresh,
  IconSearch,
  IconShield,
  IconUser,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-notification";
import { useCurrency } from "@/lib/utils/currency";

type AuditLog = {
  _id?: string;
  sequenceNumber?: number;
  eventType?: string;
  actorType?: string;
  actorId?: string;
  action?: string;
  timestamp?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  amountCents?: number;
  previousHash?: string;
  currentHash?: string;
  verificationStatus?: string;
};

type AuditLogResponse = {
  data?: AuditLog[];
  meta?: { total?: number };
};

function formatTime(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString();
}

function shortValue(value: unknown) {
  if (value === undefined || value === null) return "-";
  const text = String(value);
  if (text.length <= 24) return text;
  return `${text.slice(0, 20)}...`;
}

function amountLabel(log: AuditLog, formatCurrency: any) {
  if (typeof log.amountCents === "number") {
    return formatCurrency(log.amountCents / 100, "KSH");
  }
  const amount = log.metadata?.amount;
  if (typeof amount === "number") return formatCurrency(amount, "KSH");
  if (typeof amount === "string") return amount;
  return null;
}

export default function AuditLogsPage() {
  const { formatCurrency, symbol } = useCurrency();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [actorFilter, setActorFilter] = useState("all");

  const { data, isLoading, refetch, isFetching } = useQuery<AuditLogResponse>({
    queryKey: ["admin-audit-logs"],
    queryFn: async () => {
      const response = await fetch("/api/admin/audit-logs?limit=200&offset=0", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load audit logs");
      return response.json();
    },
  });

  const logs = useMemo(() => {
    const raw = data?.data || [];
    return raw.filter((log) => {
      const event = String(log.action || log.eventType || "");
      const actor = String(log.actorType || "");
      const searchTarget = `${event} ${actor} ${log.entityType || ""} ${log.entityId || ""}`.toLowerCase();

      const searchMatch = !searchQuery || searchTarget.includes(searchQuery.toLowerCase());
      const eventMatch = eventFilter === "all" || event.toLowerCase().includes(eventFilter.toLowerCase());
      const actorMatch = actorFilter === "all" || actor.toLowerCase() === actorFilter.toLowerCase();
      return searchMatch && eventMatch && actorMatch;
    });
  }, [actorFilter, data?.data, eventFilter, searchQuery]);

  const totalLogs = data?.meta?.total ?? data?.data?.length ?? 0;
  const verifiedLogs = (data?.data || []).filter((log) => log.verificationStatus === "verified").length;
  const lastSync = logs[0]?.timestamp ? formatTime(logs[0].timestamp) : "N/A";

  const eventOptions = useMemo(() => {
    const set = new Set<string>();
    (data?.data || []).forEach((log) => {
      const action = String(log.action || log.eventType || "").trim();
      if (action) set.add(action);
    });
    return Array.from(set).slice(0, 12);
  }, [data?.data]);

  const handleRefresh = async () => {
    await refetch();
    toast.success("Refreshed", "Audit logs reloaded");
  };

  const handleExportCSV = () => {
    const rows = logs.map((log) => [
      log.sequenceNumber ?? "",
      log.action || log.eventType || "",
      log.actorType || "",
      log.entityType || "",
      log.entityId || "",
      log.timestamp || "",
      amountLabel(log, formatCurrency) || "",
      log.verificationStatus || "",
    ]);

    const csv = [
      ["sequence", "action", "actor", "entity_type", "entity_id", "timestamp", "amount", "verification_status"].join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const safe = String(cell).replaceAll('"', '""');
            return `"${safe}"`;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported", "CSV export started");
  };

  const handleVerifyIntegrity = () => {
    const tamperedCount = (data?.data || []).filter((log) => log.verificationStatus === "tampered").length;
    if (tamperedCount > 0) {
      toast.info("Integrity warning", `${tamperedCount} log(s) marked tampered`);
      return;
    }
    toast.success("Integrity check", "No tampered logs found in current window");
  };

  const getEventBadgeStyles = (eventType: string) => {
    const normalized = eventType.toLowerCase();
    if (normalized.includes("withdrawal") || normalized.includes("reject")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (normalized.includes("approve") || normalized.includes("create")) {
      return "bg-green-50 text-green-700 border-green-200";
    }
    if (normalized.includes("ban") || normalized.includes("freeze")) {
      return "bg-red-50 text-red-700 border-red-200";
    }
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  const getActorBadgeStyles = (actor: string) => {
    return actor.toLowerCase() === "admin"
      ? "bg-purple-50 text-purple-700 border-purple-200"
      : actor.toLowerCase() === "system"
        ? "bg-neutral-100 text-neutral-700 border-neutral-200"
        : "bg-blue-50 text-blue-700 border-blue-200";
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        <div className="flex items-center justify-end gap-3 -mt-6 mb-8">
          <button
            onClick={() => void handleRefresh()}
            className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-all"
          >
            <IconRefresh className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-all"
          >
            <IconDownload className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleVerifyIntegrity}
            className="px-4 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center gap-2 cursor-pointer transition-all"
          >
            <IconShield className="w-4 h-4" />
            Verify Integrity
          </button>
        </div>

        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Overview</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Total Logs</p>
                  <p className="mt-2 text-2xl font-medium font-mono text-blue-900">{totalLogs}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconDatabase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Verified</p>
                  <p className="mt-2 text-2xl font-medium font-mono text-green-900">{verifiedLogs}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconCircleCheckFilled className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">Last Sync</p>
                  <p className="mt-2 text-sm font-medium font-mono text-purple-900">{lastSync}</p>
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
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Filters</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <DashboardCard className="p-5 mb-10">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
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
                  {eventOptions.map((event) => (
                    <option key={event} value={event.toLowerCase()}>
                      {event}
                    </option>
                  ))}
                </select>
                <IconChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={actorFilter}
                  onChange={(e) => setActorFilter(e.target.value)}
                  className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 appearance-none cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                >
                  <option value="all">All Actors</option>
                  <option value="admin">Admin</option>
                  <option value="system">System</option>
                  <option value="user">User</option>
                </select>
                <IconChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </DashboardCard>
        </motion.div>

        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Audit Logs ({logs.length})
          </h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        {isLoading ? (
          <DashboardCard className="p-8 text-sm text-neutral-500">Loading audit logs...</DashboardCard>
        ) : (
          <div className="space-y-8">
            {logs.map((log, index) => {
              const event = String(log.action || log.eventType || "EVENT");
              const actor = String(log.actorType || "system");
              const amount = amountLabel(log, formatCurrency);
              return (
                <motion.div
                  key={log._id || `${log.sequenceNumber}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.03 }}
                >
                  <DashboardCard className="p-0 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-neutral-500">#{log.sequenceNumber || index + 1}</span>
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full border uppercase tracking-wide ${getEventBadgeStyles(event)}`}
                        >
                          {event}
                        </span>
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full border uppercase tracking-wide ${getActorBadgeStyles(actor)}`}
                        >
                          {actor}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-600 font-mono flex items-center gap-1.5">
                        <IconClock className="w-3.5 h-3.5" />
                        {formatTime(log.timestamp)}
                      </span>
                    </div>

                    <div className="px-6 py-5">
                      <p className="text-sm text-neutral-900 font-medium mb-4">
                        {event} on {log.entityType || "entity"}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                          <IconUser className="w-4 h-4 text-neutral-600 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-neutral-600 font-medium">Actor</p>
                            <p className="text-xs font-mono text-neutral-900 truncate">{shortValue(log.actorId)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                          <div className="w-4 h-4 flex items-center justify-center shrink-0">
                            <span className="text-neutral-600 font-medium text-xs">#</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-neutral-600 font-medium">Entity</p>
                            <p className="text-xs font-mono text-neutral-900 truncate">{shortValue(log.entityId)}</p>
                          </div>
                        </div>

                        {amount && (
                          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-50 border border-green-100">
                            <div className="w-4 h-4 flex items-center justify-center shrink-0">
                              <span className="text-green-600 font-medium text-xs">{symbol}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-green-600 font-medium">Amount</p>
                              <p className="text-xs font-mono text-green-700 font-medium">{amount}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-neutral-50 rounded-lg border border-neutral-100 p-4 mb-4">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <span className="text-xs text-neutral-600 font-medium w-20 shrink-0 pt-0.5">Previous:</span>
                            <span className="text-xs font-mono text-neutral-700 break-all">
                              {log.previousHash || "-"}
                            </span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-xs text-neutral-600 font-medium w-20 shrink-0 pt-0.5">Current:</span>
                            <span className="text-xs font-mono text-neutral-700 break-all">
                              {log.currentHash || "-"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer">
                        <IconEye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </DashboardCard>
                </motion.div>
              );
            })}

            {logs.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DashboardCard className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                    <IconShield className="w-8 h-8 text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No audit logs found</h3>
                  <p className="text-sm text-neutral-600">Audit logs will appear here as events occur in the system</p>
                </DashboardCard>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
