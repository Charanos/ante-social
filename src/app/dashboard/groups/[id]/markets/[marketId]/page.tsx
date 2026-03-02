"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconAward,
  IconCheck,
  IconClock,
  IconCurrencyDollar,
  IconMessageShare,
  IconShield,
  IconTarget,
  IconTrendingUp,
} from "@tabler/icons-react";

import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { fetchJsonOrNull } from "@/lib/live-data";
import { LoadingLogo } from "@/components/ui/LoadingLogo";

type MarketParticipant = {
  id: string;
  name: string;
  selected: string;
  joined: string;
  avatar: string;
};

type GroupMarketDetail = {
  id: string;
  title: string;
  type: string;
  buy_in: number;
  pool: number;
  payout: number;
  status: "active" | "pending_confirmation" | "settled" | "disputed" | "cancelled";
  created_at: Date;
  creator: string;
  participants: MarketParticipant[];
  options: string[];
};

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function formatRelativeTime(value: unknown): string {
  if (!value) return "just now";
  const date = new Date(String(value));
  if (!Number.isFinite(date.getTime())) return "just now";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function mapGroupMarket(raw: any, groupRaw: any): GroupMarketDetail {
  const participants = Array.isArray(raw?.participants)
    ? raw.participants.map((entry: any, index: number) => {
        const userObj =
          entry?.userId && typeof entry.userId === "object" ? entry.userId : {};
        const name =
          userObj?.username ||
          entry?.name ||
          `member_${index + 1}`;

        return {
          id: String(userObj?._id || userObj?.id || entry?.userId || `p-${index + 1}`),
          name,
          selected: String(entry?.selectedOption || "No option"),
          joined: formatRelativeTime(entry?.joinedAt || entry?.createdAt),
          avatar: String(name).slice(0, 2).toUpperCase(),
        };
      })
    : [];

  const options = Array.isArray(raw?.options)
    ? raw.options.map((option: any) => String(option))
    : Array.from(new Set(participants.map((participant: MarketParticipant) => participant.selected).filter(Boolean)));

  const creatorName =
    (Array.isArray(groupRaw?.members)
      ? groupRaw.members.find((member: any) => {
          const role = String(member?.role || "").toLowerCase();
          return role === "admin";
        })?.userId?.username
      : undefined) ||
    "Group Admin";

  return {
    id: String(raw?._id || raw?.id || ""),
    title: String(raw?.title || "Untitled Group Market"),
    type: String(raw?.marketType || "winner_takes_all"),
    buy_in: toNumber(raw?.buyInAmount),
    pool: toNumber(raw?.totalPool),
    payout: toNumber(raw?.prizePoolAfterFees, toNumber(raw?.totalPool) * 0.95),
    status: String(raw?.status || "active") as GroupMarketDetail["status"],
    created_at: new Date(raw?.createdAt || Date.now()),
    creator: creatorName,
    participants,
    options,
  };
}

export default function PrivateMarketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();

  const groupId = params.id as string;
  const marketId = params.marketId as string;

  const [market, setMarket] = useState<GroupMarketDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!groupId || !marketId) return;
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      const [groupPayload, betsPayload] = await Promise.all([
        fetchJsonOrNull<any>(`/api/groups/${groupId}`),
        fetchJsonOrNull<any>(`/api/groups/${groupId}/markets`),
      ]);
      if (cancelled) return;

      const list = Array.isArray(betsPayload)
        ? betsPayload
        : Array.isArray(betsPayload?.data)
          ? betsPayload.data
          : [];
      const rawMarket = list.find(
        (entry: any) => String(entry?._id || entry?.id) === String(marketId),
      );

      setMarket(rawMarket ? mapGroupMarket(rawMarket, groupPayload) : null);
      setIsLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [groupId, marketId]);

  const participantOptions = useMemo(() => {
    if (!market) return [] as MarketParticipant[];
    return market.participants;
  }, [market]);

  const handleDeclareWinner = async () => {
    if (!market || !selectedWinner) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/groups/${groupId}/markets/${market.id}/settle`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "declare_winner", winnerId: selectedWinner }),
        },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || payload?.error || "Failed to declare winner.");
      }

      const nextStatus = String(payload?.status || "pending_confirmation") as GroupMarketDetail["status"];
      setMarket((prev) => (prev ? { ...prev, status: nextStatus } : prev));
      toast.success("Winner Declared!", "Waiting for group confirmation.");
    } catch (error: any) {
      toast.error("Action Failed", error?.message || "Unable to declare winner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSettlementAction = async (action: "confirm" | "disagree") => {
    if (!market) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/groups/${groupId}/markets/${market.id}/settle`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action }),
        },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || payload?.error || "Failed to submit response.");
      }

      const fallbackStatus: GroupMarketDetail["status"] =
        action === "confirm" ? "settled" : "disputed";
      const nextStatus = String(payload?.status || fallbackStatus) as GroupMarketDetail["status"];
      setMarket((prev) => (prev ? { ...prev, status: nextStatus } : prev));

      if (action === "confirm") {
        toast.success("Payout Processed!", "The winner has been credited.");
      } else {
        toast.error("Marked As Disputed", "An admin will review this result.");
      }
    } catch (error: any) {
      toast.error("Action Failed", error?.message || "Unable to submit response.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  if (!market) {
    return <div className="p-8 text-sm text-black/50">Group market not found.</div>;
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow delay-700" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-6">
        <button
          onClick={() => router.back()}
          className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <div className="p-1 rounded-full bg-white/50 border border-white/60 mr-2 group-hover:bg-white group-hover:shadow-sm transition-all">
            <IconArrowLeft className="h-4 w-4" />
          </div>
          Back to Group
        </button>

        <div className="glass-panel p-8 rounded-3xl border-white/50 bg-white/40 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <IconAward className="w-64 h-64 rotate-12" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border backdrop-blur-md",
                  market.type === "winner_takes_all"
                    ? "bg-yellow-500/10 text-yellow-700 border-yellow-200"
                    : "bg-blue-500/10 text-blue-700 border-blue-200",
                )}
              >
                {market.type.replace(/_/g, " ")}
              </span>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border backdrop-blur-md",
                  market.status === "active"
                    ? "bg-green-500/10 text-green-700 border-green-200"
                    : market.status === "settled"
                      ? "bg-gray-500/10 text-gray-700 border-gray-200"
                      : market.status === "disputed"
                        ? "bg-red-500/10 text-red-700 border-red-200"
                        : "bg-orange-500/10 text-orange-700 border-orange-200",
                )}
              >
                {market.status.replace(/_/g, " ")}
              </span>
            </div>

            <h1 className="text-4xl font-semibold text-gray-900 mb-2 leading-tight max-w-2xl">
              {market.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <IconClock className="w-4 h-4" />
                <span>Created {market.created_at.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IconShield className="w-4 h-4" />
                <span>Managed by {market.creator}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-panel p-6 rounded-2xl border-white/50 bg-white/60 flex items-center justify-between group hover:scale-[1.02] transition-transform duration-300">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Pool</p>
                  <p className="text-3xl font-semibold text-gray-900 numeric">${market.pool}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <IconCurrencyDollar className="h-6 w-6 text-green-600" />
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border-white/50 bg-white/60 flex items-center justify-between group hover:scale-[1.02] transition-transform duration-300">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Buy-in Entry</p>
                  <p className="text-3xl font-semibold text-gray-900 numeric">${market.buy_in}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <IconTarget className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {market.status === "active" && (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="glass-panel p-8 rounded-3xl border-white/50 bg-white/80 shadow-lg shadow-purple-500/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <IconAward className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Declare Winner</h2>
                        <p className="text-xs text-gray-500">Admin Action Required</p>
                      </div>
                    </div>

                    <div className="grid gap-3 mb-8">
                      {participantOptions.map((player) => (
                        <button
                          key={player.id}
                          onClick={() => setSelectedWinner(player.id)}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
                            selectedWinner === player.id
                              ? "border-purple-600 bg-purple-50 shadow-sm"
                              : "border-transparent bg-gray-50 hover:bg-white hover:border-purple-200 hover:shadow-sm",
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-semibold text-gray-600 shadow-sm">
                              {player.avatar}
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-gray-900">{player.name}</p>
                              <p className="text-xs text-gray-500">Selected: {player.selected}</p>
                            </div>
                          </div>
                          {selectedWinner === player.id && (
                            <div className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center">
                              <IconCheck className="h-4 w-4" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={!selectedWinner || isSubmitting}
                      onClick={handleDeclareWinner}
                      className="w-full py-4 rounded-xl bg-gray-900 text-white font-medium shadow-xl hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isSubmitting ? "Processing..." : "Declare Winner"}
                    </button>
                  </div>
                </motion.div>
              )}

              {market.status === "pending_confirmation" && (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="glass-panel p-8 rounded-3xl border-yellow-500/30 bg-yellow-50/80 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 animate-pulse" />
                    <div className="h-20 w-20 rounded-full bg-yellow-100 mx-auto mb-6 flex items-center justify-center animate-pulse">
                      <IconAlertCircle className="h-10 w-10 text-yellow-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Confirmation Required</h2>
                    <p className="text-gray-600 mt-2 max-w-sm mx-auto">
                      The group admin has declared a winner. Please confirm if this result is correct.
                    </p>

                    <div className="flex gap-4 w-full pt-8 max-w-sm mx-auto">
                      <button
                        onClick={() => void handleSettlementAction("confirm")}
                        className="flex-1 py-3.5 rounded-xl bg-green-600 text-white font-semibold shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all hover:-translate-y-0.5"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => void handleSettlementAction("disagree")}
                        className="flex-1 py-3.5 rounded-xl bg-white text-red-600 border border-gray-100 font-semibold hover:bg-red-50 hover:border-red-100 transition-all hover:-translate-y-0.5"
                      >
                        Dispute
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {market.status === "settled" && (
                <motion.div
                  key="settled"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="glass-panel p-12 text-center rounded-3xl border-green-500/20 bg-green-50/50">
                    <div className="h-24 w-24 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center shadow-inner">
                      <IconTrendingUp className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-semibold text-gray-900">Market Settled</h2>
                    <p className="text-gray-500 mt-2 mb-8">All rewards have been distributed to the winners.</p>
                    <div className="inline-block p-6 rounded-2xl bg-white shadow-lg border border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Winning Payout</p>
                      <p className="text-5xl font-semibold text-gray-900 numeric tracking-tight bg-clip-text bg-linear-to-r from-gray-900 to-gray-600">
                        ${market.payout}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 lg:self-start space-y-6">
            <div className="lg:sticky lg:top-28 z-40 h-fit">
            <div className="glass-panel p-6 rounded-3xl border-white/50 bg-white/60">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Valid Entries</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-lg bg-gray-100 text-gray-500">
                  {market.participants.length} Players
                </span>
              </div>

              <div className="space-y-3">
                {market.participants.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/50 hover:bg-white transition-colors border border-transparent hover:border-gray-100 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center font-semibold text-gray-500 group-hover:from-blue-50 group-hover:to-blue-100 group-hover:text-blue-600 transition-all">
                        {player.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{player.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{player.joined}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 rounded-xl border border-dashed border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all text-sm font-medium">
                View All History
              </button>
            </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border-white/50 bg-white/40">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <IconMessageShare className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Group Chat</h4>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    Discuss this prediction with the group. Is {market.creator} bluffing?
                  </p>
                  <button className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Open Chat 
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
