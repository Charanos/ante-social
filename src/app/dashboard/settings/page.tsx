"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockUser } from "@/lib/mockData";
import { useToast } from "@/components/ui/toast-notification";
import { cn } from "@/lib/utils";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  IconUser,
  IconLock,
  IconBell,
  IconShield,
  IconPalette,
  IconLanguage,
  IconCreditCard,
  IconLogout,
  IconDeviceFloppy,
  IconCheck,
  IconChevronRight,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandGoogle,
  IconBrandApple,
  IconTrash,
  IconAlertTriangle,
  IconLoader2,
} from "@tabler/icons-react";

type SettingsSection =
  | "profile"
  | "security"
  | "notifications"
  | "privacy"
  | "billing";

const NOTIFICATION_TYPES = [
  {
    id: "bets",
    label: "Bet Updates",
    description: "When your bets are settled or updated",
  },
  {
    id: "groups",
    label: "Group Activity",
    description: "New posts and bets in your groups",
  },
  {
    id: "social",
    label: "Social",
    description: "Follows, mentions, and messages",
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "News, features, and promotions",
  },
];

export default function SettingsPage() {
  const toast = useToast();
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isTwoFactorLoading, setIsTwoFactorLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Profile states
  const [username, setUsername] = useState(mockUser.username);
  const [email, setEmail] = useState(mockUser.email);
  const [phone, setPhone] = useState("+254712345678");
  const [location, setLocation] = useState("Nairobi, Kenya");
  const [bio, setBio] = useState("Passionate prediction market enthusiast");

  // Security states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notificationPrefs, setNotificationPrefs] = useState({
    bets: true,
    groups: true,
    social: false,
    marketing: false,
  });

  // Language state
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Track unsaved changes
  useEffect(() => {
    const changed =
      username !== mockUser.username ||
      email !== mockUser.email ||
      phone !== "+254712345678" ||
      location !== "Nairobi, Kenya" ||
      bio !== "Passionate prediction market enthusiast" ||
      currentPassword !== "" ||
      newPassword !== "" ||
      confirmPassword !== "" ||
      twoFactorEnabled !== false ||
      emailNotifications !== true ||
      pushNotifications !== true ||
      notificationPrefs.bets !== true ||
      notificationPrefs.groups !== true ||
      notificationPrefs.social !== false ||
      notificationPrefs.marketing !== false ||
      language !== "en";
    setHasUnsavedChanges(changed);
  }, [
    username,
    email,
    phone,
    location,
    bio,
    currentPassword,
    newPassword,
    confirmPassword,
    twoFactorEnabled,
    emailNotifications,
    pushNotifications,
    notificationPrefs,
    language,
  ]);

  const handleSave = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings Saved", "Your changes have been updated");
    }, 1000);
  }, [toast]);

  const handlePasswordChange = useCallback(() => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Missing Fields", "Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords Don't Match", "New passwords must be identical");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password Too Short", "Use at least 8 characters");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password Updated", "Your password has been changed");
    }, 1000);
  }, [currentPassword, newPassword, confirmPassword, toast]);

  const handleTwoFactorToggle = useCallback(() => {
    setIsTwoFactorLoading(true);
    setTimeout(() => {
      setIsTwoFactorLoading(false);
      const isEnabled = !twoFactorEnabled;
      setTwoFactorEnabled(isEnabled);
      if (isEnabled) {
        toast.success("Two-Factor Enabled", "Your account is now more secure");
      } else {
        toast.error("Two-Factor Disabled", "Your account is less secure");
      }
    }, 1000);
  }, [twoFactorEnabled, toast]);

  const handleProfilePictureUpload = useCallback(() => {
    setIsUploadingProfile(true);
    setTimeout(() => {
      setIsUploadingProfile(false);
      toast.success(
        "Profile Updated",
        "Your profile picture has been uploaded",
      );
    }, 1500);
  }, [toast]);

  const handleRemoveProfilePicture = useCallback(() => {
    toast.info("Profile Picture Removed", "Your avatar has been reset");
  }, [toast]);

  const handleDeleteAccount = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => {
      toast.error(
        "Account Deleted",
        "Your account has been permanently deleted",
      );
      setIsSaving(false);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }, 1000);
  }, [toast]);

  const sections = [
    { id: "profile" as SettingsSection, label: "Profile", icon: IconUser },
    { id: "security" as SettingsSection, label: "Security", icon: IconLock },
    {
      id: "notifications" as SettingsSection,
      label: "Notifications",
      icon: IconBell,
    },
    { id: "privacy" as SettingsSection, label: "Privacy", icon: IconShield },
    {
      id: "billing" as SettingsSection,
      label: "Billing",
      icon: IconCreditCard,
    },
  ];

  if (isPageLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  return (
    <div className="space-y-6 pb-20 pl-0 md:pl-8 w-full">
      <DashboardHeader
        user={mockUser}
        subtitle="Manage your account preferences and settings"
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="sticky top-6 space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <motion.button
                    key={section.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer group",
                      activeSection === section.id
                        ? "bg-black text-white shadow-lg"
                        : "bg-white/60 text-black/70 hover:bg-white hover:text-black/90 border border-black/5",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {section.label}
                      </span>
                    </div>
                    <IconChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        activeSection === section.id
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-50",
                      )}
                    />
                  </motion.button>
                );
              })}

              {/* Visual Separator */}
              <div className="flex items-center gap-3 py-2">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-black/10 to-transparent" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toast.info("Logging out", "See you soon!")}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
              >
                <IconLogout className="w-4 h-4" />
                <span className="text-sm font-semibold">Log Out</span>
              </motion.button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Profile Section */}
                {activeSection === "profile" && (
                  <div className="space-y-12">
                    <div>
                      <h2 className="text-2xl font-semibold text-black/90">
                        Profile Settings
                      </h2>
                      <p className="text-sm text-black/50 mt-1">
                        Manage your personal information
                      </p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-semibold text-white shadow-lg">
                          {mockUser.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-black/90 mb-1">
                            Profile Picture
                          </h3>
                          <p className="text-xs text-black/50 mb-3">
                            Upload a new avatar or remove the current one
                          </p>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleProfilePictureUpload}
                              disabled={isUploadingProfile}
                              className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                            >
                              {isUploadingProfile ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                  >
                                    <IconLoader2 className="w-3 h-3" />
                                  </motion.div>
                                  Uploading...
                                </>
                              ) : (
                                "Upload New"
                              )}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleRemoveProfilePicture}
                              disabled={isUploadingProfile}
                              className="px-3 py-1.5 rounded-lg bg-white border border-black/10 text-black/70 text-xs font-semibold hover:bg-black/5 transition-all cursor-pointer disabled:opacity-50"
                            >
                              Remove
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <SectionHeading
                      title="Personal Details"
                      icon={<IconUser className="w-4 h-4 text-neutral-500" />}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="space-y-2"
                      >
                        <label className="text-xs font-semibold text-black/60 uppercase tracking-wider">
                          Username
                        </label>
                        <div className="relative">
                          <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/60" />
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-black/10 bg-white outline-none focus:border-black transition-all cursor-pointer text-black/90"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                      >
                        <label className="text-xs font-semibold text-black/60 uppercase tracking-wider">
                          Email
                        </label>
                        <div className="relative">
                          <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/60" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-black/10 bg-white outline-none focus:border-black transition-all cursor-pointer text-black/90"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="space-y-2"
                      >
                        <label className="text-xs font-semibold text-black/60 uppercase tracking-wider">
                          Phone
                        </label>
                        <div className="relative">
                          <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/60" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-black/10 bg-white outline-none focus:border-black transition-all cursor-pointer text-black/90"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                      >
                        <label className="text-xs font-semibold text-black/60 uppercase tracking-wider">
                          Location
                        </label>
                        <div className="relative">
                          <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/60" />
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-black/10 bg-white outline-none focus:border-black transition-all cursor-pointer text-black/90"
                          />
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="space-y-2"
                    >
                      <label className="text-xs font-semibold text-black/60 uppercase tracking-wider">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border-2 border-black/10 bg-white outline-none focus:border-black transition-all resize-none cursor-pointer text-black/90"
                      />
                    </motion.div>
                  </div>
                )}

                {/* Security Section */}
                {activeSection === "security" && (
                  <div className="space-y-12">
                    <SectionHeading
                      title="Password Management"
                      icon={<IconLock className="w-4 h-4 text-neutral-500" />}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 space-y-4"
                    >
                      <h3 className="text-base font-semibold text-black/90">
                        Change Password
                      </h3>

                      <div className="space-y-3">
                        <div className="space-y-4 my-3">
                          <label className="text-xs font-semibold text-black/60 uppercase tracking-wider">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full px-3 py-2 rounded-lg border-2 border-black/10 bg-white outline-none focus:border-black transition-all cursor-pointer text-black/90"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-4 my-3">
                            <label className="text-xs font-semibold text-black/60 uppercase tracking-wider">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Minimum 8 characters"
                              className="w-full px-3 py-2 rounded-lg border-2 border-black/10 bg-white outline-none focus:border-black transition-all cursor-pointer text-black/90"
                            />
                          </div>

                          <div className="space-y-4 my-3">
                            <label className="text-xs font-semibold text-black/60 uppercase tracking-wider">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              placeholder="Re-enter new password"
                              className="w-full px-3 py-2 rounded-lg border-2 border-black/10 bg-white outline-none focus:border-black transition-all cursor-pointer text-black/90"
                            />
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePasswordChange}
                          disabled={isSaving}
                          className="px-4 py-2 rounded-lg bg-black text-white font-medium hover:bg-black/90 transition-all cursor-pointer text-sm disabled:opacity-50 flex items-center gap-2"
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
                                <IconLoader2 className="w-4 h-4" />
                              </motion.div>
                              Updating...
                            </>
                          ) : (
                            "Update Password"
                          )}
                        </motion.button>
                      </div>
                    </motion.div>

                    <SectionHeading
                      title="Account Security"
                      icon={<IconShield className="w-4 h-4 text-neutral-500" />}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-black/90 mb-1">
                            Two-Factor Authentication
                          </h3>
                          <p className="text-xs text-black/50">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={handleTwoFactorToggle}
                          disabled={isTwoFactorLoading}
                          className={cn(
                            "relative w-12 h-6 rounded-full transition-all cursor-pointer disabled:opacity-50",
                            twoFactorEnabled ? "bg-black" : "bg-black/20",
                          )}
                        >
                          <motion.div
                            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center"
                            animate={{
                              left: twoFactorEnabled ? "26px" : "2px",
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          >
                            {isTwoFactorLoading && (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              >
                                <IconLoader2 className="w-3 h-3 text-black" />
                              </motion.div>
                            )}
                          </motion.div>
                        </motion.button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 space-y-4"
                    >
                      <h3 className="text-base font-semibold text-black/90">
                        Connected Accounts
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-black/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-red-500 to-orange-500 flex items-center justify-center">
                              <IconBrandGoogle className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-black/90">
                                Google
                              </p>
                              <p className="text-xs text-black/50">Connected</p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-all cursor-pointer"
                          >
                            Disconnect
                          </motion.button>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-black/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                              <IconBrandApple className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-black/90">
                                Apple
                              </p>
                              <p className="text-xs text-black/50">
                                Not connected
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/90 transition-all cursor-pointer"
                          >
                            Connect
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Notifications Section */}
                {activeSection === "notifications" && (
                  <div className="space-y-12">
                    <SectionHeading
                      title="Notification Channels"
                      icon={<IconBell className="w-4 h-4 text-neutral-500" />}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-black/5 hover:border-black/10 transition-all">
                          <div className="flex items-center gap-3">
                            <IconMail className="w-4 h-4 text-black/60" />
                            <div>
                              <p className="text-sm font-semibold text-black/90">
                                Email Notifications
                              </p>
                              <p className="text-xs text-black/50">
                                Receive updates via email
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() =>
                              setEmailNotifications(!emailNotifications)
                            }
                            className={cn(
                              "relative w-12 h-6 rounded-full transition-all cursor-pointer",
                              emailNotifications ? "bg-black" : "bg-black/20",
                            )}
                          >
                            <motion.div
                              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                              animate={{
                                left: emailNotifications ? "26px" : "2px",
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                            />
                          </motion.button>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-black/5 hover:border-black/10 transition-all">
                          <div className="flex items-center gap-3">
                            <IconBell className="w-4 h-4 text-black/60" />
                            <div>
                              <p className="text-sm font-semibold text-black/90">
                                Push Notifications
                              </p>
                              <p className="text-xs text-black/50">
                                Browser and mobile alerts
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() =>
                              setPushNotifications(!pushNotifications)
                            }
                            className={cn(
                              "relative w-12 h-6 rounded-full transition-all cursor-pointer",
                              pushNotifications ? "bg-black" : "bg-black/20",
                            )}
                          >
                            <motion.div
                              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                              animate={{
                                left: pushNotifications ? "26px" : "2px",
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                            />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    <SectionHeading
                      title="Notification Types"
                      icon={<IconUser className="w-4 h-4 text-neutral-500" />}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 space-y-4"
                    >
                      <div className="space-y-3">
                        {NOTIFICATION_TYPES.map((type, index) => (
                          <motion.div
                            key={type.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-white border border-black/5 hover:border-black/10 transition-all"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-black/90">
                                {type.label}
                              </p>
                              <p className="text-xs text-black/50">
                                {type.description}
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              onClick={() =>
                                setNotificationPrefs((prev) => ({
                                  ...prev,
                                  [type.id]:
                                    !prev[type.id as keyof typeof prev],
                                }))
                              }
                              className={cn(
                                "relative w-12 h-6 rounded-full transition-all cursor-pointer",
                                notificationPrefs[
                                  type.id as keyof typeof notificationPrefs
                                ]
                                  ? "bg-black"
                                  : "bg-black/20",
                              )}
                            >
                              <motion.div
                                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                                animate={{
                                  left: notificationPrefs[
                                    type.id as keyof typeof notificationPrefs
                                  ]
                                    ? "26px"
                                    : "2px",
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 30,
                                }}
                              />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Privacy Section */}
                {activeSection === "privacy" && (
                  <div className="space-y-12">
                    <SectionHeading
                      title="Profile Visibility"
                      icon={<IconShield className="w-4 h-4 text-neutral-500" />}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 space-y-4"
                    >
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-black/5 hover:border-black/10 transition-all">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-black/90">
                            Public Profile
                          </p>
                          <p className="text-xs text-black/50">
                            Allow others to view your profile
                          </p>
                        </div>
                        <motion.button className="relative w-12 h-6 rounded-full bg-black transition-all cursor-pointer">
                          <motion.div className="absolute top-0.5 left-[26px] w-5 h-5 rounded-full bg-white shadow-md" />
                        </motion.button>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-black/5 hover:border-black/10 transition-all">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-black/90">
                            Show Betting History
                          </p>
                          <p className="text-xs text-black/50">
                            Display your bets on your profile
                          </p>
                        </div>
                        <motion.button className="relative w-12 h-6 rounded-full bg-black/20 transition-all cursor-pointer">
                          <motion.div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md" />
                        </motion.button>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-black/5 hover:border-black/10 transition-all">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-black/90">
                            Activity Status
                          </p>
                          <p className="text-xs text-black/50">
                            Show when you're online
                          </p>
                        </div>
                        <motion.button className="relative w-12 h-6 rounded-full bg-black transition-all cursor-pointer">
                          <motion.div className="absolute top-0.5 left-[26px] w-5 h-5 rounded-full bg-white shadow-md" />
                        </motion.button>
                      </div>
                    </motion.div>

                    <SectionHeading
                      title="Data Management"
                      icon={
                        <IconCreditCard className="w-4 h-4 text-neutral-500" />
                      }
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 space-y-3"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-3 rounded-lg bg-white border border-black/5 hover:bg-black/5 transition-all cursor-pointer text-left flex items-center justify-between group"
                      >
                        <span className="text-sm font-semibold text-black/90">
                          Download My Data
                        </span>
                        <IconChevronRight className="w-4 h-4 text-black/60 group-hover:text-black/60" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-3 rounded-lg bg-white border border-black/5 hover:bg-black/5 transition-all cursor-pointer text-left flex items-center justify-between group"
                      >
                        <span className="text-sm font-semibold text-black/90">
                          Privacy Policy
                        </span>
                        <IconChevronRight className="w-4 h-4 text-black/60 group-hover:text-black/60" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-3 rounded-lg bg-white border border-black/5 hover:bg-black/5 transition-all cursor-pointer text-left flex items-center justify-between group"
                      >
                        <span className="text-sm font-semibold text-black/90">
                          Terms of Service
                        </span>
                        <IconChevronRight className="w-4 h-4 text-black/60 group-hover:text-black/60" />
                      </motion.button>
                    </motion.div>
                  </div>
                )}

                {/* Billing Section */}
                {activeSection === "billing" && (
                  <div className="space-y-12">
                    <SectionHeading
                      title="Account Tier"
                      icon={
                        <IconCreditCard className="w-4 h-4 text-neutral-500" />
                      }
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-6 rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 border border-amber-100"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-semibold text-amber-900">
                            {mockUser.user_level === "high_roller"
                              ? "High Roller"
                              : "Novice"}
                          </h3>
                        </div>
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                        >
                          <IconCreditCard className="w-6 h-6 text-amber-600" />
                        </motion.div>
                      </div>
                      <p className="text-xs text-amber-700 mb-4">
                        Daily limits: $
                        {mockUser.user_level === "high_roller"
                          ? "5,000"
                          : "500"}{" "}
                        deposits • $
                        {mockUser.user_level === "high_roller"
                          ? "1,000"
                          : "250"}{" "}
                        withdrawals
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-amber-900 text-white text-sm font-semibold hover:bg-amber-800 transition-all cursor-pointer"
                      >
                        Upgrade Tier
                      </motion.button>
                    </motion.div>

                    <SectionHeading
                      title="Transaction History"
                      icon={
                        <IconCreditCard className="w-4 h-4 text-neutral-500" />
                      }
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 space-y-3"
                    >
                      <h3 className="text-base font-semibold text-black/90">
                        Recent Transactions
                      </h3>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-3 rounded-lg bg-white border border-black/5 hover:bg-black/5 transition-all cursor-pointer text-left flex items-center justify-between group"
                      >
                        <span className="text-sm font-semibold text-black/90">
                          View All Transactions
                        </span>
                        <IconChevronRight className="w-4 h-4 text-black/60 group-hover:text-black/60" />
                      </motion.button>
                    </motion.div>

                    <SectionHeading
                      title="Danger Zone"
                      icon={
                        <IconAlertTriangle className="w-4 h-4 text-red-500" />
                      }
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-6 rounded-2xl bg-red-50 border border-red-100 space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <IconAlertTriangle className="w-4 h-4 text-red-600" />
                        <h3 className="text-base font-semibold text-red-900">
                          Danger Zone
                        </h3>
                      </div>
                      <p className="text-xs text-red-700">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <IconTrash className="w-4 h-4" />
                        Delete Account
                      </motion.button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto"
                >
                  <IconAlertTriangle className="w-6 h-6 text-red-600" />
                </motion.div>

                <div className="text-center">
                  <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-semibold text-black/90 mb-2"
                  >
                    Delete Account?
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-black/60"
                  >
                    This action cannot be undone. All your data, bets, and
                    groups will be permanently deleted.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-3 pt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2 rounded-lg bg-white border-2 border-black/10 text-black font-semibold hover:bg-black/5 transition-all cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteAccount}
                    disabled={isSaving}
                    className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
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
                          <IconLoader2 className="w-4 h-4" />
                        </motion.div>
                        Deleting...
                      </>
                    ) : (
                      "Delete Forever"
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Changes Bottom Panel */}
      <AnimatePresence>
        {hasUnsavedChanges && activeSection === "profile" && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none"
          >
            <div className="max-w-3xl mx-auto bg-black text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-full bg-white/10">
                  <IconAlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium uppercase tracking-wide text-sm">
                    Unsaved Changes
                  </p>
                  <p className="text-xs text-white/60">
                    You have modified your settings
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setUsername(mockUser.username);
                    setEmail(mockUser.email);
                    setPhone("+254712345678");
                    setLocation("Nairobi, Kenya");
                    setBio("Passionate prediction market enthusiast");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setTwoFactorEnabled(false);
                    setEmailNotifications(true);
                    setPushNotifications(true);
                    setNotificationPrefs({
                      bets: true,
                      groups: true,
                      social: false,
                      marketing: false,
                    });
                    setLanguage("en");
                    setHasUnsavedChanges(false);
                  }}
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
                        <IconLoader2 className="w-4 h-4" />
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
