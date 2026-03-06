"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconAccessPoint,
  IconAlertTriangle,
  IconAward,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconCurrencyDollar,
  IconDeviceFloppy,
  IconGitBranch,
  IconLayersOff,
  IconLoader3,
  IconPhoto,
  IconPlus,
  IconStar,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/utils/currency";

const MARKET_TYPES = [
  {
    id: "poll",
    name: "Poll-Style",
    icon: IconUsers,
    description: "Option with most votes wins",
    color: "blue",
    backendType: "consensus",
  },
  {
    id: "betrayal",
    name: "Betrayal Game",
    icon: IconAlertTriangle,
    description: "Cooperate or betray",
    color: "red",
    backendType: "betrayal",
  },
  {
    id: "reflex",
    name: "Reflex Reaction",
    icon: IconAccessPoint,
    description: "5-second prediction test",
    color: "amber",
    backendType: "reflex",
  },
  {
    id: "ladder",
    name: "Majority Ladder",
    icon: IconLayersOff,
    description: "Rank items by prediction",
    color: "purple",
    backendType: "ladder",
  },
  {
    id: "divergence",
    name: "Consensus Divergence",
    icon: IconGitBranch,
    description: "Minority opinion wins big",
    color: "green",
    backendType: "divergence",
  },
];

const COLOR_MAP: Record<string, { bg: string; blur: string; title: string; subtitle: string; icon: string; border: string; activeBorder: string }> = {
  blue:   { bg: "from-blue-50/50 via-white/50 to-white/50",   blur: "bg-blue-100/50",   title: "text-blue-900",   subtitle: "text-blue-800",   icon: "text-blue-600",   border: "border-blue-100/50",   activeBorder: "border-blue-500"   },
  red:    { bg: "from-red-50/50 via-white/50 to-white/50",    blur: "bg-red-100/50",    title: "text-red-900",    subtitle: "text-red-800",    icon: "text-red-600",    border: "border-red-100/50",    activeBorder: "border-red-500"    },
  amber:  { bg: "from-amber-50/50 via-white/50 to-white/50",  blur: "bg-amber-100/50",  title: "text-amber-900",  subtitle: "text-amber-800",  icon: "text-amber-600",  border: "border-amber-100/50",  activeBorder: "border-amber-500"  },
  purple: { bg: "from-purple-50/50 via-white/50 to-white/50", blur: "bg-purple-100/50", title: "text-purple-900", subtitle: "text-purple-800", icon: "text-purple-600", border: "border-purple-100/50", activeBorder: "border-purple-500" },
  green:  { bg: "from-green-50/50 via-white/50 to-white/50",  blur: "bg-green-100/50",  title: "text-green-900",  subtitle: "text-green-800",  icon: "text-green-600",  border: "border-green-100/50",  activeBorder: "border-green-500"  },
};

const STEPS = [
  { id: 1, title: "Type" },
  { id: 2, title: "Details" },
  { id: 3, title: "Outcomes" },
  { id: 4, title: "Config" },
];

const CATEGORIES = ["Sports", "Politics", "Crypto", "Pop Culture", "Business", "Science", "Technology", "Gaming", "Other"];

interface Option { id: number; text: string; emoji: string; imageUrl: string }

interface MarketCreationFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  onCancel: () => void;
}

