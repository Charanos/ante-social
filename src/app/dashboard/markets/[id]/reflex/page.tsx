"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import {
  IconAccessPoint,
  IconArrowRight,
  IconBell,
  IconCircleCheckFilled,
  IconClock,
  IconEye,
  IconEyeOff,
  IconHelpCircle,
  IconLogout,
  IconMoodSmile,
  IconShield,
  IconTrendingUp,
  IconUsers,
  IconTrophy,
  IconGhost,
  IconBolt,
} from "@tabler/icons-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/useToast";
import { fetchJsonOrNull, useLiveUser } from "@/lib/live-data";
import { useCurrency } from "@/lib/utils/currency";
import Image from "next/image";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { mapMarketToDetailView, parseApiError } from "@/lib/market-detail-view";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { MarketChart } from "@/components/markets/MarketChart";

const REFLEX_ICONS = [
  IconLogout,
  IconBell,
  IconHelpCircle,
  IconEyeOff,
  IconMoodSmile,
];

export default function ReflexMarketPage() {
  const params = useParams();
  const toast = useToast();
  const { user } = useLiveUser();
  const marketId = params.id as string;
  const [market, setMarket] = useState<any>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { formatCurrency, symbol, convertAmount, preferredCurrency } = useCurrency();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [countdown, setCountdown] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const sortedParticipants = useMemo(() => {
    if (!market?.participants) return [];
    return [...market.participants].sort((a, b) => b.total_stake - a.total_stake);
  }, [market?.participants]);

  const totalVotes = useMemo(() => {
    if (!market?.options) return 0;
    return market.options.reduce((sum: number, opt: any) => sum + (opt.pool_amount || 0), 0);
  }, [market?.options]);

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setIsCountingDown(false);
      setCountdown(5);
    }
  }, [countdown, isCountingDown]);

  useEffect(() => {
    if (!marketId) return;
    let cancelled = false;

    const load = async () => {
      setIsPageLoading(true);
      const payload = await fetchJsonOrNull<any>(`/api/markets/${marketId}`);
      if (cancelled) return;
      if (!payload) {
        setMarket(null);
        setIsPageLoading(false);
        return;
      }

      const detail = mapMarketToDetailView(payload);
      detail.options = detail.options.map((option, index) => ({
        ...option,
        icon: REFLEX_ICONS[index % REFLEX_ICONS.length],
      }));
      setMarket(detail);
      setIsPageLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [marketId]);

  const handlePlacePrediction = async () => {
    const stakeValuePreferred = Number.parseFloat(stakeAmount);
    const stakeValueKsh = convertAmount(stakeValuePreferred, preferredCurrency, "KSH");

    if (
      !selectedOption ||
      !stakeAmount ||
      !Number.isFinite(stakeValuePreferred) ||
      stakeValueKsh < market.buy_in_amount
    ) {
      toast.error(
        "Invalid Prediction",
        `Minimum stake is ${formatCurrency(market.buy_in_amount)}`,
      );
      return;
    }
    if (user.balance < stakeValueKsh) {
      toast.error("Insufficient Balance", "Please top up your wallet to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/markets/${market.id}/predict`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          outcomeId: selectedOption,
          amount: stakeValueKsh,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(parseApiError(payload, "Failed to place prediction."));
      }

      const selectedOptionText = market.options.find(
        (o: any) => o.id === selectedOption,
      )?.option_text;
      setPredictionResult({
        optionText: selectedOptionText,
        amount: stakeValueKsh,
        timestamp: new Date().toISOString(),
        transactionId: payload?.id || payload?._id,
      });

      toast.success(
        "Prediction Placed!",
        `You predicted ${formatCurrency(stakeValueKsh)} on "${selectedOptionText}"`,
      );
    } catch (error: any) {
      toast.error("Prediction Failed", error?.message || "Unable to place prediction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeRemaining = () => {
    if (!market) return "";
    const diff = market.close_date.getTime() - Date.now();
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const stakeValuePreferredInput = parseFloat(stakeAmount) || 0;
  const stakeValueKshBase = convertAmount(stakeValuePreferredInput, preferredCurrency, "KSH");
  const platformFeeKsh = stakeValueKshBase * 0.05;
  const totalAmountKsh = stakeValueKshBase + platformFeeKsh;

  if (isPageLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }
  if (!market) {
    return <div className="p-8 text-sm text-black/50">Market not found.</div>;
  }

  const isClosed = market.status === "closed" || market.status === "settled" || market.status === "resolved";
  const winningOutcomeId = market.winningOutcomeId;
  return (
    <div className="space-y-6 md:space-y-10 pb-12 pl-0 md:pl-8 overflow-x-hidden w-full max-w-[100vw] px-2">
      <DashboardHeader user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8 lg:space-y-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl"
          >
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] mix-blend-screen" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] mix-blend-screen" />

            <div className="relative p-8 md:p-12 pb-16">
              {/* Badges */}
              <div className="flex items-center gap-3 mb-8">
                <div className="px-4 py-1.5 rounded-full flex items-center bg-white/10 backdrop-blur-md border border-white/10">
                  <span className="text-xs font-bold text-white uppercase tracking-widest">
                    {market.category}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border ${
                    isClosed
                      ? "bg-slate-800/80 border-slate-700"
                      : "bg-emerald-500/20 border-emerald-500/30"
                  }`}
                >
                  {!isClosed && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      isClosed ? "text-slate-300" : "text-emerald-300"
                    }`}
                  >
                    {isClosed ? "Closed" : "Live"}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="max-w-3xl space-y-6 relative z-10 w-full lg:w-3/5">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                  {market.title}
                </h2>
                <p className="text-lg text-slate-300 font-medium leading-relaxed">
                  {market.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12 relative z-10">
                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <IconTrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Total Pool
                    </span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold font-mono text-white">
                    {formatCurrency(market.total_pool)}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <IconUsers className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Players
                    </span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold font-mono text-white">
                    {market.participant_count}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2 mb-3">
                    <IconClock className="w-5 h-5 text-purple-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {isClosed ? "Finalized" : "Time Left"}
                    </span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold font-mono text-white">
                    {isClosed
                      ? new Date(market.close_date).toLocaleDateString()
                      : getTimeRemaining()}
                  </p>
                </div>
              </div>
            </div>

            {/* Overlapping Hero Image */}
            <div className="absolute right-0 top-0 bottom-0 w-2/5 hidden lg:block opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700">
              <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-transparent to-transparent z-10" />
              <img
                src={market.image}
                alt={market.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Mobile Hero Image Background */}
            <div className="absolute inset-0 lg:hidden opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-slate-900/80 z-10" />
              <img
                src={market.image}
                alt={market.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>

          {!isClosed ? (
            <div className="space-y-8">
              {/* Scenario Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100/50 shadow-inner"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
                    <IconBolt className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-2">
                      The Scenario
                    </h3>
                    <p className="text-lg font-medium text-indigo-900/80 leading-relaxed">
                      {market.scenario}
                    </p>
                    <p className="text-sm text-indigo-700 mt-3 font-semibold flex items-center gap-2">
                      <IconAccessPoint className="w-4 h-4" />
                      Reflex check: You have moments to decide. What will the majority choose?
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Visual Separator */}
              <div className="flex items-center gap-4 py-4">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-300 to-transparent"></div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-4 rounded-full">
                  Quick Reactions
                </h2>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-300 to-transparent"></div>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {market.options.map((option: any, index: number) => {
                  const isSelected = selectedOption === option.id;

                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      onClick={() => setSelectedOption(option.id)}
                      className={`group relative p-6 rounded-3xl transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50 border-2 border-indigo-500 shadow-[0_16px_48px_-8px_rgba(99,102,241,0.25)]"
                          : "bg-white border-2 border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                          isSelected ? "bg-indigo-100 ring-4 ring-indigo-50" : "bg-slate-100 group-hover:bg-indigo-100"
                        }`}>
                          <option.icon className={`w-7 h-7 ${isSelected ? 'text-indigo-600' : 'text-slate-500 group-hover:text-indigo-600'}`} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-xl font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-900 group-hover:text-indigo-900'}`}>
                              {option.option_text}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold font-mono text-slate-500 group-hover:text-indigo-600 transition-colors">
                                {option.percentage}%
                              </span>
                              {isSelected && (
                                <IconCircleCheckFilled className="w-6 h-6 text-indigo-600" />
                              )}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-1.5">
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${option.percentage}%` }}
                                transition={{
                                  duration: 1,
                                  ease: "easeOut",
                                  delay: 0.3 + index * 0.05,
                                }}
                                className={`h-full rounded-full ${
                                  isSelected ? "bg-indigo-500" : "bg-slate-300 group-hover:bg-indigo-400"
                                }`}
                              />
                            </div>
                            <span className="text-sm text-slate-500 font-semibold block uppercase tracking-wider">
                              {option.votes} predictions
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Closed State - Market Resolution */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <IconTrophy className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Market Resolution
                  </h3>
                  <p className="text-slate-500 font-medium">
                    The final outcome has been decided
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="h-[300px] w-full relative">
                  {market.options && market.options.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={market.options}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="pool_amount"
                          stroke="none"
                        >
                          {market.options.map((entry: any, index: number) => {
                            const isWinning = winningOutcomeId === entry.id;
                            const colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
                            return (
                              <Cell
                                key={`cell-${index}`}
                                fill={isWinning ? "#4f46e5" : colors[index % colors.length]}
                                opacity={isWinning ? 1 : 0.6}
                              />
                            );
                          })}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value: any) => formatCurrency(value)}
                          contentStyle={{
                            borderRadius: "16px",
                            border: "none",
                            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                            fontWeight: "bold",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400 font-medium">
                      No data available
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">
                      Winning Move
                    </span>
                    <span className="text-3xl font-bold text-slate-900 text-center px-4 leading-tight">
                      {market.options?.find((o:any) => o.id === winningOutcomeId)?.option_text?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">
                    Reflex Breakdown
                  </h4>
                  {market.options?.map((opt: any) => {
                    const isWinning = winningOutcomeId === opt.id;
                    const percentage = totalVotes > 0 ? ((opt.pool_amount || 0) / totalVotes) * 100 : 0;
                    
                    return (
                      <div
                        key={opt.id}
                        className={`p-4 rounded-2xl border ${
                          isWinning
                            ? "border-indigo-200 bg-indigo-50/50"
                            : "border-slate-100 bg-slate-50"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            {isWinning && (
                              <IconTrophy className="w-4 h-4 text-indigo-600" />
                            )}
                            <span className="font-bold text-slate-900">
                              {opt.option_text}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-slate-900">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              isWinning 
                                ? "bg-indigo-600" 
                                : "bg-slate-400"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                          {formatCurrency(opt.pool_amount || 0)} staked
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
          {/* Recent Activity */}
          {!isClosed && (
            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <IconEye className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Recent Activity
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Live updates from other players
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {market.participants && market.participants.length > 0 ? (
                    market.participants.map((participant: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <UserAvatar 
                            name={participant.username || "Anonymous"} 
                            size="md" 
                            border={false}
                          />
                          <div>
                            <p className="text-base font-bold text-slate-900">
                              {participant.username || "Anonymous"}
                            </p>
                            <p className="text-sm text-slate-500 font-medium">
                              Made a prediction
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold font-mono text-slate-900">
                            {formatCurrency(participant.total_stake)}
                          </p>
                          <p className="text-sm text-slate-400 font-medium">
                            {new Date(participant.timestamp).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-12 px-6 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50"
                    >
                      <IconGhost className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-slate-700 mb-1">
                        Much Empty
                      </h4>
                      <p className="text-slate-500 font-medium">
                        Be the first to predict in this market!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 lg:self-start space-y-6">
          <div className="lg:sticky lg:top-8 z-40 h-fit space-y-6 transition-all duration-300">
            {isClosed ? (
              <>
                {/* Closed Market Notice */}
                <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <IconTrophy className="w-6 h-6 text-amber-400" />
                    <h3 className="text-lg font-bold">Market Resolved</h3>
                  </div>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed mb-6">
                    This market has concluded and winnings have been distributed to the victors. Check the leaderboard below to see who came out on top!
                  </p>
                  
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Final Pool Value</p>
                    <p className="text-2xl font-mono font-bold text-white tracking-tight">{formatCurrency(market.total_pool)}</p>
                  </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Top Participants</h3>
                    <div className="px-3 py-1 bg-slate-100 rounded-full">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Final</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {sortedParticipants.slice(0, 5).map((player: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                          idx === 0 ? 'bg-amber-100 text-amber-700' :
                          idx === 1 ? 'bg-slate-200 text-slate-700' :
                          idx === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-slate-50 text-slate-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <UserAvatar name={player.username || "Anonymous"} size="sm" border={false} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{player.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono font-bold text-slate-900">{formatCurrency(player.total_stake)}</p>
                        </div>
                      </div>
                    ))}
                    {sortedParticipants.length === 0 && (
                      <div className="text-center py-6 text-slate-500 text-sm font-medium">
                        No participants in this market
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Prediction Result / Slip */}
                {predictionResult ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-emerald-100 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.2)] rounded-3xl overflow-hidden"
                  >
                    <div className="p-8 bg-emerald-500 text-white text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[32px] translate-x-1/2 -translate-y-1/2" />
                      <IconCircleCheckFilled className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
                      <h3 className="text-2xl font-bold mb-1">Prediction Secured</h3>
                      <p className="text-sm text-emerald-100 font-medium">Receipt ID: {predictionResult.transactionId?.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="p-8 space-y-5 bg-white">
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Outcome</span>
                        <span className="text-base font-bold text-emerald-600">{predictionResult.optionText}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Stake</span>
                        <span className="text-lg font-bold font-mono text-slate-900">{formatCurrency(predictionResult.amount)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                         <span className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Platform Fee</span>
                         <span className="text-sm font-bold font-mono text-slate-500">{formatCurrency(predictionResult.amount * 0.05)}</span>
                      </div>
                      <button 
                        onClick={() => setPredictionResult(null)}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all mt-6 shadow-lg shadow-slate-900/20"
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Prediction Placement Card */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border border-slate-200 shadow-xl space-y-6 rounded-3xl overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[32px] translate-x-1/2 -translate-y-1/2 mix-blend-screen" />
                      <h3 className="text-2xl font-bold mb-2 relative z-10">
                        Place Your Prediction
                      </h3>
                      <p className="text-sm text-slate-300 font-medium relative z-10">
                        Predict the crowd's reflex
                      </p>
                    </div>
    
                    {/* Content */}
                    <div className="space-y-6 px-8 py-6">
                      {/* Selected Option */}
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">
                          Selected Prediction
                        </span>
                        <div className="flex items-center gap-3">
                          {selectedOption ? (
                            <>
                              <div className="p-2 rounded-xl bg-indigo-100">
                                <IconCircleCheckFilled className="w-5 h-5 text-indigo-600" />
                              </div>
                              <span className="text-xl font-bold text-indigo-600">
                                {
                                  market.options.find(
                                    (o: any) => o.id === selectedOption,
                                  )?.option_text
                                }
                              </span>
                            </>
                          ) : (
                            <span className="text-base text-slate-400 font-medium flex items-center gap-2">
                              No option selected
                            </span>
                          )}
                        </div>
                      </div>
    
                      {/* Stake Input */}
                      <div className="space-y-4 pt-2">
                        <label className="text-sm font-bold text-slate-700">
                          Your Stake
                        </label>
                        <div className="relative group">
                          <input
                            type="number"
                            placeholder={formatCurrency(market.buy_in_amount)}
                            min={market.buy_in_amount}
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            className="w-full px-5 py-4 pr-16 bg-white border-2 border-slate-200 rounded-2xl text-lg font-mono font-bold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                          />
                          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                            {symbol}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm px-1">
                          <span className="text-slate-500 font-medium">
                            Minimum buy-in
                          </span>
                          <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {formatCurrency(market.buy_in_amount)}
                          </span>
                        </div>
                      </div>
    
                      {/* Summary */}
                      <div className="pt-6 border-t border-slate-100 space-y-4 bg-slate-50/50 -mx-8 px-8 pb-8 -mb-6 mt-6">
                        <div className="flex justify-between text-sm mt-6">
                          <span className="text-slate-500 font-bold uppercase tracking-wider">
                            Platform Fee (5%)
                          </span>
                          <span className="font-mono font-bold text-slate-600">
                            {formatCurrency(platformFeeKsh)}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg items-center">
                          <span className="text-slate-900 font-bold">
                            Total Amount
                          </span>
                          <span className="font-mono font-black text-blue-600 text-2xl">
                            {formatCurrency(totalAmountKsh)}
                          </span>
                        </div>
      
                        {/* CTA Button */}
                        <motion.button
                          onClick={handlePlacePrediction}
                          disabled={isSubmitting || !selectedOption || !stakeAmount}
                          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all mt-6 ${
                            isSubmitting || !selectedOption || !stakeAmount
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20 cursor-pointer"
                          }`}
                          whileHover={
                            !isSubmitting && selectedOption && stakeAmount
                              ? { scale: 1.02 }
                              : {}
                          }
                          whileTap={
                            !isSubmitting && selectedOption && stakeAmount
                              ? { scale: 0.98 }
                              : {}
                          }
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Confirm Prediction
                              <IconArrowRight className="w-6 h-6" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-3xl bg-blue-50 border border-blue-100/50 shadow-inner"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <IconShield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-bold text-blue-900">
                    How it works
                  </p>
                  <p className="text-sm text-blue-800/80 font-medium leading-relaxed">
                    Winners split the prize pool proportionally based on their
                    stake. All payouts are processed instantly when the market
                    closes.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
