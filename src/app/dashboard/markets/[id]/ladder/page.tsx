"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
;
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
import { mockUser } from "@/lib/mockData";
import Image from "next/image";
import { IconActivity, IconArrowRight, IconClock, IconEye, IconGripVertical, IconInfoCircle, IconLayoutGrid, IconMicrophone, IconMusic, IconPhoto, IconPlayerPlay, IconShield, IconTrendingUp, IconUsers } from '@tabler/icons-react';

interface RankItem {
  id: string;
  text: string;
  icon: any;
}

// Sortable Item Component
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
        flex items-center gap-4 p-4 rounded-xl border-2 bg-white/60 backdrop-blur-sm transition-all
        ${isDragging ? "border-black/30 shadow-2xl z-50" : "border-black/10 hover:border-black/20 shadow-sm hover:shadow-md"}
      `}
    >
      <div
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab active:cursor-grabbing p-2 hover:bg-black/5 rounded-lg transition-colors"
      >
        <IconGripVertical className="w-5 h-5 text-black/40" />
      </div>

      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white font-medium font-mono">
        {index + 1}
      </div>

      <div className="flex-1 flex items-center gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
          <item.icon className="w-5 h-5 text-black/70" />
        </div>
        <span className="font-medium text-black/90">{item.text}</span>
      </div>
    </div>
  );
}

// Mock ladder market data
const getMockLadderMarket = (id: string) => ({
  id,
  title: "Top Kenyan Musician 2024",
  description:
    "Rank the top 5 Kenyan musicians based on what the crowd thinks. Match the majority consensus to win!",
  image:
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&auto=format&fit=crop",
  category: "Ladder",
  market_type: "ladder",
  buy_in_amount: 1000,
  total_pool: 156200,
  participant_count: 78,
  status: "active",
  close_date: new Date(Date.now() + 97200000), // 1d 3h
  items: [
    { id: "item1", text: "Sauti Sol", icon: IconMicrophone },
    { id: "item2", text: "Nyashinski", icon: IconMusic },
    { id: "item3", text: "Khaligraph Jones", icon: IconMusic },
    { id: "item4", text: "Nadia Mukami", icon: IconMusic },
    { id: "item5", text: "Otile Brown", icon: IconMusic },
  ],
  participants: [
    {
      username: "@music_fan",
      total_stake: 2500,
      timestamp: new Date(Date.now() - 21600000),
    },
    {
      username: "@kenyan_vibes",
      total_stake: 5000,
      timestamp: new Date(Date.now() - 14400000),
    },
    {
      username: "@gengetone_king",
      total_stake: 1500,
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      username: "@afrobeat_lover",
      total_stake: 3000,
      timestamp: new Date(Date.now() - 3600000),
    },
  ],
});

export default function LadderMarketPage() {
  const params = useParams();
  const toast = useToast();
  const marketId = params.id as string;

  const market = getMockLadderMarket(marketId);

  const [rankedItems, setRankedItems] = useState<RankItem[]>(market.items);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setRankedItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmitRanking = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) < market.buy_in_amount) {
      toast.error(
        "Invalid Stake",
        `Minimum stake is ${market.buy_in_amount.toLocaleString()} KSH`,
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const chain = rankedItems.map((item) => item.text).join(" → ");
      toast.success("Ranking Submitted!", `Your ranking has been saved`);
      setIsSubmitting(false);
    }, 1000);
  };

  const getTimeRemaining = () => {
    const diff = market.close_date.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  const platformFee = stakeAmount ? parseFloat(stakeAmount) * 0.05 : 0;
  const totalAmount = stakeAmount ? parseFloat(stakeAmount) + platformFee : 0;

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
        {/* Dashboard Header */}
        <DashboardHeader user={mockUser} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                <Image src={market.image}
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
                  <p className="text-base text-black/60 font-medium leading-relaxed">
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
                      {market.total_pool.toLocaleString()}
                    </p>
                    <p className="text-xs font-medium text-black/40 mt-1">
                      KSH
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
                </div>
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 rounded-3xl bg-purple-50/60 backdrop-blur-sm border border-purple-200/50"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <IconGripVertical className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-purple-900/80 uppercase tracking-wider mb-2">
                    How to Play
                  </h3>
                  <p className="text-base font-medium text-purple-900 leading-relaxed">
                    Drag items to rank them from <strong>#1 (best)</strong> to{" "}
                    <strong>#5 (last)</strong>. Your goal is to match what the{" "}
                    <strong>majority</strong> will choose. Winners split the
                    prize pool!
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Visual Separator */}
            <div className="flex items-center gap-4 my-18">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                Drag to Rank
              </h2>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
            </div>

            {/* Drag and Drop Ranking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
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
                          Submitted ranking
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold font-mono text-black/90">
                        {participant.total_stake.toLocaleString()} KSH
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
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              {/* Bet Placement Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border border-black/5 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)]"
              >
                {/* Header */}
                <div className="p-6 bg-black">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    Place Your Bet
                  </h3>
                  <p className="text-sm text-white/60 font-medium">
                    Submit your ranking
                  </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Chain Preview */}
                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                    <span className="text-xs font-semibold text-black/40 uppercase tracking-wider block mb-3">
                      Your Ranking
                    </span>
                    <div className="space-y-2">
                      {rankedItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-mono shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-base font-semibold text-black/90">
                            <item.icon className="w-4 h-4 inline mr-2" />
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stake Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-black/70">
                      Your Stake
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={market.buy_in_amount.toLocaleString()}
                        min={market.buy_in_amount}
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="w-full px-4 py-2 pr-16 bg-white/60 backdrop-blur-sm border border-black/10 rounded-xl text-base font-mono font-semibold text-black/90 focus:border-black/30 focus:bg-white/80 outline-none transition-all placeholder:text-black/30"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-black/40">
                        KSH
                      </span>
                    </div>
                    <div className="flex justify-between text-xs px-1">
                      <span className="text-black/40 font-medium">
                        Minimum buy-in
                      </span>
                      <span className="font-mono font-semibold text-black/70">
                        {market.buy_in_amount.toLocaleString()} KSH
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="pt-6 border-t border-black/5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-black/60 font-medium">
                        Platform Fee (5%)
                      </span>
                      <span className="font-mono font-semibold text-black/80">
                        {platformFee.toLocaleString()} KSH
                      </span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-black/90 font-semibold">
                        Total Amount
                      </span>
                      <span className="font-mono font-semibold text-black/90">
                        {totalAmount.toLocaleString()} KSH
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    onClick={handleSubmitRanking}
                    disabled={isSubmitting || !stakeAmount}
                    className={`w-full py-2 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
                      isSubmitting || !stakeAmount
                        ? "bg-black/10 text-black/30 cursor-not-allowed"
                        : "bg-black text-white hover:bg-black/90 shadow-lg cursor-pointer"
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
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Ranking
                        <IconArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-5 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5"
              >
                <div className="flex gap-3">
                  <IconShield className="w-5 h-5 text-black/60 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-black/90">
                      How it works
                    </p>
                    <p className="text-xs text-black/60 font-medium leading-relaxed">
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
    </div>
  );
}
