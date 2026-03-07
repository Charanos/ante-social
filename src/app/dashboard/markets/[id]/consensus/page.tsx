"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconAccessPoint,
  IconArrowRight,
  IconCircleCheckFilled,
  IconClock,
  IconEye,
  IconGhost,
  IconLayoutGrid,
  IconPhoto,
  IconShield,
  IconTrendingUp,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";

import { useToast } from "@/hooks/useToast";
import { fetchJsonOrNull, useLiveUser } from "@/lib/live-data";
import { formatTimeComprehensive } from "@/lib/utils/time";
import { useCurrency } from "@/lib/utils/currency";
import { MarketChart } from "@/components/markets/MarketChart";
import { UserAvatar } from "@/components/ui/UserAvatar";
import Image from "next/image";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import {
  mapMarketToDetailView,
  parseApiError,
  extractCreatedPredictionId
} from "@/lib/market-detail-view";
import { 
  PieChart,
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend 
} from "recharts";

export default function PollMarketPage() {
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

  useEffect(() => {
    if (!marketId) return;
    let cancelled = false;

    const load = async () => {
      setIsPageLoading(true);
      const payload = await fetchJsonOrNull<any>(`/api/markets/${marketId}`);
      if (cancelled) return;
      setMarket(payload ? mapMarketToDetailView(payload) : null);
      setIsPageLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [marketId]);

  const handlePlaceBet = async () => {
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
      const response = await fetch(`/api/markets/${market.id}/bet`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          outcomeId: selectedOption,
          amount: stakeValueKsh,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(parseApiError(payload, "Failed to place vote."));
      }

      const positionId = extractCreatedPredictionId(payload);
      const selectedOptionText = market.options.find(
        (o: any) => o.id === selectedOption,
      )?.option_text;
      
      setPredictionResult({
        optionText: selectedOptionText,
        amount: stakeValueKsh,
        timestamp: new Date().toISOString(),
        transactionId: positionId || payload?.id || payload?._id,
      });

      toast.success(
        "Prediction Placed!",
        `You predicted ${formatCurrency(stakeValueKsh)} on "${selectedOptionText}"`,
      );
    } catch (error: any) {
      toast.error("Vote Failed", error?.message || "Unable to place vote.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeRemaining = () => {
    if (!market) return "";
    return formatTimeComprehensive(market.close_date);
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
  const sortedParticipants = [...(market.participants || [])]
    .sort((a, b) => parseFloat(b.total_stake) - parseFloat(a.total_stake))
    .slice(0, 5);

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
              {/* Hero Image & Backgrounds */}
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

              {/* Content */}
              <div className="relative z-10 p-8 md:p-10 lg:p-12 h-full flex flex-col justify-end min-h-[400px]">
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
                    <span className="text-[10px] font-medium uppercase tracking-widest">
                      {market.status}
                    </span>
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

                {/* Stats Grid */}
                <div className="flex flex-wrap items-center gap-8 md:gap-12 mt-auto border-t border-white/10 pt-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white/50">
                      <IconTrendingUp className="w-4 h-4" />
                      <span className="text-[10px] font-medium uppercase tracking-widest">Total Pool</span>
                    </div>
                    <p className="text-2xl font-medium font-mono text-white">
                      {formatCurrency(market.total_pool)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white/50">
                      <IconUsers className="w-4 h-4" />
                      <span className="text-[10px] font-medium uppercase tracking-widest">Players</span>
                    </div>
                    <p className="text-2xl font-medium font-mono text-white">
                      {market.participant_count}
                    </p>
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
                        : getTimeRemaining()
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Performance Chart / Momentum */}
            {!isClosed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-6 md:p-8 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-slate-200 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
                      <IconTrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Market Momentum</h3>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">Historical Activity</p>
                    </div>
                  </div>
                  <div className="sm:text-right hidden sm:block">
                    <p className="text-2xl font-semibold font-mono text-slate-900">82%</p>
                    <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-widest">+12.5% Activity</p>
                  </div>
                </div>
                
                <div className="h-64 mt-4 -mx-2 sm:mx-0">
                  <MarketChart 
                    data={[40, 45, 55, 60, 65, 70, 75, 82]} 
                    height="100%" 
                    color="#0f172a" 
                    showAxes={false}
                  />
                </div>
              </motion.div>
            )}

            {/* Closed State Visualization */}
            {isClosed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-8 md:p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">Market Resolution</h3>
                      <p className="text-slate-500 font-normal mt-1">Final distribution of community consensus</p>
                    </div>
                    
                    <div className="space-y-4">
                      {market.options.map((opt: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: ['#0f172a', '#334155', '#64748b', '#94a3b8'][idx % 4] }} 
                            />
                            <span className="text-sm font-medium text-slate-700">{opt.option_text}</span>
                          </div>
                          <span className="text-sm font-semibold font-mono text-slate-900">{opt.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full md:w-64 h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={market.options.map((opt: any) => ({ name: opt.option_text, value: opt.percentage }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {market.options.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={['#0f172a', '#334155', '#64748b', '#94a3b8'][index % 4]} stroke="none" />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            fontSize: '12px',
                            fontWeight: '600'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <IconTrophy className="w-8 h-8 text-slate-200 mb-1" />
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">RESULT</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Visual Separator */}
            {!isClosed && (
              <div className="flex items-center gap-4 my-10 md:my-16">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
                <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
                  Select Your Choice
                </h2>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
              </div>
            )}

            {/* Options - ONLY IF NOT CLOSED */}
            {!isClosed && (
              <div className="space-y-6 my-10 md:my-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {market.options.map((option: any, index: number) => {
                    const isSelected = selectedOption === option.id;
                    const isWinner = winningOutcomeId === option.id;

                    return (
                      <motion.div
                        key={option.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        onClick={() => !isClosed && setSelectedOption(option.id)}
                        className={`group relative overflow-hidden rounded-2xl transition-all duration-300 border ${
                          isClosed ? "cursor-default" : "cursor-pointer"
                        } ${
                          isSelected
                            ? "bg-white/80 backdrop-blur-xl border-slate-900 shadow-lg ring-2 ring-slate-900/10"
                            : isWinner
                            ? "bg-emerald-50/80 backdrop-blur-xl border-emerald-500 shadow-lg ring-2 ring-emerald-500/20"
                            : "bg-white/40 backdrop-blur-sm border-slate-200 hover:bg-white/80 hover:border-slate-300 shadow-sm hover:shadow-md"
                        }`}
                      >
                        {/* Image */}
                        <div className="relative h-32 overflow-hidden">
                          <Image
                            src={option.image}
                            alt={option.option_text}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                          {isSelected && !isWinner && (
                            <div className="absolute top-3 right-3 p-1.5 bg-slate-900 rounded-full shadow-md">
                              <IconCircleCheckFilled className="w-4 h-4 text-white" />
                            </div>
                          )}
                          {isWinner && (
                            <div className="absolute top-3 right-3 p-1.5 bg-emerald-500 rounded-full shadow-md backdrop-blur-md border border-emerald-400">
                              <IconTrophy className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-base font-medium text-slate-900 leading-tight flex-1">
                              {option.option_text}
                            </h4>
                            <span className="text-lg font-semibold font-mono text-slate-700 shrink-0">
                              {option.percentage}%
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-2.5">
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${option.percentage}%` }}
                                transition={{
                                  duration: 1,
                                  ease: "easeOut",
                                  delay: 0.3 + index * 0.05,
                                }}
                                className={`h-full rounded-full ${
                                  isWinner ? "bg-emerald-500" : isSelected ? "bg-slate-900" : "bg-slate-400"
                                }`}
                              />
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-500 font-normal">
                                {option.votes} votes
                              </span>
                              {isSelected && !isWinner && (
                                <span className="text-xs text-slate-900 font-semibold tracking-wide">
                                  SELECTED
                                </span>
                              )}
                              {isWinner && (
                                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md shadow-sm">
                                  <IconTrophy className="w-3 h-3" />
                                  <span className="text-[10px] uppercase tracking-widest">Winner</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <IconEye className="w-5 h-5 text-black/40" />
                <h3 className="text-lg font-medium text-black/90">
                  Recent Activity
                </h3>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {market.participants.length > 0 ? (
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
                            <p className="text-sm font-semibold text-slate-900">
                              {participant.username || "Anonymous"}
                            </p>
                            <p className="text-xs text-slate-500 font-normal mt-0.5">
                              Secured prediction
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold font-mono text-slate-900">
                            {formatCurrency(participant.total_stake || 0)}
                          </p>
                          <p className="text-xs text-slate-400 font-normal mt-0.5">
                            {participant.timestamp ? new Date(participant.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    /* Elegant Empty State */
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-12 px-4 rounded-3xl bg-slate-100/50 border border-dashed border-slate-300 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                        <IconGhost className="w-8 h-8 text-slate-400" />
                      </div>
                      <h4 className="text-base font-semibold text-slate-900 mb-1">No activity yet</h4>
                      <p className="text-sm text-slate-500 max-w-sm">
                        The market is quiet. Be the first to make a prediction and set the momentum!
                      </p>
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
                  {/* Results Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/60 backdrop-blur-xl border border-slate-200 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] rounded-[2rem] overflow-hidden"
                  >
                    <div className="p-6 bg-slate-900 text-white flex items-center gap-3">
                      <div>
                        <h3 className="text-lg font-medium tracking-tight">Market Resolved</h3>
                        <p className="text-xs text-white/60 font-normal tracking-wide uppercase">Final Results</p>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      {winningOutcomeId ? (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 mb-4 flex items-center gap-3 shadow-sm">
                          <IconTrophy className="w-5 h-5 text-emerald-500 shrink-0" />
                          <div>
                            <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest block mb-0.5">
                              Winning Outcome
                            </span>
                            <span className="text-sm font-medium text-slate-900">
                              {market.options.find((o: any) => o.id === winningOutcomeId)?.option_text}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-center">
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

                  {/* Leaderboard Card */}
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
                      {sortedParticipants.map((p: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-semibold w-4 text-center ${i < 3 ? 'text-slate-900' : 'text-slate-400'}`}>
                              {i + 1}
                            </span>
                            <UserAvatar name={p.username} size="sm" border={false} />
                            <span className="text-sm font-medium text-slate-700">{p.username}</span>
                          </div>
                          <span className="text-sm font-semibold font-mono text-slate-900">{formatCurrency(p.total_stake)}</span>
                        </div>
                      ))}
                      {sortedParticipants.length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-6">No participants yet.</p>
                      )}
                    </div>
                  </motion.div>
                </>
              ) : (
                /* Prediction Result / Slip */
                predictionResult ? (
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
                          <button className="w-full py-2 tracking-wider bg-slate-900 text-white rounded-xl font-normal cursor-pointer hover:bg-gray-600 transition-all shadow-md shadow-black/20">
                            View in My Predictions
                          </button>
                        </Link>
                        <button 
                          onClick={() => setPredictionResult(null)}
                          className="w-full py-2 tracking-wider bg-slate-100 text-slate-700 rounded-xl font-normal cursor-pointer hover:bg-slate-200 transition-all"
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
                    className={`bg-white/60 backdrop-blur-xl border border-slate-200 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] rounded-[2rem] overflow-hidden`}
                  >
                    {/* Header */}
                    <div className="p-6 bg-slate-900 text-white">
                      <h3 className="text-xl font-medium mb-1">
                        Place Your Prediction
                      </h3>
                      <p className="text-sm text-white/60 font-normal">
                        Join the poll and win
                      </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-6 px-6 py-5">
                      {/* Selected Option */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest block mb-1">
                          Selected Outcome
                        </span>
                        <div className="flex items-center gap-2">
                          {selectedOption ? (
                            <>
                              <span className="text-sm font-medium text-slate-900 block truncate">
                                {
                                  market.options.find(
                                    (o: any) => o.id === selectedOption,
                                  )?.option_text
                                }
                              </span>
                              <IconCircleCheckFilled className="w-4 h-4 text-emerald-500 shrink-0" />
                            </>
                          ) : (
                            <span className="text-sm text-slate-400 italic font-normal">
                              Select an option first
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stake Input */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                          Your Stake
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder={formatCurrency(market.buy_in_amount)}
                            min={market.buy_in_amount}
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            className="w-full px-4 py-3 pr-16 bg-white border border-slate-200 rounded-xl text-lg font-mono font-medium text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all placeholder:text-slate-300"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                            {symbol}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs px-1">
                          <span className="text-slate-400 font-normal">
                            Minimum buy-in
                          </span>
                          <span className="font-mono font-medium text-slate-600">
                            {formatCurrency(market.buy_in_amount)}
                          </span>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="pt-6 border-t border-slate-100 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-normal">
                            Platform Fee (5%)
                          </span>
                          <span className="font-mono font-medium text-slate-700">
                            {formatCurrency(platformFeeKsh)}
                          </span>
                        </div>
                        <div className="flex justify-between text-base">
                          <span className="text-slate-900 font-medium">
                            Total Amount
                          </span>
                          <span className="font-mono font-semibold text-slate-900">
                            {formatCurrency(totalAmountKsh)}
                          </span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        onClick={handlePlaceBet}
                        disabled={isSubmitting || !selectedOption || !stakeAmount}
                        className={`w-full py-2 rounded-xl font-medium text-sm flex items-center uppercase justify-center gap-2 transition-all ${
                          isSubmitting || !selectedOption || !stakeAmount
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20 cursor-pointer"
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
                )
              )}

              {/* Info Card - NOW INSIDE STICKY */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-[2rem] bg-slate-50 border border-slate-200 mt-6"
              >
                <div className="flex gap-4">
                  <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm h-fit">
                    <IconShield className="w-5 h-5 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-900">
                      How it works
                    </p>
                    <p className="text-xs text-slate-600 font-normal leading-relaxed">
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
