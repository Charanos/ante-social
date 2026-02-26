"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconLoader3, IconNote, IconSearch, IconShield, IconTarget } from "@tabler/icons-react";
import { format } from "date-fns";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { adminApi, type ComplianceFlagItem } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast-notification";

type ActionType = "resolve" | "escalate" | "note";

type ActionModalState = {
  flagId: string;
  action: ActionType;
  notes: string;
} | null;

function extractUser(flag: ComplianceFlagItem) {
  if (flag.userId && typeof flag.userId === "object") {
    return {
      id: flag.userId._id || "",
      username: flag.userId.username || "Unknown user",
      email: flag.userId.email || "",
    };
  }
  return {
    id: String(flag.userId || ""),
    username: "Unknown user",
    email: "",
  };
}

export default function AdminCompliancePage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [actionModal, setActionModal] = useState<ActionModalState>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-compliance-flags", statusFilter],
    queryFn: () =>
      adminApi.getComplianceFlags({
        status: statusFilter === "all" ? undefined : statusFilter,
        limit: 300,
        offset: 0,
      }),
    refetchInterval: 15_000,
  });

  const flags = (data?.data || []) as ComplianceFlagItem[];

  const filteredFlags = useMemo(() => {
    const query = search.trim().toLowerCase();
    return flags
      .filter((flag) => {
        if (reasonFilter !== "all" && flag.reason !== reasonFilter) return false;
        if (!query) return true;
        const user = extractUser(flag);
        return (
          flag._id.toLowerCase().includes(query) ||
          flag.reason.toLowerCase().includes(query) ||
          flag.description.toLowerCase().includes(query) ||
          user.id.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [flags, reasonFilter, search]);

  const actionMutation = useMutation({
    mutationFn: async (payload: { action: ActionType; flagId: string; notes: string }) => {
      if (payload.action === "resolve") {
        return adminApi.resolveComplianceFlag(payload.flagId, payload.notes || undefined);
      }
      if (payload.action === "escalate") {
        return adminApi.escalateComplianceFlag(payload.flagId, payload.notes || undefined);
      }
      return adminApi.addComplianceFlagNote(payload.flagId, payload.notes);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-compliance-flags"] });
      setActionModal(null);
      if (variables.action === "resolve") {
        toast.success("Flag Resolved", "Compliance flag marked as resolved.");
        return;
      }
      if (variables.action === "escalate") {
        toast.success("Flag Escalated", "Compliance flag moved to investigating.");
        return;
      }
      toast.success("Note Added", "Compliance note saved.");
    },
    onError: (error) => {
      toast.error("Action Failed", getApiErrorMessage(error, "Could not update compliance flag."));
    },
  });

  const openCount = filteredFlags.filter(
    (flag) => flag.status === "open" || flag.status === "investigating",
  ).length;

  return (
    <div className="space-y-8 pb-16">
      <DashboardHeader subtitle="Investigate, escalate, and resolve compliance alerts." />

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard>
          <p className="text-xs uppercase tracking-wide text-black/50">Visible Flags</p>
          <p className="mt-2 text-3xl font-mono font-semibold text-black/90">{filteredFlags.length}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs uppercase tracking-wide text-black/50">Open / Investigating</p>
          <p className="mt-2 text-3xl font-mono font-semibold text-black/90">{openCount}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs uppercase tracking-wide text-black/50">Sync Status</p>
          <p className="mt-2 text-sm font-medium text-black/70">
            {isFetching ? "Refreshing alerts..." : "Updated"}
          </p>
        </DashboardCard>
      </div>

      <DashboardCard className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by user, reason, or flag id"
              className="w-full rounded-xl border border-black/10 bg-white/70 py-2 pl-9 pr-3 text-sm text-black/80 outline-none focus:border-black/30"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm text-black/70 outline-none focus:border-black/30"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
          <select
            value={reasonFilter}
            onChange={(event) => setReasonFilter(event.target.value)}
            className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm text-black/70 outline-none focus:border-black/30"
          >
            <option value="all">All Reasons</option>
            <option value="manual_report">Manual Report</option>
            <option value="structuring">Structuring</option>
            <option value="rapid_deposits">Rapid Deposits</option>
            <option value="unusual_pattern">Unusual Pattern</option>
            <option value="velocity_breach">Velocity Breach</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <IconLoader3 className="h-8 w-8 animate-spin text-black/40" />
          </div>
        ) : filteredFlags.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/10 bg-black/5 py-12 text-center text-sm text-black/50">
            No compliance flags for the selected filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFlags.map((flag) => {
              const user = extractUser(flag);
              return (
                <motion.div
                  layout
                  key={flag._id}
                  className="rounded-xl border border-black/10 bg-white/70 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-black/10 bg-black/5 px-2 py-0.5 text-[11px] uppercase tracking-wide text-black/60">
                          {flag.status}
                        </span>
                        <span className="rounded-full border border-black/10 bg-white px-2 py-0.5 text-[11px] uppercase tracking-wide text-black/60">
                          {flag.reason.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-black/90">{flag.description}</p>
                      <p className="mt-1 text-xs text-black/50">
                        User: {user.username} {user.email ? `(${user.email})` : ""} | {user.id}
                      </p>
                      <p className="mt-1 text-xs text-black/50">
                        Created: {format(new Date(flag.createdAt), "MMM d, yyyy p")}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() =>
                          setActionModal({ flagId: flag._id, action: "resolve", notes: "" })
                        }
                        className="flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 cursor-pointer"
                      >
                        <IconShield className="h-3.5 w-3.5" />
                        Resolve
                      </button>
                      <button
                        onClick={() =>
                          setActionModal({ flagId: flag._id, action: "escalate", notes: "" })
                        }
                        className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 cursor-pointer"
                      >
                        <IconTarget className="h-3.5 w-3.5" />
                        Escalate
                      </button>
                      <button
                        onClick={() =>
                          setActionModal({ flagId: flag._id, action: "note", notes: "" })
                        }
                        className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 cursor-pointer"
                      >
                        <IconNote className="h-3.5 w-3.5" />
                        Add Note
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </DashboardCard>

      <AnimatePresence>
        {actionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-5 shadow-xl"
            >
              <h3 className="text-sm font-semibold text-black/80 capitalize">
                {actionModal.action === "note"
                  ? "Add Compliance Note"
                  : `${actionModal.action} Compliance Flag`}
              </h3>
              <p className="mt-1 text-xs text-black/50">
                {actionModal.action === "resolve"
                  ? "Add optional resolution notes for traceability."
                  : actionModal.action === "escalate"
                    ? "Add escalation notes for investigators."
                    : "Notes are appended to the flag history."}
              </p>
              <textarea
                value={actionModal.notes}
                onChange={(event) =>
                  setActionModal((prev) =>
                    prev ? { ...prev, notes: event.target.value } : prev,
                  )
                }
                rows={4}
                className="mt-3 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black/80 outline-none focus:border-black/30"
                placeholder="Write notes..."
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setActionModal(null)}
                  className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-black/60 hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (actionModal.action === "note" && !actionModal.notes.trim()) {
                      toast.error("Missing Note", "Please enter a note.");
                      return;
                    }
                    actionMutation.mutate({
                      action: actionModal.action,
                      flagId: actionModal.flagId,
                      notes: actionModal.notes.trim(),
                    });
                  }}
                  disabled={actionMutation.isPending}
                  className="rounded-lg border border-black/10 bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-black/90 disabled:opacity-50 cursor-pointer"
                >
                  {actionMutation.isPending ? (
                    <span className="inline-flex items-center gap-1">
                      <IconLoader3 className="h-3.5 w-3.5 animate-spin" />
                      Saving
                    </span>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
