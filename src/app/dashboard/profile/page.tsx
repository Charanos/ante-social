"use client";

import { useState, useCallback, useEffect, useMemo, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { useToast } from "@/components/ui/toast-notification";
import { cn } from "@/lib/utils";
import {
  IconAward,
  IconBell,
  IconCheck,
  IconChevronRight,
  IconGlobe,
  IconHash,
  IconMail,
  IconSettings,
  IconShield,
  IconTrendingUp,
  IconUser,
  IconLoader3,
  IconCamera,
  IconPhone,
  IconMapPin,
  IconX,
  IconCreditCard,
  IconLanguage,
  IconWallet,
  IconArrowRight,
  IconTrophy,
  IconClock,
  IconBolt,
  IconCrown,
} from "@tabler/icons-react";
import { mockUser } from "@/lib/mockData";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function ProfilePage() {
  const toast = useToast();

  // Loading states
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Profile data
  const [fullName, setFullName] = useState(mockUser.full_name);
  const [username, setUsername] = useState(mockUser.username);
  const [email, setEmail] = useState(mockUser.email);
  const [phone, setPhone] = useState("+254712345678");
  const [location, setLocation] = useState("Nairobi, Kenya");
  const [bio, setBio] = useState("Passionate prediction market enthusiast");

  // Preferences
  const [timezone, setTimezone] = useState("Africa/Nairobi");
  const [language, setLanguage] = useState("en");

  // Mock recent achievements data
  const recentAchievements = [
    {
      title: "First Win",
      description: "Won your first market",
      category: "Beginner",
      reward: 100,
      date: "2 days ago",
      icon: "trophy",
    },
    {
      title: "Early Bird",
      description: "Placed bet within first hour",
      category: "Time Based",
      reward: 150,
      date: "1 week ago",
      icon: "clock",
    },
    {
      title: "Lucky Day",
      description: "Won 3 markets in one day",
      category: "Performance",
      reward: 200,
      date: "3 days ago",
      icon: "zap",
    },
    {
      title: "High Roller",
      description: "Reached High Roller tier",
      category: "Prestige",
      reward: 500,
      date: "1 month ago",
      icon: "crown",
    },
  ];

  // Get achievement icon component
  const getAchievementIcon = (iconName: string) => {
    const iconProps =
      "w-5 h-5 text-green-400 group-hover:scale-110 transition-transform";
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

  // Track changes
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState({
    fullName: mockUser.full_name,
    username: mockUser.username,
    email: mockUser.email,
    phone: "+254712345678",
    location: "Nairobi, Kenya",
    bio: "Passionate prediction market enthusiast",
    timezone: "Africa/Nairobi",
    language: "en",
    emailNotif: true,
    pushNotif: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Check for changes
  useEffect(() => {
    const changed =
      fullName !== initialData.fullName ||
      username !== initialData.username ||
      email !== initialData.email ||
      phone !== initialData.phone ||
      location !== initialData.location ||
      bio !== initialData.bio ||
      timezone !== initialData.timezone ||
      language !== initialData.language ||
      emailNotif !== initialData.emailNotif ||
      pushNotif !== initialData.pushNotif;

    setHasChanges(changed);
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
    initialData,
  ]);

  const handleSave = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);

      // Update initial data
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

      toast.success(
        "Profile Updated",
        "Your changes have been saved successfully",
      );
    }, 1000);
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
    setHasChanges(false);
    toast.info("Changes Discarded", "All changes have been reverted");
  }, [initialData, toast]);

  const handleAvatarUpload = useCallback(() => {
    setIsUploadingAvatar(true);
    setTimeout(() => {
      setIsUploadingAvatar(false);
      toast.success("Avatar Updated", "Your profile picture has been changed");
    }, 1500);
  }, [toast]);

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
        user={mockUser}
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
                    Your Achievements
                  </h1>
                  <p className="text-sm md:text-base text-white/70 font-normal max-w-7xl my-3 leading-relaxed">
                    Track your progress, earn badges, and unlock exclusive
                    rewards as you master the art of prediction
                  </p>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-4 md:gap-8 flex-wrap w-full">
                  <span className="text-sm text-white/50 font-normal flex items-center gap-1.5">
                    <IconTrendingUp className="w-3.5 h-3.5" />
                    12 Badges Earned
                  </span>
                  <span className="text-sm text-green-400 font-normal flex items-center gap-1.5">
                    <IconCheck className="w-3.5 h-3.5" />
                    28 Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid text-center grid-cols-3 gap-2 md:gap-6 pt-6 border-t border-white/10">
            <div className="space-y-1">
              <p className="text-xs md:text-sm font-medium text-white/80">Total Badges</p>
              <p className="text-xl md:text-2xl font-normal text-white font-mono">12</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs md:text-sm font-medium text-white/80">
                Completed
              </p>
              <p className="text-xl md:text-2xl font-normal text-green-400 font-mono">
                28
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs md:text-sm font-medium text-white/80">
                Streak
              </p>
              <p className="text-xl md:text-2xl font-normal text-orange-400 font-mono">
                5 days
              </p>
            </div>
          </div>

          {/* Featured Achievements Preview */}
          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs md:text-sm font-medium text-white/90 uppercase tracking-wider">
                Recent Achievements
              </h3>
              <Link href="/dashboard/profile/achievements">
                <button className="text-xs font-medium cursor-pointer uppercase text-orange-500/80 hover:text-orange-500 transition-colors flex items-center gap-1">
                  View All
                  <IconArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>

            {/* Achievement Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {recentAchievements.slice(0, 4).map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="relative overflow-hidden p-3 md:p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  {/* Content Left Side */}
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-white line-clamp-1 uppercase tracking-wider">
                      {achievement.title}
                    </h4>
                    <p className="text-[10px] text-white/50 line-clamp-1 mt-1">
                      {achievement.category}
                    </p>
                  </div>

                  {/* Icon Right Side + Reward */}
                  <div className="flex items-end justify-between mt-3 pt-3 border-t border-white/10">
                    <span className="text-xs font-mono font-semibold text-green-400">
                      +{achievement.reward}
                    </span>
                    <div className="p-1.5 md:p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-green-400/30 transition-all">
                      {getAchievementIcon(achievement.icon)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
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
                        onChange={(e: { target: { value: SetStateAction<string>; }; }) => setFullName(e.target.value)}
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
                        onChange={(e: { target: { value: SetStateAction<string>; }; }) => setUsername(e.target.value)}
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
                        onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)}
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
                        onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPhone(e.target.value)}
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
                        onChange={(e: { target: { value: SetStateAction<string>; }; }) => setLocation(e.target.value)}
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
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setBio(e.target.value)}
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
                        {mockUser.user_level.replace("_", " ")}
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
                        {mockUser.id}
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
                        {mockUser.user_level === "high_roller"
                          ? "5,000"
                          : "500"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-black/5">
                      <div className="flex items-center gap-2">
                        <IconWallet className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-black/70">
                          Withdrawals
                        </span>
                      </div>
                      <span className="font-mono font-medium text-black/90 text-xs">
                        $
                        {mockUser.user_level === "high_roller"
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
