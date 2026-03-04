"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IconAccessPoint,
  IconAlertCircle,
  IconArrowRight,
  IconAward,
  IconLayersOff,
  IconLayoutGrid,
  IconUsers,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GameMode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  quote: string;
  mechanics: string[];
  size: string;
  tagline: string;
}

interface BentoCardProps {
  mode: GameMode;
  gridClass: string;
  delay?: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const gameModes = [
  {
    id: "poll",
    title: "Consensus Markets",
    subtitle: "Majority Rules",
    description:
      "Forecast the outcome with the crowd. Yields distributed proportionally by position size. The wisdom of the crowd — or its folly.",
    icon: IconUsers,
    quote: "The wisdom of the crowd... or the folly?",
    mechanics: ["Vote-weighting", "Pro-rata Yields", "Integrity weighting"],
    size: "large",
    tagline: "01",
  },
  {
    id: "betrayal",
    title: "Prisoner's Dilemma",
    subtitle: "Trust or Defect",
    description:
      "Choose to Cooperate for a guaranteed yield, or Defect for outsized returns. If everyone defects, the market collapses.",
    icon: IconAlertCircle,
    quote: "Trust is a currency. Spend it wisely.",
    mechanics: ["All cooperate = yield", "Defectors seize liquidity", "All defect = collapse"],
    size: "tall",
    tagline: "02",
  },
  {
    id: "reflex",
    title: "Reflex Signal Test",
    subtitle: "5-Second Arbitrage",
    description:
      "Predict the majority's first instinct. 5 seconds to identify the signal before the crowd. Speed is your edge.",
    icon: IconAccessPoint,
    quote: "Fortune favors the absurd.",
    mechanics: ["5-second window", "Contrarian premiums", "2× multiplier"],
    size: "wide",
    tagline: "03",
  },
  {
    id: "majority",
    title: "Prediction Ladder",
    subtitle: "Rank & Forecast",
    description:
      "Rank items by projected consensus. Match the exact crowd sequence to win the entire pool.",
    icon: IconLayersOff,
    quote: "You joined the parade, not the rebellion.",
    mechanics: ["Drag to rank", "Match consensus order", "Split if multiple accurate"],
    size: "small",
    tagline: "04",
  },
  {
    id: "private",
    title: "Private Syndicates",
    subtitle: "Your Circle, Your Rules",
    description:
      "Exclusive markets with trusted peers. Winner Takes All or Consensus Divergence.",
    icon: IconAward,
    quote: "Keep your friends close, and your positions closer.",
    mechanics: ["Winner Takes All", "Consensus Divergence", "Group confirmation"],
    size: "small",
    tagline: "05",
  },
  {
    id: "odd_one_out",
    title: "Consensus Divergence",
    subtitle: "Minority Wins",
    description:
      "The option with the fewest votes wins. A pure test of your ability to identify the non-consensus view.",
    icon: IconLayoutGrid,
    quote: "To be right and alone is the ultimate test.",
    mechanics: ["Minority wins", "Inverse logic", "Contrarian yields"],
    size: "wide",
    tagline: "06",
  },
];

// ─── Plus-sign SVG background ─────────────────────────────────────────────────

function PlusBg() {
  const svgPattern = encodeURIComponent(
    `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <line x1="24" y1="20" x2="24" y2="28" stroke="#000" stroke-width="1.2" stroke-linecap="round" opacity="0.12"/>
      <line x1="20" y1="24" x2="28" y2="24" stroke="#000" stroke-width="1.2" stroke-linecap="round" opacity="0.12"/>
    </svg>`
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url("data:image/svg+xml,${svgPattern}")`, backgroundSize: "48px 48px" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(248,248,246,0.85) 0%, rgba(248, 247, 246, 0) 100%)",
        }}
      />
    </div>
  );
}

// ─── Bento Card ───────────────────────────────────────────────────────────────

function BentoCard({ mode, gridClass, delay = 0 }: BentoCardProps) {
  const [hovered, setHovered] = useState(false);
  const Icon = mode.icon;

  const isLarge = mode.size === "large";
  const isTall  = mode.size === "tall";
  const isWide  = mode.size === "wide";

  return (
    <motion.div
      className={`${gridClass} relative group cursor-pointer overflow-hidden rounded-3xl`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.012, transition: { duration: 0.3 } }}
      style={{
        background: "rgba(255, 255, 255, 0.52)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.72)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05), 0 8px 32px -8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      {/* Top-edge glass sheen */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.95) 70%, transparent)",
        }}
      />

      {/* Hover inner glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        style={{
          background: "radial-gradient(ellipse 55% 45% at 25% 15%, rgba(0,0,0,0.025) 0%, transparent 70%)",
        }}
      />

      {/* Decorative dot pattern in the empty space */}
      <div
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
          maskImage: 'radial-gradient(ellipse 50% 50% at 75% 25%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 75% 25%, black 20%, transparent 80%)',
        }}
      />

      {/* ── Card content ── */}
      <div className={`relative z-20 flex flex-col h-full ${isLarge ? "p-8 md:p-10" : isTall ? "p-7 md:p-8" : "p-6 md:p-7"}`}>
        
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/5 border border-black/10">
              <Icon className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.25em] font-mono text-gray-800">
              {mode.tagline}
            </span>
          </div>

          <motion.div
            animate={{ x: hovered ? 0 : -5, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <IconArrowRight className="w-4 h-4 text-gray-500" />
          </motion.div>
        </div>

        {/* Flex spacer — pushes content to bottom */}
        <div className="flex-1 min-h-[4rem]" />

        {/* Main text */}
        <div className="space-y-2">
          <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-gray-700">
            {mode.subtitle}
          </p>

          <h3 className={`font-medium leading-tight tracking-tight text-gray-900 ${
              isLarge ? "text-3xl md:text-[2.35rem]" : isTall ? "text-2xl md:text-[1.85rem]" : isWide ? "text-[1.6rem] md:text-[1.9rem]" : "text-xl md:text-2xl"
            }`}
          >
            {mode.title}
          </h3>

          {(isLarge || isTall || isWide) && (
            <p className="text-[16px] leading-relaxed  py-2 text-gray-800">
              {mode.description}
            </p>
          )}
        </div>

        {/* Mechanics tags */}
        {(isLarge || isTall || isWide) && (
          <motion.div
            className="mt-5 flex flex-wrap gap-2"
            animate={{ opacity: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.25 }}
          >
            {mode.mechanics.map((m: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 text-[12px] font-medium tracking-widest uppercase rounded-full text-gray-800 bg-black/5 border border-black/5"
              >
                {m}
              </span>
            ))}
          </motion.div>
        )}

        {/* Quote — large only */}
        {isLarge && (
          <motion.div
            className="mt-7 pt-6 border-t border-black/5"
            animate={{ opacity: hovered ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-[14px] italic leading-relaxed text-gray-500">
              "{mode.quote}"
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function GameModes() {
  // Refactored for Mobile -> Tablet -> Desktop responsiveness
  const gridAssignments = [
    "col-span-1 md:col-span-2 lg:col-span-2 row-span-1 md:row-span-2", // poll (large)
    "col-span-1 md:col-span-1 lg:col-span-1 row-span-1 md:row-span-2", // betrayal (tall)
    "col-span-1 md:col-span-3 lg:col-span-2 row-span-1",               // reflex (wide)
    "col-span-1 md:col-span-1 lg:col-span-1 row-span-1",               // majority (small)
    "col-span-1 md:col-span-1 lg:col-span-1 row-span-1",               // private (small)
    "col-span-1 md:col-span-2 lg:col-span-2 row-span-1",               // diverge (wide)
  ];

  const delays = [0.04, 0.1, 0.17, 0.23, 0.29, 0.35];

  return (
    <section className="relative py-24 md:py-36 px-4 md:px-8 overflow-hidden bg-[#f8f8f6]">
      {/* Background & Gradients */}
      <PlusBg />
      <div className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full pointer-events-none bg-[#becdff]/20 blur-[80px]" />
      <div className="absolute -bottom-40 -right-40 w-[560px] h-[560px] rounded-full pointer-events-none bg-[#bef5d2]/15 blur-[80px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none bg-[#ffe6c8]/10 blur-[60px]" />

      <div className="relative max-w-6xl mx-auto">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 md:mb-16"
        >
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div className="space-y-3">
              <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-gray-500">
                Game Mechanics
              </p>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.0] text-gray-900">
                Choose Your Arena
              </h2>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4">
              <p className="text-md max-w-xs text-left md:text-right leading-relaxed text-gray-800">
                Six unique market types. Each one a different way to outsmart the crowd.
              </p>
              <Link href="/product/game-modes" className="inline-block">
                <motion.div
                  className="group inline-flex items-center gap-2 transition-colors duration-200 text-gray-700 hover:text-gray-900 bg-transparent border-none cursor-pointer"
                  whileHover={{ x: 3 }}
                >
                  <span className="text-[12px] tracking-widest uppercase font-normal text-inherit">
                    Explore All
                  </span>
                  <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          {gameModes.map((mode: GameMode, i: number) => (
            <BentoCard
              key={mode.id}
              mode={mode}
              gridClass={gridAssignments[i]}
              delay={delays[i]}
            />
          ))}
        </div>

        {/* ── Footer label ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="pt-12 md:pt-24 flex items-center justify-center gap-4"
        >
          <div className="h-px w-16 bg-black/10" />
          <span className="text-[12px] uppercase tracking-[0.3em] font-normal text-gray-500">
            Ante Social · All Markets
          </span>
          <div className="h-px w-16 bg-black/10" />
        </motion.div>
      </div>
    </section>
  );
}