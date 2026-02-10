"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconAccessPoint, IconAward, IconChevronLeft, IconChevronRight, IconCurrencyDollar, IconInfoCircle, IconLayoutGrid, IconList, IconPhoto, IconPlus, IconShield, IconTarget, IconUsers, IconX } from '@tabler/icons-react';;

import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-notification";
import { useRouter, useSearchParams } from "next/navigation";
import { marketCategories, mockUser, mockGroups } from "@/lib/mockData";

type MarketType = "poll" | "betrayal" | "reflex" | "ladder";

interface MarketFormData {
  // Group fields (if creating group)
  groupName?: string;
  groupDescription?: string;
  isPublic?: boolean;

  title: string;
  description: string;
  type: MarketType;
  category: string;
  targetGroup: string;
  image: string;
  buyIn: string;
  endDate: string;
  // Dynamic fields
  options?: { text: string; image?: string }[];
  betrayalConfig?: { splitMultiplier: number; stealMultiplier: number };
  reflexTrigger?: string;
  ladderItems?: string[];
}

const steps = [
  { id: 0, title: "Group Info" }, // Only for createGroup mode
  { id: 1, title: "Market Type" },
  { id: 2, title: "Basic Info" },
  { id: 3, title: "Configuration" },
  { id: 4, title: "Review" },
];

