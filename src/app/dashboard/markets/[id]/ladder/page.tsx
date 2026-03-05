"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

import DashboardHeader from "@/components/dashboard/DashboardHeader";
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
        flex items-center justify-between w-full gap-4 p-4 rounded-xl border-2 bg-white/60 backdrop-blur-sm transition-all
        ${isDragging ? "border-slate-800 shadow-2xl z-50 bg-slate-50" : "border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md bg-white"}
      `}
    >
      <div
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab active:cursor-grabbing p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <IconGripVertical className="w-5 h-5 text-slate-400" />
      </div>

      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-bold font-mono">
        {index + 1}
      </div>

      <div className="flex-1 flex items-center gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <item.icon className="w-5 h-5 text-slate-700" />
        </div>
        <span className="font-bold text-slate-900">{item.text}</span>
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

  const winningOutcomeId = market.winningOutcomeId;
  return (
    <div className="space-y-6 md:space-y-10 pb-12 pl-0 md:pl-8 overflow-x-hidden w-full max-w-[100vw] px-2">
      <DashboardHeader user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8 lg:space-y-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl"
          >
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] mix-blend-screen" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] mix-blend-screen" />

            <div className="relative p-8 md:p-12 pb-16">
              {/* Badges */}
              <div className="flex items-center gap-3 mb-8">
                <div className="px-4 py-1.5 rounded-full flex items-center bg-white/10 backdrop-blur-md border border-white/10">
                  <span className="text-xs font-bold text-white uppercase tracking-widest">
                    {market.category}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border ${
                    isClosed
                      ? "bg-slate-800/80 border-slate-700"
                      : "bg-emerald-500/20 border-emerald-500/30"
                  }`}
                >
                  {!isClosed && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      isClosed ? "text-slate-300" : "text-emerald-300"
                    }`}
                  >
                    {isClosed ? "Closed" : "Live"}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="max-w-3xl space-y-6 relative z-10 w-full lg:w-3/5">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                  {market.title}
                </h2>
                <p className="text-lg text-slate-300 font-medium leading-relaxed">
                  {market.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12 relative z-10">
                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <IconTrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Total Pool
                    </span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold font-mono text-white">
                    {formatCurrency(market.total_pool)}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <IconUsers className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Players
                    </span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold font-mono text-white">
                    {market.participant_count}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2 mb-3">
                    <IconClock className="w-5 h-5 text-purple-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {isClosed ? "Finalized" : "Time Left"}
                    </span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold font-mono text-white">
                    {isClosed
                      ? new Date(market.close_date).toLocaleDateString()
                      : getTimeRemaining()}
                  </p>
                </div>
              </div>
            </div>

            {/* Overlapping Hero Image */}
            <div className="absolute right-0 top-0 bottom-0 w-2/5 hidden lg:block opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700">
              <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-transparent to-transparent z-10" />
              <img
                src={market.image}
                alt={market.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Mobile Hero Image Background */}
            <div className="absolute inset-0 lg:hidden opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-slate-900/80 z-10" />
              <img
                src={market.image}
                alt={market.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>

          {!isClosed ? (
            <div className="space-y-8">
              {/* Performance Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <IconTrendingUp className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">Market Momentum</h3>
                      <p className="text-sm text-slate-500 font-medium">Historical Consensus Movement</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold font-mono text-slate-900">76%</p>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">+5.2% Consensus Strength</p>
                  </div>
                </div>
                
                <div className="h-64 mt-4">
                  <MarketChart 
                    data={[60, 62, 65, 68, 70, 72, 74, 76]} 
                    height="100%" 
                    color="#10b981" 
                    showAxes 
                  />
                </div>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100/50 shadow-inner"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
                    <IconGripVertical className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-2">
                      How to Play
                    </h3>
                    <p className="text-lg font-medium text-indigo-900/80 leading-relaxed">
                      Drag items to rank them from <strong>#1 (best)</strong> to{" "}
                      <strong>#5 (last)</strong>. Your goal is to match what the{" "}
                      <strong>majority</strong> will choose. Winners split the
                      prize pool!
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Visual Separator */}
              <div className="flex items-center gap-4 py-4">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-300 to-transparent"></div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-4 rounded-full">
                  Drag to Rank
                </h2>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-300 to-transparent"></div>
              </div>

              {/* Drag and Drop Ranking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
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
                    <div className="space-y-3">
                      {rankedItems.map((item, index) => (
                        <SortableItem key={item.id} item={item} index={index} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </motion.div>
            </div>
          ) : (
            /* Closed State - Market Resolution */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl space-y-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <IconTrophy className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Final Market Ranking
                  </h3>
                  <p className="text-slate-500 font-medium">
                    The community's ultimate consensus
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {market?.items?.map((item: any, index: number) => (
                  <div key={item.id} className={`flex items-center gap-4 p-5 rounded-3xl border ${index === 0 ? 'border-amber-200 bg-amber-50 shadow-md' : 'border-slate-100 bg-slate-50'}`}>
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-xl shrink-0 ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-slate-200 text-slate-700' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-white text-slate-500 shadow-sm border border-slate-100'
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                        <item.icon className="w-6 h-6 text-slate-700" />
                      </div>
                      <span className="font-bold text-xl text-slate-900">{item.text}</span>
                    </div>
                    {index === 0 && <IconTrophy className="w-8 h-8 text-amber-500 shrink-0" />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {/* Recent Activity */}
          {!isClosed && (
            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <IconEye className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Recent Activity
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Live updates from other players
                  </p>
                </div>
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
                            <p className="text-base font-bold text-slate-900">
                              {participant.username || "Anonymous"}
                            </p>
                            <p className="text-sm text-slate-500 font-medium">
                              Submitted ranking
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold font-mono text-slate-900">
                            {formatCurrency(participant.total_stake)}
                          </p>
                          <p className="text-sm text-slate-400 font-medium">
                            {new Date(participant.timestamp).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-12 px-6 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50"
                    >
                      <IconGhost className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-slate-700 mb-1">
                        Much Empty
                      </h4>
                      <p className="text-slate-500 font-medium">
                        Be the first to submit a ranking in this market!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 lg:self-start space-y-6">
          <div className="lg:sticky lg:top-8 z-40 h-fit space-y-6 transition-all duration-300">
            {isClosed ? (
              <>
                {/* Closed Market Notice */}
                <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <IconTrophy className="w-6 h-6 text-amber-400" />
                    <h3 className="text-lg font-bold">Market Resolved</h3>
                  </div>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed mb-6">
                    This market has concluded and winnings have been distributed. 
                    Those whose ranked predictions matched the community consensus 
                    have claimed the pool.
                  </p>
                  
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Final Pool Value</p>
                    <p className="text-2xl font-mono font-bold text-white tracking-tight">{formatCurrency(market.total_pool)}</p>
                  </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Top Participants</h3>
                    <div className="px-3 py-1 bg-slate-100 rounded-full">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Final</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {sortedParticipants.slice(0, 5).map((player: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                          idx === 0 ? 'bg-amber-100 text-amber-700' :
                          idx === 1 ? 'bg-slate-200 text-slate-700' :
                          idx === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-slate-50 text-slate-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <UserAvatar name={player.username || "Anonymous"} size="sm" border={false} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{player.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono font-bold text-slate-900">{formatCurrency(player.total_stake)}</p>
                        </div>
                      </div>
                    ))}
                    {sortedParticipants.length === 0 && (
                      <div className="text-center py-6 text-slate-500 text-sm font-medium">
                        No participants in this market
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Prediction Result / Slip */}
                {predictionResult ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-emerald-100 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.2)] rounded-3xl overflow-hidden"
                  >
                    <div className="p-8 bg-emerald-500 text-white text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[32px] translate-x-1/2 -translate-y-1/2" />
                      <IconCircleCheckFilled className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
                      <h3 className="text-2xl font-bold mb-1">Ranking Secured</h3>
                      <p className="text-sm text-emerald-100 font-medium">Receipt ID: {predictionResult.transactionId?.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="p-8 space-y-5 bg-white">
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Outcome</span>
                        <span className="text-base font-bold text-emerald-600">Ladder Ranking</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Stake</span>
                        <span className="text-lg font-bold font-mono text-slate-900">{formatCurrency(predictionResult.amount)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                         <span className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Platform Fee</span>
                         <span className="text-sm font-bold font-mono text-slate-500">{formatCurrency(predictionResult.amount * 0.05)}</span>
                      </div>
                      <button 
                        onClick={() => setPredictionResult(null)}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all mt-6 shadow-lg shadow-slate-900/20"
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
                    className="bg-white border border-slate-200 shadow-xl space-y-6 rounded-3xl overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[32px] translate-x-1/2 -translate-y-1/2 mix-blend-screen" />
                      <h3 className="text-2xl font-bold mb-2 relative z-10">
                        Submit Ranking
                      </h3>
                      <p className="text-sm text-slate-300 font-medium relative z-10">
                        Review your order before locking in
                      </p>
                    </div>
    
                    {/* Content */}
                    <div className="space-y-6 px-8 py-6">
                      {/* Chain Preview */}
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">
                          Current Ranking Order
                        </span>
                        <div className="space-y-3">
                          {rankedItems.map((item, index) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 text-sm"
                            >
                              <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold font-mono shrink-0">
                                {index + 1}
                              </span>
                              <span className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <span className="bg-white p-1 rounded-md border border-slate-100 shadow-sm"><item.icon className="w-4 h-4 text-slate-500" /></span>
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
    
                      {/* Stake Input */}
                      <div className="space-y-4 pt-2">
                        <label className="text-sm font-bold text-slate-700">
                          Your Stake
                        </label>
                        <div className="relative group">
                          <input
                            type="number"
                            placeholder={formatCurrency(market.buy_in_amount)}
                            min={market.buy_in_amount}
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            className="w-full px-5 py-4 pr-16 bg-white border-2 border-slate-200 rounded-2xl text-lg font-mono font-bold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                          />
                          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                            {symbol}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm px-1">
                          <span className="text-slate-500 font-medium">
                            Minimum buy-in
                          </span>
                          <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {formatCurrency(market.buy_in_amount)}
                          </span>
                        </div>
                      </div>
    
                      {/* Summary */}
                      <div className="pt-6 border-t border-slate-100 space-y-4 bg-slate-50/50 -mx-8 px-8 pb-8 -mb-6 mt-6">
                        <div className="flex justify-between text-sm mt-6">
                          <span className="text-slate-500 font-bold uppercase tracking-wider">
                            Platform Fee (5%)
                          </span>
                          <span className="font-mono font-bold text-slate-600">
                            {formatCurrency(platformFeeKsh)}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg items-center">
                          <span className="text-slate-900 font-bold">
                            Total Amount
                          </span>
                          <span className="font-mono font-black text-blue-600 text-2xl">
                            {formatCurrency(totalAmountKsh)}
                          </span>
                        </div>
      
                        {/* CTA Button */}
                        <motion.button
                          onClick={handleSubmitRankingLive}
                          disabled={isSubmitting || !stakeAmount}
                          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all mt-6 ${
                            isSubmitting || !stakeAmount
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20 cursor-pointer"
                          }`}
                          whileHover={
                            !isSubmitting && stakeAmount ? { scale: 1.02 } : {}
                          }
                          whileTap={
                            !isSubmitting && stakeAmount ? { scale: 0.98 } : {}
                          }
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                              Locking In...
                            </>
                          ) : (
                            <>
                              Confirm Prediction
                              <IconArrowRight className="w-6 h-6" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-3xl bg-blue-50 border border-blue-100/50 shadow-inner"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <IconShield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-bold text-blue-900">
                    How it works
                  </p>
                  <p className="text-sm text-blue-800/80 font-medium leading-relaxed">
                    Winners are those whose ranking matches the majority's
                    consensus exactly. Prize pool split proportionally based
                    on stakes.
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
