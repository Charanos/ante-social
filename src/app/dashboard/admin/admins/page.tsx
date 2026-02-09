"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconCalendar, IconCircleCheckFilled, IconCircleX, IconDots, IconMail, IconPlus, IconSearch, IconShield } from '@tabler/icons-react';

import { useRouter } from "next/navigation";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// Mock Data
const mockAdmins = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@antesocial.com",
    role: "Super Admin",
    status: "Active",
    lastActive: "2 mins ago",
    joinedDate: "Sep 1, 2025",
  },
  {
    id: 2,
    name: "Moderator One",
    email: "mod1@antesocial.com",
    role: "Moderator",
    status: "Active",
    lastActive: "1 hour ago",
    joinedDate: "Oct 15, 2025",
  },
  {
    id: 3,
    name: "Support Lead",
    email: "support@antesocial.com",
    role: "Support",
    status: "Inactive",
    lastActive: "2 days ago",
    joinedDate: "Nov 5, 2025",
  },
];

export default function AdminManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Moderator":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Support":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        {/* Header */}
        {/* Header */}
        <DashboardHeader subtitle="Manage admin access and permissions" />

        <div className="flex justify-end -mt-16 mb-8 relative z-10 px-2">
          <button className="group flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-neutral-900 px-5 text-white shadow-md transition-all hover:bg-black hover:shadow-lg">
            <IconPlus className="h-4 w-4" />
            <span className="font-medium text-xs">Add New Admin</span>
          </button>
        </div>

        {/* Content */}
        <DashboardCard className="p-0 overflow-hidden">
          <div className="p-6 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-neutral-900">
                Administrators
              </h2>
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

          <div className="divide-y divide-neutral-100">
            {mockAdmins.map((admin, index) => (
              <motion.div
                key={admin.id}
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
                        <h3 className="text-sm font-medium text-neutral-900">
                          {admin.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${getRoleBadgeStyles(admin.role)} uppercase tracking-wide`}
                        >
                          {admin.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-neutral-600 flex items-center gap-1">
                          <IconMail className="w-3 h-3" />
                          {admin.email}
                        </span>
                        <span className="text-xs text-neutral-500">•</span>
                        <span className="text-xs text-neutral-600 flex items-center gap-1">
                          <IconCalendar className="w-3 h-3" />
                          Joined {admin.joinedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      {admin.status === "Active" ? (
                        <IconCircleCheckFilled className="w-4 h-4 text-green-500" />
                      ) : (
                        <IconCircleX className="w-4 h-4 text-neutral-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${admin.status === "Active" ? "text-green-700" : "text-neutral-600"}`}
                      >
                        {admin.status}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 font-mono">
                      Active: {admin.lastActive}
                    </div>
                    <button className="p-2 text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer">
                      <IconDots className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
