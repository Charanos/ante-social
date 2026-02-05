"use client";

import { motion } from "framer-motion";
import { IconActivity, IconArrowRight, IconCurrencyDollar, IconShield, IconTarget, IconTrendingUp, IconUsers } from '@tabler/icons-react';


import type { IconType } from "react-icons";
import { IoPhonePortraitOutline } from 'react-icons/io5';

interface Feature {
  title: string;
  description: string;
  icon: IconType;
  stats: { label: string; value: string };
  highlights: string[];
  colSpan: string;
}

const features: Feature[] = [
  {
    title: "Public Markets",
    description:
      "Join poll-style markets, reflex games, and majority predictions. Bet on outcomes, earn when you're right.",
    icon: IconTrendingUp,
    stats: { label: "Active Markets", value: "342" },
    highlights: [
      "Poll-Style Betting",
      "Reflex Reaction Tests",
      "Majority Ladder",
    ],
    colSpan: "md:col-span-12 lg:col-span-7",
  },
  {
    title: "M-Pesa & Crypto",
    description:
      "Instant deposits via M-Pesa or USDT. Withdraw winnings in KSH or USD immediately.",
    icon: IoPhonePortraitOutline,
    stats: { label: "Avg. Deposit", value: "45s" },
    highlights: ["M-Pesa Integration", "USDT-TRC20", "Instant Payouts"],
    colSpan: "md:col-span-12 lg:col-span-5",
  },
  {
    title: "Secure & Fair",
    description:
      "5% platform fee, no hidden charges. Immutable audit logs and peer confirmation.",
    icon: IconShield,
    stats: { label: "Trust Score", value: "98%" },
    highlights: ["Transparent Fees", "Audit Trails", "2FA Security"],
    colSpan: "md:col-span-12 lg:col-span-5",
  },
  {
    title: "Group Betting",
    description:
      "Create private circles with friends. Winner-takes-all, odd-one-out, and custom markets for your crew.",
    icon: IconUsers,
    stats: { label: "Active Groups", value: "1.2K" },
    highlights: ["Private Groups", "Custom Markets", "Social Features"],
    colSpan: "md:col-span-12 lg:col-span-7",
  },
  {
    title: "Tier System",
    description:
      "Start as Novice, level up to High Roller. Unlock higher limits.",
    icon: IconTarget,
    stats: { label: "High Rollers", value: "892" },
    highlights: ["Merit-Based", "Premium Access"],
    colSpan: "md:col-span-12 lg:col-span-6",
  },
  {
    title: "Live Updates",
    description:
      "Real-time market changes, instant notifications, live settlement.",
    icon: IconActivity,
    stats: { label: "Settlement", value: "<5min" },
    highlights: ["Real-time Updates", "Push Alerts"],
    colSpan: "md:col-span-12 lg:col-span-6",
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`group relative ${feature.colSpan} flex flex-col`}
    >
      <div className="relative h-full p-6 md:p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 hover:border-black/10 hover:bg-white/60 transition-all duration-500 overflow-hidden shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)]">
        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Top border accent - Animated on View */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: index * 0.08 + 0.3, duration: 0.6 }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header Row: Icon & Stats */}
          <div className="flex items-start justify-between mb-6">
            <div className="relative group-hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-2xl bg-black/5 backdrop-blur-sm flex items-center justify-center border border-black/5 group-hover:bg-black/10 group-hover:border-black/10 transition-all shadow-sm">
                <feature.icon className="w-6 h-6 text-black/70" />
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-semibold text-black/40 uppercase tracking-widest">
                {feature.stats.label}
              </span>
              <span className="text-xl md:text-2xl font-semibold font-mono text-black/90 mt-0.5">
                {feature.stats.value}
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div className="space-y-3 mb-6 flex-1">
            <h3 className="text-xl md:text-2xl font-medium text-black/90 tracking-tight group-hover:text-black transition-colors">
              {feature.title}
            </h3>
            <p className="text-black/60 text-sm md:text-base leading-relaxed font-medium">
              {feature.description}
            </p>
          </div>

          {/* Highlights Footer */}
          <div className="mt-auto pt-6 border-t border-black/5">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {feature.highlights.map((highlight, idx) => (
                <div key={highlight} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <span className="text-xs font-medium text-black/50 group-hover:text-black/70 transition-colors uppercase tracking-wide">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>

            {/* Explore Link - Visible on Hover */}
            <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-black opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Explore Feature <IconArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function FeatureGrid() {
  return (
    <section
      id="features"
      className="relative py-24 md:py-32 px-4 md:px-6 bg-linear-to-b from-white via-neutral-50/50 to-white overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-black/2 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24 space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-black/5 rounded-full shadow-md"
          >
            <IconCurrencyDollar className="w-4 h-4" />
            <span className="text-sm font-semibold text-black/80 tracking-wide uppercase">
              Built for Modern Bettors
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-medium tracking-tight text-black leading-[1.1]"
          >
            Everything you need completely reimagined.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-black/60 font-medium leading-relaxed"
          >
            Powerful tools designed for the Kenyan market. M-Pesa ready, crypto
            enabled, socially driven.
          </motion.p>
        </div>

        {/* 12-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 flex justify-center"
        >
          <button className="group relative inline-flex cursor-pointer items-center gap-3 px-8 py-3 bg-black text-white rounded-full overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
            <span className="relative z-10 font-normal tracking-wide text-lg">
              Start Betting Now
            </span>
            <IconArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
