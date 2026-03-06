"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconAccessPoint,
  IconCalendar,
  IconChevronDown,
  IconCrown,
  IconEye,
  IconLoader3,
  IconLock,
  IconLockOpen2,
  IconMail,
  IconSearch,
  IconShield,
  IconTrash,
  IconUser,
  IconUserCheck,
  IconUsers,
  IconX,
} from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast-notification";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { format } from "date-fns";
import { adminApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api/client";

// Types
interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  tier: string;
  createdAt: string;
  isVerified: boolean;
  isFlagged?: boolean;
  isBanned?: boolean;
  avatarUrl?: string;
}

interface UsersResponse {
  data?: User[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    offset?: number;
  };
}

type FlagUser = {
  _id?: string;
  username?: string;
  email?: string;
};

interface ComplianceFlag {
  _id: string;
  userId: string | FlagUser;
  reason: string;
  status: string;
  description: string;
  createdAt: string;
  resolvedAt?: string;
}

interface ComplianceFlagsResponse {
  data?: ComplianceFlag[];
}

const tabs = [
  { id: "lookup", label: "User Lookup", icon: IconSearch },
  { id: "levels", label: "User Levels", icon: IconCrown },
  { id: "kyc", label: "KYC Review", icon: IconShield },
  { id: "aml", label: "AML & Clusters", icon: IconAccessPoint },
];

function toTitleCase(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getFlagStatusClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "open") return "bg-red-50 text-red-700 border-red-200";
  if (normalized === "investigating") return "bg-amber-50 text-amber-700 border-amber-200";
  if (normalized === "resolved") return "bg-green-50 text-green-700 border-green-200";
  return "bg-neutral-100 text-neutral-700 border-neutral-200";
}

