"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  IconArrowDown,
  IconArrowUp,
  IconCheck,
  IconLoader3,
  IconX,
} from "@tabler/icons-react";
import { format } from "date-fns";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { adminApi, type WithdrawalQueueItem } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast-notification";

type SortBy = "date" | "amount" | "user";
type SortOrder = "asc" | "desc";

type RejectModalState = {
  withdrawalId: string;
  reason: string;
} | null;

function getTimestamp(value?: string) {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export default function AdminWithdrawalsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [rejectModal, setRejectModal] = useState<RejectModalState>(null);
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<WithdrawalQueueItem | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: () => adminApi.getPendingWithdrawals({ limit: 100, offset: 0 }),
  });

  const queue = (data?.data || []) as WithdrawalQueueItem[];

  const sortedQueue = useMemo(() => {
    const next = [...queue];
    next.sort((a, b) => {
      if (sortBy === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortBy === "user") {
        const left = String(a.userId || "");
        const right = String(b.userId || "");
        return sortOrder === "asc" ? left.localeCompare(right) : right.localeCompare(left);
      }
      const left = getTimestamp(a.createdAt);
      const right = getTimestamp(b.createdAt);
      return sortOrder === "asc" ? left - right : right - left;
    });
    return next;
  }, [queue, sortBy, sortOrder]);

  const totalAmount = sortedQueue.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const approveMutation = useMutation({
    mutationFn: (withdrawalId: string) => adminApi.approveWithdrawal(withdrawalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      toast.success("Withdrawal Approved", "The request has been processed.");
    },
    onError: (error) => {
      toast.error("Approval Failed", getApiErrorMessage(error, "Could not approve withdrawal."));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ withdrawalId, reason }: { withdrawalId: string; reason: string }) =>
      adminApi.rejectWithdrawal(withdrawalId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      setRejectModal(null);
      toast.success("Withdrawal Rejected", "The request was rejected successfully.");
    },
    onError: (error) => {
      toast.error("Rejection Failed", getApiErrorMessage(error, "Could not reject withdrawal."));
    },
  });

  const selectedUserId = String(selectedWithdrawal?.userId || "");
  const { data: selectedUser } = useQuery<{ username?: string; email?: string }>({
    queryKey: ["admin-user-details", selectedUserId],
    queryFn: async () =>
      (await adminApi.getUserById(selectedUserId)) as { username?: string; email?: string },
    enabled: Boolean(selectedUserId),
  });

  return (
    <div className="space-y-8 pb-16">
      <DashboardHeader subtitle="Review and action pending withdrawal requests in real time." />

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard>
          <p className="text-xs uppercase tracking-wide text-black/50">Pending Requests</p>
          <p className="mt-2 text-3xl font-mono font-semibold text-black/90">{sortedQueue.length}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs uppercase tracking-wide text-black/50">Pending Volume</p>
          <p className="mt-2 text-3xl font-mono font-semibold text-black/90">
            ${totalAmount.toLocaleString()}
          </p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs uppercase tracking-wide text-black/50">Sync Status</p>
          <p className="mt-2 text-sm font-medium text-black/70">
            {isFetching ? "Refreshing queue..." : "Updated"}
          </p>
        </DashboardCard>
      </div>

      <DashboardCard className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "date", label: "Date" },
            { id: "amount", label: "Amount" },
            { id: "user", label: "User" },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setSortBy(option.id as SortBy)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                sortBy === option.id
                  ? "border-black/20 bg-black/5 text-black/80"
                  : "border-black/10 bg-white/50 text-black/50 hover:bg-black/5"
              }`}
            >
              {option.label}
            </button>
          ))}
          <button
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="ml-auto flex items-center gap-1 rounded-lg border border-black/10 bg-white/60 px-3 py-1.5 text-xs font-medium text-black/60 hover:bg-black/5 cursor-pointer"
          >
            {sortOrder === "asc" ? (
              <IconArrowUp className="h-3.5 w-3.5" />
            ) : (
              <IconArrowDown className="h-3.5 w-3.5" />
            )}
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <IconLoader3 className="h-8 w-8 animate-spin text-black/40" />
          </div>
        ) : sortedQueue.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/10 bg-black/5 py-12 text-center text-sm text-black/50">
            No pending withdrawals.
          </div>
        ) : (
          <div className="space-y-3">
            {sortedQueue.map((withdrawal) => {
              const isApproving =
                approveMutation.isPending &&
                approveMutation.variables === withdrawal._id;
              const isRejecting =
                rejectMutation.isPending &&
                rejectMutation.variables?.withdrawalId === withdrawal._id;

              return (
                <motion.div
                  layout
                  key={withdrawal._id}
                  className="rounded-xl border border-black/10 bg-white/70 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <button
                      onClick={() => setSelectedWithdrawal(withdrawal)}
                      className="text-left cursor-pointer"
                    >
                      <p className="text-sm font-semibold text-black/90">
                        ${Number(withdrawal.amount || 0).toLocaleString()}{" "}
                        <span className="text-black/50">{withdrawal.currency || "USD"}</span>
                      </p>
                      <p className="mt-1 text-xs text-black/50">
                        User: {String(withdrawal.userId || "Unknown")}
                      </p>
                      <p className="mt-1 text-xs text-black/50">
                        {withdrawal.createdAt
                          ? format(new Date(withdrawal.createdAt), "MMM d, yyyy p")
                          : "Unknown date"}
                      </p>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveMutation.mutate(withdrawal._id)}
                        disabled={isApproving || isRejecting}
                        className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50 cursor-pointer"
                      >
                        {isApproving ? (
                          <IconLoader3 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <IconCheck className="h-3.5 w-3.5" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          setRejectModal({ withdrawalId: withdrawal._id, reason: "" })
                        }
                        disabled={isApproving || isRejecting}
                        className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 cursor-pointer"
                      >
                        {isRejecting ? (
                          <IconLoader3 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <IconX className="h-3.5 w-3.5" />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </DashboardCard>

      {selectedWithdrawal && (
        <DashboardCard>
          <h3 className="text-sm font-semibold text-black/80">Request Details</h3>
          <div className="mt-3 grid gap-3 text-sm text-black/60 md:grid-cols-2">
            <p>
              <span className="font-medium text-black/70">Transaction ID:</span>{" "}
              {selectedWithdrawal._id}
            </p>
            <p>
              <span className="font-medium text-black/70">Status:</span>{" "}
              {selectedWithdrawal.status}
            </p>
            <p>
              <span className="font-medium text-black/70">User ID:</span>{" "}
              {String(selectedWithdrawal.userId || "Unknown")}
            </p>
            <p>
              <span className="font-medium text-black/70">Wallet ID:</span>{" "}
              {String(selectedWithdrawal.walletId || "Unknown")}
            </p>
            {selectedUser && (
              <p className="md:col-span-2">
                <span className="font-medium text-black/70">User:</span>{" "}
                {selectedUser.username || "Unknown"} ({selectedUser.email || "No email"})
              </p>
            )}
          </div>
        </DashboardCard>
      )}

      <AnimatePresence>
        {rejectModal && (
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
              <h3 className="text-sm font-semibold text-black/80">Reject Withdrawal</h3>
              <p className="mt-1 text-xs text-black/50">
                Provide a rejection reason to keep the audit trail complete.
              </p>
              <textarea
                value={rejectModal.reason}
                onChange={(event) =>
                  setRejectModal((prev) =>
                    prev ? { ...prev, reason: event.target.value } : prev,
                  )
                }
                rows={4}
                className="mt-3 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black/80 outline-none focus:border-black/30"
                placeholder="Reason for rejection"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setRejectModal(null)}
                  className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-black/60 hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!rejectModal.reason.trim()) {
                      toast.error("Missing Reason", "Please enter a rejection reason.");
                      return;
                    }
                    rejectMutation.mutate({
                      withdrawalId: rejectModal.withdrawalId,
                      reason: rejectModal.reason.trim(),
                    });
                  }}
                  disabled={rejectMutation.isPending}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 cursor-pointer"
                >
                  {rejectMutation.isPending ? "Submitting..." : "Reject Withdrawal"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
