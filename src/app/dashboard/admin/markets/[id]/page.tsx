"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  IconAward,
  IconCalendar,
  IconChartBar,
  IconClock,
  IconCurrencyDollar,
  IconEdit,
  IconShare2,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { useToast } from "@/components/ui/toast-notification";
import { getApiErrorMessage } from "@/lib/api/client";
import { marketsApi } from "@/lib/api";
import { useCurrency } from "@/lib/utils/currency";

type MarketOutcome = {
  _id?: string;
  id?: string;
  optionText?: string;
  participantCount?: number;
  totalAmount?: number;
};

type MarketPayload = {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  totalPool?: number;
  participantCount?: number;
  buyInAmount?: number;
  minParticipants?: number;
  maxParticipants?: number;
  closeTime?: string;
  settlementTime?: string;
  createdAt?: string;
  tags?: string[];
  outcomes?: MarketOutcome[];
};

function formatDateTime(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function hoursUntil(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const diffMs = date.getTime() - Date.now();
  if (diffMs <= 0) return "passed";
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours >= 24) return `${Math.floor(hours / 24)}d`;
  return `${hours}h`;
}

export default function ViewMarketPage() {
  const { formatCurrency } = useCurrency();
  const params = useParams();
  const toast = useToast();
  const marketId = params.id as string;

  const [marketData, setMarketData] = useState<MarketPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState("");

  const loadMarket = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(`/api/markets/${marketId}`, { cache: "no-store" });
    if (!response.ok) {
      setMarketData(null);
      setIsLoading(false);
      return;
    }
    const payload = (await response.json().catch(() => null)) as MarketPayload | null;
    setMarketData(payload);
    const firstOutcome = payload?.outcomes?.[0];
    const firstOutcomeId = String(firstOutcome?._id || firstOutcome?.id || "");
    setSelectedOutcomeId((current) => current || firstOutcomeId);
    setIsLoading(false);
  }, [marketId]);

  useEffect(() => {
    void loadMarket();
  }, [loadMarket]);

  const outcomes = useMemo(() => {
    const raw = Array.isArray(marketData?.outcomes) ? marketData.outcomes : [];
    const totalAmount = raw.reduce((sum, outcome) => sum + Number(outcome.totalAmount || 0), 0);
    return raw.map((outcome, index) => {
      const amount = Number(outcome.totalAmount || 0);
      const percentage = totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0;
      return {
        id: outcome._id || outcome.id || `${index}`,
        name: outcome.optionText || `Option ${index + 1}`,
        bets: Number(outcome.participantCount || 0),
        amount,
        percentage,
      };
    });
  }, [marketData]);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "closed":
      case "settling":
      case "settled":
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/dashboard/markets/${marketId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied", "Market URL copied to clipboard");
    } catch {
      toast.error("Share failed", "Could not copy link");
    }
  };

  const handleCloseMarket = async () => {
    if (!window.confirm("Close this market now?")) return;
    setIsMutating(true);
    try {
      await marketsApi.close(marketId);
      toast.success("Market Closed", "The market is now closed.");
      await loadMarket();
    } catch (error) {
      toast.error(
        "Close Failed",
        getApiErrorMessage(error, "Unable to close market"),
      );
    } finally {
      setIsMutating(false);
    }
  };

  const handleSettleMarket = async () => {
    if (
      !window.confirm(
        "Settle this market now? This will trigger payouts and cannot be undone.",
      )
    ) {
      return;
    }

    setIsMutating(true);
    try {
      await marketsApi.settle(marketId, {
        winningOptionId: selectedOutcomeId || undefined,
      });
      toast.success("Settlement Triggered", "Market settlement has started.");
      await loadMarket();
    } catch (error) {
      toast.error(
        "Settle Failed",
        getApiErrorMessage(error, "Unable to settle market"),
      );
    } finally {
      setIsMutating(false);
    }
  };

  if (isLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  if (!marketData) {
    return (
      <div className="min-h-screen pb-8">
        <div className="max-w-full mx-auto px-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-sm text-neutral-600">
            Market not found.
          </div>
        </div>
      </div>
    );
  }

  const normalizedStatus = String(marketData.status || "unknown").toLowerCase();

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-full mx-auto px-6">
        <div className="flex items-center justify-end gap-2 -mt-16 mb-8 relative z-10 px-2">
          <Link href={`/dashboard/admin/markets/${marketId}/edit`}>
            <button className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm">
              <IconEdit className="w-4 h-4" />
              Edit Market
            </button>
          </Link>
          {normalizedStatus === "active" && (
            <button
              onClick={() => void handleCloseMarket()}
              disabled={isMutating}
              className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
            >
              {isMutating ? "Closing..." : "Close Market"}
            </button>
          )}
          {(normalizedStatus === "closed" || normalizedStatus === "settling") && (
            <>
              {outcomes.length > 0 && (
                <select
                  value={selectedOutcomeId}
                  onChange={(event) => setSelectedOutcomeId(event.target.value)}
                  className="px-3 py-2 text-sm rounded-lg border border-neutral-200 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent cursor-pointer"
                >
                  {outcomes.map((outcome) => (
                    <option key={outcome.id} value={outcome.id}>
                      {outcome.name}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={() => void handleSettleMarket()}
                disabled={isMutating}
                className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
              >
                {isMutating ? "Settling..." : "Settle Market"}
              </button>
            </>
          )}
          <button
            onClick={handleShare}
            className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <IconShare2 className="w-4 h-4" />
            Share
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-neutral-200 p-8 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-medium text-neutral-900 mb-3">{marketData.title || "Untitled Market"}</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">{marketData.description || "No description."}</p>
              <div className="flex flex-wrap gap-2">
                {(marketData.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span
              className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusStyles(normalizedStatus)}`}
            >
              {normalizedStatus.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-100">
            <div className="p-4 rounded-lg bg-green-50/50 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <IconCurrencyDollar className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">Total Pool</span>
              </div>
              <p className="text-2xl font-medium text-green-900">{formatCurrency(Number(marketData.totalPool || 0), "KSH")}</p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <IconUsers className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Participants</span>
              </div>
              <p className="text-2xl font-medium text-blue-900">{Number(marketData.participantCount || 0)}</p>
              <p className="text-xs text-blue-600 mt-1">
                Min: {Number(marketData.minParticipants || 0)} / Max: {Number(marketData.maxParticipants || 0)}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-purple-50/50 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <IconTrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">Buy-in</span>
              </div>
              <p className="text-2xl font-medium text-purple-900">{formatCurrency(Number(marketData.buyInAmount || 0), "KSH")}</p>
            </div>

            <div className="p-4 rounded-lg bg-orange-50/50 border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <IconAward className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-orange-700">Status</span>
              </div>
              <p className="text-lg font-medium text-orange-900 capitalize">{normalizedStatus}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-neutral-200 p-8 mb-6"
        >
          <h3 className="text-lg font-medium text-neutral-900 mb-6">Timeline</h3>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-neutral-100">
                <IconCalendar className="w-5 h-5 text-neutral-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Created</p>
                <p className="text-sm text-neutral-600">{formatDate(marketData.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-red-100">
                <IconClock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Closes</p>
                <p className="text-sm text-neutral-600">{formatDateTime(marketData.closeTime)}</p>
                <p className="text-xs text-red-600 mt-0.5">
                  {hoursUntil(marketData.closeTime) ? `in ${hoursUntil(marketData.closeTime)}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-100">
                <IconChartBar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Settlement</p>
                <p className="text-sm text-neutral-600">{formatDateTime(marketData.settlementTime)}</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  {hoursUntil(marketData.settlementTime) ? `in ${hoursUntil(marketData.settlementTime)}` : ""}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-neutral-200 p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-neutral-900">Outcomes</h3>
            <span className="text-sm text-neutral-600">{outcomes.length} options</span>
          </div>

          <div className="space-y-8">
            {outcomes.map((outcome) => (
              <div
                key={outcome.id}
                className="p-6 rounded-lg border border-neutral-200 bg-neutral-50/30 hover:bg-neutral-50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-medium text-neutral-900">{outcome.name}</h4>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      outcome.percentage > 0
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                    }`}
                  >
                    {outcome.percentage}%
                  </span>
                </div>

                <div className="w-full h-2 bg-neutral-200 rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-green-500 to-green-600 transition-all duration-500"
                    style={{ width: `${outcome.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-neutral-600">
                      <span className="font-medium text-neutral-900">{outcome.bets}</span> bet(s)
                    </span>
                    <span className="text-neutral-600">
                      <span className="font-medium text-neutral-900">{formatCurrency(outcome.amount, "KSH")}</span> staked
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {outcomes.length === 0 && (
              <div className="text-sm text-neutral-500">No outcomes configured.</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
