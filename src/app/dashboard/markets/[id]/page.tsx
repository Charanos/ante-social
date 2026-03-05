"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useCurrency } from "@/lib/utils/currency";
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

import Image from "next/image";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { useToast } from "@/components/ui/toast-notification";
import { MarketChart } from "@/components/markets/MarketChart";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { cn } from "@/lib/utils";
import { fetchJsonOrNull, useLiveUser } from "@/lib/live-data";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip
} from "recharts";
import {
  extractCreatedPredictionId,
  mapMarketToDetailView,
  parseApiError,
} from "@/lib/market-detail-view";

export default function MarketDetailPage() {
  const params = useParams();
  const { user } = useLiveUser();
  const { formatCurrency, symbol, convertAmount, preferredCurrency } = useCurrency();
  const marketId = params.id as string;
  const [market, setMarket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  useEffect(() => {
    if (!marketId) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const payload = await fetchJsonOrNull<any>(`/api/markets/${marketId}`);
      if (cancelled) return;
      setMarket(payload ? mapMarketToDetailView(payload) : null);
      setLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [marketId]);

  const router = useRouter();
  const toast = useToast();

  const handlePlaceForecast = async () => {
    const stakeValuePreferred = Number.parseFloat(stakeAmount);
    const stakeValueKsh = convertAmount(stakeValuePreferred, preferredCurrency, "KSH");

    if (!Number.isFinite(stakeValuePreferred) || stakeValueKsh < market.minStake) {
      toast.error(
        "Invalid Stake",
        `Minimum stake is ${formatCurrency(market.minStake)}`,
      );
      return;
    }

    // Check balance
    if (user.balance < stakeValueKsh) {
      toast.error(
        "Insufficient Balance",
        "Please top up your wallet to participate in this market."
      );
      setTimeout(() => {
        router.push("/dashboard/wallet/checkout");
      }, 1000);
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(
      "Confirming your forecast...",
      "Processing transaction securely",
    );

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
        throw new Error(
          parseApiError(payload, "Failed to place forecast. Please try again."),
        );
      }

      const positionId = extractCreatedPredictionId(payload);
      const selectedOptionText = market.options.find(
        (o: any) => o.id === selectedOption,
      )?.option_text;

      setPredictionResult({
        optionText: selectedOptionText,
        amount: stakeValueKsh,
        timestamp: new Date().toISOString(),
        transactionId: payload?.id || payload?._id,
      });

      toast.removeToast(toastId);
      toast.success(
        "Prediction Placed!",
        `You predicted ${formatCurrency(Number.parseFloat(stakeAmount))} on "${selectedOptionText}"`,
      );
      // Optional: Delay redirect or let user dismiss receipt
    } catch (error: any) {
      toast.removeToast(toastId);
      toast.error("Submission Failed", error?.message || "Unable to place forecast.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeRemaining = () => {
    if (!market) return "";
    const endsAt = new Date(market.endsAt);
    const diff = endsAt.getTime() - Date.now();
    if (diff <= 0) return "Closed";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  if (loading) {
    return <LoadingLogo fullScreen size="lg" />;
  }
  if (!market) {
    return (
      <div className="p-8 text-sm text-black/50">
        Market not found or unavailable.
      </div>
    );
  }
  const isClosed = market.status === "closed" || market.status === "settled" || market.status === "resolved";
  const winningOutcomeId = market.winningOutcomeId;
  const sortedParticipants = [...(market.participants || [])]
    .sort((a, b) => parseFloat(b.total_stake) - parseFloat(a.total_stake))
    .slice(0, 5);

  const totalVotes = market.options.reduce(
    (acc: number, opt: any) => acc + opt.votes,
    0,
  );
  const platformFee = stakeAmount ? parseFloat(stakeAmount) * 0.05 : 0;
  const totalAmount = stakeAmount ? parseFloat(stakeAmount) + platformFee : 0;

  return (
    <div className="space-y-6 md:space-y-10 pb-12 w-full px-2 md:px-6 lg:px-8">
      <DashboardHeader user={user} />

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
                    <span className="text-[10px] font-semibold text-white/90 uppercase tracking-widest">
                      {market.category}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-md backdrop-blur-md border ${
                    isClosed 
                      ? "bg-slate-500/20 border-slate-500/30 text-slate-300" 
                      : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isClosed ? "bg-slate-400" : "bg-emerald-400 animate-pulse"}`} />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">
                      {isClosed ? 'Closed' : market.status}
                    </span>
                  </div>
                </div>

                <div className="max-w-3xl mb-12">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight mb-4 text-white">
                    {market.title}
                  </h2>
                  <p className="text-base md:text-lg text-white/70 font-medium leading-relaxed max-w-2xl">
                    {market.description}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="flex flex-wrap items-center gap-8 md:gap-12 mt-auto border-t border-white/10 pt-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white/50">
                      <IconTrendingUp className="w-4 h-4" />
                      <span className="text-[10px] font-semibold uppercase tracking-widest">Total Pool</span>
                    </div>
                    <p className="text-2xl font-semibold font-mono text-white">
                      {formatCurrency(market.poolAmount, preferredCurrency)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white/50">
                      <IconUsers className="w-4 h-4" />
                      <span className="text-[10px] font-semibold uppercase tracking-widest">Players</span>
                    </div>
                    <p className="text-2xl font-semibold font-mono text-white">
                      {market.participantCount}
                    </p>
                  </div>

                  <div className="space-y-1 border-l border-white/10 pl-8">
                    <div className="flex items-center gap-2 text-white/50">
                      <IconClock className="w-4 h-4" />
                      <span className="text-[10px] font-semibold uppercase tracking-widest">
                        {isClosed ? "Finalized On" : "Closes In"}
                      </span>
                    </div>
                    <p className="text-2xl font-semibold font-mono text-white">
                      {isClosed 
                        ? (market.resolved_at ? new Date(market.resolved_at).toLocaleDateString() : new Date(market.endsAt || market.close_date).toLocaleDateString())
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
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">Market Momentum</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Historical Activity</p>
                    </div>
                  </div>
                  <div className="sm:text-right hidden sm:block">
                    <p className="text-2xl font-bold font-mono text-slate-900">82%</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">+12.5% Activity</p>
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
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Market Resolution</h3>
                      <p className="text-slate-500 font-medium mt-1">Final distribution of community consensus</p>
                    </div>
                    
                    <div className="space-y-4">
                      {market.options.map((opt: any, idx: number) => {
                        const localPercentage = Math.round((opt.votes / totalVotes) * 100) || 0;
                        return (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: ['#0f172a', '#334155', '#64748b', '#94a3b8'][idx % 4] }} 
                              />
                              <span className="text-sm font-semibold text-slate-700">{opt.option_text}</span>
                            </div>
                            <span className="text-sm font-bold font-mono text-slate-900">{localPercentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="w-full md:w-64 h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={market.options.map((opt: any) => ({ name: opt.option_text, value: Math.round((opt.votes / totalVotes) * 100) || 0 }))}
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
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RESULT</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Visual Separator */}
            {!isClosed && (
              <div className="flex items-center gap-4 my-10 md:my-16">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Select Your Choice
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
              </div>
            )}

            {/* Options - ONLY IF NOT CLOSED */}
            {!isClosed && (
              <div className="space-y-6 my-10 md:my-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {market.options.map((option: any, index: number) => {
                    const isSelected = selectedOption === option.id;
                    const isWinner = winningOutcomeId === option.id;
                    const votePercentage = Math.round((option.votes / totalVotes) * 100) || 0;

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
                            <h4 className="text-base font-semibold text-slate-900 leading-tight flex-1">
                              {option.option_text}
                            </h4>
                            <span className="text-lg font-bold font-mono text-slate-700 shrink-0">
                              {votePercentage}%
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-2.5">
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${votePercentage}%` }}
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
                              <span className="text-xs text-slate-500 font-medium">
                                {option.votes} votes
                              </span>
                              {isSelected && !isWinner && (
                                <span className="text-xs text-slate-900 font-bold tracking-wide">
                                  SELECTED
                                </span>
                              )}
                              {isWinner && (
                                <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md shadow-sm">
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
                <h3 className="text-lg font-semibold text-black/90">
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
                            <p className="text-sm font-bold text-slate-900">
                              {participant.username || "Anonymous"}
                            </p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              Submitted forecast
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold font-mono text-slate-900">
                            {formatCurrency(participant.total_stake || 0, preferredCurrency)}
                          </p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
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
                      <h4 className="text-base font-bold text-slate-900 mb-1">No activity yet</h4>
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
                        <h3 className="text-lg font-semibold tracking-tight">Market Resolved</h3>
                        <p className="text-xs text-white/60 font-medium tracking-wide uppercase">Final Results</p>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      {winningOutcomeId ? (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 mb-4 flex items-center gap-3 shadow-sm">
                          <IconTrophy className="w-5 h-5 text-emerald-500 shrink-0" />
                          <div>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-0.5">
                              Winning Outcome
                            </span>
                            <span className="text-sm font-semibold text-slate-900">
                              {market.options.find((o: any) => o.id === winningOutcomeId)?.option_text}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-center">
                          <span className="text-sm font-medium text-slate-500">Awaiting resolution...</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                        <span className="text-sm text-slate-500 font-medium">Final Pool</span>
                        <span className="text-base font-bold font-mono text-slate-900">{formatCurrency(market.poolAmount, preferredCurrency)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                        <span className="text-sm text-slate-500 font-medium">Total Players</span>
                        <span className="text-base font-semibold font-mono text-slate-900">{market.participantCount}</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5">
                        <span className="text-sm text-slate-500 font-medium">Closed On</span>
                        <span className="text-sm font-semibold text-slate-900">
                          {market.resolved_at ? new Date(market.resolved_at).toLocaleDateString() : new Date(market.endsAt || market.close_date).toLocaleDateString()}
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
                        <h3 className="text-base font-semibold text-slate-900">Top Participants</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">By Stake Amount</p>
                      </div>
                      <IconUsers className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="p-2 space-y-1">
                      {sortedParticipants.map((p: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                            <UserAvatar name={p.username || "Anonymous"} size="sm" border={false} />
                            <span className="text-sm font-semibold text-slate-700">{p.username || "Anonymous"}</span>
                          </div>
                          <span className="text-sm font-bold font-mono text-slate-900">{formatCurrency(p.total_stake, preferredCurrency)}</span>
                        </div>
                      ))}
                      {sortedParticipants.length === 0 && (
                        <div className="p-4 text-center text-sm text-slate-500">No participants yet.</div>
                      )}
                    </div>
                  </motion.div>
                </>
              ) : (
                /* Prediction Result / Slip */
                <>
                  {predictionResult ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/60 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-[2rem] overflow-hidden"
                    >
                      <div className="p-8 bg-emerald-500 text-white text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
                        <IconCircleCheckFilled className="w-16 h-16 mx-auto mb-3 drop-shadow-md" />
                        <h3 className="text-2xl font-bold tracking-tight">Prediction Secured</h3>
                        <p className="text-sm text-emerald-100 font-medium mt-1">Receipt ID: <span className="font-mono">{predictionResult.transactionId?.slice(-8).toUpperCase()}</span></p>
                      </div>
                      <div className="p-6 space-y-5">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-sm text-slate-500 font-medium">Selected Outcome</span>
                          <span className="text-base font-bold text-slate-900">{predictionResult.optionText}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-sm text-slate-500 font-medium">Total Stake</span>
                          <span className="text-base font-bold font-mono text-slate-900">{formatCurrency(predictionResult.amount, preferredCurrency)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                           <span className="text-sm text-slate-500 font-medium">Platform Fee</span>
                           <span className="text-sm font-semibold font-mono text-slate-600">{formatCurrency(predictionResult.amount * 0.05, preferredCurrency)}</span>
                        </div>
                        <button 
                          onClick={() => setPredictionResult(null)}
                          className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold tracking-wide hover:bg-slate-800 transition-all mt-6 shadow-md"
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
                      className={`overflow-hidden rounded-[2rem] bg-white border border-slate-200 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.08)] ${isClosed ? 'opacity-75 pointer-events-none' : ''}`}
                    >
                      {/* Header */}
                      <div className={`p-6 ${isClosed ? 'bg-slate-500' : 'bg-slate-900'} text-white`}>
                        <h3 className="text-xl font-bold tracking-tight mb-1">
                          {isClosed ? 'Market Closed' : 'Place Your Prediction'}
                        </h3>
                        <p className="text-sm text-white/70 font-medium">
                          {isClosed ? 'Predictions are no longer accepted' : 'Join the pool and win'}
                        </p>
                      </div>
      
                      {/* Content */}
                      <div className="space-y-6 p-6">
                        {/* Selected Option Preview */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                            {isClosed && winningOutcomeId ? 'Winning Outcome' : 'Selected Outcome'}
                          </span>
                          <div className="flex items-center gap-2">
                            {isClosed && winningOutcomeId ? (
                               <>
                               <span className="text-base font-bold text-slate-900">
                                 {market.options.find((o: any) => o.id === winningOutcomeId)?.option_text}
                               </span>
                               <IconCircleCheckFilled className="w-5 h-5 text-emerald-500" />
                             </>
                            ) : selectedOption ? (
                              <>
                                <span className="text-base font-bold text-slate-900">
                                  {
                                    market.options.find(
                                      (o: any) => o.id === selectedOption,
                                    )?.option_text
                                  }
                                </span>
                                <IconCircleCheckFilled className="w-5 h-5 text-emerald-500" />
                              </>
                            ) : (
                              <span className="text-sm text-slate-400 font-medium">
                                No outcome selected yet
                              </span>
                            )}
                          </div>
                        </div>
      
                        {!isClosed && (
                          <>
                            {/* Stake Input */}
                            <div className="space-y-3">
                              <label className="text-sm font-bold text-slate-900 block">
                                Your Stake Amount
                              </label>
                              <div className="relative group/input">
                                <input
                                  type="number"
                                  placeholder={market.minStake.toString()}
                                  min={market.minStake}
                                  value={stakeAmount}
                                  onChange={(e) => setStakeAmount(e.target.value)}
                                  className="w-full px-4 py-3 pr-16 bg-white border-2 border-slate-200 rounded-xl text-lg font-mono font-bold text-slate-900 focus:border-slate-900 focus:ring-0 outline-none transition-all placeholder:text-slate-300"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                  {symbol}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs px-1">
                                <span className="text-slate-500 font-medium">
                                  Minimum stake required
                                </span>
                                <span className="font-mono font-bold text-slate-700">
                                  {formatCurrency(market.minStake, preferredCurrency)}
                                </span>
                              </div>
                            </div>
      
                            {/* Summary */}
                            <div className="pt-6 border-t border-slate-100 space-y-3.5">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">
                                  Platform Fee (5%)
                                </span>
                                <span className="font-mono font-semibold text-slate-600">
                                  {formatCurrency(platformFee, preferredCurrency)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-base p-3 rounded-lg bg-slate-50">
                                <span className="text-slate-900 font-bold">
                                  Total Cost
                                </span>
                                <span className="font-mono font-bold text-slate-900 text-lg">
                                  {formatCurrency(totalAmount, preferredCurrency)}
                                </span>
                              </div>
                            </div>
      
                            {/* CTA Button */}
                            <motion.button
                              onClick={handlePlaceForecast}
                              disabled={isSubmitting || !selectedOption || !stakeAmount}
                              className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                                isSubmitting || !selectedOption || !stakeAmount
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                                  : "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg cursor-pointer"
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
                                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Confirming...
                                </>
                              ) : (
                                <>
                                  Confirm Prediction
                                  <IconArrowRight className="w-5 h-5" />
                                </>
                              )}
                            </motion.button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {/* Info Card - Always visible, now perfectly integrated into sticky sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <div className="flex gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 h-fit">
                    <IconShield className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-bold text-slate-900">
                      How Market Settlement Works
                    </p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Winners split the prize pool proportionally based on their stake. All payouts are automatically securely processed to your wallet when the market is resolved.
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
