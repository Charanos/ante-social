"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IconLayoutGrid, IconTag, IconTrendingUp } from '@tabler/icons-react';

import { cn } from "@/lib/utils";

interface MarketCardProps {
  id: number;
  title: string;
  category: string;
  volume: string;
  participants: number;
  endingAt: string;
  isLive?: boolean;
  imageGradient: string;
  odds: string;
  poolProgress: number;
  tags: string[];
}

export function MarketCard({
  id,
  title,
  category,
  volume,
  participants,
  endingAt,
  isLive,
  imageGradient,
  odds,
  poolProgress,
  tags,
}: MarketCardProps) {
  return (
    <Card
      onClick={() => console.log(`Navigate to market ${id}`)}
      className="group relative overflow-hidden border border-neutral-100 bg-white rounded-2xl text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] cursor-pointer h-full flex flex-col"
    >
      {/* Top muted accent using provided gradient (muted via opacity) */}
      <div
        className={`absolute -left-24 -top-20 h-48 w-48 rounded-full blur-3xl ${imageGradient || "bg-linear-to-br from-amber-50 to-amber-100"} opacity-20`}
      />

      <div className="relative z-10 flex h-full flex-col">
        <CardHeader className="p-6 pb-4 space-y-3">
          {/* Top row: Category badge and Odds */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span
                tabIndex={0}
                role="button"
                className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700 border border-zinc-100 shadow-sm cursor-pointer hover:bg-white hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-100"
              >
                {category}
              </span>
              {isLive && (
                <span
                  tabIndex={0}
                  role="button"
                  className="inline-flex items-center gap-2 rounded-full bg-white/60 text-red-600 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide cursor-pointer hover:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                  LIVE
                </span>
              )}
            </div>

            <div
              tabIndex={0}
              role="button"
              className="shrink-0 flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-br from-zinc-900 to-zinc-800 text-white shadow-md cursor-pointer transform transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <IconTrendingUp className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">{odds}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-medium tracking-tight leading-snug text-zinc-900 group-hover:text-zinc-800 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                tabIndex={0}
                role="button"
                className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-xs font-medium text-zinc-600 bg-white/60 border border-zinc-100 cursor-pointer hover:bg-white hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-100"
              >
                <IconTag className="w-3 h-3 text-zinc-400" />
                {tag}
              </span>
            ))}
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-6 pb-6 space-y-5">
          {/* Pool Progress */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Pool
              </span>
              <span className="text-sm font-medium text-zinc-900">
                {poolProgress}%
              </span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-700 shadow-sm"
                style={{ width: `${poolProgress}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white border border-zinc-100 shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Volume
              </span>
              <span className="text-base font-mono font-medium text-zinc-900">
                {volume}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white border border-zinc-100 shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Users
              </span>
              <span className="text-base font-mono font-medium text-zinc-900">
                {participants}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white border border-zinc-100 shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Ends
              </span>
              <span className="text-base font-mono font-medium text-zinc-900">
                {endingAt}
              </span>
            </div>
          </div>
        </CardContent>

        {/* Hover indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="h-1 w-full bg-linear-to-r from-amber-400 to-amber-500" />
        </div>
      </div>
    </Card>
  );
}
