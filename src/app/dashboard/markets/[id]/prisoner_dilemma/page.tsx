"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
  IconAccessPoint,
  IconArrowRight,
  IconCircleCheckFilled,
  IconClock,
  IconEye,
  IconHandClick,
  IconInfoCircle,
  IconLayoutGrid,
  IconPhoto,
  IconScale,
  IconShield,
  IconSkull,
  IconTrendingUp,
  IconUsers,
  IconBolt,
} from "@tabler/icons-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/useToast";
import { fetchJsonOrNull, useLiveUser } from "@/lib/live-data";
import { useCurrency } from "@/lib/utils/currency";
import Image from "next/image";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { mapMarketToDetailView, parseApiError } from "@/lib/market-detail-view";

export default function BetrayalMarketPage() {
  const params = useParams();
  const toast = useToast();
  const { user } = useLiveUser();
  const marketId = params.id as string;
  const [market, setMarket] = useState<any>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { formatCurrency, symbol, convertAmount, preferredCurrency } = useCurrency();

  const [selectedChoice, setSelectedChoice] = useState<
    "cooperate" | "betray" | null
  >(null);
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
    return () => {
      cancelled = true;
    };
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

    if (
      !selectedChoice ||
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
      const response = await fetch(`/api/markets/${market.id}/predict`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          outcomeId,
          amount: stakeValueKsh,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(parseApiError(payload, "Failed to place choice."));
      }
      setPredictionResult({
        optionText: selectedChoice.toUpperCase(),
        amount: stakeValueKsh,
        timestamp: new Date().toISOString(),
        transactionId: payload?.id || payload?._id,
      });

      toast.success(
        "Decision Locked!",
        `You predicted ${formatCurrency(stakeValueKsh)} on your choice`,
      );
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
          <div className="lg:col-span-8 space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

              {/* Hero Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <Image
                  src={market.image}
                  alt={market.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                {/* Badges on Image */}
                <div className="absolute top-6 left-6 flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full flex items-center bg-white/90 backdrop-blur-sm border border-black/10">
                    <span className="text-xs font-semibold text-black/70 uppercase tracking-wider">
                      {market.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/90 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      {market.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-black/90 tracking-tight mb-3">
                    {market.title}
                  </h2>
                  <p className="text-base text-black/80 font-medium leading-relaxed">
                    {market.description}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                    <div className="flex items-center gap-2 mb-2">
                      <IconTrendingUp className="w-4 h-4 text-black/40" />
                      <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                        Pool
                      </span>
                    </div>
                    <p className="text-xl font-semibold font-mono text-black/90">
                      {formatCurrency(market.total_pool)}
                    </p>
                    <p className="text-xs font-medium text-black/40 mt-1">
                      Pool Total
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                    <div className="flex items-center gap-2 mb-2">
                      <IconUsers className="w-4 h-4 text-black/40" />
                      <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                        Players
                      </span>
                    </div>
                    <p className="text-xl font-semibold font-mono text-black/90">
                      {market.participant_count}
                    </p>
                    <p className="text-xs font-medium text-black/40 mt-1">
                      Active
                    </p>
                  </div>

                  {!isClosed && (
                    <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5 col-span-2 md:col-span-1">
                      <div className="flex items-center gap-2 mb-2">
                        <IconClock className="w-4 h-4 text-black/40" />
                        <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                          Closes In
                        </span>
                      </div>
                      <p className="text-xl font-semibold font-mono text-black/90">
                        {getTimeRemaining()}
                      </p>
                      <p className="text-xs font-medium text-black/40 mt-1">
                        Remaining
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Visual Separator */}
            {!isClosed && (
              <div className="flex items-center gap-4 my-10 md:my-16">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
                <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                  Choose Your Strategy
                </h2>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
              </div>
            )}

            {/* Choice Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Cooperate */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => setSelectedChoice("cooperate")}
                className={`
                  relative overflow-hidden rounded-3xl border-2 p-8 cursor-pointer transition-all
                  ${
                    isClosed ? "cursor-default opacity-60" : "cursor-pointer"
                  }
                  ${
                    selectedChoice === "cooperate"
                      ? "border-green-500/50 bg-green-50/60 backdrop-blur-xl shadow-[0_16px_48px_-8px_rgba(34,197,94,0.3)]"
                      : winningOutcomeId === market.options?.[0]?.id
                      ? "border-green-500/30 bg-green-50/20 backdrop-blur-sm shadow-[0_8px_32px_-8px_rgba(34,197,94,0.1)]"
                      : "border-black/10 bg-white/40 backdrop-blur-sm hover:border-green-300/50 hover:bg-green-50/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
                  }
                `}
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
                    <IconHandClick className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-black/90">
                    COOPERATE
                  </h3>
                  <p className="text-sm text-black/80 font-medium">
                    Play it safe. Share the reward.
                  </p>
                  <div className="space-y-2 text-center">
                    <p className="text-xs text-green-700 font-medium">
                      ✓ Guaranteed small win if others cooperate
                    </p>
                    <p className="text-xs text-green-700 font-medium">
                      ✓ Lower risk strategy
                    </p>
                    <p className="text-xs text-red-600 font-medium">
                      ✗ Betrayers take your share
                    </p>
                  </div>
                </div>
                {selectedChoice === "cooperate" && (
                  <div className="absolute top-4 right-4">
                    <div className="rounded-full bg-green-500 p-2">
                      <IconCircleCheckFilled className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Betray */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => setSelectedChoice("betray")}
                className={`
                  relative overflow-hidden rounded-3xl border-2 p-8 cursor-pointer transition-all
                  ${
                    isClosed ? "cursor-default opacity-60" : "cursor-pointer"
                  }
                  ${
                    selectedChoice === "betray"
                      ? "border-red-500/50 bg-red-50/60 backdrop-blur-xl shadow-[0_16px_48px_-8px_rgba(239,68,68,0.3)]"
                      : winningOutcomeId === market.options?.[1]?.id
                      ? "border-red-500/30 bg-red-50/20 backdrop-blur-sm shadow-[0_8px_32px_-8px_rgba(239,68,68,0.1)]"
                      : "border-black/10 bg-white/40 backdrop-blur-sm hover:border-red-300/50 hover:bg-red-50/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
                  }
                `}
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
                    <IconBolt className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-black/90">
                    BETRAY
                  </h3>
                  <p className="text-sm text-black/80 font-medium">
                    Risk it all. Take the prize.
                  </p>
                  <div className="space-y-2 text-center">
                    <p className="text-xs text-green-700 font-medium">
                      ✓ Win big if minority betrays
                    </p>
                    <p className="text-xs text-green-700 font-medium">
                      ✓ Maximum potential payout
                    </p>
                    <p className="text-xs text-red-600 font-medium">
                      ✗ Everyone loses if majority betrays
                    </p>
                  </div>
                </div>
                {selectedChoice === "betray" && (
                  <div className="absolute top-4 right-4">
                    <div className="rounded-full bg-red-500 p-2">
                      <IconCircleCheckFilled className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Outcomes Explanation */}
            {showOutcomes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6 rounded-3xl bg-white/40 backdrop-blur-sm border border-black/5"
              >
                <h3 className="text-lg font-semibold text-black/90 mb-4">
                  How Payouts Work
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-green-50/60 border border-green-200/50">
                    <IconHandClick className="w-6 h-6 text-green-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-900">
                        All Cooperate
                      </p>
                      <p className="text-sm text-green-700 font-medium">
                        Everyone wins a small amount. Prize pool divided
                        equally.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/50">
                    <IconScale className="w-6 h-6 text-amber-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-amber-900">
                        Majority Cooperate, Minority Betray
                      </p>
                      <p className="text-sm text-amber-700 font-medium">
                        Betrayers win BIG. They split the entire prize pool.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50/60 border border-red-200/50">
                    <IconBolt className="w-6 h-6 text-red-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-900">
                        Majority Betray
                      </p>
                      <p className="text-sm text-red-700 font-medium">
                        Everyone loses. No payouts. Greed destroyed the pool.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-black border border-black/20">
                    <IconSkull className="w-6 h-6 text-white shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-white">All Betray</p>
                      <p className="text-sm text-white/70 font-medium">
                        Zero for everyone. Complete mutual destruction.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="text-center">
              <button
                onClick={() => setShowOutcomes(!showOutcomes)}
                className="px-6 py-2 text-sm text-black/80 hover:text-black/90 font-medium cursor-pointer transition-colors underline"
              >
                {showOutcomes ? "Hide" : "Show"} Possible Outcomes
              </button>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <IconEye className="w-5 h-5 text-black/40" />
                <h3 className="text-lg font-semibold text-black/90">
                  Recent Activity
                </h3>
              </div>

              <div className="space-y-3">
                {market.participants.map((participant: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5 hover:bg-white/60 hover:border-black/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-sm font-semibold text-black/70">
                        {participant.username.substring(1, 3).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black/90">
                          {participant.username}
                        </p>
                        <p className="text-xs text-black/50 font-medium">
                          Made choice
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold font-mono text-black/90">
                        {formatCurrency(participant.total_stake)}
                      </p>
                      <p className="text-xs text-black/40 font-medium">
                        {new Date(participant.timestamp).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 sticky top-24 self-start">
            <div className="space-y-6">
              {/* Prediction Result / Slip */}
              {predictionResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/60 backdrop-blur-xl border border-black/5 shadow-2xl rounded-3xl overflow-hidden"
                >
                  <div className="p-6 bg-green-500 text-white text-center">
                    <IconCircleCheckFilled className="w-12 h-12 mx-auto mb-2" />
                    <h3 className="text-xl font-bold">Decision Secured</h3>
                    <p className="text-sm text-white/80">Receipt ID: {predictionResult.transactionId?.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span className="text-sm text-black/40 font-medium">Outcome</span>
                      <span className="text-base font-bold text-black/90">{predictionResult.optionText}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span className="text-sm text-black/40 font-medium">Stake</span>
                      <span className="text-base font-bold text-black/90">{formatCurrency(predictionResult.amount)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                       <span className="text-sm text-black/40 font-medium">Platform Fee</span>
                       <span className="text-sm font-medium text-black/60">{formatCurrency(predictionResult.amount * 0.05)}</span>
                    </div>
                    <button 
                      onClick={() => setPredictionResult(null)}
                      className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-black/90 transition-all mt-4"
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
                  className={`bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] space-y-6 rounded-3xl overflow-hidden ${isClosed ? 'opacity-75' : ''}`}
                >
                  {/* Header */}
                  <div className={`p-6 ${isClosed ? 'bg-neutral-500' : 'bg-black'} text-white`}>
                    <h3 className="text-xl font-semibold mb-1">
                      {isClosed ? 'Market Closed' : 'Place Your Prediction'}
                    </h3>
                    <p className="text-sm text-white/60 font-medium">
                      {isClosed ? 'Choices are no longer accepted' : 'Make your choice'}
                    </p>
                  </div>
  
                  {/* Content */}
                  <div className="space-y-6 px-6 py-4">
                    {/* Selected Choice */}
                    <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                      <span className="text-xs font-semibold text-black/40 uppercase tracking-wider block mb-2">
                        {isClosed && winningOutcomeId ? 'Final Outcome' : 'Selected Strategy'}
                      </span>
                      <div className="flex items-center gap-2">
                        {isClosed && winningOutcomeId ? (
                           <>
                           <span className="text-base font-semibold text-black/90">
                             {market.options.find((o: any) => o.id === winningOutcomeId)?.option_text.toUpperCase()}
                           </span>
                           <IconCircleCheckFilled className="w-4 h-4 text-green-600" />
                         </>
                        ) : selectedChoice ? (
                          <>
                            <span
                              className={`text-base font-semibold ${
                                selectedChoice === "cooperate"
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              {selectedChoice.toUpperCase()}
                            </span>
                            <IconCircleCheckFilled
                              className={`w-4 h-4 ${
                                selectedChoice === "cooperate"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            />
                          </>
                        ) : (
                          <span className="text-base text-black/40 italic">
                            No choice selected
                          </span>
                        )}
                      </div>
                    </div>
  
                    {!isClosed && (
                      <>
                        {/* Stake Input */}
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-black/70">
                            Your Stake
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              placeholder={formatCurrency(market.buy_in_amount)}
                              min={market.buy_in_amount}
                              value={stakeAmount}
                              onChange={(e) => setStakeAmount(e.target.value)}
                              className="w-full px-4 py-2 pr-16 bg-white/60 backdrop-blur-sm border border-black/10 rounded-xl text-base font-mono font-semibold text-black/90 focus:border-black/30 focus:bg-white/80 outline-none transition-all placeholder:text-black/30"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-black/40">
                              {symbol}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs px-1">
                            <span className="text-black/40 font-medium">
                              Minimum buy-in
                            </span>
                            <span className="font-mono font-semibold text-black/70">
                              {formatCurrency(market.buy_in_amount)}
                            </span>
                          </div>
                        </div>
  
                        {/* Summary */}
                        <div className="pt-6 border-t border-black/5 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-black/80 font-medium">
                              Platform Fee (5%)
                            </span>
                            <span className="font-mono font-semibold text-black/80">
                              {formatCurrency(platformFeeKsh)}
                            </span>
                          </div>
                          <div className="flex justify-between text-base">
                            <span className="text-black/90 font-semibold">
                              Total Amount
                            </span>
                            <span className="font-mono font-semibold text-black/90">
                              {formatCurrency(totalAmountKsh)}
                            </span>
                          </div>
                        </div>
  
                        {/* CTA Button */}
                        <motion.button
                          onClick={handlePlacePrediction}
                          disabled={isSubmitting || !selectedChoice || !stakeAmount}
                          className={`w-full py-2 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
                            isSubmitting || !selectedChoice || !stakeAmount
                              ? "bg-black/10 text-black/30 cursor-not-allowed"
                              : "bg-black text-white hover:bg-black/90 shadow-lg cursor-pointer"
                          }`}
                          whileHover={
                            !isSubmitting && selectedChoice && stakeAmount
                              ? { scale: 1.02 }
                              : {}
                          }
                          whileTap={
                            !isSubmitting && selectedChoice && stakeAmount
                              ? { scale: 0.98 }
                              : {}
                          }
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Locking In...
                            </>
                          ) : (
                            <>
                              Lock In Choice
                              <IconArrowRight className="w-5 h-5" />
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
                className="p-5 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5"
              >
                <div className="flex gap-3">
                  <IconShield className="w-5 h-5 text-black/80 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-black/90">
                      Your Choice is Secret
                    </p>
                    <p className="text-xs text-black/80 font-medium leading-relaxed">
                      No one knows what you picked until the market settles.
                      Results revealed simultaneously to all participants.
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

