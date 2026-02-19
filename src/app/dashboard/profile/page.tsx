"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { useToast } from "@/components/ui/toast-notification";
import { cn } from "@/lib/utils";
import { fetchJsonOrNull, useLiveUser } from "@/lib/live-data";
import {
  IconAward,
  IconBell,
  IconCheck,
  IconChevronRight,
  IconGlobe,
  IconHash,
  IconMail,
  IconSettings,
  IconTrendingUp,
  IconUser,
  IconLoader3,
  IconCamera,
  IconPhone,
  IconMapPin,
  IconCreditCard,
  IconLanguage,
  IconArrowRight,
  IconTrophy,
  IconClock,
  IconBolt,
  IconCrown,
  IconSparkles,
  IconChartLine,
} from "@tabler/icons-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProgressChart } from "@/components/charts/ProgressChart";

const DEFAULT_PHONE = "+254712345678";
const DEFAULT_LOCATION = "Nairobi, Kenya";
const DEFAULT_BIO = "Passionate prediction market enthusiast";
const DEFAULT_TIMEZONE = "Africa/Nairobi";
const DEFAULT_LANGUAGE = "en";

type ProfilePayload = {
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  notificationEmail?: boolean;
  notificationPush?: boolean;
  avatarUrl?: string;
};

type ActivityRecord = {
  type?: string;
  description?: string;
  createdAt?: string;
  metadata?: Record<string, unknown>;
};

type AchievementCard = {
  title: string;
  description: string;
  category: string;
  reward: number;
  date: string;
  icon: string;
};

