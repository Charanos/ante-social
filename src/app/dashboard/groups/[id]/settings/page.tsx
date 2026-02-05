"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  IconActivity,
  IconAlertCircle,
  IconAward,
  IconBolt,
  IconCheck,
  IconCircleCheckFilled,
  IconClipboard,
  IconClock,
  IconCopy,
  IconCurrencyDollar,
  IconDeviceFloppy,
  IconDots,
  IconEdit,
  IconEye,
  IconExternalLink,
  IconFilter,
  IconGavel,
  IconGlobe,
  IconLayoutGrid,
  IconLoader2,
  IconLock,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconShield,
  IconTrash,
  IconTrendingUp,
  IconUpload,
  IconUsers,
  IconX,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { mockGroups, mockUser } from "@/lib/mockData";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";

// IconSettings Sections
type SettingsSection = "general" | "privacy" | "roles" | "markets";

export default function GroupSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupCategory, setGroupCategory] = useState("Sports");
  const [isPublic, setIsPublic] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find group data
  const group = mockGroups.find((g) => g.id === id) || mockGroups[0];
  const isPlatformAdmin = mockUser.role === "admin";
  const isGroupAdmin = group.creator_id === mockUser.id;
  const canEdit = isPlatformAdmin || isGroupAdmin;

  // Initialize state from group
  useEffect(() => {
    setGroupName(group.name);
    setGroupDescription(group.description);
    setGroupCategory(group.category || "Sports");
    setIsPublic(group.isPublic !== false);
  }, [group]);

  // Track changes
  useEffect(() => {
    const changed =
      groupName !== group.name ||
      groupDescription !== group.description ||
      groupCategory !== (group.category || "Sports") ||
      isPublic !== (group.isPublic !== false);
    setHasUnsavedChanges(changed);
  }, [groupName, groupDescription, groupCategory, isPublic, group]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
      // Show success toast
    }, 1500);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle image upload
      console.log("Uploading:", file.name);
      setShowImageUpload(false);
      setHasUnsavedChanges(true);
    }
  };

  const sections = [
    {
      id: "general",
      label: "General",
      icon: IconSettings,
      description: "Basic group information",
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: IconLock,
      description: "Access control settings",
    },
    {
      id: "roles",
      label: "Permissions",
      icon: IconShield,
      description: "Member capabilities",
    },
    {
      id: "markets",
      label: "Markets",
      icon: IconTrendingUp,
      description: "Manage betting markets",
    },
  ];

  const [markets, setMarkets] = useState([
    {
      id: "m1",
      title: "Man United vs Liverpool",
      description: "Premier League Clash - Who will win?",
      image:
        "https://images.unsplash.com/photo-1610237736387-991eb8151475?auto=format&fit=crop&q=80&w=800",
      type: "poll",
      timeLeft: "2h 30m",
      status: "active",
      pool: "45,200 KSH",
      participants: 128,
      correctOption: null as string | null,
    },
    {
      id: "m2",
      title: "Next Bitcoin ATH",
      description: "Will BTC likely break 100k before 2025?",
      image:
        "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800",
      type: "ladder",
      timeLeft: "5d 12h",
      status: "pending_confirmation",
      pool: "125,000 KSH",
      participants: 342,
      correctOption: null as string | null,
    },
    {
      id: "m3",
      title: "Best Tech Stack 2024",
      description: "Vote for the most popular frontend framework",
      image:
        "https://images.unsplash.com/photo-1607799275518-d750cc0613db?auto=format&fit=crop&q=80&w=800",
      type: "priority",
      timeLeft: "Ended",
      status: "settled",
      pool: "8,500 KSH",
      participants: 45,
      correctOption: "React",
    },
  ]);

  const filteredMarkets = markets.filter((market) => {
    const matchesSearch = market.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && market.status === "active") ||
      (filterStatus === "pending" &&
        market.status === "pending_confirmation") ||
      (filterStatus === "settled" && market.status === "settled");
    return matchesSearch && matchesFilter;
  });

  const getTypeStyles = (type: string) => {
    switch (type.toLowerCase()) {
      case "poll":
        return { label: "Poll", color: "blue", icon: IconClipboard };
      case "reflex":
        return { label: "Reflex", color: "amber", icon: IconActivity };
      case "ladder":
        return { label: "Ladder", color: "purple", icon: IconAward };
      case "betrayal":
        return { label: "Betrayal", color: "red", icon: IconBolt };
      default:
        return { label: "Market", color: "gray", icon: IconAlertCircle };
    }
  };

  return (
    <div className="min-h-screen pl-0 md:pl-8 pb-20">
      <DashboardHeader
        user={mockUser}
        subtitle={`Manage configuration and permissions for ${group.name}`}
      />

      <div className="w-full mx-auto px-0 md:px-4 space-y-8">
        {/* Global Group Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/60">
                    Group Members
                  </p>
                  <p className="mt-2 text-3xl font-medium numeric text-blue-900">
                    {group.member_count}
                  </p>
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
                  <p className="text-sm font-medium text-green-900/60">
                    Security Level
                  </p>
                  <p className="mt-2 text-xl font-medium text-green-900 uppercase tracking-tight">
                    {group.isPublic ? "PUBLIC" : "PRIVATE"}
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconShield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-linear-to-br from-amber-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-100/50 blur-2xl transition-all group-hover:bg-amber-200/50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-900/60 text-[10px] uppercase tracking-widest">
                    Your Status
                  </p>
                  <p className="mt-2 text-xl font-medium text-amber-900">
                    Group Admin
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                  <IconGlobe className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="IconSearch within settings..."
          tabs={[{ id: "all", label: "All Settings" }]}
          activeTab="all"
          onTabChange={() => {}}
          className="w-full my-16"
          sticky={false}
        />

        {/* Visual Separator */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-black/10 to-transparent" />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky Sidebar Navigation */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-28 space-y-3">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() =>
                    setActiveSection(section.id as SettingsSection)
                  }
                  className={cn(
                    "w-full text-left px-5 py-3 rounded-2xl cursor-pointer transition-all flex items-start gap-4 group relative",
                    activeSection === section.id
                      ? "bg-white text-black shadow-lg ring-2 ring-black/5"
                      : "text-black/50 hover:bg-white/80 hover:text-black/80 hover:shadow-md",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-xl transition-all shrink-0",
                      activeSection === section.id
                        ? "bg-black text-white shadow-md"
                        : "bg-black/5 text-black/40 group-hover:bg-black/10",
                    )}
                  >
                    <section.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="font-medium text-sm mb-1">{section.label}</p>
                    <p className="text-xs opacity-70 line-clamp-2 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                  {activeSection === section.id && (
                    <motion.div
                      layoutId="activeSetting"
                      className="absolute left-0 top-0 bottom-0 w-1.5 bg-black rounded-r-full"
                    />
                  )}
                </button>
              ))}

              {canEdit && (
                <div className="pt-6 mt-6 border-t border-black/10">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full text-left p-5 rounded-2xl hover:bg-red-50 text-red-600 transition-all flex items-center gap-4 group border-2 border-transparent hover:border-red-200"
                  >
                    <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                      <IconTrash className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Delete Group</p>
                      <p className="text-xs opacity-70 mt-0.5">
                        Permanently remove
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {activeSection === "general" && (
                  <div className="pl-6 space-y-10">
                    <div>
                      <h2 className="text-3xl font-medium flex items-center gap-3 text-black/90">
                        General Information
                      </h2>
                      <p className="text-black/60 text-sm mt-3 leading-relaxed">
                        Customize your group's basic details and appearance.
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* Group Image */}
                      <div className="p-6 rounded-2xl bg-linear-to-br from-neutral-50 to-white border border-black/5">
                        <label className="block text-sm font-medium text-black/70 mb-5 uppercase tracking-wider">
                          Group Logo
                        </label>
                        <div className="flex items-start gap-8">
                          <div
                            onClick={canEdit ? handleImageUpload : undefined}
                            className={cn(
                              "w-40 h-40 rounded-3xl bg-linear-to-br from-black/5 to-black/10 border-3 border-black/10 flex items-center justify-center relative overflow-hidden group shadow-lg",
                              canEdit &&
                                "cursor-pointer hover:border-black/30 hover:shadow-xl transition-all active:scale-95",
                            )}
                          >
                            {group.image ? (
                              <Image
                                src={group.image}
                                alt={group.name}
                                className="object-cover"
                              />
                            ) : (
                              <IconUsers className="w-16 h-16 text-black/20" />
                            )}
                            {canEdit && (
                              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all gap-2">
                                <IconPhoto className="w-10 h-10 text-white" />
                                <p className="text-xs font-medium text-white uppercase tracking-wider">
                                  Change
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="space-y-4 flex-1">
                            <div className="space-y-2 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                              <p className="text-xs font-medium text-blue-900 uppercase tracking-wider flex items-center gap-2">
                                <IconAlertCircle className="w-3.5 h-3.5" />
                                Image Guidelines
                              </p>
                              <ul className="text-xs text-blue-700 space-y-1 ml-5 list-disc">
                                <li>Recommended size: 400×400px</li>
                                <li>Maximum file size: 2MB</li>
                                <li>Formats: JPG, PNG, WEBP</li>
                              </ul>
                            </div>
                            {canEdit && (
                              <div className="flex gap-3">
                                <button
                                  onClick={handleImageUpload}
                                  className="px-6 py-2 bg-black hover:bg-black/90 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-black/20 hover:shadow-xl active:scale-95"
                                >
                                  <IconUpload className="w-4 h-4" />
                                  IconUpload New
                                </button>
                                {group.image && (
                                  <button className="px-6 py-2 hover:bg-red-50 text-red-600 border-2 border-red-200 rounded-xl text-sm font-medium transition-all hover:border-red-300 active:scale-95">
                                    <IconX className="w-4 h-4 inline mr-1.5" />
                                    Remove
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>

                      <div className="h-px w-full bg-linear-to-r from-transparent via-black/10 to-transparent" />

                      {/* Name & ID */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-black/70 uppercase tracking-wider">
                            Group Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            disabled={!canEdit}
                            className="w-full px-5 py-3 bg-white border-2 border-black/20 rounded-xl focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 disabled:opacity-50 disabled:bg-black/2 font-medium text-black/90 transition-all shadow-sm hover:border-black/30"
                            placeholder="Enter group name"
                          />
                          <p className="text-xs text-black/40 flex items-center gap-1.5">
                            <IconAlertCircle className="w-3.5 h-3.5" />
                            This is how your group appears across the platform
                          </p>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-black/70 uppercase tracking-wider">
                            Group Handle
                          </label>
                          <div className="flex">
                            <span className="px-5 py-2 bg-black/5 border-2 border-black/20 border-r-0 rounded-l-xl text-black/60 text-sm flex items-center font-mono font-medium shadow-sm">
                              @
                            </span>
                            <input
                              type="text"
                              defaultValue={id}
                              disabled={!canEdit}
                              className="flex-1 px-5 py-3 bg-white border-2 border-black/20 border-l-0 rounded-r-xl focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 disabled:opacity-50 disabled:bg-black/2 font-medium font-mono text-black/90 transition-all shadow-sm hover:border-black/30"
                            />
                          </div>
                          <p className="text-xs text-black/40 flex items-center gap-1.5">
                            <IconLock className="w-3.5 h-3.5" />
                            Handle cannot be changed once created
                          </p>
                        </div>
                      </div>

                      <div className="h-px w-full bg-linear-to-r from-transparent via-black/10 to-transparent" />

                      {/* Description */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-black/70 uppercase tracking-wider">
                          Description
                        </label>
                        <textarea
                          value={groupDescription}
                          onChange={(e) => setGroupDescription(e.target.value)}
                          disabled={!canEdit}
                          rows={6}
                          maxLength={300}
                          className="w-full px-5 py-4 bg-white border-2 border-black/20 rounded-xl focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 disabled:opacity-50 disabled:bg-black/2 resize-none font-normal text-black/90 transition-all shadow-sm hover:border-black/30 leading-relaxed"
                          placeholder="Describe your group's purpose, rules, and what members can expect..."
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-black/40">
                            Help potential members understand what your group is
                            about
                          </p>
                          <p className="text-xs text-black/50 font-mono font-medium px-3 py-1 bg-black/5 rounded-lg">
                            {groupDescription.length}/300
                          </p>
                        </div>
                      </div>

                      <div className="h-px w-full bg-linear-to-r from-transparent via-black/10 to-transparent" />

                      {/* Category */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-black/70 uppercase tracking-wider">
                          Category
                        </label>
                        <select
                          value={groupCategory}
                          onChange={(e) => setGroupCategory(e.target.value)}
                          disabled={!canEdit}
                          className="w-full px-5 py-4 bg-white border-2 border-black/20 rounded-xl focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 disabled:opacity-50 disabled:bg-black/2 font-medium text-black/90 transition-all shadow-sm hover:border-black/30 cursor-pointer"
                        >
                          <option>Sports</option>
                          <option>Finance</option>
                          <option>Gaming</option>
                          <option>Social</option>
                          <option>Politics</option>
                          <option>Entertainment</option>
                          <option>Technology</option>
                          <option>Science</option>
                          <option>Other</option>
                        </select>
                        <p className="text-xs text-black/40">
                          Category helps users discover your group
                        </p>
                      </div>

                      <div className="h-px w-full bg-linear-to-r from-transparent via-black/10 to-transparent" />

                      {/* Group URL Preview */}
                      <div className="p-5 rounded-xl bg-linear-to-br from-purple-50 to-pink-50 border border-purple-100">
                        <p className="text-xs font-medium text-purple-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <IconExternalLink className="w-3.5 h-3.5" />
                          Group URL Preview
                        </p>
                        <div className="flex items-center gap-3">
                          <code className="flex-1 px-4 py-2 bg-white rounded-lg text-sm font-mono text-purple-900 border border-purple-200">
                            ante.social/groups/{id}
                          </code>
                          <button className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all active:scale-95">
                            <IconCopy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "privacy" && (
                  <div className="pl-6 space-y-10">
                    <div>
                      <h2 className="text-3xl font-medium flex items-center gap-3 text-black/90">
                        Privacy & Access
                      </h2>
                      <p className="text-black/60 text-sm mt-3 leading-relaxed">
                        Control who can discover and join your group.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Visibility Toggle */}
                      <div className="p-4 rounded-2xl border-2 border-black/10 bg-linear-to-br from-blue-50/50 to-transparent hover:border-blue-200 transition-all shadow-sm">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex gap-5">
                            <div className="p-4 bg-blue-500 rounded-xl shadow-lg h-fit">
                              {isPublic ? (
                                <IconGlobe className="w-4 h-4 text-white" />
                              ) : (
                                <IconLock className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-medium text-lg text-black/90">
                                {isPublic ? "Public Group" : "Private Group"}
                              </h3>
                              <p className="text-sm text-black/60 leading-relaxed max-w-md">
                                {isPublic
                                  ? "Anyone can search for and view this group. Markets and activities are visible to all users."
                                  : "Only members can view this group. Hidden from public search and discovery."}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => canEdit && setIsPublic(!isPublic)}
                            disabled={!canEdit}
                            className={cn(
                              "relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner",
                              isPublic ? "bg-black" : "bg-black/20",
                            )}
                          >
                            <span
                              className={cn(
                                "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition-all duration-300",
                                isPublic ? "translate-x-8" : "translate-x-0",
                              )}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Join IconSettings */}
                      <div className="space-y-5">
                        <h3 className="font-medium text-sm text-black/60 uppercase tracking-widest flex items-center gap-2">
                          <IconUsers className="w-4 h-4" />
                          Membership IconSettings
                        </h3>
                        <div className="space-y-3">
                          <label className="flex items-start gap-4 p-5 rounded-xl hover:bg-black/2 cursor-pointer transition-all group border-2 border-transparent hover:border-black/10">
                            <div className="w-6 h-6 rounded-lg border-2 border-black/30 flex items-center justify-center text-white bg-black shrink-0 mt-0.5 group-hover:scale-110 transition-transform shadow-sm">
                              <IconCircleCheckFilled className="w-4 h-4" />
                            </div>
                            <div className="space-y-1.5 flex-1">
                              <span className="text-sm font-medium text-black/90">
                                Require Admin Approval
                              </span>
                              <p className="text-xs text-black/50 leading-relaxed">
                                All join requests must be reviewed and approved
                                by group administrators
                              </p>
                            </div>
                          </label>
                          <label className="flex items-start gap-4 p-5 rounded-xl hover:bg-black/2 cursor-pointer transition-all group border-2 border-transparent hover:border-black/10">
                            <div className="w-6 h-6 rounded-lg border-2 border-black/20 flex items-center justify-center bg-white shrink-0 mt-0.5 group-hover:border-black/40 transition-all"></div>
                            <div className="space-y-1.5 flex-1">
                              <span className="text-sm font-medium text-black/90">
                                Membership Questions
                              </span>
                              <p className="text-xs text-black/50 leading-relaxed">
                                Ask custom screening questions when users
                                request to join
                              </p>
                            </div>
                          </label>
                          <label className="flex items-start gap-4 p-5 rounded-xl hover:bg-black/2 cursor-pointer transition-all group border-2 border-transparent hover:border-black/10">
                            <div className="w-6 h-6 rounded-lg border-2 border-black/20 flex items-center justify-center bg-white shrink-0 mt-0.5 group-hover:border-black/40 transition-all"></div>
                            <div className="space-y-1.5 flex-1">
                              <span className="text-sm font-medium text-black/90">
                                Invite-Only Mode
                              </span>
                              <p className="text-xs text-black/50 leading-relaxed">
                                Only existing members can invite others to join
                                the group
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Content Visibility */}
                      <div className="space-y-5">
                        <h3 className="font-medium text-sm text-black/60 uppercase tracking-widest flex items-center gap-2">
                          <IconEye className="w-4 h-4" />
                          Content Visibility
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-5 rounded-xl border-2 border-black/10 bg-linear-to-br from-white to-neutral-50 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-black/5 rounded-lg">
                                  <IconTrendingUp className="w-4 h-4 text-black/60" />
                                </div>
                                <span className="text-sm font-medium text-black/90">
                                  Markets
                                </span>
                              </div>
                              <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                PUBLIC
                              </div>
                            </div>
                            <p className="text-xs text-black/50">
                              All betting markets are visible to everyone
                            </p>
                          </div>
                          <div className="p-5 rounded-xl border-2 border-black/10 bg-linear-to-br from-white to-neutral-50 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-black/5 rounded-lg">
                                  <IconUsers className="w-4 h-4 text-black/60" />
                                </div>
                                <span className="text-sm font-medium text-black/90">
                                  Member List
                                </span>
                              </div>
                              <div className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                MEMBERS
                              </div>
                            </div>
                            <p className="text-xs text-black/50">
                              Only members can see the full member list
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "roles" && (
                  <div className="pl-6 space-y-10">
                    <div>
                      <h2 className="text-3xl font-medium flex items-center gap-3 text-black/90">
                        Roles & Permissions
                      </h2>
                      <p className="text-black/60 text-sm mt-3 leading-relaxed">
                        Control what members can do in your group.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <h3 className="font-medium text-sm text-black/60 uppercase tracking-widest flex items-center gap-2">
                        <IconShield className="w-4 h-4" />
                        Member Capabilities
                      </h3>
                      <div className="divide-y divide-black/5 border-2 border-black/10 rounded-2xl overflow-hidden shadow-sm">
                        {[
                          {
                            id: "create_markets",
                            title: "Create Markets",
                            desc: "Allow members to propose new betting markets for the group",
                            icon: IconTrendingUp,
                            default: true,
                          },
                          {
                            id: "post_comment",
                            title: "Post & Comment",
                            desc: "Share messages and interact in the activity feed",
                            icon: IconUsers,
                            default: true,
                          },
                          {
                            id: "invite_members",
                            title: "Invite Members",
                            desc: "Generate and share invitation links with others",
                            icon: IconUsers,
                            default: true,
                          },
                          {
                            id: "moderate_content",
                            title: "Moderate Content",
                            desc: "IconFlag inappropriate posts and comments for review",
                            icon: IconGavel,
                            default: false,
                          },
                        ].map((perm, i) => (
                          <PermissionRow
                            key={i}
                            perm={perm}
                            canEdit={canEdit}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "markets" && (
                  <div className="pl-6 space-y-8">
                    <div>
                      <h2 className="text-3xl font-medium flex items-center gap-3 text-black/90">
                        Market Management
                      </h2>
                      <p className="text-black/60 text-sm mt-3 leading-relaxed">
                        Control and settle betting markets in your group.
                      </p>
                    </div>

                    {/* Markets Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
                        <CardContent className="p-6 relative z-10">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-900/60">
                                Active Markets
                              </p>
                              <p className="mt-2 text-3xl font-medium numeric text-green-900">
                                {
                                  markets.filter((m) => m.status === "active")
                                    .length
                                }
                              </p>
                            </div>
                            <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                              <IconAward className="h-6 w-6 text-green-600" />
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
                                Total Volume
                              </p>
                              <p className="mt-2 text-3xl font-medium numeric text-purple-900">
                                {markets.reduce(
                                  (sum, m) =>
                                    sum +
                                    parseInt(
                                      m.pool.replace(/[^0-9]/g, "") || "0",
                                    ),
                                  0,
                                ) / 1000}
                                k
                              </p>
                            </div>
                            <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                              <IconCurrencyDollar className="h-6 w-6 text-purple-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Market Specific IconSearch & IconFilter */}
                    <div className="space-y-6">
                      <SearchFilterBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        placeholder="IconSearch for a specific market..."
                        tabs={[
                          { id: "all", label: "All Markets" },
                          { id: "active", label: "Active" },
                          { id: "pending", label: "Pending" },
                          { id: "settled", label: "Settled" },
                        ]}
                        activeTab={filterStatus}
                        onTabChange={setFilterStatus}
                        className="mb-0 sticky top-0 z-20"
                      />

                      {/* Markets Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredMarkets.length > 0 ? (
                          filteredMarkets.map((market) => {
                            const typeInfo = getTypeStyles(market.type);
                            const TypeIcon = typeInfo.icon;
                            return (
                              <motion.div
                                key={market.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-black/5 hover:border-black/10 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                                onClick={() => setSelectedMarket(market)}
                              >
                                {/* Image Section */}
                                <div className="relative h-40 overflow-hidden bg-black/5">
                                  <Image
                                    src={market.image}
                                    alt={market.title}
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full border border-black/10 shadow-sm flex items-center gap-1.5">
                                    <TypeIcon className="w-3 h-3 text-black/60" />
                                    <span className="text-[10px] font-semibold text-black/70 uppercase tracking-widest">
                                      {typeInfo.label}
                                    </span>
                                  </div>
                                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm rounded-full flex items-center gap-1.5">
                                    <IconClock className="w-3 h-3 text-white" />
                                    <span className="text-[10px] font-medium text-white font-mono">
                                      {market.timeLeft}
                                    </span>
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h3 className="font-medium text-base text-black/90 line-clamp-1">
                                        {market.title}
                                      </h3>
                                      <p className="text-xs text-black/50 line-clamp-1 mt-0.5">
                                        {market.description}
                                      </p>
                                    </div>
                                    <span
                                      className={cn(
                                        "px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider shrink-0",
                                        market.status === "active" &&
                                          "bg-green-100 text-green-700",
                                        market.status ===
                                          "pending_confirmation" &&
                                          "bg-orange-100 text-orange-700",
                                        market.status === "settled" &&
                                          "bg-black/5 text-black/60",
                                      )}
                                    >
                                      {market.status === "pending_confirmation"
                                        ? "Pending"
                                        : market.status}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-4 text-xs font-medium text-black/60 pt-3 border-t border-black/5">
                                    <div className="flex items-center gap-1.5">
                                      <IconCurrencyDollar className="w-3.5 h-3.5 text-black/40" />
                                      {market.pool}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <IconUsers className="w-3.5 h-3.5 text-black/40" />
                                      {market.participants}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        ) : (
                          <div className="col-span-full py-12 text-center text-black/40">
                            <p className="text-sm">
                              No markets found based on your filters.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Market Management Modal */}
      <AnimatePresence>
        {selectedMarket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMarket(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-32 bg-black">
                <Image
                  src={selectedMarket.image}
                  alt={selectedMarket.title}
                  className="object-cover opacity-60"
                />
                <button
                  onClick={() => setSelectedMarket(null)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all"
                >
                  <IconX className="w-5 h-5" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md",
                        selectedMarket.status === "active" &&
                          "bg-green-500/80 text-white",
                        selectedMarket.status === "pending_confirmation" &&
                          "bg-orange-500/80 text-white",
                        selectedMarket.status === "settled" &&
                          "bg-white/20 text-white",
                      )}
                    >
                      {selectedMarket.status.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white leading-tight">
                    {selectedMarket.title}
                  </h3>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="space-y-1">
                    <p className="text-xs text-black/40 font-medium uppercase tracking-wider">
                      Pool Size
                    </p>
                    <p className="text-lg font-mono font-semibold text-black/80">
                      {selectedMarket.pool}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-black/40 font-medium uppercase tracking-wider">
                      Participants
                    </p>
                    <p className="text-lg font-mono font-semibold text-black/80">
                      {selectedMarket.participants}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-black/40 font-medium uppercase tracking-wider">
                      Created
                    </p>
                    <p className="text-lg font-mono font-semibold text-black/80">
                      2d ago
                    </p>
                  </div>
                </div>

                {/* Actions based on Status */}
                {(isPlatformAdmin || isGroupAdmin) && (
                  <div className="space-y-6">
                    {/* Active State Actions */}
                    {selectedMarket.status === "active" && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-black/5 border border-black/5 space-y-3">
                          <label className="text-sm font-semibold text-black/70">
                            Management Options
                          </label>
                          <div className="flex gap-3">
                            <button className="flex-1 py-2.5 px-4 bg-white border border-black/10 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2">
                              <IconEdit className="w-4 h-4" />
                              IconEdit Details
                            </button>
                            <button className="flex-1 py-2.5 px-4 bg-white border border-black/10 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-2">
                              <IconX className="w-4 h-4" />
                              Cancel Market
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pending Confirmation - Settle Actions */}
                    {selectedMarket.status === "pending_confirmation" && (
                      <div className="space-y-4">
                        <p className="text-sm font-semibold text-black/80 flex items-center gap-2">
                          <IconGavel className="w-4 h-4" />
                          Determine Winner
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {["Man United", "Liverpool", "Draw"].map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                const updated = markets.map((m) =>
                                  m.id === selectedMarket.id
                                    ? { ...m, correctOption: option }
                                    : m,
                                );
                                setMarkets(updated);
                                setSelectedMarket({
                                  ...selectedMarket,
                                  correctOption: option,
                                });
                              }}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-xl border-2 transition-all",
                                selectedMarket.correctOption === option
                                  ? "border-black bg-black/5"
                                  : "border-transparent bg-neutral-50 hover:bg-neutral-100",
                              )}
                            >
                              <span className="font-medium text-sm">
                                {option}
                              </span>
                              {selectedMarket.correctOption === option && (
                                <IconCircleCheckFilled className="w-4 h-4 text-black" />
                              )}
                            </button>
                          ))}
                        </div>
                        <button
                          disabled={!selectedMarket.correctOption}
                          onClick={() => {
                            const updated = markets.map((m) =>
                              m.id === selectedMarket.id
                                ? { ...m, status: "settled" }
                                : m,
                            );
                            setMarkets(updated);
                            setSelectedMarket({
                              ...selectedMarket,
                              status: "settled",
                            });
                          }}
                          className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <IconCheck className="w-4 h-4" />
                          Confirm Result
                        </button>
                      </div>
                    )}

                    {/* Settled View */}
                    {selectedMarket.status === "settled" && (
                      <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <IconAward className="w-5 h-5 text-green-700" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-green-800 uppercase tracking-wider">
                              Winner Declared
                            </p>
                            <p className="text-lg font-medium text-green-900">
                              {selectedMarket.correctOption}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <IconAlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-medium text-black/90">
                    Delete Group?
                  </h3>
                  <p className="text-black/60 leading-relaxed">
                    This action cannot be undone. All markets, member data, and
                    activity will be permanently removed.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-2 bg-black/5 hover:bg-black/10 text-black/70 font-medium rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-red-600/30">
                    Delete Forever
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Changes Bottom Bar */}
      <AnimatePresence>
        {hasUnsavedChanges && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none"
          >
            <div className="max-w-3xl mx-auto bg-black text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-full bg-white/10">
                  <IconAlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium uppercase tracking-wide text-sm">
                    Unsaved Changes
                  </p>
                  <p className="text-xs text-white/60">
                    You have modified group settings
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <IconLoader2 className="w-4 h-4 animate-spin" />
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

function PermissionRow({ perm, canEdit }: { perm: any; canEdit: boolean }) {
  const [enabled, setEnabled] = useState(perm.default);
  return (
    <div className="flex items-center justify-between p-6 bg-white hover:bg-neutral-50 transition-all group">
      <div className="flex items-start gap-5">
        <div
          className={cn(
            "p-3 rounded-xl transition-all",
            enabled ? "bg-black/10" : "bg-black/5 group-hover:bg-black/10",
          )}
        >
          <perm.icon
            className={cn(
              "w-5 h-5 transition-colors",
              enabled ? "text-black/70" : "text-black/40",
            )}
          />
        </div>
        <div className="space-y-1.5">
          <h4 className="font-medium text-sm text-black/90">{perm.title}</h4>
          <p className="text-xs text-black/50 leading-relaxed max-w-md">
            {perm.desc}
          </p>
        </div>
      </div>
      <button
        onClick={() => canEdit && setEnabled(!enabled)}
        disabled={!canEdit}
        className={cn(
          "w-14 h-8 rounded-full relative transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-inner",
          enabled ? "bg-black" : "bg-black/10",
        )}
      >
        <div
          className={cn(
            "absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all",
            enabled ? "left-7" : "left-1",
          )}
        />
      </button>
    </div>
  );
}
