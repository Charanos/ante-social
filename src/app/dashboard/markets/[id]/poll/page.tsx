"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { IconActivity, IconArrowRight, IconCircleCheckFilled, IconClock, IconEye, IconLayoutGrid, IconPhoto, IconShield, IconTrendingUp, IconUsers } from '@tabler/icons-react';

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/useToast";
import { mockUser } from "@/lib/mockData";
import Image from "next/image";

// Mock poll market data
const getMockPollMarket = (id: string) => {
  const markets: Record<string, any> = {
    "poll-001": {
      id: "poll-001",
      title: "Best Nairobi Matatu Route",
      description:
        "Vote for the most reliable, comfortable, and safest matatu route in Nairobi. Consider factors like speed, music, conductor vibes, and overall passenger experience.",
      image:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop",
      category: "Poll",
      market_type: "poll",
      buy_in_amount: 500,
      total_pool: 245000,
      participant_count: 47,
      status: "active",
      close_date: new Date(Date.now() + 7920000), // ~2h 15m
      options: [
        {
          id: "opt1",
          option_text: "Route 111 (Ngong Road)",
          votes: 15,
          percentage: 32,
          image:
            "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop",
        },
        {
          id: "opt2",
          option_text: "Route 125/126 (Rongai)",
          votes: 18,
          percentage: 38,
          image:
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop",
        },
        {
          id: "opt3",
          option_text: "Route 23 (Westlands)",
          votes: 8,
          percentage: 17,
          image:
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop",
        },
        {
          id: "opt4",
          option_text: "Route 58 (Buruburu)",
          votes: 6,
          percentage: 13,
          image:
            "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop",
        },
      ],
      participants: [
        {
          username: "@matatu_king",
          total_stake: 5000,
          timestamp: new Date(Date.now() - 7200000),
        },
        {
          username: "@nai_guy",
          total_stake: 1500,
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          username: "@city_hopper",
          total_stake: 1000,
          timestamp: new Date(Date.now() - 1800000),
        },
        {
          username: "@route_master",
          total_stake: 2500,
          timestamp: new Date(Date.now() - 900000),
        },
      ],
    },
    "poll-002": {
      id: "poll-002",
      title: "Who Wins the Derby?",
      description:
        "AFC Leopards vs Gor Mahia - predict the winner of Kenya's biggest football rivalry",
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop",
      category: "Poll",
      market_type: "poll",
      buy_in_amount: 1000,
      total_pool: 182500,
      participant_count: 93,
      status: "active",
      close_date: new Date(Date.now() + 19800000), // ~5h 30m
      options: [
        {
          id: "opt1",
          option_text: "AFC Leopards Win",
          votes: 35,
          percentage: 38,
          image:
            "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&auto=format&fit=crop",
        },
        {
          id: "opt2",
          option_text: "Gor Mahia Win",
          votes: 48,
          percentage: 52,
          image:
            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop",
        },
        {
          id: "opt3",
          option_text: "Draw",
          votes: 10,
          percentage: 10,
          image:
            "https://images.unsplash.com/photo-1529993654-293d0c6e4b84?w=800&auto=format&fit=crop",
        },
      ],
      participants: [
        {
          username: "@leopards_fan",
          total_stake: 3000,
          timestamp: new Date(Date.now() - 10800000),
        },
        {
          username: "@kogalo",
          total_stake: 5000,
          timestamp: new Date(Date.now() - 5400000),
        },
        {
          username: "@neutral_better",
          total_stake: 1000,
          timestamp: new Date(Date.now() - 2700000),
        },
      ],
    },
    "poll-003": {
      id: "poll-003",
      title: "Nairobi Traffic Chaos",
      description: "Which time of day has the worst traffic in Nairobi CBD?",
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&auto=format&fit=crop",
      category: "Poll",
      market_type: "poll",
      buy_in_amount: 300,
      total_pool: 67800,
      participant_count: 34,
      status: "active",
      close_date: new Date(Date.now() + 30000000), // ~8h 20m
      options: [
        {
          id: "opt1",
          option_text: "7-9 AM (Morning Rush)",
          votes: 12,
          percentage: 35,
          image:
            "https://images.unsplash.com/photo-1508146544796-045a7653611a?w=800&auto=format&fit=crop",
        },
        {
          id: "opt2",
          option_text: "5-7 PM (Evening Rush)",
          votes: 18,
          percentage: 53,
          image:
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop",
        },
        {
          id: "opt3",
          option_text: "12-2 PM (Lunch Hour)",
          votes: 4,
          percentage: 12,
          image:
            "https://images.unsplash.com/photo-1502905172761-5b55a56d33f2?w=800&auto=format&fit=crop",
        },
      ],
      participants: [
        {
          username: "@commuter_daily",
          total_stake: 500,
          timestamp: new Date(Date.now() - 14400000),
        },
        {
          username: "@traffic_master",
          total_stake: 1200,
          timestamp: new Date(Date.now() - 7200000),
        },
      ],
    },
  };

  return markets[id] || markets["poll-001"];
};

export default function PollMarketPage() {
  const params = useParams();
  const toast = useToast();
  const marketId = params.id as string;

  const market = getMockPollMarket(marketId);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceBet = () => {
    if (
      !selectedOption ||
      !stakeAmount ||
      parseFloat(stakeAmount) < market.buy_in_amount
    ) {
      toast.error(
        "Invalid Bet",
        `Minimum stake is ${market.buy_in_amount.toLocaleString()} KSH`,
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const selectedOptionText = market.options.find(
        (o: any) => o.id === selectedOption,
      )?.option_text;
      toast.success(
        "Vote Placed!",
        `You voted ${stakeAmount} KSH on "${selectedOptionText}"`,
      );
      setIsSubmitting(false);
    }, 1000);
  };

  const getTimeRemaining = () => {
    const diff = market.close_date.getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
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
              {/* Top border accent */}
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

            {/* Visual Separator */}
            <div className="flex items-center gap-4 my-18">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                Select Your Choice
              </h2>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
            </div>

            {/* Options */}
            <div className="space-y-6 my-18">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {market.options.map((option: any, index: number) => {
                  const isSelected = selectedOption === option.id;

                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      onClick={() => setSelectedOption(option.id)}
                      className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "bg-white/60 backdrop-blur-xl border-2 border-black/20 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)]"
                          : "bg-white/40 backdrop-blur-sm border border-black/5 hover:bg-white/60 hover:border-black/10 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]"
                      }`}
                    >
                      {/* Image */}
                      <div className="relative h-32 overflow-hidden">
                        <Image src={option.image}
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
                              <span className="text-xs text-black/60 font-semibold">
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
                          Placed vote
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
                    Place Your Vote
                  </h3>
                  <p className="text-sm text-white/60 font-medium">
                    Join the poll and win
                  </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Selected Option */}
                  <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                    <span className="text-xs font-semibold text-black/40 uppercase tracking-wider block mb-2">
                      Selected Outcome
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedOption ? (
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
                        Confirm Vote
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
    </div>
  );
}
