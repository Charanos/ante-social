"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  IconAccessPoint,
  IconAlertCircle,
  IconArrowRight,
  IconAward,
  IconClipboard,
  IconClock,
  IconCurrencyDollar,
  IconLayoutGrid,
  IconPhoto,
  IconTarget,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";

interface MarketCardProps {
  market: {
    id: string;
    title: string;
    description: string;
    image: string;
    type: string;
    buyIn?: string;
    pool: string;
    participants?: string | number;
    bets?: string | number;
    timeLeft: string;
    status?: string;
    tag?: string;
  };
  index?: number;
  href?: string;
}

const getTypeStyles = (type: string) => {
  switch (type.toLowerCase()) {
    case "poll":
      return { label: "Poll", color: "blue", icon: IconClipboard };
    case "reflex":
      return { label: "Reflex", color: "amber", icon: IconAccessPoint };
    case "ladder":
      return { label: "Ladder", color: "purple", icon: IconAward };
    case "betrayal":
      return { label: "Betrayal", color: "red", icon: IconTarget };
    default:
      return { label: "Market", color: "gray", icon: IconAlertCircle };
  }
};

export function MarketCard({ market, index = 0, href }: MarketCardProps) {
  const typeInfo = getTypeStyles(market.type);
  const linkHref = href || `/dashboard/markets/${market.id}/${market.type}`;
  const participantsCount = market.participants || market.bets || 0;
  const buyIn = market.buyIn || "500 KSH";
  const status = market.status || "active";
  const TypeIcon = typeInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative flex flex-col justify-between h-full  overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 hover:border-black/10 hover:bg-white/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)] transition-all duration-500"
    >
      <Link href={linkHref} className="block h-full">
        <div className="flex flex-col justify-between h-full  max-h-[420px]">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top border accent */}
          <div className="relative top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

          {/* Image Section */}
          <div className="relative h-48 top-0 overflow-hidden bg-linear-to-br from-black/5 to-black/10">
            <Image
              src={market.image}
              alt={market.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Type Badge */}
            <div className="absolute top-4 left-4 px-3 flex items-center gap-1.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-black/10 shadow-sm">
              <TypeIcon className="w-3 h-3 text-black/80" />
              <span className="text-[10px] font-semibold text-black/70 uppercase tracking-widest">
                {typeInfo.label}
              </span>
            </div>

            {/* Time Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-full">
              <IconClock className="w-3 h-3 text-white" />
              <span className="text-[10px] font-semibold font-mono text-white tracking-wider">
                {market.timeLeft}
              </span>
            </div>

            {/* Status Badge */}
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-green-500/40 backdrop-blur-sm rounded-full border border-green-400/50">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-semibold text-white uppercase tracking-widest">
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="relative p-6 h-full min-h-[250px] flex flex-col justify-between">
            <div className="">
              <h3 className="text-lg font-semibold text-black/90 tracking-tight mb-2 line-clamp-1 group-hover:text-black transition-colors">
                {market.title}
              </h3>
              <p className="text-sm text-black/80 font-medium line-clamp-2 leading-relaxed">
                {market.description}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid w-full grid-cols-3 gap-3 border-y py-4 my-6 border-gray-100/50">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-black/30">
                  <IconCurrencyDollar className="w-3 h-3" />
                  <p className="text-[10px] font-semibold uppercase tracking-wider">
                    Stake
                  </p>
                </div>
                <p className="text-xs font-semibold font-mono text-black/80">
                  {buyIn}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-black/30">
                  <IconTrendingUp className="w-3 h-3" />
                  <p className="text-[10px] font-semibold uppercase tracking-wider">
                    Pool
                  </p>
                </div>
                <p className="text-xs font-semibold font-mono text-black/80">
                  {market.pool}
                </p>
              </div>
              <div className="space-y-1 flex flex-col items-center">
                <div className="flex items-center gap-1 text-black/30">
                  <IconUsers className="w-3 h-3" />
                  <p className="text-[10px] font-semibold uppercase tracking-wider">
                    Active
                  </p>
                </div>
                <p className="text-xs font-semibold font-mono text-black/80">
                  {participantsCount}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              className="mt-auto w-full flex items-center justify-center gap-2 px-6 py-2.5 cursor-pointer bg-black text-white rounded-xl font-semibold tracking-wider text-xs hover:bg-black/90 transition-all shadow-lg shadow-black/5 group/btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              JOIN MARKET
              <IconArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
