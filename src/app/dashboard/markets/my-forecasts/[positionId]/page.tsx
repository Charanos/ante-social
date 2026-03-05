"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import { Position } from "@/types/market";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-notification";
import { IoArrowForwardOutline, IoCheckmarkCircleOutline, IoCloseOutline, IoSaveOutline, IoShareSocialOutline, IoRefresh, IoTimeOutline, IoTrendingUpOutline, IoTrophyOutline } from 'react-icons/io5';
import {
  fetchJsonOrNull,
  normalizePosition,
} from "@/lib/live-data";

type OutcomeOption = {
  id: string;
  name: string;
};

export default function ForecastTicketPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const positionId = params.positionId as string;
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState<Position | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [marketOutcomes, setMarketOutcomes] = useState<OutcomeOption[]>([]);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState("");
  const [savedOutcomeId, setSavedOutcomeId] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const payload = await fetchJsonOrNull<any>(`/api/markets/my/positions/${positionId}`);
      const foundPosition = payload ? normalizePosition(payload) : null;

      if (foundPosition) {
        setPosition(foundPosition);
        const currentOutcomeId = String(
          payload?.selectedOutcome?._id || payload?.selectedOutcome?.id || "",
        );
        setSelectedOutcomeId(currentOutcomeId);
        setSavedOutcomeId(currentOutcomeId);

        const marketPayload = await fetchJsonOrNull<any>(
          `/api/markets/${foundPosition.marketId}`,
        );
        const options = Array.isArray(marketPayload?.outcomes)
          ? marketPayload.outcomes.map((outcome: any, index: number) => ({
              id: String(outcome?._id || outcome?.id || `option-${index}`),
              name: String(outcome?.optionText || `Option ${index + 1}`),
            }))
          : [];
        setMarketOutcomes(options);

        if (!currentOutcomeId && options.length > 0) {
          setSelectedOutcomeId(options[0].id);
          setSavedOutcomeId(options[0].id);
        }
      }
      setShowSuccess(searchParams.get("new") === "true" && Boolean(foundPosition));
      setLoading(false);
    };
    void load();
  }, [positionId, searchParams]);

  const handleUpdatePosition = async () => {
    if (!position) return;
    if (!selectedOutcomeId) {
      toast.error("Missing Selection", "Choose an outcome before saving.");
      return;
    }

    const openedAtMs = new Date(position.openedAt).getTime();
    const isWithinEditWindow =
      Number.isFinite(openedAtMs) &&
      Date.now() - openedAtMs <= 5 * 60 * 1000;

    if (!isWithinEditWindow || position.status !== "active") {
      toast.error(
        "Edit Window Closed",
        "Forecast updates are only available within 5 minutes.",
      );
      setIsEditing(false);
      return;
    }

    if (selectedOutcomeId === savedOutcomeId) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    const response = await fetch(`/api/markets/my/positions/${position.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ outcomeId: selectedOutcomeId }),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setIsUpdating(false);
      toast.error(
        "Update Failed",
        payload?.message || payload?.error || "Unable to update forecast.",
      );
      return;
    }

    const selectedOutcome = marketOutcomes.find(
      (option) => option.id === selectedOutcomeId,
    );
    setPosition((current) =>
      current
        ? { ...current, outcome: selectedOutcome?.name || current.outcome }
        : current,
    );
    setSavedOutcomeId(selectedOutcomeId);
    setIsUpdating(false);
    setIsEditing(false);
    toast.success("Forecast Updated", "Your selected outcome has been updated.");
  };

  const handleCancelPosition = async () => {
    if (!position) return;
    if (!confirm("Are you sure you want to cancel this forecast?")) return;

    const response = await fetch(`/api/markets/my/positions/${position.id}`, {
      method: "DELETE",
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      toast.error(
        "Cancel Failed",
        payload?.message || payload?.error || "Unable to cancel position.",
      );
      return;
    }

    toast.success(
      "Position Cancelled",
      "Your funds have been returned to your wallet.",
    );
    router.push("/dashboard/markets/my-forecasts");
  };

  const handleClose = () => {
    if (searchParams.get("new") === "true") {
      router.push("/dashboard/markets/my-forecasts");
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

  if (!position) {
    return null;
  }

  const isMarketOpen = position.status === "active";
  const openedAtMs = new Date(position.openedAt).getTime();
  const editWindowRemainingMs =
    Number.isFinite(openedAtMs)
      ? Math.max(0, openedAtMs + 5 * 60 * 1000 - Date.now())
      : 0;
  const canEdit =
    isMarketOpen && editWindowRemainingMs > 0 && marketOutcomes.length > 0;
  const canCancel = isMarketOpen && editWindowRemainingMs > 0;
  const potentialProfit = (position.potentialWin || 0) - position.stakeAmount;
  const isWon = position.status === "settled" && (position.pnl ?? 0) > 0;

  const StatusIcon =
    position.status === "active"
      ? IoTimeOutline
      : isWon
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
                    <p className="font-semibold">Forecast Confirmed</p>
                    <p className="text-xs text-white/70">
                      Your position has been opened
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

        {/* Header - Prediction-Slip Details */}
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
                  {position.status}
                </p>
              </div>
            </div>
          </div>

            {/* Market Title */}
            <div className="relative z-10 space-y-2 max-w-[90%]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold leading-snug tracking-tight">
                  {position.title}
                </h2>
              </div>
              <div className="flex items-center justify-between gap-2 text-white/40 text-xs font-normal">
                <div className="flex items-center gap-2">
                  <IoTimeOutline className="w-3.5 h-3.5" />
                  <span>
                    {new Date(position.openedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-0.5">
                    Position ID:{" "}
                  </p>
                  <p className="font-mono text-xs text-white/60">
                    #{position.id.slice(0, 8)}
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
                  {position.outcome}
                </p>
              </div>
              <div className="w-px h-10 bg-black/5" />
              <div className="shrink-0 text-right">
                <p className="text-[10px] font-semibold text-black/40 uppercase tracking-widest mb-1.5">
                  Type
                </p>
                <div className="bg-black/5 px-3 py-1 rounded-full">
                  <p className="text-xs font-semibold text-black/70 capitalize">
                    {position.type || "Standard"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Body - Position Information */}
          <div className="p-6 pt-6 space-y-8">
            {/* Stake Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                  Stake Amount
                </p>
                {canEdit && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-semibold text-black hover:text-black/80 transition-colors cursor-pointer"
                  >
                    MANAGE
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider">
                      Change Outcome
                    </label>
                    <select
                      value={selectedOutcomeId}
                      onChange={(event) => setSelectedOutcomeId(event.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-black/10 bg-white outline-none focus:border-black transition-all cursor-pointer text-black/90"
                    >
                      {marketOutcomes.map((outcome) => (
                        <option key={outcome.id} value={outcome.id}>
                          {outcome.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => void handleUpdatePosition()}
                      disabled={isUpdating}
                      className="py-3 bg-black text-white rounded-xl font-semibold text-sm hover:bg-black/90 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/5"
                    >
                      <IoSaveOutline className="w-4 h-4" />{" "}
                      {isUpdating ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedOutcomeId(savedOutcomeId);
                      }}
                      className="py-3 bg-gray-100 text-black/80 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <p className="text-4xl font-mono font-semibold text-black tracking-tighter tabular-nums">
                    ${position.stakeAmount.toLocaleString()}
                  </p>
                  {isMarketOpen && !canEdit && (
                    <p className="text-xs text-black/40 mt-2">
                      Edit window closed. Updates are allowed for 5 minutes after entry.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Payout Breakdown */}
            <div className="space-y-4 pt-6 border-t border-black/5 border-dashed">
              {/* Potential Profit */}
              {!isWon && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-black/40">
                    Potential Profit
                  </span>
                  <span className="font-semibold text-black/80 font-mono tracking-tight">
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
                      isWon ? "bg-green-100" : "bg-black/5",
                    )}
                  >
                    {isWon ? (
                      <IoCheckmarkCircleOutline className="w-4 h-4 text-green-600" />
                    ) : (
                      <IoTrendingUpOutline className="w-4 h-4 text-black" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-black/70 uppercase tracking-wide">
                    {isWon ? "Total Paid" : "Potential Payout"}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-2xl font-semibold font-mono tracking-tight tabular-nums",
                    isWon ? "text-green-600" : "text-black",
                  )}
                >
                  $
                  {(position.potentialWin || 0).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Cancel Action */}
            {canCancel && (
              <div className="pt-2">
                <button
                  onClick={handleCancelPosition}
                  className="w-full text-center py-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel Position & Refund
                </button>
              </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-black/5 p-5 flex items-center justify-between gap-4">
          <Link
            href={`/dashboard/markets/${position.marketId}`}
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
