"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  IconAccessPoint,
  IconArrowRight,
  IconArrowUpRight,
  IconShield,
  IconTarget,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import { IoPhonePortraitOutline } from "react-icons/io5";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

interface InstrumentItem {
  id: string;
  num: string;
  title: string;
  blurb: string;
  icon: React.ElementType;
  badge: string;
}

interface NarrativeItem {
  id: string;
  num: string;
  title: string;
  body: string;
  icon: React.ElementType;
  highlights: string[];
  stat: { value: string; label: string };
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const heroStats: StatItem[] = [
  { value: "342", label: "Active Markets", suffix: "+" },
  { value: "98", label: "Trust Score", suffix: "%" },
  { value: "45", label: "Avg. Deposit Speed", suffix: "s" },
  { value: "1.2K", label: "Active Syndicates" },
];

const instruments: InstrumentItem[] = [
  {
    id: "public",
    num: "01",
    title: "Public Markets",
    blurb: "Consensus forecasts, reflex signals, majority ladders. Earn yield when you're right.",
    icon: IconTrendingUp,
    badge: "Live",
  },
  {
    id: "mpesa",
    num: "02",
    title: "M-Pesa & Crypto",
    blurb: "Instant KSH or USDT deposits. Withdraw in seconds via M-Pesa or USDT-TRC20.",
    icon: IoPhonePortraitOutline,
    badge: "Instant",
  },
  {
    id: "secure",
    num: "03",
    title: "Secure & Fair",
    blurb: "5% flat fee, zero hidden charges. Immutable audit logs, 2FA, peer confirmation.",
    icon: IconShield,
    badge: "Audited",
  },
  {
    id: "signals",
    num: "04",
    title: "Live Signals",
    blurb: "Real-time market pulses, push alerts, and settlement under 5 minutes.",
    icon: IconAccessPoint,
    badge: "<5min",
  },
];

const narratives: NarrativeItem[] = [
  {
    id: "syndicates",
    num: "05",
    title: "Private Syndicates",
    body: "Build exclusive circles with your most trusted peers. Set your own rules — winner-takes-all, consensus divergence, or fully custom formats. Your market, your edge, your terms.",
    icon: IconUsers,
    highlights: ["Private Circles", "Custom Market Formats", "Peer Settlement"],
    stat: { value: "1.2K", label: "Active Groups" },
  },
  {
    id: "tiers",
    num: "06",
    title: "The Tier System",
    body: "Start as a Novice. Study the patterns. Level up through Analyst, Strategist, and High Roller. Each tier unlocks higher limits, exclusive markets, and priority settlement.",
    icon: IconTarget,
    highlights: ["Merit-Based Progression", "Higher Limits", "Premium Access"],
    stat: { value: "892", label: "High Rollers" },
  },
];

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedStat({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col gap-1 border-l border-black/10 pl-5 first:border-l-0 first:pl-0"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-end gap-0.5">
        <span className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 leading-none">
          {stat.value}
        </span>
        {stat.suffix && (
          <span className="text-xl font-semibold mb-0.5 leading-none text-gray-600">
            {stat.suffix}
          </span>
        )}
      </div>
      <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-gray-500">
        {stat.label}
      </p>
    </motion.div>
  );
}

// ─── Instrument Card ─────────────────────────────────────────────────────────

function InstrumentCard({ item, index }: { item: InstrumentItem; index: number }) {
  return (
    <motion.div
      className="relative flex flex-col justify-between cursor-pointer group overflow-hidden rounded-3xl p-6 bg-white/50 backdrop-blur-xl border border-white/70 shadow-[0_2px_12px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.88)] min-h-[180px]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
    >
      {/* Top sheen */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none z-10"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 50%, transparent)" }}
      />

      {/* Decorative dot pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
          maskImage: 'radial-gradient(ellipse 50% 50% at 75% 25%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 75% 25%, black 20%, transparent 80%)',
        }}
      />

      <div className="flex items-start justify-end mb-auto relative z-10">
        <span className="text-[12px] font-semibold uppercase tracking-[0.25em] font-mono text-gray-800">
          {item.num}
        </span>
      </div>

      <div className="mt-8 relative z-10">
        {/* Live badge */}
        <span className="inline-block mb-3 text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full text-gray-600 bg-black/5 border border-black/5">
          {item.badge}
        </span>

        <h3 className="text-[1.1rem] md:text-[1.3rem] font-medium leading-tight tracking-tight text-gray-900 mb-2 group-hover:text-black transition-colors">
          {item.title}
        </h3>
        <p className="text-[14px] leading-relaxed text-gray-800">
          {item.blurb}
        </p>
      </div>

      {/* Hover arrow */}
      <motion.div
        className="absolute bottom-5 right-5"
        initial={{ opacity: 0, x: -4 }}
        whileHover={{ opacity: 1, x: 0 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <IconArrowUpRight className="w-4 h-4 text-gray-400" />
      </motion.div>
    </motion.div>
  );
}

// ─── Narrative Row ────────────────────────────────────────────────────────────

function NarrativeRow({ item, index }: { item: NarrativeItem; index: number }) {
  const Icon = item.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className="relative flex flex-col md:flex-row items-stretch gap-0 overflow-hidden rounded-3xl bg-white/50 backdrop-blur-xl border border-white/70 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.88)]"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: 0.08 + index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top sheen */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none z-10"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0.9) 60%, transparent)" }}
      />

