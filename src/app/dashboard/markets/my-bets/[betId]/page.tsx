"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IconDeviceFloppy } from '@tabler/icons-react';;

import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockUser, mockMyBets, mockMarkets } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { useToast } from "@/components/ui/toast-notification";
import { IoAlertCircleOutline, IoArrowForwardOutline, IoCheckmarkCircleOutline, IoCloseOutline, IoSaveOutline, IoShareSocialOutline, IoRefresh, IoTimeOutline, IoTrendingUpOutline, IoTrophyOutline } from 'react-icons/io5';

export default function BetSlipPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const betId = params.betId as string;
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [bet, setBet] = useState<any>(null);
  const [market, setMarket] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Simulate fetching
    setTimeout(() => {
      let foundBet = mockMyBets.find((b) => b.id === betId);

      // If not found in mock data, try to construct from URL params (New Bet Scenario)
      if (!foundBet && searchParams.get("new") === "true") {
        foundBet = {
          id: betId,
          marketId: searchParams.get("marketId") || "",
          title: searchParams.get("title") || "Unknown Market",
          amount: parseFloat(searchParams.get("amount") || "0"),
          status: searchParams.get("status") || "active",
          potentialWin:
            parseFloat(searchParams.get("amount") || "0") *
            (Math.random() * 2 + 1.2),
          type: "poll",
          date: searchParams.get("date") || new Date().toISOString(),
          outcome: searchParams.get("outcome") || "Unknown",
        };
        setShowSuccess(true);

        // Trigger Confetti
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = {
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 50,
        };

        const randomInRange = (min: number, max: number) =>
          Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          });
        }, 250);
      }

      if (foundBet) {
        setBet(foundBet);
        setNewAmount(foundBet.amount);

        const foundMarket = mockMarkets.find(
          (m) => m.id === foundBet!.marketId,
        ) || {
          title: foundBet.title,
          status: foundBet.status === "active" ? "active" : "closed",
          id: foundBet.marketId,
        };
        setMarket(foundMarket);
      }
      setLoading(false);
    }, 1000);
  }, [betId, searchParams]);

  const handleUpdateBet = () => {
    setIsEditing(false);
    setBet({
      ...bet,
      amount: newAmount,
      potentialWin: newAmount * (Math.random() * 2 + 1.2),
    });
    toast.success("Stake Updated", `New stake amount: $${newAmount}`);
  };

  const handleCancelBet = () => {
    if (confirm("Are you sure you want to cancel this bet?")) {
      toast.info(
        "Bet Cancelled",
        "Your funds have been returned to your wallet.",
      );
      setTimeout(() => {
        router.back();
      }, 1500);
    }
  };

  const handleClose = () => {
    if (searchParams.get("new") === "true") {
      router.push("/dashboard/markets/my-bets");
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="relative">
          <IoRefresh className="w-16 h-16 border-[3px] border-white/10 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!bet) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-black/5"
        >
          <div className="bg-black/5 p-6 rounded-2xl w-fit mx-auto">
            <IoAlertCircleOutline className="w-12 h-12 text-black/60" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-black">
              Bet Slip Not Found
            </p>
            <p className="text-sm text-black/50">
              This bet may have been removed or doesn't exist.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/markets/my-bets")}
            className="w-full py-4 bg-black text-white rounded-xl font-semibold hover:bg-black/90 transition-all cursor-pointer"
          >
            Return to My Bets
          </button>
        </motion.div>
      </div>
    );
  }

  const isMarketOpen = bet.status === "active";
  const potentialProfit = bet.potentialWin - bet.amount;

  const StatusIcon =
    bet.status === "active"
      ? IoTimeOutline
      : bet.status === "won"
        ? IoTrophyOutline
        : IoCloseOutline;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.25 }}
        className="relative w-full max-w-lg bg-white shadow-2xl overflow-hidden"
        style={{ borderRadius: "24px" }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer group backdrop-blur-sm"
        >
          <IoCloseOutline className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
        </button>

        {/* Success Banner */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-black text-white overflow-hidden border-b border-white/10"
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <IoCheckmarkCircleOutline className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Bet Confirmed</p>
                    <p className="text-xs text-white/70">
                      Your wager has been placed
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="text-white/70 hover:text-white cursor-pointer p-1"
                >
                  <IoCloseOutline className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header - Bet Details */}
        <div className="bg-black text-white p-6 pb-12 relative overflow-hidden">
          {/* Decorative blurred blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex items-start justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/5">
                <StatusIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-0.5">
                  Status
                </p>
                <p className="font-semibold text-lg capitalize tracking-tight">
                  {bet.status}
                </p>
              </div>
            </div>
          </div>

          {/* Market Title */}
          <div className="relative z-10 space-y-2 max-w-[90%]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold leading-snug tracking-tight">
                {bet.title}
              </h2>
            </div>
            <div className="flex items-center justify-between gap-2 text-white/40 text-xs font-normal">
              <div className="flex items-center gap-2">
                <IoTimeOutline className="w-3.5 h-3.5" />
                <span>
                  {new Date(bet.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-0.5">
                  Bet ID:{" "}
                </p>
                <p className="font-mono text-xs text-white/60">
                  #{bet.id.slice(0, 8)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Outcome - Ticket Style */}
        <div className="relative -mt-6 mx-6 z-20">
          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-black/40 uppercase tracking-widest mb-1.5">
                You Picked
              </p>
              <p className="text-xl font-semibold text-black leading-tight">
                {bet.outcome}
              </p>
            </div>
            <div className="w-px h-10 bg-black/5" />
            <div className="shrink-0 text-right">
              <p className="text-[10px] font-semibold text-black/40 uppercase tracking-widest mb-1.5">
                Type
              </p>
              <div className="bg-black/5 px-3 py-1 rounded-full">
                <p className="text-xs font-semibold text-black/70 capitalize">
                  {bet.type || "Standard"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Body - Bet Information */}
        <div className="p-6 pt-6 space-y-8">
          {/* Stake Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                Stake Amount
              </p>
              {isMarketOpen && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-semibold text-black hover:text-black/60 transition-colors cursor-pointer"
                >
                  EDIT
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-black/20 group-focus-within:text-black transition-colors">
                    $
                  </span>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(parseFloat(e.target.value))}
                    className="w-full font-mono pl-10 pr-4 py-4 text-3xl font-semibold bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black/10 focus:outline-none transition-all placeholder:text-black/10 tabular-nums"
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleUpdateBet}
                    className="py-3 bg-black text-white rounded-xl font-semibold text-sm hover:bg-black/90 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/5"
                  >
                    <IoSaveOutline className="w-4 h-4" /> Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setNewAmount(bet.amount);
                    }}
                    className="py-3 bg-gray-100 text-black/60 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-2">
                <p className="text-4xl font-mono font-semibold text-black tracking-tighter tabular-nums">
                  ${bet.amount.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Payout Breakdown */}
          <div className="space-y-4 pt-6 border-t border-black/5 border-dashed">
            {/* Potential Profit */}
            {bet.status !== "won" && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black/40">
                  Potential Profit
                </span>
                <span className="font-semibold text-black/60 font-mono tracking-tight">
                  +$
                  {potentialProfit.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            {/* Total Payout Big */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-linear-to-br from-gray-50 to-white border border-black/5 shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    bet.status === "won" ? "bg-green-100" : "bg-black/5",
                  )}
                >
                  {bet.status === "won" ? (
                    <IoCheckmarkCircleOutline className="w-4 h-4 text-green-600" />
                  ) : (
                    <IoTrendingUpOutline className="w-4 h-4 text-black" />
                  )}
                </div>
                <span className="text-sm font-semibold text-black/70 uppercase tracking-wide">
                  {bet.status === "won" ? "Total Paid" : "Potential Payout"}
                </span>
              </div>
              <span
                className={cn(
                  "text-2xl font-semibold font-mono tracking-tight tabular-nums",
                  bet.status === "won" ? "text-green-600" : "text-black",
                )}
              >
                $
                {bet.potentialWin.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Cancel Action */}
          {isMarketOpen && (
            <div className="pt-2">
              <button
                onClick={handleCancelBet}
                className="w-full text-center py-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel Bet & Refund
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-black/5 p-5 flex items-center justify-between gap-4">
          <Link
            href={`/dashboard/markets/${bet.marketId}`}
            className="flex items-center gap-2 text-xs font-semibold text-black/40 hover:text-black transition-colors cursor-pointer group uppercase tracking-wider"
          >
            Market Details
            <IoArrowForwardOutline className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <button className="flex items-center gap-2 text-xs font-semibold text-black/40 hover:text-black transition-colors cursor-pointer uppercase tracking-wider">
            <IoShareSocialOutline className="w-3 h-3" /> Share
          </button>
        </div>
      </motion.div>
    </div>
  );
}
