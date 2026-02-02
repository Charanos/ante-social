'use client';

import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Zap,
  Brain,
  ShieldAlert,
  Trophy,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

const gameModes = [
  {
    id: "poll",
    title: "Poll-Style Betting",
    subtitle: "Majority Rules",
    description: "The classic prediction market. Option with the most votes wins. Winners split the prize pool proportionally by their stake amount.",
    icon: Users,
    quote: "The wisdom of the crowd... or the folly?",
    mechanics: ["Most votes wins", "Pro-rata payouts", "Integrity weighting"],
  },
  {
    id: "betrayal",
    title: "The Betrayal Game",
    subtitle: "Trust or Betray",
    description: "Choose to Cooperate for a small guaranteed win, or Betray for a chance at the jackpot. But if everyone betrays, everyone loses.",
    icon: ShieldAlert,
    quote: "Trust is a currency. Spend it wisely.",
    mechanics: ["All cooperate = small win", "Betrayers win big", "All betray = zero"],
  },
  {
    id: "reflex",
    title: "Reflex Reaction Test",
    subtitle: "5-Second Decision",
    description: "Predict the majority's first instinct when confronted with a situation. You have 5 seconds. Don't think, just react.",
    icon: Zap,
    quote: "Fortune favors the absurd.",
    mechanics: ["5-second countdown", "Minority pays more", "2x multiplier tier"],
  },
  {
    id: "majority",
    title: "Majority Prediction Ladder",
    subtitle: "Rank & Predict",
    description: "Rank items based on what you think the majority will choose. Guess the correct chain to win. Perfect consensus prediction.",
    icon: Brain,
    quote: "You joined the parade, not the rebellion.",
    mechanics: ["Drag to rank", "Match majority order", "Split if multiple winners"],
  },
  {
    id: "private",
    title: "Private Group Bets",
    subtitle: "Your Circle, Your Rules",
    description: "Create exclusive markets with friends. Winner Takes All or Odd One Out. Peer confirmation system ensures fairness.",
    icon: Trophy,
    quote: "Keep your friends close, and your bets closer.",
    mechanics: ["Winner Takes All", "Odd One Out", "Group confirmation"],
  },
];

export function GameModes() {
  const [activeMode, setActiveMode] = useState(0);
  const currentMode = gameModes[activeMode];

  return (
    <section className="relative py-24 md:py-32 px-4 md:px-6 bg-linear-to-b from-neutral-50/50 via-white to-neutral-50/50 overflow-hidden">

      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,var(--tw-gradient-stops))] from-black/2 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20 text-center space-y-4"
        >
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-black/90 leading-[1.1]">
            Choose Your Arena
          </h2>
          <p className="text-base md:text-lg text-black/60 font-medium max-w-2xl mx-auto leading-relaxed">
            Five unique betting formats. Each one a different way to outsmart the crowd.
          </p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left: Navigation Menu */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {gameModes.map((mode, index) => (
              <motion.button
                key={mode.id}
                onClick={() => setActiveMode(index)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`group relative cursor-pointer flex items-center gap-4 p-5 md:p-6 rounded-2xl text-left transition-all duration-300 ${activeMode === index
                  ? "bg-white/60 backdrop-blur-xl border border-black/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)]"
                  : "bg-white/30 backdrop-blur-sm border border-black/5 hover:bg-white/50 hover:border-black/8 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)]"
                  }`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activeMode === index
                  ? "bg-black/8 border border-black/10"
                  : "bg-black/5 border border-black/5 group-hover:bg-black/8"
                  }`}>
                  <mode.icon className={`w-6 h-6 transition-colors ${activeMode === index ? "text-black/80" : "text-black/40 group-hover:text-black/60"
                    }`} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base md:text-lg font-semibold tracking-tight transition-colors ${activeMode === index ? "text-black/90" : "text-black/50 group-hover:text-black/70"
                    }`}>
                    {mode.title}
                  </h3>
                  <p className={`text-xs md:text-sm font-medium mt-0.5 transition-colors ${activeMode === index ? "text-black/50" : "text-black/30 group-hover:text-black/40"
                    }`}>
                    {mode.subtitle}
                  </p>
                </div>

                {/* Arrow Indicator */}
                <ArrowRight className={`w-5 h-5 transition-all ${activeMode === index
                  ? "opacity-100 translate-x-0 text-black/60"
                  : "opacity-0 -translate-x-2 text-black/30"
                  }`} />
              </motion.button>
            ))}
          </div>

          {/* Right: Display Card */}
          <div className="lg:col-span-7 relative min-h-[550px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 flex flex-col p-8 md:p-12 rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.1)]"
              >
                {/* Icon Circle */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-black/5 backdrop-blur-sm flex items-center justify-center border border-black/10 mb-8"
                >
                  <currentMode.icon className="w-8 h-8 text-black/70" />
                </motion.div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-sm font-semibold text-black/40 uppercase tracking-widest mb-2"
                    >
                      {currentMode.subtitle}
                    </motion.p>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl md:text-4xl font-semibold text-black/90 tracking-tight mb-4"
                    >
                      {currentMode.title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="text-base md:text-lg text-black/60 font-medium leading-relaxed"
                    >
                      {currentMode.description}
                    </motion.p>
                  </div>

                  {/* Mechanics List */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2"
                  >
                    {currentMode.mechanics.map((mechanic, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/40 backdrop-blur-sm border border-black/5 rounded-full"
                      >
                        <div className="w-1 h-1 rounded-full bg-black/30" />
                        <span className="text-xs font-medium text-black/60 uppercase tracking-wide">
                          {mechanic}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Quote Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="pt-8 mt-8 border-t border-black/5"
                >
                  <div className="p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/5">
                    <p className="text-xs font-semibold text-black/30 uppercase tracking-widest mb-2">
                      Ante Social Wisdom
                    </p>
                    <p className="text-base md:text-lg text-black/70 italic font-medium">
                      "{currentMode.quote}"
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 md:mt-20 flex justify-center"
        >
          <motion.button
            className="group inline-flex items-center gap-3 px-8 py-3 bg-black text-white font-normal rounded-full shadow-lg hover:shadow-xl cursor-pointer transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg font-normal">Explore All Game Modes</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}