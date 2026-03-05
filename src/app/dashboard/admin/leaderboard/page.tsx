"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  IconAward,
  IconRefresh,
  IconSearch,
  IconTrendingUp,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useToast } from "@/components/ui/toast-notification";

type UserRow = {
  _id: string;
  username?: string;
  fullName?: string;
  email?: string;
  role?: string;
  tier?: string;
  reputationScore?: number;
  positionsWon?: number;
  positionsLost?: number;
  createdAt?: string;
};

type UsersResponse = {
  data?: UserRow[];
};

function formatDate(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function LeaderboardPage() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isFetching, refetch } = useQuery<UsersResponse>({
    queryKey: ["admin-leaderboard-users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users?limit=500&offset=0", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
  });

  const leaderboard = useMemo(() => {
    const list = data?.data || [];
    const filtered = list.filter((user) => {
      if (!searchQuery) return true;
      const text = `${user.username || ""} ${user.fullName || ""} ${user.email || ""} ${user._id}`.toLowerCase();
      return text.includes(searchQuery.toLowerCase());
    });

    return filtered
      .sort((a, b) => {
        const aScore = Number(a.reputationScore || 0);
        const bScore = Number(b.reputationScore || 0);
        return bScore - aScore;
      })
      .map((user, index) => ({
        rank: index + 1,
        user,
        reputation: `${Number(user.reputationScore || 0).toLocaleString()} RP`,
        totalWinnings: `+${Number(user.positionsWon || 0)} wins`,
        totalLosses: `-${Number(user.positionsLost || 0)} losses`,
        joined: formatDate(user.createdAt),
      }));
  }, [data?.data, searchQuery]);

  const totalUsers = data?.data?.length || 0;
  const totalReputation = (data?.data || []).reduce((sum, user) => sum + Number(user.reputationScore || 0), 0);
  const avgReputation = totalUsers > 0 ? Math.round(totalReputation / totalUsers) : 0;

  const handleRefresh = async () => {
    await refetch();
    toast.success("Refreshed", "Leaderboard data reloaded");
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <IconAward className="w-5 h-5 text-amber-500" />;
      case 2:
        return <IconAward className="w-5 h-5 text-neutral-500" />;
      case 3:
        return <IconAward className="w-5 h-5 text-amber-700" />;
      default:
        return <span className="text-sm font-medium text-neutral-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-linear-to-br from-amber-50 to-amber-100 border-amber-200";
      case 2:
        return "bg-linear-to-br from-neutral-50 to-neutral-100 border-neutral-300";
      case 3:
        return "bg-linear-to-br from-amber-50/50 to-orange-50 border-orange-200";
      default:
        return "bg-neutral-50 border-neutral-200";
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-full mx-auto px-6 pb-8">
        <div className="flex justify-end -mt-6 mb-8">
          <button
            onClick={() => void handleRefresh()}
            className="px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-all"
          >
            <IconRefresh className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
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
                  <p className="text-sm font-medium text-blue-900/60">Total Users</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-blue-900">{totalUsers}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconUsers className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900/60">Total Reputation</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-green-900">{totalReputation.toLocaleString()} RP</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconTrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900/60">Average Reputation</p>
                  <p className="mt-2 text-3xl font-medium font-mono text-purple-900">{avgReputation} RP</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconAward className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Search</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <DashboardCard className="p-5 mb-10">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search by username, name, email, or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>
          </DashboardCard>
        </motion.div>

        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
          <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Rankings ({leaderboard.length})</h2>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <DashboardCard className="p-0 overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-sm text-neutral-500">Loading leaderboard...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Reputation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Total Winnings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Total Losses</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {leaderboard.map((entry) => (
                      <tr key={entry.user._id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <div
                            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${getRankBadgeColor(entry.rank)}`}
                          >
                            {getRankIcon(entry.rank)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center shrink-0">
                              <IconUser className="w-5 h-5 text-neutral-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-neutral-900">
                                  {entry.user.fullName || entry.user.username || "Unknown"}
                                </p>
                                {entry.user.role === "admin" && (
                                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-neutral-900 text-white">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-neutral-600">{entry.user.email || "-"}</p>
                              <p className="text-xs text-neutral-500 font-mono">{entry.user._id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-green-600 font-mono">{entry.reputation}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-blue-600 font-mono">{entry.totalWinnings}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-red-600 font-mono">{entry.totalLosses}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-neutral-600">{entry.joined}</span>
                        </td>
                      </tr>
                    ))}
                    {leaderboard.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-sm text-neutral-500 text-center">
                          No users found for this query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardCard>
        </motion.div>
      </div>
    </div>
  );
}