export function MarketCreationForm({ initialData, onSubmit, isSubmitting = false, onCancel }: MarketCreationFormProps) {
  const { symbol, preferredCurrency } = useCurrency();
  const [step, setStep] = useState(1);

  // Step 1 – Type
  const [selectedType, setSelectedType] = useState<string | null>(initialData?.type || null);

  // Step 2 – Details
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [mediaUrl, setMediaUrl] = useState(initialData?.mediaUrl || "");

  // Step 3 – Outcomes
  const [options, setOptions] = useState<Option[]>(
    initialData?.options || [
      { id: 1, text: "", emoji: "", imageUrl: "" },
      { id: 2, text: "", emoji: "", imageUrl: "" },
    ]
  );
  const [ladderItems, setLadderItems] = useState<Option[]>(
    initialData?.ladderItems || [
      { id: 1, text: "", emoji: "", imageUrl: "" },
      { id: 2, text: "", emoji: "", imageUrl: "" },
      { id: 3, text: "", emoji: "", imageUrl: "" },
    ]
  );
  const [scenario, setScenario] = useState(initialData?.scenario || "");

  // Step 4 – Config
  const [buyIn, setBuyIn] = useState(initialData?.buyIn || "");
  const [buyInCurrency, setBuyInCurrency] = useState<"KSH" | "USD">(initialData?.buyInCurrency || preferredCurrency || "KSH");
  const [closeDate, setCloseDate] = useState(initialData?.closeDate || "");

  const handleNext = () => {
    if (step === 1 && !selectedType) return;
    if (step === 2 && (!title || !description)) return;
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = () => {
    onSubmit({ type: selectedType, title, description, category, isFeatured, mediaUrl, buyIn, buyInCurrency, closeDate, options, ladderItems, scenario });
  };

  const updateOption = (idx: number, field: keyof Option, value: string) => {
    setOptions((prev) => prev.map((o, i) => i === idx ? { ...o, [field]: value } : o));
  };

  const updateLadder = (idx: number, field: keyof Option, value: string) => {
    setLadderItems((prev) => prev.map((o, i) => i === idx ? { ...o, [field]: value } : o));
  };

  const addOption = () => setOptions((prev) => [...prev, { id: Date.now(), text: "", emoji: "", imageUrl: "" }]);
  const removeOption = (id: number) => options.length > 2 && setOptions((prev) => prev.filter((o) => o.id !== id));
  const addLadder = () => setLadderItems((prev) => [...prev, { id: Date.now(), text: "", emoji: "", imageUrl: "" }]);
  const removeLadder = (id: number) => ladderItems.length > 3 && setLadderItems((prev) => prev.filter((o) => o.id !== id));

  return (
    <div className="w-full">
      {/* Progress Steps */}
      <div className="mb-8 mt-2">
        <div className="flex items-center justify-between relative z-10">
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
              <div className={cn("w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-all duration-500 border-2",
                step >= s.id ? "bg-black border-black text-white shadow-lg shadow-black/20" : "bg-white/50 backdrop-blur-sm border-neutral-200 text-neutral-400"
              )}>
                {step > s.id ? <IconPlus className="w-4 h-4 rotate-45" /> : s.id}
              </div>
              <span className={cn("text-[10px] font-semibold uppercase tracking-widest transition-colors duration-300 hidden md:block", step >= s.id ? "text-black" : "text-neutral-400")}>
                {s.title}
              </span>
            </div>
          ))}
          <div className="absolute top-4 md:top-5 left-0 w-full h-0.5 bg-neutral-200/50 -z-10" />
          <div className="absolute top-4 md:top-5 left-0 h-0.5 bg-black transition-all duration-500 -z-10" style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 1: Market Type ── */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
              <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Select Market Type</h2>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {MARKET_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                const colors = COLOR_MAP[type.color];
                return (
                  <motion.button key={type.id} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedType(type.id)}
                    className={cn("relative p-6 rounded-2xl border-2 transition-all cursor-pointer text-left overflow-hidden group min-h-[140px]",
                      isSelected ? `bg-linear-to-br ${colors.bg.replace(/\/50/g, "")} ${colors.activeBorder} shadow-lg scale-[1.02]` : `bg-linear-to-br ${colors.bg} ${colors.border} hover:border-black/10 hover:shadow-md`)}
                  >
                    <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-all duration-500 opacity-60 group-hover:opacity-100", colors.blur)} />
                    <div className="relative z-10 flex flex-col gap-4 h-full">
                      <div className={cn("p-3 rounded-xl w-fit shadow-sm backdrop-blur-sm transition-all", isSelected ? "bg-white/90" : "bg-white/70")}>
                        <Icon className={cn("w-6 h-6", colors.icon)} />
                      </div>
                      <div>
                        <h3 className={cn("font-medium mb-1 transition-colors text-lg", colors.title)}>{type.name}</h3>
                        <p className={cn("text-xs transition-colors line-clamp-2", colors.subtitle)}>{type.description}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            <div className="flex justify-center">
              <button onClick={handleNext} disabled={!selectedType}
                className="px-8 py-2 rounded-xl bg-black text-white font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed">
                Continue <IconChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Details ── */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
              <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Market Details</h2>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
            </div>

            <DashboardCard className="p-6 mb-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Market Title <span className="text-red-500">*</span></label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., What's your vibe right now?"
                    className="w-full px-4 py-3 text-neutral-900 font-medium rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Description <span className="text-red-500">*</span></label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                    placeholder="Provide details about the market..."
                    className="w-full px-4 py-3 text-neutral-900 font-medium rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none transition-colors resize-none bg-white/50 backdrop-blur-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 text-neutral-900 font-medium rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm">
                      <option value="">Select category...</option>
                      {CATEGORIES.map((c) => <option key={c} value={c.toLowerCase().replace(" ", "_")}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">Market Cover Image URL</label>
                    <div className="relative">
                      <IconPhoto className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input type="url" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full pl-9 pr-4 py-3 text-neutral-900 font-medium rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm" />
                    </div>
                  </div>
                </div>
                <div>
                  <button type="button" onClick={() => setIsFeatured(!isFeatured)}
                    className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all cursor-pointer w-full text-left",
                      isFeatured ? "border-amber-400 bg-amber-50" : "border-neutral-200 bg-white/50 hover:border-neutral-300")}>
                    <IconStar className={cn("w-5 h-5 transition-colors", isFeatured ? "text-amber-500 fill-amber-500" : "text-neutral-400")} />
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Feature on Dashboard</p>
                      <p className="text-xs text-neutral-500">Pin this market to the main discover feed</p>
                    </div>
                  </button>
                </div>
              </div>
            </DashboardCard>

            <div className="flex gap-4">
              <button onClick={handleBack} className="flex-1 py-2 rounded-xl border-2 text-black border-neutral-200 bg-white font-semibold hover:bg-neutral-50 transition-colors cursor-pointer flex items-center justify-center gap-2">
                <IconChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={handleNext} disabled={!title || !description}
                className="flex-2 py-2 rounded-xl bg-black text-white font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed">
                Continue <IconChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Outcomes / Options ── */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
              <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Outcomes & Options</h2>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
            </div>

            {/* Poll options */}
            {(selectedType === "poll" || selectedType === "divergence") && (
              <DashboardCard className="p-6 mb-6">
                <h3 className="text-lg font-medium text-neutral-900 mb-2">{selectedType === "divergence" ? "Divergence Options" : "Poll Options"}</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  {selectedType === "divergence"
                    ? "Minority picks earn a multiplier bonus. Add options with optional images."
                    : "Add options for participants to vote on. Winners split the pool pro-rata."}
                </p>
                <div className="space-y-4">
                  {options.map((option, index) => (
                    <div key={option.id} className="p-4 rounded-xl border-2 border-neutral-100 bg-neutral-50/50 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-medium text-blue-700 text-sm">{index + 1}</div>
                        <input type="text" value={option.text} onChange={(e) => updateOption(index, "text", e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 px-4 py-2 text-neutral-900 font-medium rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none transition-colors bg-white/50" />
                        {options.length > 2 && (
                          <button onClick={() => removeOption(option.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                            <IconX className="w-5 h-5 text-red-500" />
                          </button>
                        )}
                      </div>
                      <div className="relative pl-11">
                        <IconPhoto className="absolute left-14 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input type="url" value={option.imageUrl} onChange={(e) => updateOption(index, "imageUrl", e.target.value)}
                          placeholder="Option image URL (optional)"
                          className="w-full pl-8 pr-4 py-2 text-neutral-900 font-medium rounded-lg border-2 border-neutral-100 focus:border-blue-400 focus:outline-none transition-colors bg-white/70 text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addOption} className="mt-4 w-full py-2 border-2 border-dashed border-neutral-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-neutral-600 hover:text-blue-600 font-medium cursor-pointer">
                  <IconPlus className="w-5 h-5" /> Add Option
                </button>
              </DashboardCard>
            )}

            {/* Reflex options */}
            {selectedType === "reflex" && (
              <DashboardCard className="p-6 mb-6">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Reflex Test Configuration</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">Scenario <span className="text-red-500">*</span></label>
                    <textarea value={scenario} onChange={(e) => setScenario(e.target.value)} rows={2}
                      placeholder="e.g., When suddenly added to a group chat, what's your first reaction?"
                      className="w-full px-4 py-3 text-neutral-900 font-medium rounded-lg border-2 border-neutral-200 focus:border-amber-500 focus:outline-none transition-colors resize-none bg-white/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">Quick Options (5-second choices) <span className="text-red-500">*</span></label>
                    <div className="space-y-4">
                      {options.map((option, index) => (
                        <div key={option.id} className="p-4 rounded-xl border-2 border-neutral-100 bg-neutral-50/50 space-y-3">
                          <div className="flex items-center gap-3">
                            <input type="text" value={option.emoji} onChange={(e) => updateOption(index, "emoji", e.target.value)} placeholder="🏃" maxLength={2}
                              className="w-16 text-center text-2xl px-2 py-2 text-neutral-900 font-medium rounded-lg border-2 border-neutral-200 focus:border-amber-500 focus:outline-none bg-white/50" />
                            <input type="text" value={option.text} onChange={(e) => updateOption(index, "text", e.target.value)} placeholder={`Option ${index + 1}`}
                              className="flex-1 px-4 py-2 text-neutral-900 font-medium rounded-lg border-2 border-neutral-200 focus:border-amber-500 focus:outline-none bg-white/50" />
                            {options.length > 2 && (
                              <button onClick={() => removeOption(option.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                <IconX className="w-5 h-5 text-red-500" />
                              </button>
                            )}
                          </div>
                          <div className="relative pl-0">
                            <IconPhoto className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input type="url" value={option.imageUrl} onChange={(e) => updateOption(index, "imageUrl", e.target.value)} placeholder="Option image URL (optional)"
                              className="w-full pl-9 pr-4 py-2 text-neutral-900 font-medium rounded-lg border-2 border-neutral-100 focus:border-amber-400 focus:outline-none bg-white/70 text-sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={addOption} className="mt-3 w-full py-2 border-2 border-dashed border-neutral-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors flex items-center justify-center gap-2 text-neutral-600 hover:text-amber-600 font-medium cursor-pointer">
                      <IconPlus className="w-5 h-5" /> Add Option
                    </button>
                  </div>
                </div>
              </DashboardCard>
            )}

            {/* Ladder items */}
            {selectedType === "ladder" && (
              <DashboardCard className="p-6 mb-6">
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Ranking Items</h3>
                <p className="text-sm text-neutral-600 mb-4">Create items for participants to rank. Winners match the majority's exact order.</p>
                <div className="space-y-4">
                  {ladderItems.map((item, index) => (
                    <div key={item.id} className="p-4 rounded-xl border-2 border-neutral-100 bg-neutral-50/50 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-medium text-purple-700 text-sm">{index + 1}</div>
                        <input type="text" value={item.emoji} onChange={(e) => updateLadder(index, "emoji", e.target.value)} placeholder="🐌" maxLength={2}
                          className="w-16 text-center text-2xl px-2 py-2 text-neutral-900 font-medium rounded-lg border-2 border-neutral-200 focus:border-purple-500 focus:outline-none bg-white/50" />
                        <input type="text" value={item.text} onChange={(e) => updateLadder(index, "text", e.target.value)} placeholder={`Item ${index + 1}`}
                          className="flex-1 px-4 py-2 text-neutral-900 font-medium rounded-lg border-2 border-neutral-200 focus:border-purple-500 focus:outline-none bg-white/50" />
                        {ladderItems.length > 3 && (
                          <button onClick={() => removeLadder(item.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                            <IconX className="w-5 h-5 text-red-500" />
                          </button>
                        )}
                      </div>
                      <div className="relative pl-11">
                        <IconPhoto className="absolute left-14 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input type="url" value={item.imageUrl} onChange={(e) => updateLadder(index, "imageUrl", e.target.value)} placeholder="Item image URL (optional)"
                          className="w-full pl-8 pr-4 py-2 text-neutral-900 font-medium rounded-lg border-2 border-neutral-100 focus:border-purple-400 focus:outline-none bg-white/70 text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addLadder} className="mt-4 w-full py-2 border-2 border-dashed border-neutral-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 text-neutral-600 hover:text-purple-600 font-medium cursor-pointer">
                  <IconPlus className="w-5 h-5" /> Add Item
                </button>
              </DashboardCard>
            )}

            {/* Betrayal — fixed options */}
            {selectedType === "betrayal" && (
              <DashboardCard className="p-6 mb-6 bg-linear-to-br from-red-50 to-white border-2 border-red-200">
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Betrayal Game</h3>
                <p className="text-sm text-neutral-600 mb-4">This market type has predefined mechanics: <strong>Cooperate</strong> or <strong>Betray</strong>. No additional configuration needed.</p>
                <div className="p-4 rounded-lg bg-white border border-red-200">
                  <h4 className="font-medium text-red-900 mb-2">Outcome Rules:</h4>
                  <ul className="text-sm text-neutral-700 space-y-1">
                    <li>• All cooperate → Small win for all</li>
                    <li>• Majority cooperate, minority betray → Betrayers win big</li>
                    <li>• Majority betray → Everyone loses</li>
                    <li>• All betray → Zero for everyone</li>
                  </ul>
                </div>
              </DashboardCard>
            )}

            <div className="flex gap-4">
              <button onClick={handleBack} className="flex-1 py-2 rounded-xl border-2 text-black border-neutral-200 bg-white font-semibold hover:bg-neutral-50 transition-colors cursor-pointer flex items-center justify-center gap-2">
                <IconChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={handleNext} className="flex-2 py-2 rounded-xl bg-black text-white font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2">
                Continue <IconChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 4: Config ── */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
              <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Market Configuration</h2>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
            </div>

            <DashboardCard className="p-6 mb-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Buy-in Amount <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    {/* Currency toggle */}
                    <div className="flex text-neutral-900 font-medium rounded-lg border-2 border-neutral-200 overflow-hidden shrink-0">
                      {(["KSH", "USD"] as const).map((cur) => (
                        <button key={cur} type="button" onClick={() => setBuyInCurrency(cur)}
                          className={cn("px-3 py-0 text-sm font-semibold transition-all cursor-pointer",
                            buyInCurrency === cur ? "bg-black text-white" : "bg-white text-neutral-600 hover:bg-neutral-50")}>
                          {cur}
                        </button>
                      ))}
                    </div>
                    <div className="relative flex-1">
                      <IconCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                      <input type="number" value={buyIn} onChange={(e) => setBuyIn(e.target.value)} min="1"
                        placeholder={buyInCurrency === "USD" ? "0.77" : "100"}
                        className="w-full pl-10 pr-4 py-3 text-neutral-900 font-medium rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none font-mono bg-white/50" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Close Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <IconCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input type="datetime-local" value={closeDate} onChange={(e) => setCloseDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-neutral-900 font-medium rounded-lg border-2 border-neutral-200 focus:border-blue-500 focus:outline-none bg-white/50" />
                  </div>
                </div>
              </div>
            </DashboardCard>

            <div className="flex gap-4">
              <button onClick={handleBack} className="flex-1 py-2 text-black text-neutral-900 font-medium rounded-lg border-2 border-neutral-200 bg-white hover:bg-neutral-50 font-medium transition-colors cursor-pointer">
                <span className="flex items-center justify-center gap-2"><IconChevronLeft className="w-4 h-4" /> Back</span>
              </button>
              <button onClick={handleSubmit} disabled={isSubmitting || !buyIn || !closeDate}
                className="flex-1 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
                {isSubmitting ? <><IconLoader3 className="w-5 h-5 animate-spin" /> Creating...</> : <><IconDeviceFloppy className="w-5 h-5" /> Create Market</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {step === 1 && !selectedType && (
        <div className="text-center py-12">
          <IconAward className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Choose a Market Type</h3>
          <p className="text-sm text-neutral-600">Select a market type above to begin</p>
        </div>
      )}
    </div>
  );
}
