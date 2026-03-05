"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useCurrency } from "@/lib/utils/currency";
import {
  IconAccessPoint,
  IconArrowRight,
  IconCircleCheckFilled,
  IconClock,
  IconEye,
  IconLayoutGrid,
  IconPhoto,
  IconShield,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";

import Image from "next/image";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { useToast } from "@/components/ui/toast-notification";
import { MarketChart } from "@/components/markets/MarketChart";
import { cn } from "@/lib/utils";
import { fetchJsonOrNull, useLiveUser } from "@/lib/live-data";
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

  const totalVotes = market.options.reduce(
    (acc: number, opt: any) => acc + opt.votes,
    0,
  );
  const platformFee = stakeAmount ? parseFloat(stakeAmount) * 0.05 : 0;
  const totalAmount = stakeAmount ? parseFloat(stakeAmount) + platformFee : 0;

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-2 space-y-8">
        {/* Dashboard Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 px-4">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
            >
              {/* Top border accent */}
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
                      {isClosed ? 'Closed' : market.status}
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
                      {formatCurrency(market.poolAmount)}
                    </p>
                    <p className="text-xs font-medium text-black/40 mt-1">
                      {symbol}
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
                      {market.participantCount}
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

            {/* Market Analytics Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 md:p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-black/90">Market Performance</h3>
                  <p className="text-sm text-black/40 font-medium tracking-tight">
                    Historical consensus probability movement
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-green-600 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    +12.4% Trend
                  </span>
                </div>
              </div>
              
              <div className="h-[240px] w-full pt-4">
                <MarketChart 
                  data={[45, 48, 42, 51, 58, 54, 62, 65]} 
                  height={240}
                  color="#000"
                  showAxes
                />
              </div>
            </motion.div>

            {/* Visual Separator */}
            {!isClosed && (
              <div className="flex items-center gap-4 my-10 md:my-16">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
                <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                  Select Your Choice
                </h2>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
              </div>
            )}

            {/* Options */}
            <div className="space-y-6 my-10 md:my-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {market.options.map((option: any, index: number) => {
                  const isSelected = selectedOption === option.id;
                  const votePercentage =
                    Math.round((option.votes / totalVotes) * 100) || 0;

                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      onClick={() => setSelectedOption(option.id)}
                      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                        isClosed ? "cursor-default" : "cursor-pointer"
                      } ${
                        isSelected
                          ? "bg-white/60 backdrop-blur-xl border-2 border-black/20 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)]"
                          : winningOutcomeId === option.id
                          ? "bg-green-50/60 backdrop-blur-xl border-2 border-green-500/30 shadow-[0_8px_32px_-8px_rgba(16,185,129,0.1)]"
                          : "bg-white/40 backdrop-blur-sm border border-black/5 hover:bg-white/60 hover:border-black/10 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]"
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
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

                        {(isSelected || winningOutcomeId === option.id) && (
                          <div className={cn(
                            "absolute top-3 right-3 p-1.5 rounded-full",
                            winningOutcomeId === option.id ? "bg-green-500" : "bg-black"
                          )}>
                            <IconCircleCheckFilled className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-base font-semibold text-black/90 leading-tight">
                            {option.option_text}
                          </h4>
                          <span className="text-lg font-semibold font-mono text-black/80 shrink-0">
                            {votePercentage}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${votePercentage}%` }}
                              transition={{
                                duration: 1,
                                ease: "easeOut",
                                delay: 0.3 + index * 0.05,
                              }}
                              className={`h-full rounded-full ${
                                isSelected ? "bg-black/80" : "bg-black/40"
                              }`}
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-black/40 font-medium">
                              {option.votes} votes
                            </span>
                            {isSelected && (
                              <span className="text-xs text-black/80 font-semibold">
                                Selected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
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
                            Submitted forecast
                          </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold font-mono text-black/90">
                        {formatCurrency(participant.total_stake)} {symbol}
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
          <div className="lg:col-span-4 lg:self-start space-y-6">
            <div className="lg:sticky lg:top-28 z-40 h-fit">
              {/* Prediction Result / Slip */}
              {predictionResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/60 backdrop-blur-xl border border-black/5 shadow-2xl rounded-3xl overflow-hidden"
                >
                  <div className="p-6 bg-green-500 text-white text-center">
                    <IconCircleCheckFilled className="w-12 h-12 mx-auto mb-2" />
                    <h3 className="text-xl font-bold">Prediction Secured</h3>
                    <p className="text-sm text-white/80">Receipt ID: {predictionResult.transactionId?.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span className="text-sm text-black/40 font-medium">Outcome</span>
                      <span className="text-base font-bold text-black/90">{predictionResult.optionText}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-black/5">
                      <span className="text-sm text-black/40 font-medium">Stake</span>
                      <span className="text-base font-bold text-black/90">{formatCurrency(predictionResult.amount)} {symbol}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                       <span className="text-sm text-black/40 font-medium">Platform Fee</span>
                       <span className="text-sm font-medium text-black/60">{formatCurrency(predictionResult.amount * 0.05)} {symbol}</span>
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
                  className={`overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border border-black/5 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)] space-y-6 ${isClosed ? 'opacity-75' : ''}`}
                >
                  {/* Header */}
                  <div className={`p-6 ${isClosed ? 'bg-neutral-500' : 'bg-black'} text-white`}>
                    <h3 className="text-xl font-semibold mb-1">
                      {isClosed ? 'Market Closed' : 'Place Your Prediction'}
                    </h3>
                    <p className="text-sm text-white/60 font-medium">
                      {isClosed ? 'Predictions are no longer accepted' : 'Join the pool and win'}
                    </p>
                  </div>
  
                  {/* Content */}
                  <div className="space-y-6 px-6 py-4">
                    {/* Selected Option */}
                    <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                      <span className="text-xs font-semibold text-black/40 uppercase tracking-wider block mb-2">
                        {isClosed && winningOutcomeId ? 'Winning Outcome' : 'Selected Outcome'}
                      </span>
                      <div className="flex items-center gap-2">
                        {isClosed && winningOutcomeId ? (
                           <>
                           <span className="text-base font-semibold text-black/90">
                             {market.options.find((o: any) => o.id === winningOutcomeId)?.option_text}
                           </span>
                           <IconCircleCheckFilled className="w-4 h-4 text-green-600" />
                         </>
                        ) : selectedOption ? (
                          <>
                            <span className="text-base font-semibold text-black/90">
                              {
                                market.options.find(
                                  (o: any) => o.id === selectedOption,
                                )?.option_text
                              }
                            </span>
                            <IconCircleCheckFilled className="w-4 h-4 text-green-600" />
                          </>
                        ) : (
                          <span className="text-base text-black/40 italic">
                            No option selected
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
                              placeholder={market.minStake.toString()}
                              min={market.minStake}
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
                              Minimum staking amount
                            </span>
                            <span className="font-mono font-semibold text-black/70">
                              {formatCurrency(market.minStake)}
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
                              {formatCurrency(platformFee, preferredCurrency)}
                            </span>
                          </div>
                          <div className="flex justify-between text-base">
                            <span className="text-black/90 font-semibold">
                              Total Amount
                            </span>
                            <span className="font-mono font-semibold text-black/90">
                              {formatCurrency(totalAmount, preferredCurrency)}
                            </span>
                          </div>
                        </div>
  
                        {/* CTA Button */}
                        <motion.button
                          onClick={handlePlaceForecast}
                          disabled={isSubmitting || !selectedOption || !stakeAmount}
                          className={`w-full py-2 rounded-xl font-semibold text-base flex items-center uppercase justify-center gap-2 transition-all ${
                            isSubmitting || !selectedOption || !stakeAmount
                              ? "bg-black/10 text-black/30 cursor-not-allowed"
                              : "bg-black text-white hover:bg-black/90 shadow-lg cursor-pointer"
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
                              <IconArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

            </div>

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
                      How it works
                    </p>
                    <p className="text-xs text-black/80 font-medium leading-relaxed">
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
