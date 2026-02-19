"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  IconCalendar,
  IconCircleCheckFilled,
  IconCircleX,
  IconDots,
  IconMail,
  IconPlus,
  IconShield,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/components/ui/toast-notification";

type AdminUser = {
  _id: string;
  username?: string;
  fullName?: string;
  email?: string;
  role?: string;
  isBanned?: boolean;
  createdAt?: string;
};

type UsersResponse = {
  data?: AdminUser[];
};

function formatDate(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function relativeTime(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminManagementPage() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, refetch } = useQuery<UsersResponse>({
    queryKey: ["admin-admin-users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users?role=admin&limit=200&offset=0", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch admin users");
      return response.json();
    },
  });

  const admins = useMemo(() => {
    const list = data?.data || [];
    return list.filter((admin) => {
      if (!searchQuery) return true;
      const target = `${admin.username || ""} ${admin.fullName || ""} ${admin.email || ""}`.toLowerCase();
      return target.includes(searchQuery.toLowerCase());
    });
  }, [data?.data, searchQuery]);

  const getRoleBadgeStyles = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "moderator":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        <DashboardHeader subtitle="Manage admin access and permissions" />

        <div className="flex justify-end -mt-16 mb-8 relative z-10 px-2">
          <button
            onClick={() => toast.info("Access control", "Create admins through secure user provisioning flow")}
            className="group flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-neutral-900 px-5 text-white shadow-md transition-all hover:bg-black hover:shadow-lg"
          >
            <IconPlus className="h-4 w-4" />
            <span className="font-medium text-xs">Add New Admin</span>
          </button>
        </div>

        <DashboardCard className="p-0 overflow-hidden">
          <div className="p-6 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-neutral-900">Administrators</h2>
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search admins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 text-sm rounded-lg border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-6 text-sm text-neutral-500">Loading administrators...</div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {admins.map((admin, index) => {
                const displayName = admin.fullName || admin.username || "Admin";
                const role = admin.role || "admin";
                const isActive = !admin.isBanned;
                return (
                  <motion.div
                    key={admin._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-neutral-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                          <IconShield className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-neutral-900">{displayName}</h3>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${getRoleBadgeStyles(role)} uppercase tracking-wide`}
                            >
                              {role}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-neutral-600 flex items-center gap-1">
                              <IconMail className="w-3 h-3" />
                              {admin.email || "-"}
                            </span>
                            <span className="text-xs text-neutral-500">•</span>
                            <span className="text-xs text-neutral-600 flex items-center gap-1">
                              <IconCalendar className="w-3 h-3" />
                              Joined {formatDate(admin.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          {isActive ? (
                            <IconCircleCheckFilled className="w-4 h-4 text-green-500" />
                          ) : (
                            <IconCircleX className="w-4 h-4 text-neutral-500" />
                          )}
                          <span className={`text-sm font-medium ${isActive ? "text-green-700" : "text-neutral-600"}`}>
                            {isActive ? "Active" : "Banned"}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 font-mono">Updated: {relativeTime(admin.createdAt)}</div>
                        <button
                          onClick={() => void refetch()}
                          className="p-2 text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
                        >
                          <IconDots className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {admins.length === 0 && (
                <div className="p-6 text-sm text-neutral-500">No administrators found for this filter.</div>
              )}
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}