export default function UserManagementPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("levels");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => {
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  // Fetch Users
  const { data: usersResponse, isLoading } = useQuery<UsersResponse>({
    queryKey: ['admin-users', page, limit, debouncedSearchQuery],
    queryFn: async () => {
      return adminApi.getUsers({
        page,
        limit,
        search: debouncedSearchQuery || undefined,
      });
    },
    placeholderData: (previous) => previous,
  });

  const { data: complianceResponse, isLoading: isComplianceLoading } = useQuery<ComplianceFlagsResponse>({
    queryKey: ["admin-compliance-flags"],
    queryFn: async () => {
      return (await adminApi.getComplianceFlags({
        limit: 500,
        offset: 0,
      })) as ComplianceFlagsResponse;
    },
  });

  const {
    data: selectedUserDetails,
    isLoading: isUserDetailsLoading,
  } = useQuery({
    queryKey: ["admin-user-details", selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return null;
      return adminApi.getUserById(selectedUserId);
    },
    enabled: Boolean(selectedUserId),
  });

  const users = usersResponse?.data || [];
  const complianceFlags = complianceResponse?.data || [];

  // Update Tier Mutation
  const updateTierMutation = useMutation({
    mutationFn: async ({ userId, tier }: { userId: string, tier: string }) => {
      return adminApi.updateUserTier(userId, tier.toLowerCase());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success("Tier Updated", "User level has been changed.");
      setOpenDropdown(null);
    },
    onError: (error) => {
      toast.error("Update Failed", getApiErrorMessage(error, "Could not change user level."));
    }
  });

  const complianceActionMutation = useMutation({
    mutationFn: async ({
      userId,
      action,
      reason,
    }: {
      userId: string;
      action: "freeze" | "unfreeze";
      reason?: string;
    }) => {
      return adminApi.applyComplianceAction(userId, action, reason);
    },
    onSuccess: (_payload, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-compliance-flags"] });
      toast.success(
        variables.action === "freeze" ? "Account Frozen" : "Account Unfrozen",
        "Compliance action applied successfully.",
      );
    },
    onError: (error: any) => {
      toast.error("Action Failed", getApiErrorMessage(error, "Could not update compliance state."));
    },
  });

  const suspendUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason?: string }) =>
      adminApi.suspendUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User Suspended", "The user has been suspended.");
    },
    onError: (error) => {
      toast.error("Suspend Failed", getApiErrorMessage(error, "Could not suspend user."));
    },
  });

  const unsuspendUserMutation = useMutation({
    mutationFn: async (userId: string) => adminApi.unsuspendUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User Unsuspended", "The user account is active again.");
    },
    onError: (error) => {
      toast.error("Unsuspend Failed", getApiErrorMessage(error, "Could not unsuspend user."));
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User Deleted", "The user has been removed.");
      setSelectedUserId(null);
      setUserToDelete(null);
    },
    onError: (error) => {
      toast.error("Delete Failed", getApiErrorMessage(error, "Could not delete user."));
    },
  });

  const userById = useMemo(() => {
    const map = new Map<string, User>();
    users.forEach((user) => {
      map.set(user._id, user);
    });
    return map;
  }, [users]);

  const normalizedFlags = useMemo(() => {
    return complianceFlags.map((flag) => {
      const embeddedUser =
        flag.userId && typeof flag.userId === "object"
          ? (flag.userId as FlagUser)
          : undefined;
      const userId = typeof flag.userId === "string" ? flag.userId : embeddedUser?._id || "";
      const linkedUser = userById.get(userId);

      return {
        ...flag,
        normalizedUserId: userId,
        username: embeddedUser?.username || linkedUser?.username || "Unknown user",
        email: embeddedUser?.email || linkedUser?.email || "",
        isUserFlagged: Boolean(linkedUser?.isFlagged),
      };
    });
  }, [complianceFlags, userById]);

  const kycRows = useMemo(() => {
    return users
      .map((user) => {
        const userFlags = normalizedFlags.filter(
          (flag) => flag.normalizedUserId === user._id,
        );
        const latestFlag = userFlags[0];
        const openFlags = userFlags.filter(
          (flag) => flag.status === "open" || flag.status === "investigating",
        ).length;

        return {
          user,
          latestFlag,
          openFlags,
          needsReview: !user.isVerified || Boolean(user.isFlagged) || openFlags > 0,
        };
      })
      .filter((row) => {
        if (kycFilter === "pending") return row.needsReview;
        if (kycFilter === "flagged") return row.openFlags > 0 || Boolean(row.user.isFlagged);
        if (kycFilter === "verified") return row.user.isVerified && !row.needsReview;
        return true;
      })
      .filter((row) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          row.user.username.toLowerCase().includes(query) ||
          row.user.email.toLowerCase().includes(query) ||
          row.user._id.includes(query)
        );
      });
  }, [kycFilter, normalizedFlags, searchQuery, users]);

  const amlClusters = useMemo(() => {
    const clusters = new Map<
      string,
      {
        userId: string;
        username: string;
        email: string;
        totalFlags: number;
        openFlags: number;
        lastFlagAt: string;
        lastReason: string;
        isUserFlagged: boolean;
      }
    >();

    normalizedFlags.forEach((flag) => {
      if (!flag.normalizedUserId) return;
      const existing = clusters.get(flag.normalizedUserId);
      if (!existing) {
        clusters.set(flag.normalizedUserId, {
          userId: flag.normalizedUserId,
          username: flag.username,
          email: flag.email,
          totalFlags: 1,
          openFlags:
            flag.status === "open" || flag.status === "investigating" ? 1 : 0,
          lastFlagAt: flag.createdAt,
          lastReason: flag.reason,
          isUserFlagged: flag.isUserFlagged,
        });
        return;
      }

      existing.totalFlags += 1;
      if (flag.status === "open" || flag.status === "investigating") {
        existing.openFlags += 1;
      }
      if (new Date(flag.createdAt).getTime() > new Date(existing.lastFlagAt).getTime()) {
        existing.lastFlagAt = flag.createdAt;
        existing.lastReason = flag.reason;
      }
      existing.isUserFlagged = existing.isUserFlagged || flag.isUserFlagged;
      clusters.set(flag.normalizedUserId, existing);
    });

    return Array.from(clusters.values())
      .filter((cluster) => cluster.totalFlags > 0)
      .filter((cluster) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          cluster.username.toLowerCase().includes(query) ||
          cluster.email.toLowerCase().includes(query) ||
          cluster.userId.includes(query)
        );
      })
      .sort((a, b) => {
        if (b.openFlags !== a.openFlags) return b.openFlags - a.openFlags;
        return b.totalFlags - a.totalFlags;
      });
  }, [normalizedFlags, searchQuery]);

  const filteredUsers = users.filter(user => {
    // Filter by Level
    if (levelFilter !== "all" && user.tier.toLowerCase() !== levelFilter.toLowerCase()) return false;
    
    // Filter by Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user._id.includes(query)
      );
    }
    
    return true;
  });

  const handleLevelChange = (userId: string, newLevel: string) => {
    const shouldProceed = window.confirm(
      `Update this user's tier to ${newLevel.replace("_", " ")}?`,
    );
    if (!shouldProceed) return;
    updateTierMutation.mutate({ userId, tier: newLevel });
  };

  const handleComplianceAction = (userId: string, action: "freeze" | "unfreeze") => {
    if (action === "freeze") {
      const reason = window.prompt(
        "Provide a freeze reason",
        "Manual compliance review",
      );
      if (!reason || !reason.trim()) return;
      complianceActionMutation.mutate({ userId, action, reason: reason.trim() });
      return;
    }
    complianceActionMutation.mutate({ userId, action });
  };

  const handleSuspendToggle = (user: User) => {
    if (user.isBanned) {
      const shouldUnsuspend = window.confirm("Unsuspend this user account?");
      if (!shouldUnsuspend) return;
      unsuspendUserMutation.mutate(user._id);
      return;
    }

    const reason = window.prompt("Provide suspension reason", "Policy violation");
    if (!reason || !reason.trim()) return;
    const shouldSuspend = window.confirm("Suspend this user account?");
    if (!shouldSuspend) return;
    suspendUserMutation.mutate({ userId: user._id, reason: reason.trim() });
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
  };

  const totalUsers = Number(usersResponse?.meta?.total || users.length);
  const totalPages = Math.max(1, Math.ceil(totalUsers / limit));
  const noviceUsers = users.filter((u) => u.tier === "novice").length;
  const highRollerUsers = users.filter((u) => u.tier === "high_roller").length;
  const pendingKycCount = kycRows.filter((row) => row.needsReview).length;
  const openComplianceFlags = normalizedFlags.filter(
    (flag) => flag.status === "open" || flag.status === "investigating",
  ).length;

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        <DashboardCard className="overflow-hidden p-0">
          {/* Tabs */}
          <div className="flex items-center border-b border-neutral-100 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "text-neutral-900"
                      : "text-neutral-600 hover:text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-neutral-900" : "text-neutral-500"}`}
                  />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6 min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === "lookup" && (
                <motion.div
                  key="lookup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="max-w-3xl">
                    <h3 className="text-sm font-medium text-neutral-900 mb-4">
                      Search for a user
                    </h3>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Enter user ID, email, or username..."
                          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    
                    {/* Results for Lookup */}
                    <div className="mt-8 space-y-3">
                      {searchQuery && filteredUsers.map(user => (
                         <div key={user._id} className="p-4 border rounded-lg bg-white flex justify-between items-center">
                            <div>
                               <p className="font-medium">{user.username}</p>
                               <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs uppercase">{user.tier}</span>
                         </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "levels" && (
                <motion.div
                  key="levels"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-neutral-50 rounded-lg border border-neutral-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-600">Total Users</span>
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center">
                          <IconUsers className="w-4 h-4 text-neutral-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-medium text-neutral-900 font-mono">{totalUsers}</p>
                    </div>

                    <div className="bg-neutral-50 rounded-lg border border-neutral-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-600">Novice</span>
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center">
                          <IconUserCheck className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-medium text-neutral-900 font-mono">{noviceUsers}</p>
                    </div>

                    <div className="bg-neutral-50 rounded-lg border border-neutral-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-600">High Roller</span>
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center">
                          <IconCrown className="w-4 h-4 text-amber-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-medium text-neutral-900 font-mono">{highRollerUsers}</p>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="relative">
                      <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 appearance-none cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                      >
                        <option value="all">All Levels</option>
                        <option value="novice">Novice</option>
                        <option value="high_roller">High Roller</option>
                      </select>
                      <IconChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <span className="text-sm text-neutral-600 font-mono">
                      {totalUsers} users
                    </span>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <IconLoader3 className="w-8 h-8 animate-spin text-neutral-400" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredUsers.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-neutral-100 to-neutral-200 flex items-center justify-center text-neutral-600 shrink-0">
                              <IconUser className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-neutral-900">
                                {user.username}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-neutral-600 flex items-center gap-1.5">
                                  <IconMail className="w-3 h-3" />
                                  {user.email}
                                </span>
                                <span className="text-xs text-neutral-300">•</span>
                                <span className="text-xs text-neutral-600 flex items-center gap-1.5">
                                  <IconCalendar className="w-3 h-3" />
                                  Joined {user.createdAt ? format(new Date(user.createdAt), 'MMM do, yyyy') : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedUserId(user._id)}
                              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-all cursor-pointer"
                            >
                              <IconEye className="w-3.5 h-3.5" />
                              Details
                            </button>
                            <button
                              onClick={() => handleSuspendToggle(user)}
                              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                                user.isBanned
                                  ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                                  : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                              }`}
                            >
                              {user.isBanned ? (
                                <IconLockOpen2 className="w-3.5 h-3.5" />
                              ) : (
                                <IconLock className="w-3.5 h-3.5" />
                              )}
                              {user.isBanned ? "Unsuspend" : "Suspend"}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-all cursor-pointer"
                            >
                              <IconTrash className="w-3.5 h-3.5" />
                              Delete
                            </button>

                            <div className="relative">
                              <button
                                  onClick={() => setOpenDropdown(openDropdown === user._id ? null : user._id)}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white cursor-pointer hover:bg-neutral-50 transition-all"
                              >
                                  <span className="text-xs font-medium text-neutral-600 uppercase">{user.tier}</span>
                                  <div className="h-4 w-px bg-neutral-200"></div>
                                  <IconChevronDown className="w-3.5 h-3.5 text-neutral-500 ml-1" />
                              </button>

                              {openDropdown === user._id && (
                                  <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 overflow-hidden">
                                      <button
                                          onClick={() => handleLevelChange(user._id, 'novice')}
                                          className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50"
                                      >
                                          Novice
                                      </button>
                                      <button
                                          onClick={() => handleLevelChange(user._id, 'high_roller')}
                                          className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50"
                                      >
                                          High Roller
                                      </button>
                                  </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isLoading && totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                      <span className="text-xs font-medium text-neutral-600">
                        Page {page} of {totalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                          disabled={page <= 1}
                          className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-200 bg-white hover:bg-neutral-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={page >= totalPages}
                          className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-200 bg-white hover:bg-neutral-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {!isLoading && filteredUsers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
                        <IconUsers className="w-8 h-8 text-neutral-300" />
                      </div>
                      <h3 className="text-base font-medium text-neutral-900 mb-2">No users found</h3>
                      <p className="text-sm text-neutral-600">Try adjusting your filters</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "kyc" && (
                <motion.div
                  key="kyc"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-neutral-50 rounded-lg border border-neutral-100 p-4">
                      <p className="text-sm text-neutral-600">Pending KYC Review</p>
                      <p className="text-2xl font-mono text-neutral-900 mt-2">
                        {pendingKycCount}
                      </p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg border border-neutral-100 p-4">
                      <p className="text-sm text-neutral-600">Open Compliance Flags</p>
                      <p className="text-2xl font-mono text-neutral-900 mt-2">
                        {openComplianceFlags}
                      </p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg border border-neutral-100 p-4">
                      <p className="text-sm text-neutral-600">Verified Users</p>
                      <p className="text-2xl font-mono text-neutral-900 mt-2">
                        {users.filter((user) => user.isVerified).length}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter KYC queue by user/email..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={kycFilter}
                        onChange={(e) => setKycFilter(e.target.value)}
                        className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 appearance-none cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                      >
                        <option value="all">All</option>
                        <option value="pending">Pending Review</option>
                        <option value="flagged">Flagged</option>
                        <option value="verified">Fully Verified</option>
                      </select>
                      <IconChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {isLoading || isComplianceLoading ? (
                    <div className="flex justify-center py-16">
                      <IconLoader3 className="w-8 h-8 animate-spin text-neutral-400" />
                    </div>
                  ) : kycRows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-4">
                        <IconShield className="w-8 h-8 text-neutral-300" />
                      </div>
                      <h3 className="text-base font-medium text-neutral-900 mb-2">
                        No records in this filter
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Try changing search or review status.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {kycRows.map((row) => (
                        <div
                          key={row.user._id}
                          className="rounded-lg border border-neutral-200 bg-white p-4 flex items-center justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium text-neutral-900">
                                {row.user.username}
                              </h3>
                              {!row.user.isVerified && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                                  Unverified
                                </span>
                              )}
                              {row.openFlags > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                                  {row.openFlags} open flags
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-neutral-600">
                              <span className="flex items-center gap-1">
                                <IconMail className="w-3 h-3" />
                                {row.user.email}
                              </span>
                              <span className="text-xs text-neutral-300">|</span>
                              <span>
                                Joined{" "}
                                {row.user.createdAt
                                  ? format(new Date(row.user.createdAt), "MMM do, yyyy")
                                  : "N/A"}
                              </span>
                            </div>
                            {row.latestFlag && (
                              <p className="mt-2 text-xs text-neutral-600">
                                Latest flag:{" "}
                                <span className="font-medium">
                                  {toTitleCase(row.latestFlag.reason)}
                                </span>
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              handleComplianceAction(
                                row.user._id,
                                row.user.isFlagged ? "unfreeze" : "freeze",
                              )
                            }
                            disabled={complianceActionMutation.isPending}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${
                              row.user.isFlagged
                                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            }`}
                          >
                            {row.user.isFlagged ? "Unfreeze" : "Freeze"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "aml" && (
                <motion.div
                  key="aml"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="relative max-w-md">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search AML clusters by user/email..."
                      className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    />
                  </div>

                  {isComplianceLoading ? (
                    <div className="flex justify-center py-16">
                      <IconLoader3 className="w-8 h-8 animate-spin text-neutral-400" />
                    </div>
                  ) : amlClusters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-4">
                        <IconAccessPoint className="w-8 h-8 text-neutral-300" />
                      </div>
                      <h3 className="text-base font-medium text-neutral-900 mb-2">
                        No AML clusters found
                      </h3>
                      <p className="text-sm text-neutral-600">
                        No compliance flags available for clustering.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {amlClusters.map((cluster) => (
                        <div
                          key={cluster.userId}
                          className="rounded-lg border border-neutral-200 bg-white p-4 flex items-center justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <h3 className="text-sm font-medium text-neutral-900">
                              {cluster.username}
                            </h3>
                            <p className="text-xs text-neutral-600 mt-1">
                              {cluster.email || cluster.userId}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-[11px]">
                              <span className="px-2 py-0.5 rounded-full border bg-neutral-100 text-neutral-700 border-neutral-200">
                                {cluster.totalFlags} total flags
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full border ${getFlagStatusClass(
                                  cluster.openFlags > 0 ? "open" : "resolved",
                                )}`}
                              >
                                {cluster.openFlags} open
                              </span>
                              <span className="px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                                {toTitleCase(cluster.lastReason)}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 mt-2">
                              Last flag: {format(new Date(cluster.lastFlagAt), "MMM do, yyyy p")}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              handleComplianceAction(
                                cluster.userId,
                                cluster.isUserFlagged ? "unfreeze" : "freeze",
                              )
                            }
                            disabled={complianceActionMutation.isPending}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${
                              cluster.isUserFlagged
                                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            }`}
                          >
                            {cluster.isUserFlagged ? "Unfreeze" : "Freeze"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {selectedUserId && (
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
                    className="w-full max-w-xl rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-neutral-900">User Details</h3>
                      <button
                        onClick={() => setSelectedUserId(null)}
                        className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-all cursor-pointer"
                      >
                        <IconX className="h-4 w-4" />
                      </button>
                    </div>

                    {isUserDetailsLoading ? (
                      <div className="flex justify-center py-10">
                        <IconLoader3 className="h-6 w-6 animate-spin text-neutral-400" />
                      </div>
                    ) : selectedUserDetails ? (
                      <div className="grid gap-3 text-sm text-neutral-700 md:grid-cols-2">
                        <p>
                          <span className="font-medium text-neutral-900">ID:</span>{" "}
                          {String((selectedUserDetails as { _id?: string })._id || selectedUserId)}
                        </p>
                        <p>
                          <span className="font-medium text-neutral-900">Email:</span>{" "}
                          {String((selectedUserDetails as { email?: string }).email || "N/A")}
                        </p>
                        <p>
                          <span className="font-medium text-neutral-900">Username:</span>{" "}
                          {String((selectedUserDetails as { username?: string }).username || "N/A")}
                        </p>
                        <p>
                          <span className="font-medium text-neutral-900">Role:</span>{" "}
                          {String((selectedUserDetails as { role?: string }).role || "user")}
                        </p>
                        <p>
                          <span className="font-medium text-neutral-900">Tier:</span>{" "}
                          {String((selectedUserDetails as { tier?: string }).tier || "novice")}
                        </p>
                        <p>
                          <span className="font-medium text-neutral-900">Banned:</span>{" "}
                          {(selectedUserDetails as { isBanned?: boolean }).isBanned ? "Yes" : "No"}
                        </p>
                        <p className="md:col-span-2">
                          <span className="font-medium text-neutral-900">Created:</span>{" "}
                          {(selectedUserDetails as { createdAt?: string }).createdAt
                            ? format(
                                new Date(
                                  (selectedUserDetails as { createdAt?: string }).createdAt as string,
                                ),
                                "MMM do, yyyy p",
                              )
                            : "N/A"}
                        </p>
                      </div>
                    ) : (
                      <p className="py-8 text-center text-sm text-neutral-500">
                        Could not load user details.
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DashboardCard>
      </div>

      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (userToDelete) deleteUserMutation.mutate(userToDelete._id);
        }}
        isLoading={deleteUserMutation.isPending}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.username}? This action will anonymize the account and ban access.`}
        confirmLabel="Delete User"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
}
