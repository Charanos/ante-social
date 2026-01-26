"use client";

import { Clock } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

interface VibeMarketCardProps {
  title: string;
  description: string;
  image: string;
  pool: string;
  bets: number;
  timeLeft: string;
  tag: string;
}

export function VibeMarketCard({
  title,
  description,
  image,
  pool,
  bets,
  timeLeft,
  tag
}: VibeMarketCardProps) {
  return (
    <DashboardCard className="max-w-md w-full p-0 border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-56 w-full bg-neutral-100">
        <img 
          src={image} 
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 rounded-full shadow-sm backdrop-blur-sm">
          <span className="text-xs font-medium text-white">{tag}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-medium text-black mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-neutral-500 text-sm leading-relaxed mb-5 line-clamp-2">
          {description}
        </p>

        {/* Divider */}
        <div className="h-px w-full bg-neutral-100 mb-4" />

        {/* Time Left */}
        <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium mb-4">
          <Clock className="w-4 h-4" />
          <span>Closes in {timeLeft}</span>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-neutral-100 mb-4" />

        {/* Footer Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-black font-medium font-mono">{pool}</span>
            <span className="text-neutral-400 text-sm font-medium">{bets} bets</span>
          </div>
          
          <button className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer">
            Join Bet
          </button>
        </div>
      </div>
    </DashboardCard>
  );
}
