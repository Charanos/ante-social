"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/hooks/useToast";
import { mockUser } from "@/lib/mockData";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { IconAccessPoint, IconAward, IconBriefcase, IconChevronLeft, IconChevronRight, IconCoffee, IconDeviceGamepad, IconDeviceLaptop, IconFlask, IconGlobe, IconLayersOff, IconLoader3, IconLock, IconPalette, IconPlus, IconShield, IconStar, IconTrendingUp, IconUsers } from '@tabler/icons-react';

const steps = [
  { id: 1, title: "Category" },
  { id: 2, title: "Identity" },
  { id: 3, title: "Market Type" },
  { id: 4, title: "Market Config" },
  { id: 5, title: "Review" },
];

const marketTypes = [
  {
    id: "poll",
    name: "Poll-Style",
    icon: IconUsers,
    description: "Option with most votes wins",
    color: "blue",
  },
  {
    id: "betrayal",
    name: "Betrayal Game",
    icon: IconShield,
    description: "Cooperate or betray",
    color: "red",
  },
  {
    id: "reflex",
    name: "Reflex Reaction",
    icon: IconAccessPoint,
    description: "5-second prediction test",
    color: "amber",
  },
  {
    id: "ladder",
    name: "Majority Ladder",
    icon: IconLayersOff,
    description: "Rank items by prediction",
    color: "purple",
  },
];

const groupCategories = [
  {
    id: "sports",
    name: "Sports",
    icon: IconAward,
    description: "Football, Basketball, F1 & more",
    color: "blue",
  },
  {
    id: "politics",
    name: "Politics",
    icon: IconGlobe,
    description: "Elections, Policy & Global Events",
    color: "red",
  },
  {
    id: "crypto",
    name: "Crypto",
    icon: IconTrendingUp,
    description: "Prices, Adoption & Memecoins",
    color: "green",
  },
  {
    id: "pop_culture",
    name: "Pop Culture",
    icon: IconStar,
    description: "Celebrities, Music & Virality",
    color: "purple",
  },
  {
    id: "business",
    name: "Business",
    icon: IconBriefcase,
    description: "Startups, Stocks & Economy",
    color: "amber",
  },
  {
    id: "science",
    name: "Science",
    icon: IconFlask,
    description: "Space, Tech & Breakthroughs",
    color: "cyan",
  },
  {
    id: "tech",
    name: "Technology",
    icon: IconDeviceLaptop,
    description: "AI, Gadgets & Software",
    color: "indigo",
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: IconDeviceGamepad,
    description: "Esports, Releases & Streamers",
    color: "violet",
  },
];

const visibilityOptions = [
  {
    id: "public",
    name: "Public",
    icon: IconGlobe,
    description: "Anyone can find and join",
    color: "blue",
  },
  {
    id: "private",
    name: "Private",
    icon: IconLock,
    description: "Join via invitation only",
    color: "red",
  },
];

