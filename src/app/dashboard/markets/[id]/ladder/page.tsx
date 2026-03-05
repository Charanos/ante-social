"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useToast } from "@/hooks/useToast";
import { fetchJsonOrNull, useLiveUser } from "@/lib/live-data";
import { useCurrency } from "@/lib/utils/currency";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { MarketChart } from "@/components/markets/MarketChart";
import Image from "next/image";
import {
  IconArrowRight,
  IconCircleCheckFilled,
  IconClock,
  IconEye,
  IconGripVertical,
  IconMicrophone,
  IconMusic,
  IconPlayerPlay,
  IconShield,
  IconTrendingUp,
  IconUsers,
  IconAccessPoint,
  IconTrophy,
  IconGhost,
} from "@tabler/icons-react";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { mapMarketToDetailView, parseApiError } from "@/lib/market-detail-view";

interface RankItem {
  id: string;
  text: string;
  icon: any;
}

const LADDER_ICONS = [
  IconMicrophone,
  IconMusic,
  IconPlayerPlay,
  IconAccessPoint,
  IconMusic,
];

function SortableItem({ item, index }: { item: RankItem; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-3 w-full p-4 rounded-2xl border transition-all duration-200
        ${
          isDragging
            ? "border-slate-900 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)] z-50 bg-white"
            : "border-slate-200 bg-white/60 backdrop-blur-sm hover:bg-white/90 hover:border-slate-300 shadow-sm hover:shadow-md"
        }
      `}
    >
      <div
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <IconGripVertical className="w-4 h-4 text-slate-400" />
      </div>

      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-semibold font-mono text-xs shrink-0">
        {index + 1}
      </div>

      <div className="flex-1 flex items-center gap-3">
        <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
          <item.icon className="w-4 h-4 text-slate-600" />
        </div>
        <span className="font-medium text-slate-900 text-sm">{item.text}</span>
      </div>
    </div>
  );
}

export default function LadderMarketPage() {
  const params = useParams();
  const toast = useToast();
  const { user } = useLiveUser();
  const { formatCurrency, symbol, convertAmount, preferredCurrency } = useCurrency();
  const marketId = params.id as string;
  const [market, setMarket] = useState<any>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [rankedItems, setRankedItems] = useState<RankItem[]>([]);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  const sortedParticipants = useMemo(() => {
    if (!market?.participants) return [];
    return [...market.participants].sort((a, b) => b.total_stake - a.total_stake);
  }, [market?.participants]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (!marketId) return;
    let cancelled = false;

    const load = async () => {
      setIsPageLoading(true);
      const payload = await fetchJsonOrNull<any>(`/api/markets/${marketId}`);
      if (cancelled) return;
      if (!payload) {
        setMarket(null);
        setRankedItems([]);
        setIsPageLoading(false);
        return;
      }

      const detail = mapMarketToDetailView(payload);
      const items: RankItem[] = detail.options.map((option, index) => ({
        id: option.id,
        text: option.option_text,
        icon: LADDER_ICONS[index % LADDER_ICONS.length],
      }));

      setMarket({ ...detail, items });
      setRankedItems(items);
      setIsPageLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [marketId]);

  const isClosed = market?.status === "closed" || market?.status === "settled" || market?.status === "resolved";

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && !isClosed) {
      setRankedItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmitRankingLive = async () => {
    if (!market) return;
    const stakeValuePreferred = Number.parseFloat(stakeAmount);
    const stakeValueKsh = convertAmount(stakeValuePreferred, preferredCurrency, "KSH");

    if (
      !stakeAmount ||
      !Number.isFinite(stakeValuePreferred) ||
      stakeValueKsh < market.buy_in_amount
    ) {
      toast.error(
        "Invalid Stake",
        `Minimum stake is ${formatCurrency(market.buy_in_amount)}`,
      );
      return;
    }
    if (user.balance < stakeValueKsh) {
      toast.error("Insufficient Balance", "Please top up your wallet to continue.");
      return;
    }
    if (!rankedItems[0]) {
      toast.error("Ranking Required", "Add at least one ranked option.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/markets/${market.id}/predict`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          outcomeId: rankedItems[0].id,
          amount: stakeValueKsh,
          ranking: rankedItems.map((item) => item.id),
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(parseApiError(payload, "Failed to submit ranking."));
      }

      setPredictionResult({
        optionText: "Custom Ranking",
        amount: stakeValueKsh,
        timestamp: new Date().toISOString(),
        transactionId: payload?.id || payload?._id,
      });

      toast.success("Ranking Submitted!", "Your ranking has been saved");
    } catch (error: any) {
      toast.error("Submit Failed", error?.message || "Unable to submit ranking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeRemaining = () => {
    if (!market) return "";
    const diff = market.close_date.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  const stakeValuePreferred = parseFloat(stakeAmount) || 0;
  const stakeValueKsh = convertAmount(stakeValuePreferred, preferredCurrency, "KSH");
  const platformFeeKsh = stakeValueKsh * 0.05;
  const totalAmountKsh = stakeValueKsh + platformFeeKsh;

  if (isPageLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }
  if (!market) {
    return <div className="p-8 text-sm text-black/50">Market not found.</div>;
  }

  return (
    <div className="space-y-6 md:space-y-10 pb-12 w-full px-2 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">

          {/* Hero Section — matches poll page pattern */}
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

              {/* Stats — inline with border-separated dividers like poll page */}
              <div className="flex flex-wrap items-center gap-8 md:gap-12 mt-auto border-t border-white/10 pt-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-white/50">
                    <IconTrendingUp className="w-4 h-4" />
                    <span className="text-[10px] font-medium uppercase tracking-widest">Total Pool</span>
                  </div>
                  <p className="text-2xl font-medium font-mono text-white">
                    {formatCurrency(market.total_pool)}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-white/50">
                    <IconUsers className="w-4 h-4" />
                    <span className="text-[10px] font-medium uppercase tracking-widest">Players</span>
                  </div>
                  <p className="text-2xl font-medium font-mono text-white">
                    {market.participant_count}
                  </p>
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
                      ? new Date(market.close_date).toLocaleDateString()
                      : getTimeRemaining()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Performance Chart — only when open */}
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
                    <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Market Momentum</h3>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">Historical Consensus Movement</p>
                  </div>
                </div>
                <div className="sm:text-right hidden sm:block">
                  <p className="text-2xl font-semibold font-mono text-slate-900">76%</p>
                  <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-widest">+5.2% Consensus Strength</p>
                </div>
              </div>

              <div className="h-64 mt-4 -mx-2 sm:mx-0">
                <MarketChart
                  data={[60, 62, 65, 68, 70, 72, 74, 76]}
                  height="100%"
                  color="#0f172a"
                  showAxes={false}
                />
              </div>
            </motion.div>
          )}

          {/* Closed State — Final Ranking */}
          {isClosed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-8 md:p-10 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-slate-200 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
                  <IconTrophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Final Market Ranking</h3>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">The community's ultimate consensus</p>
                </div>
              </div>

              <div className="space-y-3">
                {market?.items?.map((item: any, index: number) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      index === 0
                        ? "border-amber-200 bg-amber-50/60"
                        : "border-slate-100 bg-slate-50/60"
                    }`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-semibold text-sm shrink-0 ${
                      index === 0 ? "bg-amber-100 text-amber-700" :
                      index === 1 ? "bg-slate-200 text-slate-700" :
                      index === 2 ? "bg-orange-100 text-orange-800" :
                      "bg-white text-slate-500 border border-slate-100 shadow-sm"
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="font-medium text-slate-900">{item.text}</span>
                    </div>
                    {index === 0 && <IconTrophy className="w-5 h-5 text-amber-500 shrink-0" />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* How to Play + Drag to Rank — only when open */}
          {!isClosed && (
            <>
              {/* Visual Separator */}
              <div className="flex items-center gap-4 my-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
                  Drag to Rank
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
              </div>

              {/* Instructions — styled like poll info card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-6 rounded-[2rem] bg-slate-50 border border-slate-200"
              >
                <div className="flex gap-4">
                  <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm h-fit">
                    <IconGripVertical className="w-5 h-5 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-900">How to Play</p>
                    <p className="text-xs text-slate-600 font-normal leading-relaxed">
                      Drag items to rank them from <strong>#1 (best)</strong> to <strong>#5 (last)</strong>. Your goal is to match what the <strong>majority</strong> will choose. Winners split the prize pool!
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Drag and Drop Ranking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={rankedItems.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2.5">
                      {rankedItems.map((item, index) => (
                        <SortableItem key={item.id} item={item} index={index} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </motion.div>
            </>
          )}

          {/* Recent Activity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <IconEye className="w-5 h-5 text-black/40" />
              <h3 className="text-lg font-medium text-black/90">Recent Activity</h3>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
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
                        <UserAvatar
                          name={participant.username || "Anonymous"}
                          size="md"
                          border={false}
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {participant.username || "Anonymous"}
                          </p>
                          <p className="text-xs text-slate-500 font-normal mt-0.5">
                            Submitted ranking
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold font-mono text-slate-900">
                          {formatCurrency(participant.total_stake)}
                        </p>
                        <p className="text-xs text-slate-400 font-normal mt-0.5">
                          {new Date(participant.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
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
                      Be the first to submit a ranking in this market!
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
                {/* Closed Market Notice */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/60 backdrop-blur-xl border border-slate-200 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] rounded-[2rem] overflow-hidden"
                >
                  <div className="p-6 bg-slate-900 text-white flex items-center gap-3">
                    <div>
                      <h3 className="text-lg font-medium tracking-tight">Market Resolved</h3>
                      <p className="text-xs text-white/60 font-normal tracking-wide uppercase">Final Results</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-500 font-normal leading-relaxed">
                      This market has concluded and winnings have been distributed. Those whose ranked predictions matched the community consensus have claimed the pool.
                    </p>
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
                        {new Date(market.close_date).toLocaleDateString()}
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
                    {sortedParticipants.slice(0, 5).map((player: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <span className={`text-xs font-semibold w-4 text-center ${idx < 3 ? "text-slate-900" : "text-slate-400"}`}>
                          {idx + 1}
                        </span>
                        <UserAvatar name={player.username || "Anonymous"} size="sm" border={false} />
                        <span className="text-sm font-medium text-slate-700 flex-1 truncate">{player.username}</span>
                        <span className="text-sm font-semibold font-mono text-slate-900">{formatCurrency(player.total_stake)}</span>
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
                  <h3 className="text-xl font-semibold">Ranking Secured</h3>
                  <p className="text-sm text-white/80">Receipt ID: {predictionResult.transactionId?.slice(-8).toUpperCase()}</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500 font-normal">Outcome</span>
                    <span className="text-base font-semibold text-emerald-600">Ladder Ranking</span>
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
                {/* Header */}
                <div className="p-6 bg-slate-900 text-white">
                  <h3 className="text-xl font-medium mb-1">Submit Ranking</h3>
                  <p className="text-sm text-white/60 font-normal">Review your order before locking in</p>
                </div>

                {/* Content */}
                <div className="space-y-6 px-6 py-5">
                  {/* Current Ranking Preview */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest block mb-3">
                      Current Ranking Order
                    </span>
                    <div className="space-y-2.5">
                      {rankedItems.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-2.5 text-sm">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-semibold font-mono shrink-0">
                            {index + 1}
                          </span>
                          <span className="font-medium text-slate-900 flex items-center gap-2">
                            <span className="bg-white p-1 rounded-md border border-slate-100 shadow-sm">
                              <item.icon className="w-3.5 h-3.5 text-slate-500" />
                            </span>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stake Input */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                      Your Stake
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={formatCurrency(market.buy_in_amount)}
                        min={market.buy_in_amount}
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="w-full px-4 py-3 pr-16 bg-white border border-slate-200 rounded-xl text-lg font-mono font-medium text-slate-900 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all placeholder:text-slate-300"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                        {symbol}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs px-1">
                      <span className="text-slate-400 font-normal">Minimum buy-in</span>
                      <span className="font-mono font-medium text-slate-600">
                        {formatCurrency(market.buy_in_amount)}
                      </span>
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
                    onClick={handleSubmitRankingLive}
                    disabled={isSubmitting || !stakeAmount}
                    className={`w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                      isSubmitting || !stakeAmount
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20 cursor-pointer"
                    }`}
                    whileHover={!isSubmitting && stakeAmount ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting && stakeAmount ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Locking In...
                      </>
                    ) : (
                      <>
                        Confirm Prediction
                        <IconArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
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
                  <p className="text-sm font-semibold text-slate-900">How it works</p>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    Winners are those whose ranking matches the majority's consensus exactly. Prize pool split proportionally based on stakes.
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