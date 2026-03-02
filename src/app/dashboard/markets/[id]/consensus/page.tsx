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
  IconLayoutGrid,
  IconPhoto,
  IconShield,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/useToast";
import { fetchJsonOrNull, useLiveUser } from "@/lib/live-data";
import { useCurrency } from "@/lib/utils/currency";
import { MarketChart } from "@/components/markets/MarketChart";
import { UserAvatar } from "@/components/ui/UserAvatar";
import Image from "next/image";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import {
  mapMarketToDetailView,
  parseApiError,
} from "@/lib/market-detail-view";

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
        throw new Error(parseApiError(payload, "Failed to place vote."));
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
      toast.error("Vote Failed", error?.message || "Unable to place vote.");
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

            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 md:p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
                    <IconTrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black/90 tracking-tight">Market Performance</h3>
                    <p className="text-xs text-black/40 font-semibold uppercase tracking-wider">Historical Signal Movement</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold font-mono text-black/90">82%</p>
                  <p className="text-[10px] text-green-600 font-medium uppercase tracking-wider">+12.5% Signal Strength</p>
                </div>
              </div>
              
              <div className="h-64 mt-4">
                <MarketChart 
                  data={[40, 45, 55, 60, 65, 70, 75, 82]} 
                  height="100%" 
                  color="#10b981" 
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
                  const isWinner = winningOutcomeId === option.id;

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
                          : isWinner
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

                        {isSelected && (
                          <div className="absolute top-3 right-3 p-1.5 bg-black rounded-full">
                            <IconCircleCheckFilled className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-base font-semibold text-black/90 leading-tight flex-1">
                            {option.option_text}
                          </h4>
                          <span className="text-lg font-semibold font-mono text-black/80 shrink-0">
                            {option.percentage}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${option.percentage}%` }}
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
                            {isWinner && (
                              <div className="flex items-center gap-1 text-green-600 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">
                                <IconCircleCheckFilled className="w-3 h-3" />
                                <span className="text-[10px] uppercase tracking-wider">Winner</span>
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
                      <UserAvatar 
                        name={participant.username} 
                        size="md" 
                        border={false}
                      />
                      <div>
                        <p className="text-sm font-semibold text-black/90">
                          {participant.username}
                        </p>
                        <p className="text-xs text-black/50 font-medium">
                          Placed vote
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
                      {isClosed ? 'Predictions are no longer accepted' : 'Join the poll and win'}
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
                              {
                                market.options.find(
                                  (o: any) => o.id === winningOutcomeId,
                                )?.option_text
                              }
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
                          onClick={handlePlaceBet}
                          disabled={isSubmitting || !selectedOption || !stakeAmount}
                          className={`w-full py-2 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
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
  );
}
