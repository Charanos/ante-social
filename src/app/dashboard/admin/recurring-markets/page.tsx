"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconCalendarClock, IconLoader3, IconPlayerPause, IconPlayerPlay, IconPlus, IconTrash } from "@tabler/icons-react";
import { format } from "date-fns";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import RecurringMarketModal from "@/components/admin/RecurringMarketModal";
import { adminApi, type RecurringMarketTemplateItem } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast-notification";

export default function AdminRecurringMarketsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<RecurringMarketTemplateItem | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-recurring-markets"],
    queryFn: () => adminApi.getRecurringMarkets({ limit: 200, offset: 0 }),
    refetchInterval: 30_000,
  });

  const templates = useMemo(
    () =>
      ((data?.data || []) as RecurringMarketTemplateItem[]).sort((a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
      ),
    [data?.data],
  );

  const pauseMutation = useMutation({
    mutationFn: ({ id, isPaused }: { id: string; isPaused: boolean }) =>
      adminApi.updateRecurringMarket(id, { isPaused }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-recurring-markets"] });
      toast.success(
        variables.isPaused ? "Template Paused" : "Template Resumed",
        "Recurring market schedule updated.",
      );
    },
    onError: (error) => {
      toast.error("Update Failed", getApiErrorMessage(error, "Could not update template status."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteRecurringMarket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-recurring-markets"] });
      toast.success("Template Deleted", "Recurring market template removed.");
    },
    onError: (error) => {
      toast.error("Delete Failed", getApiErrorMessage(error, "Could not delete template."));
    },
  });

  return (
    <div className="space-y-8 pb-16">
      <DashboardHeader subtitle="Create, pause, resume, and edit recurring market templates." />

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard>
          <p className="text-xs uppercase tracking-wide text-black/50">Templates</p>
          <p className="mt-2 text-3xl font-mono font-semibold text-black/90">{templates.length}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-xs uppercase tracking-wide text-black/50">Active</p>
          <p className="mt-2 text-3xl font-mono font-semibold text-black/90">
            {templates.filter((template) => !template.isPaused).length}
          </p>
        </DashboardCard>
        <DashboardCard className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-black/50">Sync Status</p>
            <p className="mt-2 text-sm font-medium text-black/70">
              {isFetching ? "Refreshing..." : "Updated"}
            </p>
          </div>
          <button
            onClick={() => {
              setEditingTemplate(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-black/90 cursor-pointer"
          >
            <IconPlus className="h-4 w-4" />
            New Template
          </button>
        </DashboardCard>
      </div>

      <DashboardCard>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <IconLoader3 className="h-8 w-8 animate-spin text-black/40" />
          </div>
        ) : templates.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/10 bg-black/5 py-12 text-center text-sm text-black/50">
            No recurring templates yet. Create one to automate market publication.
          </div>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => {
              const isUpdating =
                pauseMutation.isPending && pauseMutation.variables?.id === template._id;
              const isDeleting =
                deleteMutation.isPending && deleteMutation.variables === template._id;

              return (
                <motion.div
                  layout
                  key={template._id}
                  className="rounded-xl border border-black/10 bg-white/70 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <button
                      onClick={() => {
                        setEditingTemplate(template);
                        setIsModalOpen(true);
                      }}
                      className="min-w-0 text-left cursor-pointer"
                    >
                      <p className="text-sm font-semibold text-black/90">{template.name}</p>
                      <p className="mt-1 text-xs text-black/50">{template.titleTemplate}</p>
                      <p className="mt-2 text-xs text-black/50">
                        {template.recurrence.toUpperCase()} | {template.marketType} | $
                        {Number(template.buyInAmount || 0).toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs text-black/50">
                        Next execution:{" "}
                        {template.nextExecutionAt
                          ? format(new Date(template.nextExecutionAt), "MMM d, yyyy p")
                          : "Not scheduled"}
                      </p>
                    </button>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide ${
                          template.isPaused
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-green-200 bg-green-50 text-green-700"
                        }`}
                      >
                        {template.isPaused ? "Paused" : "Active"}
                      </span>

                      <button
                        onClick={() =>
                          pauseMutation.mutate({
                            id: template._id,
                            isPaused: !template.isPaused,
                          })
                        }
                        disabled={isUpdating || isDeleting}
                        className="inline-flex items-center gap-1 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-black/70 hover:bg-black/5 disabled:opacity-50 cursor-pointer"
                      >
                        {template.isPaused ? (
                          <IconPlayerPlay className="h-3.5 w-3.5" />
                        ) : (
                          <IconPlayerPause className="h-3.5 w-3.5" />
                        )}
                        {template.isPaused ? "Resume" : "Pause"}
                      </button>

                      <button
                        onClick={() => {
                          const shouldDelete = window.confirm(
                            "Delete this recurring market template?",
                          );
                          if (!shouldDelete) return;
                          deleteMutation.mutate(template._id);
                        }}
                        disabled={isUpdating || isDeleting}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 cursor-pointer"
                      >
                        <IconTrash className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {template.tags && template.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {template.tags.map((tag) => (
                        <span
                          key={`${template._id}-${tag}`}
                          className="rounded-md border border-black/10 bg-black/5 px-2 py-0.5 text-[11px] text-black/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-1 text-[11px] text-black/50">
                    <IconCalendarClock className="h-3.5 w-3.5" />
                    Created{" "}
                    {template.createdAt
                      ? format(new Date(template.createdAt), "MMM d, yyyy")
                      : "Unknown"}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </DashboardCard>

      <RecurringMarketModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTemplate(null);
        }}
        initialTemplate={editingTemplate}
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ["admin-recurring-markets"] });
        }}
      />
    </div>
  );
}