      {/* Decorative dot pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
          maskImage: 'radial-gradient(ellipse 50% 50% at 75% 25%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 75% 25%, black 20%, transparent 80%)',
        }}
      />

      {/* Left: stat panel */}
      <div
        className={`flex flex-col items-center justify-center gap-3 px-10 py-10 md:py-0 md:w-[240px] flex-shrink-0 border-b md:border-b-0 border-black/5 relative z-10 ${
          isEven ? "md:border-r" : "md:order-last md:border-l"
        }`}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 bg-black/5 border border-black/10">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="text-center">
          <span className="text-5xl font-semibold leading-none text-gray-900 tracking-tight">
            {item.stat.value}
          </span>
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-gray-500 mt-2">
            {item.stat.label}
          </p>
        </div>
        <span className="text-[12px] font-semibold uppercase tracking-[0.2em] mt-1 font-mono text-gray-800">
          {item.num}
        </span>
      </div>

      {/* Right: content */}
      <div className="flex-1 p-8 md:p-10 flex flex-col justify-center gap-5 relative z-10">
        <div>
          <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 leading-tight mb-3">
            {item.title}
          </h3>
          <p className="text-[16px] leading-relaxed text-gray-800 max-w-lg">
            {item.body}
          </p>
        </div>

        {/* Highlight pills */}
        <div className="flex flex-wrap gap-2">
          {item.highlights.map((h, i) => (
            <span
              key={i}
              className="text-[12px] font-medium uppercase tracking-widest px-3 py-1 rounded-full text-gray-800 bg-black/5 border border-black/5"
            >
              {h}
            </span>
          ))}
        </div>

        {/* CTA link */}
        <Link href="/product/game-modes" className="self-start mt-2 block">
          <motion.div
            className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer p-0"
            whileHover={{ x: 3 }}
          >
            <span>Learn More</span>
            <IconArrowRight className="w-3.5 h-3.5" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function FeatureGrid() {
  return (
    <section id="features" className="relative py-24 md:py-36 px-4 md:px-8 overflow-hidden bg-white">
      <div className="relative max-w-6xl mx-auto">
        
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-20"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-3">
                <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-gray-500">
                  Platform Features
                </p>
              </div>
              <h2 className="text-5xl md:text-[4.2rem] font-medium tracking-tight leading-[1.0] text-gray-900">
                The market for outcomes.
              </h2>
              <p className="text-[16px] text-gray-800 leading-relaxed pt-2 max-w-md">
                Built for the Kenyan market. M-Pesa ready, crypto enabled, socially driven. Forecast outcomes and earn yield when you're right.
              </p>
            </div>

            {/* ── Hero Stats Row ── */}
            <div className="grid grid-cols-2 md:flex md:flex-nowrap items-end gap-6 md:gap-10">
              {heroStats.map((stat, i) => (
                <AnimatedStat key={stat.label} stat={stat} index={i} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <div className="relative mb-10 md:mb-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* ── Instrument Cards Grid ── */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-[12px] font-medium uppercase tracking-[0.28em] text-gray-500">
            Core Instruments
          </span>
          <span className="text-[12px] font-medium uppercase tracking-[0.28em] text-gray-500 font-mono border border-black/10 px-3 py-1 bg-black/5 rounded-full">
            01 — 04
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {instruments.map((item, i) => (
            <InstrumentCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="relative my-12 md:my-16 flex items-center gap-4">
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* ── Narrative Rows ── */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-[12px] font-medium uppercase tracking-[0.28em] text-gray-500">
            Advanced Features
          </span>
          <span className="text-[12px] font-medium uppercase tracking-[0.28em] text-gray-500 font-mono border border-black/10 px-3 py-1 bg-black/5 rounded-full">
            05 — 06
          </span>
        </div>

        <div className="flex flex-col gap-6 md:gap-8">
          {narratives.map((item, i) => (
            <NarrativeRow key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.55 }}
          className="mt-16 md:mt-24 flex flex-col items-center gap-4"
        >
          <Link href="/register">
            <motion.div
              className="group relative inline-flex items-center gap-3 px-8 py-2 rounded-full overflow-hidden cursor-pointer bg-gray-900 text-white shadow-xl border-none"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 text-[15px] font-medium tracking-wide">
                Start Forecasting Now
              </span>
              <IconArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)" }}
              />
            </motion.div>
          </Link>

          <p className="text-[12px] uppercase pt-4 tracking-widest text-gray-500 font-medium">
            M-Pesa · USDT · Instant Deposits
          </p>
        </motion.div>

      </div>
    </section>
  );
}