export function MarketCreationWizard() {
  const searchParams = useSearchParams();
  const isCreatingGroup = searchParams.get("createGroup") === "true";

  const [step, setStep] = useState(isCreatingGroup ? 0 : 1);
  const [formData, setFormData] = useState<MarketFormData>({
    groupName: "",
    groupDescription: "",
    isPublic: mockUser.role === "admin" ? true : false,
    title: "",
    description: "",
    type: "poll",
    category: marketCategories[0],
    targetGroup: isCreatingGroup ? "new_group" : "global",
    image: "",
    buyIn: "",
    endDate: "",
    options: [
      { text: "", image: "" },
      { text: "", image: "" },
    ],
  });

  const activeSteps = isCreatingGroup ? steps : steps.filter((s) => s.id !== 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    const minStep = isCreatingGroup ? 0 : 1;
    if (step > minStep) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const label = isCreatingGroup
      ? "Creating Group & Market..."
      : "Creating Market...";
    toast.loading(label, "Broadcasting to the network");

    // Simulate API
    setTimeout(() => {
      setIsSubmitting(false);
      const successMsg = isCreatingGroup
        ? "Group & Market Launched!"
        : "Market Launched!";
      toast.success(successMsg, "Redirecting to your new group...");
      const redirectPath = isCreatingGroup
        ? "/dashboard/groups/group1"
        : "/dashboard/markets/market1";
      router.push(redirectPath);
    }, 2000);
  };

  const updateForm = (data: Partial<MarketFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative z-10">
          {activeSteps.map((s, i) => (
            <div
              key={s.id}
              className="flex flex-col items-center gap-3 relative z-10 w-40"
            >
              <div
                onClick={() =>
                  i <
                    activeSteps.findIndex((step_obj) => step_obj.id === step) &&
                  setStep(s.id)
                }
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 border-2",
                  step >= s.id
                    ? "bg-black border-black text-white shadow-lg shadow-black/20"
                    : "bg-white border-neutral-200 text-neutral-400",
                  s.id < step &&
                    "cursor-pointer hover:scale-110 active:scale-95",
                )}
              >
                {step > s.id ? <IconAccessPoint className="w-5 h-5" /> : s.id}
              </div>
              <span
                className={cn(
                  "text-xs font-medium uppercase tracking-wider transition-colors duration-300",
                  step >= s.id ? "text-black" : "text-neutral-400",
                )}
              >
                {s.title}
              </span>
            </div>
          ))}
          {/* Progress Bar Background */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-neutral-100 -z-10" />
          {/* Active Progress Bar */}
          <div
            className="absolute top-5 left-0 h-0.5 bg-black transition-all duration-500 -z-10"
            style={{
              width: `${(activeSteps.findIndex((s) => s.id === step) / (activeSteps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-white/60 bg-white/70 shadow-xl shadow-gray-200/50 min-h-[600px] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-blue-500/5 to-purple-500/5 blur-3xl rounded-full pointer-events-none" />

        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative z-10 h-full flex flex-col justify-between"
        >
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key={0}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-2xl mx-auto w-full"
              >
                <div className="text-center space-y-2 mb-10">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Establish Your Group
                  </h2>
                  <p className="text-gray-500">
                    You'll be the group's first admin
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 ml-1">
                      Group Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Nairobi High Rollers"
                      className="w-full text-black text-3xl font-semibold bg-transparent border-b-2 border-gray-100 focus:border-black py-4 outline-none placeholder:text-gray-200 transition-colors"
                      value={formData.groupName}
                      onChange={(e) =>
                        updateForm({ groupName: e.target.value })
                      }
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 ml-1">
                      About this Group
                    </label>
                    <textarea
                      rows={4}
                      placeholder="What's the purpose? Private office bets? Friends gaming group?"
                      className="w-full rounded-2xl bg-gray-50 border border-gray-200 p-4 outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all resize-none"
                      value={formData.groupDescription}
                      onChange={(e) =>
                        updateForm({ groupDescription: e.target.value })
                      }
                    />
                  </div>

                  {/* Visibility Toggle */}
                  <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                          formData.isPublic
                            ? "bg-blue-100 text-blue-600"
                            : "bg-neutral-200 text-neutral-600",
                        )}
                      >
                        {formData.isPublic ? (
                          <IconLayoutGrid className="w-5 h-5" />
                        ) : (
                          <IconShield className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formData.isPublic ? "Public Group" : "Private Group"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formData.isPublic
                            ? "Visible to everyone on the discovery page"
                            : "Visible only to invited members"}
                        </p>
                      </div>
                    </div>
                    {mockUser.role === "admin" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateForm({ isPublic: !formData.isPublic })
                        }
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          formData.isPublic ? "bg-black" : "bg-neutral-200",
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                            formData.isPublic
                              ? "translate-x-5"
                              : "translate-x-0",
                          )}
                        />
                      </button>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4 items-center">
                    <IconShield className="w-5 h-5 text-amber-600" />
                    <p className="text-sm text-amber-800 font-medium">
                      As creator, you'll have full control over members and
                      market resolution.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key={1}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2 mb-10">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Choose Market Type
                  </h2>
                  <p className="text-gray-500">
                    Select the mechanism for this betting market
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      id: "poll",
                      label: "Poll",
                      icon: IconAward,
                      desc: "Multiple options, winner takes all.",
                    },
                    {
                      id: "betrayal",
                      label: "Betrayal",
                      icon: IconTarget,
                      desc: "Prisoner's dilemma style game.",
                    },
                    {
                      id: "reflex",
                      label: "Reflex",
                      icon: IconAccessPoint,
                      desc: "Time-sensitive prediction windows.",
                    },
                    {
                      id: "ladder",
                      label: "Ladder",
                      icon: IconList,
                      desc: "Rank items in correct order.",
                    },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() =>
                        updateForm({ type: type.id as MarketType })
                      }
                      className={cn(
                        "p-6 rounded-3xl border-2 text-left transition-all hover:scale-[1.02] relative overflow-hidden group h-full cursor-pointer",
                        formData.type === type.id
                          ? "border-black bg-black text-white shadow-xl shadow-black/10"
                          : "border-gray-100 bg-white hover:border-gray-200 text-gray-900",
                      )}
                    >
                      <div
                        className={cn(
                          "h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                          formData.type === type.id
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-900",
                        )}
                      >
                        <type.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-medium text-lg mb-2">{type.label}</h3>
                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          formData.type === type.id
                            ? "text-white/60"
                            : "text-gray-500",
                        )}
                      >
                        {type.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key={2}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-2xl mx-auto w-full"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 ml-1">
                      Market Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Who will use the new coffee machine first?"
                      className="w-full text-black text-3xl font-semibold bg-transparent border-b-2 border-gray-100 focus:border-black py-4 outline-none placeholder:text-gray-200 transition-colors"
                      value={formData.title}
                      onChange={(e) => updateForm({ title: e.target.value })}
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-10">
                      <label className="text-sm font-medium text-gray-900 ml-1 ">
                        Category
                      </label>
                      <select
                        className="w-full text-black rounded-2xl bg-gray-50 border border-gray-200 p-4 outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all cursor-pointer appearance-none"
                        value={formData.category}
                        onChange={(e) =>
                          updateForm({ category: e.target.value })
                        }
                      >
                        {marketCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {!isCreatingGroup && mockUser.role === "group_admin" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 ml-1">
                          Post To
                        </label>
                        <div className="relative">
                          <IconUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                          <select
                            className="w-full rounded-2xl bg-gray-50 border border-gray-200 pl-10 pr-4 py-4 outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all cursor-pointer appearance-none"
                            value={formData.targetGroup}
                            onChange={(e) =>
                              updateForm({ targetGroup: e.target.value })
                            }
                          >
                            <option value="global">Public (Global)</option>
                            {mockGroups
                              .filter((g) =>
                                mockUser.managed_groups?.includes(g.id),
                              )
                              .map((group) => (
                                <option key={group.id} value={group.id}>
                                  {group.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}
                    {isCreatingGroup && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 ml-1">
                          Post To
                        </label>
                        <div className="relative">
                          <IconUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                          <div className="w-full rounded-2xl bg-gray-50 border border-gray-200 pl-10 pr-4 py-4 font-medium text-gray-500">
                            New Group: {formData.groupName || "..."}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 ml-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Add context, rules, or fun details..."
                      className="w-full text-black rounded-2xl bg-gray-50 border border-gray-200 p-4 outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all resize-none"
                      value={formData.description}
                      onChange={(e) =>
                        updateForm({ description: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 ml-1">
                      Cover Image URL
                    </label>
                    <div className="relative">
                      <IconPhoto className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="https://..."
                        className="w-full text-black rounded-2xl bg-gray-50 border border-gray-200 pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
                        value={formData.image}
                        onChange={(e) => updateForm({ image: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key={3}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-2xl mx-auto w-full"
              >
                {/* Financials */}
                <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500 ml-1">
                      Buy-In
                    </label>
                    <div className="relative">
                      <IconCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full text-black rounded-xl bg-white border border-gray-200 pl-9 pr-4 py-2 font-mono font-medium outline-none focus:border-black transition-all"
                        value={formData.buyIn}
                        onChange={(e) => updateForm({ buyIn: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500 ml-1">
                      End Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full text-black rounded-xl bg-white border border-gray-200 px-4 py-2 font-normal outline-none focus:border-black transition-all cursor-pointer"
                        value={formData.endDate}
                        onChange={(e) =>
                          updateForm({ endDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Type Specific Config */}
                {formData.type === "poll" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-900">
                        Poll Options
                      </label>
                      <button
                        onClick={() =>
                          updateForm({
                            options: [
                              ...(formData.options || []),
                              { text: "", image: "" },
                            ],
                          })
                        }
                        className="text-xs font-semibold bg-black text-white px-3 py-1.5 rounded-lg hover:bg-black/80 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <IconPlus className="w-3 h-3" /> Add Option
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.options?.map((opt, idx) => (
                        <div key={idx} className="flex gap-2">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              placeholder={`Option ${idx + 1}`}
                              className="w-full text-black rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 outline-none focus:border-black transition-all"
                              value={opt.text}
                              onChange={(e) => {
                                const newOpts = [...(formData.options || [])];
                                newOpts[idx].text = e.target.value;
                                updateForm({ options: newOpts });
                              }}
                            />
                          </div>
                          {idx > 1 && (
                            <button
                              onClick={() => {
                                const newOpts = formData.options?.filter(
                                  (_, i) => i !== idx,
                                );
                                updateForm({ options: newOpts });
                              }}
                              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            >
                              <IconX className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Placeholder for other types */}
                {formData.type !== "poll" && (
                  <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex gap-4 items-center">
                    <IconInfoCircle className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      Advanced configuration for {formData.type} markets coming
                      soon. Standard defaults will apply.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key={4}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-2xl mx-auto w-full text-center"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IconAward className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-semibold text-gray-900">
                  Ready to Launch?
                </h2>
                <div className="space-y-1">
                  <p className="text-gray-500 max-w-md mx-auto">
                    You are about to create{" "}
                    {isCreatingGroup ? (
                      <>
                        the group <strong>{formData.groupName}</strong> and{" "}
                      </>
                    ) : (
                      "a "
                    )}
                    <strong>{formData.type}</strong> market in{" "}
                    <strong>{formData.category}</strong>.
                  </p>
                  <p className="text-gray-400 text-sm">
                    {isCreatingGroup ? (
                      <span className="flex items-center justify-center gap-1">
                        <IconShield className="w-3 h-3" /> You will be the group
                        admin
                      </span>
                    ) : (
                      <>
                        Target:{" "}
                        {formData.targetGroup === "global"
                          ? "Global Feed"
                          : `Group ID: ${formData.targetGroup}`}
                      </>
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left max-w-md mx-auto space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Buy-In Amount</span>
                    <span className="font-mono font-normal">
                      ${formData.buyIn || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Platform Fee</span>
                    <span className="font-mono font-normal">5.0%</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="text-gray-500">Publication Status</span>
                    <span className="font-mono font-normal text-green-600">
                      Immediate
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
            <button
              onClick={handleBack}
              className={cn(
                "px-6 py-3 rounded-xl font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer",
                step === (isCreatingGroup ? 0 : 1) && "invisible",
              )}
            >
              <IconChevronLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={step === 4 ? handleSubmit : handleNext}
              disabled={
                isSubmitting ||
                (step === 0 && !formData.groupName) ||
                (step === 1 && !formData.type) ||
                (step === 2 && !formData.title)
              }
              className="px-8 py-3 rounded-xl bg-black text-white font-medium shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer"
            >
              {step === 4
                ? isSubmitting
                  ? "Launching..."
                  : "Launch Market"
                : "Continue"}
              {!isSubmitting && <IconChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
