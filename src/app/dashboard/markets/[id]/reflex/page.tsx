"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconAccessPoint,
  IconArrowRight,
  IconBell,
  IconBolt,
  IconCircleCheckFilled,
  IconClock,
  IconEye,
  IconEyeOff,
  IconGhost,
  IconHelpCircle,
  IconLogout,
  IconMoodSmile,
  IconShield,
  IconTrendingUp,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

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
    return () => { cancelled = true; };
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
      toast.error("Invalid Prediction", `Minimum stake is ${formatCurrency(market.buy_in_amount)}`);
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
        body: JSON.stringify({ outcomeId: selectedOption, amount: stakeValueKsh }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(parseApiError(payload, "Failed to place prediction."));

      const selectedOptionText = market.options.find((o: any) => o.id === selectedOption)?.option_text;
      setPredictionResult({
        optionText: selectedOptionText,
        amount: stakeValueKsh,
        timestamp: new Date().toISOString(),
        transactionId: payload?.id || payload?._id,
      });
      toast.success("Prediction Placed!", `You predicted ${formatCurrency(stakeValueKsh)} on "${selectedOptionText}"`);
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

  if (isPageLoading) return <LoadingLogo fullScreen size="lg" />;
  if (!market) return <div className="p-8 text-sm text-black/50">Market not found.</div>;

  const isClosed = market.status === "closed" || market.status === "settled" || market.status === "resolved";
  const winningOutcomeId = market.winningOutcomeId;

  return (
    <div className="space-y-6 md:space-y-10 pb-12 w-full px-2 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-2xl"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={market.image}
                alt={market.title}
                fill
                className="object-cover opacity-50 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent" />
            </div>

            <div className="relative z-10 p-8 md:p-10 lg:p-12 flex flex-col justify-end min-h-[400px]">
              {/* Badges */}
              <div className="flex items-center gap-3 mb-6">
                <div className="px-2 py-0 rounded-md bg-white/10 backdrop-blur-md border border-white/10">
                  <span className="text-[10px] font-medium text-white/90 uppercase tracking-widest">
                    {market.category}
                  </span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-md backdrop-blur-md border ${
                  isClosed
                    ? "bg-slate-500/20 border-slate-500/30 text-slate-300"
                    : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isClosed ? "bg-slate-400" : "bg-emerald-400 animate-pulse"}`} />
                  <span className="text-[10px] font-medium uppercase tracking-widest">{market.status}</span>
                </div>
              </div>

              <div className="max-w-3xl mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight mb-4 text-white">
                  {market.title}
                </h2>
                <p className="text-base md:text-lg text-white/70 font-normal leading-relaxed max-w-2xl">
                  {market.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-8 md:gap-12 mt-auto border-t border-white/10 pt-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-white/50">
                    <IconTrendingUp className="w-4 h-4" />
                    <span className="text-[10px] font-medium uppercase tracking-widest">Total Pool</span>
                  </div>
                  <p className="text-2xl font-medium font-mono text-white">{formatCurrency(market.total_pool)}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-white/50">
                    <IconUsers className="w-4 h-4" />
                    <span className="text-[10px] font-medium uppercase tracking-widest">Players</span>
                  </div>
                  <p className="text-2xl font-medium font-mono text-white">{market.participant_count}</p>
                </div>

                <div className="space-y-1 border-l border-white/10 pl-8">
                  <div className="flex items-center gap-2 text-white/50">
                    <IconClock className="w-4 h-4" />
                    <span className="text-[10px] font-medium uppercase tracking-widest">
                      {isClosed ? "Finalized On" : "Closes In"}
                    </span>
                  </div>
                  <p className="text-2xl font-medium font-mono text-white">
                    {isClosed
                      ? (market.resolved_at ? new Date(market.resolved_at).toLocaleDateString() : new Date(market.close_date).toLocaleDateString())
                      : getTimeRemaining()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scenario Box — only when open */}
          {!isClosed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 rounded-[2rem] bg-slate-50 border border-slate-200"
            >
              <div className="flex gap-4">
                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm h-fit">
                  <IconBolt className="w-5 h-5 text-slate-900" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">The Scenario</p>
                  <p className="text-sm text-slate-700 font-normal leading-relaxed">{market.scenario}</p>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 pt-1">
                    <IconAccessPoint className="w-3.5 h-3.5" />
                    Reflex check: You have moments to decide. What will the majority choose?
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Closed State — Resolution */}
          {isClosed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-8 md:p-10 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-slate-200 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
                  <IconTrophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Market Resolution</h3>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">The final outcome has been decided</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Pie Chart */}
                <div className="h-[260px] w-full relative">
                  {market.options && market.options.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={market.options}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={6}
                          dataKey="pool_amount"
                          stroke="none"
                        >
                          {market.options.map((entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={['#0f172a', '#334155', '#64748b', '#94a3b8'][index % 4]}
                              opacity={winningOutcomeId === entry.id ? 1 : 0.5}
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value: any) => formatCurrency(value)}
                          contentStyle={{
                            borderRadius: "16px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400 font-normal text-sm">No data available</div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <IconTrophy className="w-6 h-6 text-slate-300 mb-1" />
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Result</span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3">
                  {market.options?.map((opt: any) => {
                    const isWinning = winningOutcomeId === opt.id;
                    const percentage = totalVotes > 0 ? ((opt.pool_amount || 0) / totalVotes) * 100 : 0;
                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border ${
                          isWinning ? "border-slate-200 bg-slate-50" : "border-slate-100 bg-white/60"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: ['#0f172a', '#334155', '#64748b', '#94a3b8'][market.options.indexOf(opt) % 4] }}
                          />
                          <div className="flex items-center gap-1.5 min-w-0">
                            {isWinning && <IconTrophy className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                            <span className="text-sm font-medium text-slate-700 truncate">{opt.option_text}</span>
                          </div>
                        </div>
                        <span className="text-sm font-semibold font-mono text-slate-900 shrink-0 ml-3">{percentage.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Visual Separator — only when open */}
          {!isClosed && (
            <div className="flex items-center gap-4 my-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
              <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-widest">Quick Reactions</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
            </div>
          )}

          {/* Options — only when open */}
          {!isClosed && (
            <div className="space-y-3">
              {market.options.map((option: any, index: number) => {
                const isSelected = selectedOption === option.id;

                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    onClick={() => setSelectedOption(option.id)}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer border ${
                      isSelected
                        ? "bg-white/80 backdrop-blur-xl border-slate-900 shadow-lg ring-2 ring-slate-900/10"
                        : "bg-white/40 backdrop-blur-sm border-slate-200 hover:bg-white/80 hover:border-slate-300 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-4 p-5">
                      {/* Icon */}
                      <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? "bg-slate-900" : "bg-slate-100 group-hover:bg-slate-200"
                      }`}>
                        <option.icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-slate-500"}`} />
                      </div>

                      {/* Text + Bar */}
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-base font-medium text-slate-900 leading-tight">
                            {option.option_text}
                          </h4>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-base font-semibold font-mono text-slate-700">
                              {option.percentage}%
                            </span>
                            {isSelected && <IconCircleCheckFilled className="w-5 h-5 text-slate-900" />}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${option.percentage}%` }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.3 + index * 0.05 }}
                              className={`h-full rounded-full ${isSelected ? "bg-slate-900" : "bg-slate-400"}`}
                            />
                          </div>
                          <span className="text-xs text-slate-500 font-normal">{option.votes} predictions</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Recent Activity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <IconEye className="w-5 h-5 text-black/40" />
              <h3 className="text-lg font-medium text-black/90">Recent Activity</h3>
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
                        <UserAvatar name={participant.username || "Anonymous"} size="md" border={false} />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{participant.username || "Anonymous"}</p>
                          <p className="text-xs text-slate-500 font-normal mt-0.5">Made a prediction</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold font-mono text-slate-900">{formatCurrency(participant.total_stake)}</p>
                        <p className="text-xs text-slate-400 font-normal mt-0.5">
                          {new Date(participant.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 px-4 rounded-3xl bg-slate-100/50 border border-dashed border-slate-300 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                      <IconGhost className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-base font-semibold text-slate-900 mb-1">No activity yet</h4>
                    <p className="text-sm text-slate-500 max-w-sm">Be the first to predict in this market!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 lg:self-start h-full">
          <div className="lg:sticky lg:top-8 z-40 space-y-6">
            {isClosed ? (
              <>
                {/* Closed Market Notice */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/60 backdrop-blur-xl border border-slate-200 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] rounded-[2rem] overflow-hidden"
                >
                  <div className="p-6 bg-slate-900 text-white">
                    <h3 className="text-lg font-medium tracking-tight">Market Resolved</h3>
                    <p className="text-xs text-white/60 font-normal tracking-wide uppercase mt-0.5">Final Results</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {winningOutcomeId ? (
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                        <IconTrophy className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div>
                          <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest block mb-0.5">Winning Outcome</span>
                          <span className="text-sm font-medium text-slate-900">
                            {market.options.find((o: any) => o.id === winningOutcomeId)?.option_text}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                        <span className="text-sm font-normal text-slate-500">Awaiting resolution...</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                      <span className="text-sm text-slate-500 font-normal">Final Pool</span>
                      <span className="text-base font-semibold font-mono text-slate-900">{formatCurrency(market.total_pool)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                      <span className="text-sm text-slate-500 font-normal">Total Players</span>
                      <span className="text-base font-medium font-mono text-slate-900">{market.participant_count}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-sm text-slate-500 font-normal">Closed On</span>
                      <span className="text-sm font-medium text-slate-900">
                        {market.resolved_at ? new Date(market.resolved_at).toLocaleDateString() : new Date(market.close_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Leaderboard */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/60 backdrop-blur-xl border border-slate-200 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] rounded-[2rem] overflow-hidden"
                >
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/40">
                    <div>
                      <h3 className="text-base font-medium text-slate-900">Top Participants</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium mt-0.5">By Stake Amount</p>
                    </div>
                    <IconUsers className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="p-2 space-y-1">
                    {sortedParticipants.slice(0, 5).map((player: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <span className={`text-xs font-semibold w-4 text-center ${idx < 3 ? "text-slate-900" : "text-slate-400"}`}>{idx + 1}</span>
                        <UserAvatar name={player.username || "Anonymous"} size="sm" border={false} />
                        <span className="text-sm font-medium text-slate-700 flex-1 truncate">{player.username}</span>
                        <span className="text-sm font-semibold font-mono text-slate-900">{formatCurrency(player.total_stake)}</span>
                      </div>
                    ))}
                    {sortedParticipants.length === 0 && (
                      <p className="text-sm text-slate-500 text-center py-6">No participants yet.</p>
                    )}
                  </div>
                </motion.div>
              </>
            ) : predictionResult ? (
              /* Prediction Result */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/60 backdrop-blur-xl border border-slate-200 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] rounded-[2rem] overflow-hidden"
              >
                <div className="p-6 bg-slate-900 text-white text-center">
                  <IconCircleCheckFilled className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="text-xl font-semibold">Prediction Secured</h3>
                  <p className="text-sm text-white/80">Receipt ID: {predictionResult.transactionId?.slice(-8).toUpperCase()}</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500 font-normal">Outcome</span>
                    <span className="text-base font-semibold text-slate-900">{predictionResult.optionText}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500 font-normal">Stake</span>
                    <span className="text-base font-semibold font-mono text-slate-900">{formatCurrency(predictionResult.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-500 font-normal">Platform Fee</span>
                    <span className="text-sm font-normal font-mono text-slate-600">{formatCurrency(predictionResult.amount * 0.05)}</span>
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    <Link href={`/dashboard/markets/my-forecasts/${predictionResult.transactionId}?new=true`} className="w-full">
                      <button className="w-full py-2 cursor-pointer bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                        View in My Predictions
                      </button>
                    </Link>
                    <button
                      onClick={() => setPredictionResult(null)}
                      className="w-full py-2 cursor-pointer bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Prediction Placement Card */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/60 backdrop-blur-xl border border-slate-200 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] rounded-[2rem] overflow-hidden"
              >
                <div className="p-6 bg-slate-900 text-white">
                  <h3 className="text-xl font-medium mb-1">Place Your Prediction</h3>
                  <p className="text-sm text-white/60 font-normal">Predict the crowd's reflex</p>
                </div>

                <div className="space-y-6 px-6 py-5">
                  {/* Selected Option */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest block mb-1">
                      Selected Prediction
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedOption ? (
                        <>
                          <span className="text-sm font-medium text-slate-900 truncate">
                            {market.options.find((o: any) => o.id === selectedOption)?.option_text}
                          </span>
                          <IconCircleCheckFilled className="w-4 h-4 text-emerald-500 shrink-0" />
                        </>
                      ) : (
                        <span className="text-sm text-slate-400 italic font-normal">Select an option first</span>
                      )}
                    </div>
                  </div>

                  {/* Stake Input */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Your Stake</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={formatCurrency(market.buy_in_amount)}
                        min={market.buy_in_amount}
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="w-full px-4 py-3 pr-16 bg-white border border-slate-200 rounded-xl text-lg font-mono font-medium text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all placeholder:text-slate-300"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">{symbol}</span>
                    </div>
                    <div className="flex justify-between text-xs px-1">
                      <span className="text-slate-400 font-normal">Minimum buy-in</span>
                      <span className="font-mono font-medium text-slate-600">{formatCurrency(market.buy_in_amount)}</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="pt-6 border-t border-slate-100 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-normal">Platform Fee (5%)</span>
                      <span className="font-mono font-medium text-slate-700">{formatCurrency(platformFeeKsh)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-slate-900 font-medium">Total Amount</span>
                      <span className="font-mono font-semibold text-slate-900">{formatCurrency(totalAmountKsh)}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    onClick={handlePlacePrediction}
                    disabled={isSubmitting || !selectedOption || !stakeAmount}
                    className={`w-full py-2 rounded-xl font-medium text-sm flex items-center uppercase justify-center gap-2 transition-all ${
                      isSubmitting || !selectedOption || !stakeAmount
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20 cursor-pointer"
                    }`}
                    whileHover={!isSubmitting && selectedOption && stakeAmount ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting && selectedOption && stakeAmount ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Prediction
                        <IconArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-[2rem] bg-slate-50 border border-slate-200"
            >
              <div className="flex gap-4">
                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm h-fit">
                  <IconShield className="w-5 h-5 text-slate-900" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">How it works</p>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    Winners split the prize pool proportionally based on their stake. All payouts are processed instantly when the market closes.
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