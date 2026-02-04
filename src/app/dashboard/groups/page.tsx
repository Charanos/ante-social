"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  Users,
  Plus,
  TrendingUp,
  Calendar,
  Activity,
  X,
  Shield,
} from "lucide-react";
import { mockGroups, mockUser } from "@/lib/mockData";
import { getJoinedGroups, isGroupMember } from "@/lib/membership";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GroupCard } from "@/components/groups/GroupCard";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/toast-notification";
import { LoaderPinwheel } from "lucide-react";

export default function GroupsPage() {
  const router = useRouter();
  // Keep the filtering logic for role-based visibility
  const [groups, setGroups] = useState(mockGroups);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);

  useEffect(() => {
    setJoinedGroupIds(getJoinedGroups());
  }, []);

  const filteredGroups = groups.filter((group) => {
    return joinedGroupIds.includes(group.id.toString());
  });

  // Redirect to dedicated group creation page
  const handleCreateGroup = () => {
    setIsCreating(true);
    toast.info("Opening Group Creator", "One moment while we set things up...");
    setTimeout(() => {
      router.push("/dashboard/groups/create");
    }, 800);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  return (
    <div className="space-y-8 pl-0 md:pl-8 w-full">
      <DashboardHeader
        user={mockUser}
        subtitle="Join communities and create private betting markets"
      />

      <div className="flex justify-end z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateGroup}
          className="group flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-gray-900 px-5 text-white shadow-xl transition-all hover:bg-black disabled:opacity-70"
          disabled={isCreating}
        >
          {isCreating ? (
            <LoaderPinwheel className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span className="font-semibold text-sm">
            {isCreating ? "Preparing..." : "Create Group"}
          </span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900/60">
                  My Groups
                </p>
                <p className="mt-2 text-3xl font-medium numeric text-blue-900">
                  {filteredGroups.length}
                </p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900/60">
                  Active Bets
                </p>
                <p className="mt-2 text-3xl font-medium numeric text-green-900">
                  {filteredGroups.reduce(
                    (sum, g) => sum + (g.active_bets || 0),
                    0,
                  )}
                </p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl transition-all group-hover:bg-purple-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900/60">
                  Total Members
                </p>
                <p className="mt-2 text-3xl font-medium numeric text-purple-900">
                  {filteredGroups.reduce(
                    (sum, g) => sum + (g.member_count || 0),
                    0,
                  )}
                </p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <SectionHeading
        title="Your Groups"
        icon={<Users className="h-4 w-4 text-purple-500" />}
      />

      {/* Groups Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {filteredGroups.map((group, index) => (
          <GroupCard
            key={group.id}
            group={{
              id: group.id,
              name: group.name,
              description: group.description,
              members: group.member_count,
              activeBets: group.active_bets,
              category: group.category || "Community",
              isPublic: group.is_public ?? true,
              image: group.image,
            }}
            index={index}
            showVisibilityBadge={true}
            isJoined={true}
            hideJoinedBadge={true}
          />
        ))}
      </motion.div>
    </div>
  );
}