function toRelativeTime(dateValue?: string) {
  if (!dateValue) return "Recently";
  const createdAt = new Date(dateValue).getTime();
  if (!Number.isFinite(createdAt)) return "Recently";
  const diffMs = Date.now() - createdAt;
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${Math.max(1, months)}mo ago`;
}

function mapActivityToAchievement(activity: ActivityRecord): AchievementCard {
  const type = (activity.type || "").toLowerCase();
  if (type.endsWith("_won")) {
    return {
      title: "Winning Forecast",
      description: activity.description || "Successfully settled a forecast",
      category: "Performance",
      reward: 250,
      date: toRelativeTime(activity.createdAt),
      icon: "trophy",
    };
  }
  if (type.endsWith("_placed")) {
    return {
      title: "Market Entry",
      description: activity.description || "Placed a new forecast",
      category: "Participation",
      reward: 100,
      date: toRelativeTime(activity.createdAt),
      icon: "zap",
    };
  }
  if (type === "deposit_completed") {
    return {
      title: "Capital Added",
      description: activity.description || "Wallet funded successfully",
      category: "Finance",
      reward: 150,
      date: toRelativeTime(activity.createdAt),
      icon: "crown",
    };
  }
  if (type === "group_joined") {
    return {
      title: "Community Joined",
      description: activity.description || "Joined a prediction group",
      category: "Social",
      reward: 100,
      date: toRelativeTime(activity.createdAt),
      icon: "clock",
    };
  }

  return {
    title: "Account Activity",
    description: activity.description || "Recent platform activity",
    category: "General",
    reward: 50,
    date: toRelativeTime(activity.createdAt),
    icon: "clock",
  };
}

export default function ProfilePage() {
  const toast = useToast();
  const { user, isLoading: isUserLoading, refresh } = useLiveUser();

  // Loading states
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [hasHydratedProfile, setHasHydratedProfile] = useState(false);

  // Profile data
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(DEFAULT_PHONE);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [bio, setBio] = useState(DEFAULT_BIO);

  // Preferences
  const [timezone, setTimezone] = useState(DEFAULT_TIMEZONE);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [activityRecords, setActivityRecords] = useState<ActivityRecord[]>([]);

  const recentAchievements = useMemo(() => {
    if (activityRecords.length === 0) {
      return [
        {
          title: "Account Ready",
          description: "Complete forecasts to unlock achievement history",
          category: "Getting Started",
          reward: 0,
          date: "Recently",
          icon: "clock",
        },
      ];
    }

    return activityRecords
      .slice(0, 4)
      .map(mapActivityToAchievement);
  }, [activityRecords]);

  const progressData = useMemo(() => {
    const referenceNow = activityRecords.reduce((latest, activity) => {
      const createdAt = new Date(activity.createdAt || "").getTime();
      if (!Number.isFinite(createdAt)) return latest;
      return Math.max(latest, createdAt);
    }, new Date(user.joinedAt || "1970-01-01T00:00:00.000Z").getTime());

    const buckets = Array.from({ length: 8 }, (_, index) => ({
      week: `Week ${index + 1}`,
      points: 0,
      wins: 0,
      forecasts: 0,
    }));

    for (const activity of activityRecords) {
      const createdAt = new Date(activity.createdAt || "").getTime();
      if (!Number.isFinite(createdAt)) continue;

      const daysAgo = Math.floor((referenceNow - createdAt) / (1000 * 60 * 60 * 24));
      if (daysAgo < 0 || daysAgo >= 56) continue;

      const bucketIndex = 7 - Math.floor(daysAgo / 7);
      const bucket = buckets[bucketIndex];
      const type = (activity.type || "").toLowerCase();

      if (type.endsWith("_won")) {
        bucket.points += 120;
        bucket.wins += 1;
        bucket.forecasts += 1;
        continue;
      }
      if (type.endsWith("_lost")) {
        bucket.points += 20;
        bucket.forecasts += 1;
        continue;
      }
      if (type.endsWith("_placed")) {
        bucket.points += 40;
        bucket.forecasts += 1;
        continue;
      }
      if (type === "deposit_completed" || type === "group_joined") {
        bucket.points += 30;
      }
    }

    const baseline = Math.max(0, Math.round(user.reputationScore * 10));
    let runningPoints = baseline;
    return buckets.map((bucket) => {
      runningPoints += bucket.points;
      const weeklyAccuracy =
        bucket.forecasts > 0
          ? Math.round((bucket.wins / bucket.forecasts) * 100)
          : Math.round(user.signalAccuracy);

      return {
        week: bucket.week,
        points: runningPoints,
        accuracy: Math.max(0, Math.min(100, weeklyAccuracy)),
      };
    });
  }, [activityRecords, user.joinedAt, user.reputationScore, user.signalAccuracy]);

  // Get achievement icon component
  const getAchievementIcon = (iconName: string) => {
    const iconProps =
      "w-6 h-6";
    switch (iconName) {
      case "trophy":
        return <IconTrophy className={iconProps} />;
      case "clock":
        return <IconClock className={iconProps} />;
      case "zap":
        return <IconBolt className={iconProps} />;
      case "crown":
        return <IconCrown className={iconProps} />;
      default:
        return <IconAward className={iconProps} />;
    }
  };

  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const achievementStats = useMemo(() => {
    const completed = activityRecords.filter(
      (record) => (record.type || "").toLowerCase().endsWith("_won"),
    ).length;
    const streak = Math.max(1, Math.min(30, Math.round(user.signalAccuracy / 10)));
    return {
      totalBadges: recentAchievements.length,
      completed,
      streakDays: streak,
    };
  }, [activityRecords, recentAchievements.length, user.signalAccuracy]);

  // Track changes
  const [initialData, setInitialData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: DEFAULT_PHONE,
    location: DEFAULT_LOCATION,
    bio: DEFAULT_BIO,
    timezone: DEFAULT_TIMEZONE,
    language: DEFAULT_LANGUAGE,
    emailNotif: true,
    pushNotif: true,
  });

  const hasChanges = useMemo(
    () =>
      fullName !== initialData.fullName ||
      username !== initialData.username ||
      email !== initialData.email ||
      phone !== initialData.phone ||
      location !== initialData.location ||
      bio !== initialData.bio ||
      timezone !== initialData.timezone ||
      language !== initialData.language ||
      emailNotif !== initialData.emailNotif ||
      pushNotif !== initialData.pushNotif,
    [
      fullName,
      username,
      email,
      phone,
      location,
      bio,
      timezone,
      language,
      emailNotif,
      pushNotif,
      initialData,
    ],
  );

  useEffect(() => {
    if (isUserLoading || hasHydratedProfile) return;

    const hydrateProfile = async () => {
      const [profilePayload, activityPayload] = await Promise.all([
        fetchJsonOrNull<ProfilePayload>("/api/user/profile"),
        fetchJsonOrNull<{ data?: ActivityRecord[] }>("/api/user/activity?limit=120&offset=0"),
      ]);

      const profileState = {
        fullName: profilePayload?.fullName || user.fullName || "",
        username: profilePayload?.username || user.username || "",
        email: profilePayload?.email || user.email || "",
        phone: profilePayload?.phone || DEFAULT_PHONE,
        location: profilePayload?.location || DEFAULT_LOCATION,
        bio: profilePayload?.bio || DEFAULT_BIO,
        timezone: profilePayload?.timezone || DEFAULT_TIMEZONE,
        language: profilePayload?.language || DEFAULT_LANGUAGE,
        emailNotif: profilePayload?.notificationEmail ?? true,
        pushNotif: profilePayload?.notificationPush ?? true,
      };

      const records = Array.isArray(activityPayload?.data)
        ? activityPayload.data
        : [];

      setActivityRecords(records);
      setInitialData(profileState);
      setFullName(profileState.fullName);
      setUsername(profileState.username);
      setEmail(profileState.email);
      setPhone(profileState.phone);
      setLocation(profileState.location);
      setBio(profileState.bio);
      setTimezone(profileState.timezone);
      setLanguage(profileState.language);
      setEmailNotif(profileState.emailNotif);
      setPushNotif(profileState.pushNotif);
      setHasHydratedProfile(true);
      setIsPageLoading(false);
    };

    void hydrateProfile();
  }, [hasHydratedProfile, isUserLoading, user.email, user.fullName, user.username]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);

    const response = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        username,
        email,
        phone,
        location,
        bio,
        timezone,
        language,
        notificationEmail: emailNotif,
        notificationPush: pushNotif,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setIsSaving(false);
      toast.error(
        "Save Failed",
        payload?.message || payload?.error || "Unable to update your profile",
      );
      return;
    }

    setInitialData({
      fullName,
      username,
      email,
      phone,
      location,
      bio,
      timezone,
      language,
      emailNotif,
      pushNotif,
    });
    await refresh();
    setIsSaving(false);
    toast.success(
      "Profile Updated",
      "Your changes have been saved successfully",
    );
  }, [
    fullName,
    username,
    email,
    phone,
    location,
    bio,
    timezone,
    language,
    emailNotif,
    pushNotif,
    refresh,
    toast,
  ]);

  const handleDiscard = useCallback(() => {
    setFullName(initialData.fullName);
    setUsername(initialData.username);
    setEmail(initialData.email);
    setPhone(initialData.phone);
    setLocation(initialData.location);
    setBio(initialData.bio);
    setTimezone(initialData.timezone);
    setLanguage(initialData.language);
    setEmailNotif(initialData.emailNotif);
    setPushNotif(initialData.pushNotif);
    toast.info("Changes Discarded", "All changes have been reverted");
  }, [initialData, toast]);

  const handleAvatarUpload = useCallback(() => {
    const current = user.avatarUrl || "";
    const nextUrl = window.prompt("Paste a profile image URL", current)?.trim();
    if (!nextUrl || nextUrl === current) return;

    const run = async () => {
      setIsUploadingAvatar(true);
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: nextUrl }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        toast.error(
          "Avatar Update Failed",
          payload?.message || payload?.error || "Could not update avatar",
        );
        setIsUploadingAvatar(false);
        return;
      }

      await refresh();
      setIsUploadingAvatar(false);
      toast.success("Avatar Updated", "Your profile picture has been changed");
    };

    void run();
  }, [refresh, toast, user.avatarUrl]);

  const handleEmailToggle = useCallback(() => {
    setEmailNotif((prev) => !prev);
  }, []);

  const handlePushToggle = useCallback(() => {
    setPushNotif((prev) => !prev);
  }, []);

  if (isPageLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-12 md:pb-20 pl-0 md:pl-8">
      <DashboardHeader
        user={user}
        subtitle="Manage your account and preferences"
      />

      {/* Achievements Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl mx-1 md:mx-0"
      >
        {/* Background with gradient overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-br from-purple-600/20 via-neutral-900 to-neutral-900" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 md:p-10 space-y-6 md:space-y-8">
          <div className="flex items-start justify-between">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 flex-1 text-center md:text-left">
              {/* Avatar Circle */}
              <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl md:text-5xl font-semibold text-white shadow-lg shrink-0">
                {username.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-4 pt-2 flex-1 w-full">
                <div>
                  <h1 className="text-2xl md:text-4xl font-medium text-white">
                    Hello {username}
                  </h1>
                  <p className="text-sm md:text-base text-white/70 font-normal max-w-7xl my-3 leading-relaxed">
                    Track your progress, earn badges, and unlock exclusive
                    rewards as you master the art of prediction
                  </p>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-4 md:gap-8 flex-wrap w-full">
                  <span className="text-sm text-white/50 font-normal flex items-center gap-1.5">
                    <IconTrendingUp className="w-3.5 h-3.5" />
                    {achievementStats.totalBadges} Badges Earned
                  </span>
                  <span className="text-sm text-green-400 font-normal flex items-center gap-1.5">
                    <IconCheck className="w-3.5 h-3.5" />
                    {achievementStats.completed} Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid text-center grid-cols-3 gap-2 md:gap-6 pt-6 border-t border-white/10">
            <div className="space-y-1">
              <p className="text-xs md:text-sm font-medium text-white/80">Total Badges</p>
              <p className="text-xl md:text-2xl font-normal text-white font-mono">
                {achievementStats.totalBadges}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs md:text-sm font-medium text-white/80">
                Completed
              </p>
              <p className="text-xl md:text-2xl font-normal text-green-400 font-mono">
                {achievementStats.completed}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs md:text-sm font-medium text-white/80">
                Streak
              </p>
              <p className="text-xl md:text-2xl font-normal text-orange-400 font-mono">
                {achievementStats.streakDays} days
              </p>
            </div>
          </div>


        </div>
      </motion.div>

      {/* Achievement Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-1 md:mx-0"
      >
        <div className="flex items-center justify-between mb-6">
          <SectionHeading 
            title="Recent Achievements"
            icon={<IconSparkles className="w-5 h-5 text-neutral-500 my-12" />}
          />
          <Link href="/dashboard/profile/achievements">
            <button className="text-sm font-medium cursor-pointer text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1.5">
              View All
              <IconArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentAchievements.map((achievement, index) => {
            const gradientColors = [
              { bg: "from-blue-50 via-white to-white", blur: "bg-blue-100/50 group-hover:bg-blue-200/50", icon: "text-blue-600" },
              { bg: "from-amber-50 via-white to-white", blur: "bg-amber-100/50 group-hover:bg-amber-200/50", icon: "text-amber-600" },
              { bg: "from-green-50 via-white to-white", blur: "bg-green-100/50 group-hover:bg-green-200/50", icon: "text-green-600" },
              { bg: "from-purple-50 via-white to-white", blur: "bg-purple-100/50 group-hover:bg-purple-200/50", icon: "text-purple-600" },
            ];
            const colors = gradientColors[index % gradientColors.length];

            return (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={cn(
                  "relative overflow-hidden rounded-[2rem] border border-black/5 p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 group cursor-pointer bg-gradient-to-br",
                  colors.bg
                )}
              >
                <div className={cn("absolute -right-6 -top-6 h-32 w-32 rounded-full blur-3xl transition-all opacity-60", colors.blur)} />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm">
                      <div className={colors.icon}>
                        {getAchievementIcon(achievement.icon)}
                      </div>
                    </div>
                    <span className="text-xs text-black font-medium px-2 py-1 rounded-full bg-white/50 backdrop-blur-sm border border-black/5">
                      {achievement.date}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-black">
                      {achievement.title}
                    </h3>
                    <p className="text-sm font-medium opacity-60">
                      {achievement.category}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-black/50">Reward:</span>
                      <span className="text-sm font-mono font-semibold text-green-600">
                        +{achievement.reward} pts
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Progress Graph Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mx-1 md:mx-0"
      >
        <SectionHeading 
          title="Performance Over Time"
          icon={<IconChartLine className="w-5 h-5 text-neutral-500 my-12" />}
          className="mb-6"
        />
        
        <div className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] p-6 md:p-8">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />
          
          <ProgressChart
            data={progressData}
            xAxisKey="week"
            lines={[
              { dataKey: 'points', name: 'Points', color: '#f97316', yAxisId: 'left' },
              { dataKey: 'accuracy', name: 'Accuracy %', color: '#3b82f6', yAxisId: 'right' },
            ]}
            yAxisLabels={{ left: 'Points', right: 'Accuracy %' }}
            height={300}
            className="md:h-[400px]"
          />
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-12">
          {/* Personal Information */}
          <div className="space-y-12">
            <SectionHeading title="Edit Profile Information" className="mt-12" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

              <div className="p-6 md:p-8 space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-medium text-white shadow-lg">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                      className="absolute -bottom-1 -right-1 p-2 rounded-full bg-black text-white hover:bg-black/90 transition-all cursor-pointer disabled:opacity-50 shadow-lg"
                    >
                      {isUploadingAvatar ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <IconLoader3 className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <IconCamera className="h-4 w-4" />
                      )}
                    </motion.button>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-black/90 mb-1">
                      {fullName}
                    </h3>
                    <p className="text-sm text-black/50 font-normal">
                      @{username}
                    </p>
                  </div>
                </div>

                {/* Visual Separator */}
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-linear-to-r from-transparent via-black/10 to-transparent" />
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-black/80 uppercase tracking-wider">
                      Full Name
                    </label>
                    <div className="relative">
                      <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/90 pointer-events-none" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 text-sm font-medium text-black placeholder:text-black/30 focus:border-black/30 focus:bg-white/80 outline-none transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-black/80 uppercase tracking-wider">
                      Username
                    </label>
                    <div className="relative">
                      <IconHash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/90 pointer-events-none" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 text-sm font-medium text-black placeholder:text-black/30 focus:border-black/30 focus:bg-white/80 outline-none transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-black/80 uppercase tracking-wider">
                      Email
                    </label>
                    <div className="relative">
                      <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/90 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 text-sm font-medium text-black placeholder:text-black/30 focus:border-black/30 focus:bg-white/80 outline-none transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-black/80 uppercase tracking-wider">
                      Phone
                    </label>
                    <div className="relative">
                      <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/90 pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 text-sm font-medium text-black placeholder:text-black/30 focus:border-black/30 focus:bg-white/80 outline-none transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-medium text-black/80 uppercase tracking-wider">
                      Location
                    </label>
                    <div className="relative">
                      <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/90 pointer-events-none" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 text-sm font-medium text-black placeholder:text-black/30 focus:border-black/30 focus:bg-white/80 outline-none transition-all cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-black/80 uppercase tracking-wider">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 text-sm font-medium text-black placeholder:text-black/30 focus:border-black/30 focus:bg-white/80 outline-none transition-all resize-none cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <SectionHeading
              title="Preferences"
              className="my-16 md:my-18"
              icon={<IconSettings className="h-5 w-5 text-black/80" />}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Timezone */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-black/80 uppercase tracking-wider">
                      Timezone
                    </label>
                    <div className="relative">
                      <IconGlobe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/80 pointer-events-none" />
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full appearance-none pl-10 pr-3 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 text-sm font-medium text-black focus:border-black/30 focus:bg-white/80 outline-none transition-all cursor-pointer"
                      >
                        <option value="UTC">
                          UTC (Coordinated Universal Time)
                        </option>
                        <option value="Africa/Nairobi">
                          Africa/Nairobi (EAT)
                        </option>
                        <option value="America/New_York">
                          America/New_York (EST)
                        </option>
                        <option value="America/Los_Angeles">
                          America/Los_Angeles (PST)
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-black/80 uppercase tracking-wider">
                      Language
                    </label>
                    <div className="relative">
                      <IconLanguage className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/80 pointer-events-none" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full appearance-none pl-10 pr-3 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-black/10 text-sm font-medium text-black focus:border-black/30 focus:bg-white/80 outline-none transition-all cursor-pointer"
                      >
                        <option value="en">English</option>
                        <option value="sw">Swahili</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Visual Separator */}
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-linear-to-r from-transparent via-black/10 to-transparent" />
                </div>

                {/* Notifications */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-black/70">
                    Notifications
                  </label>

                  <div className="space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      onClick={handleEmailToggle}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white/80 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            emailNotif ? "bg-black/10" : "bg-black/5",
                          )}
                        >
                          <IconMail
                            className={cn(
                              "h-4 w-4",
                              emailNotif ? "text-black/70" : "text-black/80",
                            )}
                          />
                        </div>
                        <span className="text-sm font-medium text-black/90">
                          Email Notifications
                        </span>
                      </div>
                      <div
                        className={cn(
                          "h-6 w-11 rounded-full transition-colors relative",
                          emailNotif ? "bg-black" : "bg-black/20",
                        )}
                      >
                        <motion.div
                          className="absolute top-1 h-4 w-4 rounded-full bg-white"
                          animate={{ left: emailNotif ? "24px" : "4px" }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      onClick={handlePushToggle}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white/80 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            pushNotif ? "bg-black/10" : "bg-black/5",
                          )}
                        >
                          <IconBell
                            className={cn(
                              "h-4 w-4",
                              pushNotif ? "text-black/70" : "text-black/80",
                            )}
                          />
                        </div>
                        <span className="text-sm font-medium text-black/90">
                          Push Notifications
                        </span>
                      </div>
                      <div
                        className={cn(
                          "h-6 w-11 rounded-full transition-colors relative",
                          pushNotif ? "bg-black" : "bg-black/20",
                        )}
                      >
                        <motion.div
                          className="absolute top-1 h-4 w-4 rounded-full bg-white"
                          animate={{ left: pushNotif ? "24px" : "4px" }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Status & Quick Links */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status & Limits */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative overflow-hidden "
            >
              <div className="space-y-6">
                <SectionHeading title="Account Status" className="my-12" />

                {/* Tier Badge */}
                <div className="relative overflow-hidden p-4 rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 border border-amber-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-medium text-amber-900 uppercase tracking-wider mb-1">
                        Current Tier
                      </p>
                      <p className="text-xl font-medium text-amber-900 capitalize">
                        {user.tier.replace("_", " ")}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      <IconAward className="h-8 w-8 text-amber-600" />
                    </motion.div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 rounded-lg bg-amber-900 text-white text-xs font-medium hover:bg-amber-800 transition-all cursor-pointer"
                  >
                    Upgrade Tier
                  </motion.button>
                </div>

                {/* Visual Separator */}
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-linear-to-r from-transparent via-black/10 to-transparent" />
                </div>

                {/* User ID */}
                <div className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-black/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-black/5">
                      <IconHash className="h-4 w-4 text-black/80" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-black/80 uppercase tracking-wider">
                        User ID
                      </p>
                      <p className="text-sm font-mono font-medium text-black/90">
                        {user.id || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visual Separator */}
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-linear-to-r from-transparent via-black/10 to-transparent" />
                </div>

                {/* Daily Limits */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-black/70">
                    Daily Limits
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-black/5">
                      <div className="flex items-center gap-2">
                        <IconTrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-black/70">
                          Deposits
                        </span>
                      </div>
                      <span className="font-mono font-medium text-black/90 text-xs">
                        $
                        {user.tier === "whale"
                          ? "5,000"
                          : "500"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-black/5">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-400/20 border border-orange-400/30">
                        <span className="text-[10px] font-semibold text-orange-900 uppercase">
                          {user.tier === "whale" ? "High Stake" : "Standard"}
                        </span>
                      </div>
                      <span className="font-mono font-medium text-black/90 text-xs">
                        $
                        {user.tier === "whale"
                          ? "1,000"
                          : "250"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 mt-10">
            <SectionHeading title="Quick Links" className="my-16 md:my-18" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

              <div className="p-4 ">
                <Link href="/dashboard/settings">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center justify-between p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white/80 hover:border-black/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-black/5 group-hover:bg-black/10 transition-colors">
                        <IconSettings className="w-4 h-4 text-black/80" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black/90">
                          Settings
                        </p>
                        <p className="text-xs text-black/50">
                          Account preferences
                        </p>
                      </div>
                    </div>
                    <IconChevronRight className="w-4 h-4 text-black/80 group-hover:text-black/80 transition-colors" />
                  </motion.div>
                </Link>

                <Link href="/dashboard/wallet">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex my-4 items-center justify-between p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white/80 hover:border-black/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-black/5 group-hover:bg-black/10 transition-colors">
                        <IconCreditCard className="w-4 h-4 text-black/80" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black/90">
                          Wallet
                        </p>
                        <p className="text-xs text-black/50">Manage funds</p>
                      </div>
                    </div>
                    <IconChevronRight className="w-4 h-4 text-black/80 group-hover:text-black/80 transition-colors" />
                  </motion.div>
                </Link>

                <Link href="/dashboard/profile/achievements">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center justify-between p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white/80 hover:border-black/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-black/5 group-hover:bg-black/10 transition-colors">
                        <IconAward className="w-4 h-4 text-black/80" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black/90">
                          Achievements
                        </p>
                        <p className="text-xs text-black/50">View badges</p>
                      </div>
                    </div>
                    <IconChevronRight className="w-4 h-4 text-black/80 group-hover:text-black/80 transition-colors" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Save/Discard Panel */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none"
          >
            <div className="max-w-3xl mx-auto bg-black text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-full bg-white/10">
                  <IconCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium uppercase tracking-wide text-sm">
                    Unsaved Changes
                  </p>
                  <p className="text-xs text-white/60">
                    You have modified your profile
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDiscard}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <IconLoader3 className="w-4 h-4" />
                      </motion.div>
                      Saving...
                    </>
                  ) : (
                    <>Save Changes</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