export default function CreateGroupPage() {
  const router = useRouter();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Group State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVisibility, setSelectedVisibility] =
    useState<string>("public");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Market State
  const [selectedMarketType, setSelectedMarketType] = useState<string | null>(
    null,
  );
  const [marketTitle, setMarketTitle] = useState("");
  const [marketDescription, setMarketDescription] = useState("");
  const [buyIn, setBuyIn] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "", emoji: "" },
    { id: 2, text: "", emoji: "" },
  ]);

  const handleNext = () => {
    if (currentStep === 1 && !selectedCategory) {
      toast.error("Category Required", "Please select a category to continue.");
      return;
    }
    if (currentStep === 2 && (!name || !description)) {
      toast.error(
        "Group Details Required",
        "Please provide a name and description.",
      );
      return;
    }
    if (currentStep === 3 && !selectedMarketType) {
      toast.error(
        "Market Type Required",
        "Please select a market type for your first bet.",
      );
      return;
    }
    if (currentStep === 4 && (!marketTitle || !marketDescription || !buyIn)) {
      toast.error(
        "Market Details Required",
        "Please fill in all required market fields.",
      );
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    setIsCreating(true);
    toast.success(
      "Launching Experience...",
      `Creating ${name} and your first market!`,
    );

    // Simulate navigation after creation
    setTimeout(() => {
      router.push("/dashboard/groups");
    }, 1500);
  };
  if (isLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  return (
    <div className="min-h-screen pb-12 pl-0 md:pl-8">
      <div className="w-full mx-auto px-0 md:px-6 pb-8">
        <DashboardHeader
          user={mockUser}
          subtitle="Start a new community and launch your first betting market"
        />

        {/* Progress Steps */}
        <div className="mb-8 md:mb-12 mt-4 md:mt-8">
          <div className="flex items-center justify-between relative z-10 max-w-7xl mx-auto px-2 md:px-0">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className="flex flex-col items-center gap-2 md:gap-3 relative z-10"
              >
                <div
                  className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-all duration-500 border-2",
                    currentStep >= s.id
                      ? "bg-black border-black text-white shadow-lg shadow-black/20"
                      : "bg-white/50 backdrop-blur-sm border-neutral-200 text-neutral-400",
                  )}
                >
                  {currentStep > s.id ? (
                    <IconPlus className="w-4 h-4 md:w-5 md:h-5 rotate-45" />
                  ) : (
                    s.id
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-widest transition-colors duration-300 hidden md:block",
                    currentStep >= s.id ? "text-black" : "text-neutral-400",
                  )}
                >
                  {s.title}
                </span>
              </div>
            ))}
            {/* Progress Bar Background */}
            <div className="absolute top-4 md:top-5 left-0 w-full h-0.5 bg-neutral-200/50 -z-10" />
            {/* Active Progress Bar */}
            <div
              className="absolute top-4 md:top-5 left-0 h-0.5 bg-black transition-all duration-500 -z-10"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
                <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Select Category
                </h2>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 max-w-7xl mx-auto">
                {groupCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  const colorMap: Record<
                    string,
                    {
                      bg: string;
                      blur: string;
                      title: string;
                      subtitle: string;
                      icon: string;
                      border: string;
                      activeBorder: string;
                    }
                  > = {
                    blue: {
                      bg: "from-blue-50/50 via-white/50 to-white/50",
                      blur: "bg-blue-100/50",
                      title: "text-blue-900",
                      subtitle: "text-blue-800",
                      icon: "text-blue-600",
                      border: "border-blue-100/50",
                      activeBorder: "border-blue-500",
                    },
                    green: {
                      bg: "from-green-50/50 via-white/50 to-white/50",
                      blur: "bg-green-100/50",
                      title: "text-green-900",
                      subtitle: "text-green-800",
                      icon: "text-green-600",
                      border: "border-green-100/50",
                      activeBorder: "border-green-500",
                    },
                    amber: {
                      bg: "from-amber-50/50 via-white/50 to-white/50",
                      blur: "bg-amber-100/50",
                      title: "text-amber-900",
                      subtitle: "text-amber-800",
                      icon: "text-amber-600",
                      border: "border-amber-100/50",
                      activeBorder: "border-amber-500",
                    },
                    purple: {
                      bg: "from-purple-50/50 via-white/50 to-white/50",
                      blur: "bg-purple-100/50",
                      title: "text-purple-900",
                      subtitle: "text-purple-800",
                      icon: "text-purple-600",
                      border: "border-purple-100/50",
                      activeBorder: "border-purple-500",
                    },
                  };
                  const colors = colorMap[cat.color] || colorMap.blue;
                  return (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "relative p-6 rounded-2xl flex flex-col border-2 transition-all cursor-pointer text-left overflow-hidden group min-h-[160px]",
                        isSelected
                          ? `bg-linear-to-br ${colors.bg.replace(/\/50/g, "")} ${colors.activeBorder} shadow-lg scale-[1.02]`
                          : `bg-linear-to-br ${colors.bg} ${colors.border} hover:border-black/10 hover:shadow-md`,
                      )}
                    >
                      {/* Blurred background accent */}
                      <div
                        className={cn(
                          "absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-all duration-500 opacity-60 group-hover:opacity-100",
                          colors.blur,
                        )}
                      />

                      <div className="relative z-10 flex flex-col gap-4 h-full">
                        <div
                          className={cn(
                            "p-3 rounded-xl w-fit shadow-sm backdrop-blur-sm transition-all",
                            isSelected ? "bg-white/90" : "bg-white/70",
                          )}
                        >
                          <Icon className={cn("w-6 h-6", colors.icon)} />
                        </div>
                        <div>
                          <h3
                            className={cn(
                              "font-medium mb-1 transition-colors text-lg",
                              colors.title,
                            )}
                          >
                            {cat.name}
                          </h3>
                          <p
                            className={cn(
                              "text-xs transition-colors line-clamp-2",
                              colors.subtitle,
                            )}
                          >
                            {cat.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleNext}
                  className="px-8 py-2 rounded-xl bg-black text-white font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  Continue <IconChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
                <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Group Identity
                </h2>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <DashboardCard className="p-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-2">
                          Group Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g., The Elite Punter's Club"
                          className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black focus:outline-none transition-colors bg-white/50 backdrop-blur-sm text-lg font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-2">
                          Description
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                          placeholder="What's the vibe of this community?"
                          className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black focus:outline-none transition-colors resize-none bg-white/50 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                  </DashboardCard>
                </div>

                <div className="space-y-6 w-full">
                  <DashboardCard className="p-6">
                    <h3 className="text-sm font-semibold text-neutral-900 mb-4 uppercase tracking-widest">
                      Visibility
                    </h3>
                    <div className="space-y-3">
                      {visibilityOptions.map((v) => {
                        const Icon = v.icon;
                        const isSelected = selectedVisibility === v.id;
                        return (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVisibility(v.id)}
                            className={`
                                                            w-full p-4 rounded-xl border-2 transition-all text-left flex items-start gap-3 cursor-pointer
                                                            ${
                                                              isSelected
                                                                ? `border-black bg-neutral-900 text-white shadow-lg`
                                                                : "border-neutral-100 hover:border-neutral-200 bg-white/50"
                                                            }
                                                        `}
                          >
                            <div
                              className={`p-2 rounded-lg ${isSelected ? `bg-white/20` : "bg-neutral-50"}`}
                            >
                              <Icon
                                className={`w-4 h-4 ${isSelected ? `text-white` : "text-neutral-500"}`}
                              />
                            </div>
                            <div>
                              <p className="text-xs font-semibold">{v.name}</p>
                              <p
                                className={cn(
                                  "text-[10px]",
                                  isSelected
                                    ? "text-white/60"
                                    : "text-neutral-500",
                                )}
                              >
                                {v.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </DashboardCard>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleBack}
                  className="flex-1 py-2 rounded-xl border-2 text-black border-neutral-200 bg-white font-semibold hover:bg-neutral-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <IconChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-2 py-2 rounded-xl bg-black text-white font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Continue <IconChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
                <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Choose First Market Type
                </h2>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 max-w-7xl mx-auto">
                {marketTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedMarketType === type.id;
                  const colorMap: Record<
                    string,
                    {
                      bg: string;
                      blur: string;
                      title: string;
                      subtitle: string;
                      icon: string;
                      border: string;
                      activeBorder: string;
                    }
                  > = {
                    blue: {
                      bg: "from-blue-50/50 via-white/50 to-white/50",
                      blur: "bg-blue-100/50",
                      title: "text-blue-900",
                      subtitle: "text-blue-800",
                      icon: "text-blue-600",
                      border: "border-blue-100/50",
                      activeBorder: "border-blue-500",
                    },
                    red: {
                      bg: "from-red-50/50 via-white/50 to-white/50",
                      blur: "bg-red-100/50",
                      title: "text-red-900",
                      subtitle: "text-red-800",
                      icon: "text-red-600",
                      border: "border-red-100/50",
                      activeBorder: "border-red-500",
                    },
                    amber: {
                      bg: "from-amber-50/50 via-white/50 to-white/50",
                      blur: "bg-amber-100/50",
                      title: "text-amber-900",
                      subtitle: "text-amber-800",
                      icon: "text-amber-600",
                      border: "border-amber-100/50",
                      activeBorder: "border-amber-500",
                    },
                    purple: {
                      bg: "from-purple-50/50 via-white/50 to-white/50",
                      blur: "bg-purple-100/50",
                      title: "text-purple-900",
                      subtitle: "text-purple-800",
                      icon: "text-purple-600",
                      border: "border-purple-100/50",
                      activeBorder: "border-purple-500",
                    },
                  };
                  const colors = colorMap[type.color] || colorMap.blue;

                  return (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMarketType(type.id)}
                      className={cn(
                        "relative p-6 rounded-2xl border-2 transition-all cursor-pointer text-left overflow-hidden group",
                        isSelected
                          ? `bg-linear-to-br ${colors.bg} ${colors.activeBorder} shadow-lg scale-[1.02]`
                          : `bg-linear-to-br ${colors.bg} ${colors.border} hover:border-black/10 hover:shadow-md`,
                      )}
                    >
                      {/* Blurred background accent */}
                      <div
                        className={cn(
                          "absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-all duration-500 opacity-60 group-hover:opacity-100",
                          colors.blur,
                        )}
                      />

                      <div className="relative z-10 flex flex-col gap-4">
                        <div
                          className={cn(
                            "p-3 rounded-xl w-fit shadow-sm backdrop-blur-sm transition-all",
                            isSelected ? "bg-white/90" : "bg-white/70",
                          )}
                        >
                          <Icon className={cn("w-6 h-6", colors.icon)} />
                        </div>
                        <div>
                          <h3
                            className={cn(
                              "font-medium mb-1 transition-colors",
                              colors.title,
                            )}
                          >
                            {type.name}
                          </h3>
                          <p
                            className={cn(
                              "text-xs transition-colors line-clamp-2",
                              colors.subtitle,
                            )}
                          >
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex gap-4 max-w-md mx-auto">
                <button
                  onClick={handleBack}
                  className="flex-1 py-2 rounded-xl text-black border-2 border-neutral-200 bg-white font-semibold hover:bg-neutral-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <IconChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-2 py-2 rounded-xl bg-black text-white font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Continue <IconChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
                <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Market Configuration
                </h2>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
              </div>

              <DashboardCard className="p-6 mb-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Market Title
                    </label>
                    <input
                      type="text"
                      value={marketTitle}
                      onChange={(e) => setMarketTitle(e.target.value)}
                      placeholder="e.g., Will the group reach 100 members today?"
                      className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Market Rules / Description
                    </label>
                    <textarea
                      value={marketDescription}
                      onChange={(e) => setMarketDescription(e.target.value)}
                      rows={3}
                      placeholder="Provide details about how the market will be settled..."
                      className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black focus:outline-none transition-colors resize-none bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Buy-in (KSh)
                      </label>
                      <input
                        type="number"
                        value={buyIn}
                        onChange={(e) => setBuyIn(e.target.value)}
                        placeholder="100"
                        className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Closing Date
                      </label>
                      <input
                        type="datetime-local"
                        value={closeDate}
                        onChange={(e) => setCloseDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </div>
              </DashboardCard>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 py-2 text-black rounded-xl border-2 border-neutral-200 bg-white font-semibold hover:bg-neutral-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <IconChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-2 py-2 rounded-xl bg-black text-white font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Continue <IconChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-100/50">
                <IconAward className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-semibold text-black mb-4">
                Launch New Community?
              </h2>
              <p className="text-neutral-500 mb-8">
                You are about to create the group{" "}
                <span className="text-black font-semibold">"{name}"</span> and
                launch a{" "}
                <span className="text-black font-semibold">
                  "{selectedMarketType}"
                </span>{" "}
                market.
              </p>

              <DashboardCard className="p-6 mb-8 text-left bg-linear-to-br from-neutral-50 to-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-black/5">
                    <span className="text-sm text-neutral-500 font-semibold uppercase tracking-wider">
                      Group Category
                    </span>
                    <span className="text-sm font-semibold text-black bg-white px-3 py-1 rounded-full shadow-sm border border-black/5">
                      {selectedCategory}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-black/5">
                    <span className="text-sm text-neutral-500 font-semibold uppercase tracking-wider">
                      Visibility
                    </span>
                    <span className="text-sm font-semibold text-black">
                      {selectedVisibility}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-black/5">
                    <span className="text-sm text-neutral-500 font-semibold uppercase tracking-wider">
                      Opening Bet
                    </span>
                    <span className="text-sm font-semibold text-black">
                      {marketTitle}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-neutral-500 font-semibold uppercase tracking-wider">
                      Entry Fee
                    </span>
                    <span className="text-sm font-semibold text-black font-mono">
                      {buyIn} MP
                    </span>
                  </div>
                </div>
              </DashboardCard>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 py-2 text-black rounded-xl border-2 border-neutral-200 bg-white font-semibold hover:bg-neutral-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <IconChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isCreating}
                  className="flex-2 py-2 rounded-xl bg-black text-white font-semibold shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isCreating ? (
                    <>
                      <IconLoader3 className="w-5 h-5 animate-spin" />
                      Launching...
                    </>
                  ) : (
                    <>
                      <IconPlus className="w-5 h-5" />
                      Confirm & Launch
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
