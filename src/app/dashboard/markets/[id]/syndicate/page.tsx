"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
  IconAccessPoint,
  IconArrowRight,
  IconCircleCheckFilled,
  IconClock,
  IconEye,
  IconShield,
  IconTrendingUp,
  IconUsers,
  IconBriefcase,
  IconChartBar,
} from "@tabler/icons-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/useToast";
import { fetchJsonOrNull, useLiveUser } from "@/lib/live-data";
import { MarketChart } from "@/components/markets/MarketChart";
import { UserAvatar } from "@/components/ui/UserAvatar";
import Image from "next/image";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { mapMarketToDetailView, parseApiError } from "@/lib/market-detail-view";

export default function SyndicateMarketPage() {
  const params = useParams();
  const toast = useToast();
  const { user } = useLiveUser();
  const marketId = params.id as string;
  const [market, setMarket] = useState<any>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [stakeAmount, setStakeAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const targetCap = Math.max(
        detail.total_pool * 2,
        detail.buy_in_amount * Math.max(10, detail.participant_count || 10),
      );
      setMarket({
        ...detail,
        min_contribution: detail.buy_in_amount,
        current_funding: detail.total_pool,
        target_cap: targetCap,
      });
      setIsPageLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [marketId]);

  const defaultOutcomeId = useMemo(() => market?.options?.[0]?.id ?? null, [market]);

  const handleJoinSyndicate = async () => {
    if (!market) return;
    const contribution = Number.parseFloat(stakeAmount);
    if (
      !stakeAmount ||
      !Number.isFinite(contribution) ||
      contribution < market.min_contribution
    ) {
      toast.error(
        "Invalid Contribution",
        `Minimum contribution is ${market.min_contribution.toLocaleString()} KSH`,
      );
      return;
    }
    if (!defaultOutcomeId) {
      toast.error("Unavailable Market", "No allocation options are available yet.");
      return;
    }
    if (user.balance < contribution) {
      toast.error("Insufficient Balance", "Please top up your wallet to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/markets/${market.id}/bet`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          outcomeId: defaultOutcomeId,
          amount: contribution,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(parseApiError(payload, "Failed to join syndicate."));
      }
      toast.success(
        "Syndicate Joined!",
        `You contributed ${stakeAmount} KSH to the initiative.`,
      );
    } catch (error: any) {
      toast.error("Join Failed", error?.message || "Unable to join syndicate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeRemaining = () => {
    const diff = market.close_date.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  const fundingPercentage = (market.current_funding / market.target_cap) * 100;
  const platformFee = stakeAmount ? parseFloat(stakeAmount) * 0.05 : 0;
  const totalAmount = stakeAmount ? parseFloat(stakeAmount) + platformFee : 0;

  if (isPageLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }
  if (!market) {
    return <div className="p-8 text-sm text-black/50">Market not found.</div>;
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-2 space-y-8">
        <DashboardHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />
              <div className="relative h-64 md:h-80 overflow-hidden">
                <Image src={market.image} alt={market.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-6 left-6 flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full flex items-center bg-white/90 backdrop-blur-sm border border-black/10">
                    <span className="text-xs font-semibold text-black/70 uppercase tracking-wider">{market.category}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-black/90 tracking-tight mb-3">{market.title}</h2>
                  <p className="text-base text-black/80 font-medium leading-relaxed">{market.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                    <div className="flex items-center gap-2 mb-2">
                      <IconTrendingUp className="w-4 h-4 text-black/40" />
                      <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">Target</span>
                    </div>
                    <p className="text-xl font-semibold font-mono text-black/90">{market.target_cap.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                    <div className="flex items-center gap-2 mb-2">
                       <IconBriefcase className="w-4 h-4 text-black/40" />
                       <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">Funded</span>
                    </div>
                    <p className="text-xl font-semibold font-mono text-black/90">{market.current_funding.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5 col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-2">
                      <IconClock className="w-4 h-4 text-black/40" />
                      <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">Ends In</span>
                    </div>
                    <p className="text-xl font-semibold font-mono text-black/90">{getTimeRemaining()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-black/40">
                    <span>Funding Progress</span>
                    <span>{fundingPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-black/5 rounded-full overflow-hidden border border-black/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${fundingPercentage}%` }}
                      className="h-full bg-black/80 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 md:p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <IconChartBar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black/90 tracking-tight">Investment Momentum</h3>
                    <p className="text-xs text-black/40 font-semibold uppercase tracking-wider">Funding Velocity</p>
                  </div>
                </div>
              </div>
              <div className="h-64 mt-4">
                <MarketChart data={[10, 20, 35, 45, 60, 80, 100, 120]} height="100%" color="#3b82f6" showAxes />
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] space-y-6 rounded-3xl"
              >
                <div className="p-6 bg-black">
                  <h3 className="text-xl font-semibold text-white mb-1 rounded-3xl">Join Syndicate</h3>
                  <p className="text-sm text-white/60 font-medium">Contribute and earn share</p>
                </div>

                <div className="space-y-6 px-6 py-4">
                   <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                    <span className="text-xs font-semibold text-black/40 uppercase tracking-wider block mb-2">Min Contribution</span>
                    <span className="text-lg font-semibold text-black/90 font-mono">{market.min_contribution.toLocaleString()} KSH</span>
                   </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-black/70">Your Contribution</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={market.min_contribution.toLocaleString()}
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="w-full px-4 py-2 pr-16 bg-white/60 backdrop-blur-sm border border-black/10 rounded-xl text-base font-mono font-semibold text-black/90 focus:border-black/30 outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-black/40">KSH</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-black/5 space-y-3">
                    <div className="flex justify-between text-base">
                      <span className="text-black/90 font-semibold">Total with Fee</span>
                      <span className="font-mono font-semibold text-black/90">{totalAmount.toLocaleString()} KSH</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleJoinSyndicate}
                    disabled={isSubmitting || !stakeAmount}
                    className={`w-full py-2 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
                      isSubmitting || !stakeAmount ? "bg-black/10 text-black/30 cursor-not-allowed" : "bg-black text-white hover:bg-black/90 shadow-lg cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? "Processing..." : "Contribute Now"}
                    {!isSubmitting && <IconArrowRight className="w-5 h-5" />}
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-5 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5"
              >
                <div className="flex gap-3">
                  <IconShield className="w-5 h-5 text-black/80 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-black/90">Syndicate Security</p>
                    <p className="text-xs text-black/80 font-medium leading-relaxed">Contributions are locked in a smart contract. If target isn't met, funds are returned.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
