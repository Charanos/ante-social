"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconArrowRight,
  IconBolt,
  IconCircleCheckFilled,
  IconClock,
  IconEye,
  IconGhost,
  IconHandClick,
  IconScale,
  IconShield,
  IconSkull,
  IconTrendingUp,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";

import { useToast } from "@/hooks/useToast";
import { fetchJsonOrNull, useLiveUser } from "@/lib/live-data";
import { useCurrency } from "@/lib/utils/currency";
import { UserAvatar } from "@/components/ui/UserAvatar";
import Image from "next/image";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { mapMarketToDetailView, parseApiError, extractCreatedPredictionId } from "@/lib/market-detail-view";

export default function BetrayalMarketPage() {
  const params = useParams();
  const toast = useToast();
  const { user } = useLiveUser();
  const marketId = params.id as string;
  const [market, setMarket] = useState<any>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { formatCurrency, symbol, convertAmount, preferredCurrency } = useCurrency();

  const [selectedChoice, setSelectedChoice] = useState<"cooperate" | "betray" | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [showOutcomes, setShowOutcomes] = useState(false);

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
    return () => { cancelled = true; };
  }, [marketId]);

  const handlePlacePrediction = async () => {
    if (!market) return;
    const stakeValuePreferred = Number.parseFloat(stakeAmount);
    const stakeValueKsh = convertAmount(stakeValuePreferred, preferredCurrency, "KSH");
    const outcomeId =
      selectedChoice === "cooperate"
        ? market.options?.[0]?.id
        : selectedChoice === "betray"
          ? market.options?.[1]?.id
          : null;

    if (!selectedChoice || !stakeAmount || !Number.isFinite(stakeValuePreferred) || stakeValueKsh < market.buy_in_amount) {
      toast.error("Invalid Prediction", `Minimum stake is ${formatCurrency(market.buy_in_amount)}`);
      return;
    }
    if (!outcomeId) {
      toast.error("Unavailable Option", "This market does not have a valid choice mapping.");
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
        body: JSON.stringify({ outcomeId, amount: stakeValueKsh }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(parseApiError(payload, "Failed to place choice."));

      const positionId = extractCreatedPredictionId(payload);
      setPredictionResult({
        optionText: selectedChoice.toUpperCase(),
        amount: stakeValueKsh,
        timestamp: new Date().toISOString(),
        transactionId: positionId || payload?.id || payload?._id,
      });
      toast.success("Decision Locked!", `You predicted ${formatCurrency(stakeValueKsh)} on your choice`);
    } catch (error: any) {
      toast.error("Submit Failed", error?.message || "Unable to place choice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeRemaining = () => {
    if (!market) return "";
    const diff = market.close_date.getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const stakeValuePreferredInput = parseFloat(stakeAmount) || 0;
  const stakeValueKshBase = convertAmount(stakeValuePreferredInput, preferredCurrency, "KSH");
  const platformFeeKsh = stakeValueKshBase * 0.05;
  const totalAmountKsh = stakeValueKshBase + platformFeeKsh;

  if (isPageLoading) return <LoadingLogo fullScreen size="lg" />;
  if (!market) return <div className="p-8 text-sm text-black/50">Market not found.</div>;

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

          {/* Visual Separator */}
          {!isClosed && (
            <div className="flex items-center gap-4 my-16">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
              <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
                Choose Your Strategy
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
            </div>
          )}

          {/* Choice Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Cooperate */}
            <motion.div
              whileHover={!isClosed ? { scale: 1.02, y: -4 } : {}}
              onClick={() => !isClosed && setSelectedChoice("cooperate")}
              className={`
                relative overflow-hidden rounded-[2rem] border-2 p-8 transition-all duration-300
                ${isClosed ? "cursor-default" : "cursor-pointer"}
                ${
                  selectedChoice === "cooperate"
                    ? "border-emerald-400/60 bg-emerald-50/80 backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(16,185,129,0.25)]"
                    : winningOutcomeId === market.options?.[0]?.id
                    ? "border-emerald-400/40 bg-emerald-50/40 backdrop-blur-sm"
                    : "border-slate-200 bg-white/60 backdrop-blur-sm hover:border-emerald-300/50 hover:bg-emerald-50/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
                }
              `}
            >
              <div className="text-center space-y-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${
                  selectedChoice === "cooperate" ? "bg-emerald-100" : "bg-slate-100"
                }`}>
                  <IconHandClick className={`w-8 h-8 ${selectedChoice === "cooperate" ? "text-emerald-600" : "text-slate-500"}`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 tracking-tight">COOPERATE</h3>
                  <p className="text-sm text-slate-500 font-normal mt-1">Play it safe. Share the reward.</p>
                </div>
                <div className="space-y-1.5 text-left pt-2">
                  <p className="text-xs text-emerald-700 font-normal flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Guaranteed small win if others cooperate
                  </p>
                  <p className="text-xs text-emerald-700 font-normal flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Lower risk strategy
                  </p>
                  <p className="text-xs text-red-500 font-normal flex items-center gap-1.5">
                    <span>✗</span> Betrayers take your share
                  </p>
                </div>
              </div>
              {selectedChoice === "cooperate" && (
                <div className="absolute top-4 right-4">
                  <IconCircleCheckFilled className="w-6 h-6 text-emerald-500" />
                </div>
              )}
              {winningOutcomeId === market.options?.[0]?.id && (
                <div className="absolute top-4 right-4">
                  <IconTrophy className="w-6 h-6 text-emerald-500" />
                </div>
              )}
            </motion.div>

            {/* Betray */}
            <motion.div
              whileHover={!isClosed ? { scale: 1.02, y: -4 } : {}}
              onClick={() => !isClosed && setSelectedChoice("betray")}
              className={`
                relative overflow-hidden rounded-[2rem] border-2 p-8 transition-all duration-300
                ${isClosed ? "cursor-default" : "cursor-pointer"}
                ${
                  selectedChoice === "betray"
                    ? "border-red-400/60 bg-red-50/80 backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(239,68,68,0.25)]"
                    : winningOutcomeId === market.options?.[1]?.id
                    ? "border-red-400/40 bg-red-50/40 backdrop-blur-sm"
                    : "border-slate-200 bg-white/60 backdrop-blur-sm hover:border-red-300/50 hover:bg-red-50/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
                }
              `}
            >
              <div className="text-center space-y-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${
                  selectedChoice === "betray" ? "bg-red-100" : "bg-slate-100"
                }`}>
                  <IconBolt className={`w-8 h-8 ${selectedChoice === "betray" ? "text-red-600" : "text-slate-500"}`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 tracking-tight">BETRAY</h3>
                  <p className="text-sm text-slate-500 font-normal mt-1">Risk it all. Take the prize.</p>
                </div>
                <div className="space-y-1.5 text-left pt-2">
                  <p className="text-xs text-emerald-700 font-normal flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Win big if minority betrays
                  </p>
                  <p className="text-xs text-emerald-700 font-normal flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> Maximum potential payout
                  </p>
                  <p className="text-xs text-red-500 font-normal flex items-center gap-1.5">
                    <span>✗</span> Everyone loses if majority betrays
                  </p>
                </div>
              </div>
              {selectedChoice === "betray" && (
                <div className="absolute top-4 right-4">
                  <IconCircleCheckFilled className="w-6 h-6 text-red-500" />
                </div>
              )}
              {winningOutcomeId === market.options?.[1]?.id && (
                <div className="absolute top-4 right-4">
                  <IconTrophy className="w-6 h-6 text-red-500" />
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Outcomes Explanation */}
          {showOutcomes && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-6 md:p-8 rounded-[2rem] bg-white/60 backdrop-blur-xl border my-14 border-slate-200 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] space-y-4"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
                  <IconScale className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 tracking-tight">How Payouts Work</h3>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">Possible Outcome Scenarios</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <div className="p-1.5 bg-emerald-100 rounded-lg shrink-0">
                    <IconHandClick className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">All Cooperate</p>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">Everyone wins a small amount. Prize pool divided equally.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <div className="p-1.5 bg-amber-100 rounded-lg shrink-0">
                    <IconScale className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Majority Cooperate, Minority Betray</p>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">Betrayers win BIG. They split the entire prize pool.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50/60 border border-red-100">
                  <div className="p-1.5 bg-red-100 rounded-lg shrink-0">
                    <IconBolt className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Majority Betray</p>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">Everyone loses. No payouts. Greed destroyed the pool.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="p-1.5 bg-white/10 rounded-lg shrink-0">
                    <IconSkull className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">All Betray</p>
                    <p className="text-xs text-white/50 font-normal mt-0.5">Zero for everyone. Complete mutual destruction.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="text-center">
            <button
              onClick={() => setShowOutcomes(!showOutcomes)}
              className="px-6 py-2 text-xs font-medium cursor-pointer text-slate-500 hover:text-slate-700 uppercase tracking-widest transition-colors underline underline-offset-4"
            >
              {showOutcomes ? "Hide" : "Show"} Possible Outcomes
            </button>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <IconEye className="w-5 h-5 text-black/40" />
              <h3 className="text-lg font-medium text-black/90">Recent Activity</h3>
            </div>

            <div className="space-y-3">
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
                        <p className="text-xs text-slate-500 font-normal mt-0.5">Made a choice</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold font-mono text-slate-900">{formatCurrency(participant.total_stake)}</p>
                      <p className="text-xs text-slate-400 font-normal mt-0.5">
                        {participant.timestamp ? new Date(participant.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"}
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
                  <p className="text-sm text-slate-500 max-w-sm">
                    The market is quiet. Be the first to make a choice!
                  </p>
                </motion.div>
              )}
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
                            {market.options.find((o: any) => o.id === winningOutcomeId)?.option_text?.toUpperCase()}
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
                    {sortedParticipants.map((p: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <span className={`text-xs font-semibold w-4 text-center ${i < 3 ? "text-slate-900" : "text-slate-400"}`}>{i + 1}</span>
                        <UserAvatar name={p.username} size="sm" border={false} />
                        <span className="text-sm font-medium text-slate-700 flex-1 truncate">{p.username}</span>
                        <span className="text-sm font-semibold font-mono text-slate-900">{formatCurrency(p.total_stake)}</span>
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
                  <h3 className="text-xl font-semibold">Decision Secured</h3>
                  <p className="text-sm text-white/80">Receipt ID: {predictionResult.transactionId?.slice(-8).toUpperCase()}</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500 font-normal">Outcome</span>
                    <span className={`text-base font-semibold ${predictionResult.optionText === "COOPERATE" ? "text-emerald-600" : "text-red-600"}`}>
                      {predictionResult.optionText}
                    </span>
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
                  <h3 className="text-xl font-medium mb-1">
                    {isClosed ? "Market Closed" : "Place Your Prediction"}
                  </h3>
                  <p className="text-sm text-white/60 font-normal">
                    {isClosed ? "Choices are no longer accepted" : "Make your choice"}
                  </p>
                </div>

                <div className="space-y-6 px-6 py-5">
                  {/* Selected Choice */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest block mb-1">
                      {isClosed && winningOutcomeId ? "Final Outcome" : "Selected Strategy"}
                    </span>
                    <div className="flex items-center gap-2">
                      {isClosed && winningOutcomeId ? (
                        <>
                          <span className="text-sm font-medium text-slate-900">
                            {market.options.find((o: any) => o.id === winningOutcomeId)?.option_text?.toUpperCase()}
                          </span>
                          <IconCircleCheckFilled className="w-4 h-4 text-emerald-500" />
                        </>
                      ) : selectedChoice ? (
                        <>
                          <span className={`text-sm font-medium ${selectedChoice === "cooperate" ? "text-emerald-700" : "text-red-700"}`}>
                            {selectedChoice.toUpperCase()}
                          </span>
                          <IconCircleCheckFilled className={`w-4 h-4 ${selectedChoice === "cooperate" ? "text-emerald-500" : "text-red-500"}`} />
                        </>
                      ) : (
                        <span className="text-sm text-slate-400 italic font-normal">Select a strategy first</span>
                      )}
                    </div>
                  </div>

                  {!isClosed && (
                    <>
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
                        disabled={isSubmitting || !selectedChoice || !stakeAmount}
                        className={`w-full py-2 uppercase rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                          isSubmitting || !selectedChoice || !stakeAmount
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20 cursor-pointer"
                        }`}
                        whileHover={!isSubmitting && selectedChoice && stakeAmount ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting && selectedChoice && stakeAmount ? { scale: 0.98 } : {}}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Locking In...
                          </>
                        ) : (
                          <>
                            Lock In Choice
                            <IconArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    </>
                  )}
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
                  <p className="text-sm font-semibold text-slate-900">Your Choice is Secret</p>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    No one knows what you picked until the market settles. Results revealed simultaneously to all participants.
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