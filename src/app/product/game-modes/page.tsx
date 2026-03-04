"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import Link from "next/link";
import { IconArrowRight, IconEye, IconUsers, IconBolt, IconChartBar, IconLock, IconArrowsSplit } from "@tabler/icons-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const gameModes = [
  {
    id: "consensus",
    num: "01",
    title: "Consensus Markets",
    subtitle: "The crowd is the oracle.",
    description: "Forecast an outcome, and capital flows toward the correct position. The best forecasters compound quietly — everyone else donates.",
    icon: <IconChartBar stroke={1} size={32} />,
    size: "col-span-2 md:col-span-3",
    color: "bg-blue-50/50",
  },
  {
    id: "prisoner",
    num: "02",
    title: "Prisoner's Dilemma",
    subtitle: "Trust is finite.",
    description: "Cooperate for shared yield, or Defect to seize liquidity. If everyone defects, the market collapses.",
    icon: <IconUsers stroke={1} size={32} />,
    size: "col-span-2 md:col-span-3",
    color: "bg-red-50/50",
  },
  {
    id: "reflex",
    num: "03",
    title: "Reflex Signal Test",
    subtitle: "Five seconds. One take.",
    description: "The window opens for five seconds. Pattern recognition and social calibration over research.",
    icon: <IconBolt stroke={1} size={32} />,
    size: "col-span-2 md:col-span-2",
    color: "bg-amber-50/50",
  },
  {
    id: "ladder",
    num: "04",
    title: "Prediction Ladder",
    subtitle: "Applied empathy.",
    description: "Rank options in the order the crowd will rank them. Your personal preferences are a liability here.",
    icon: <IconArrowsSplit stroke={1} size={32} />,
    size: "col-span-2 md:col-span-2",
    color: "bg-purple-50/50",
  },
  {
    id: "syndicates",
    num: "05",
    title: "Private Syndicates",
    subtitle: "Your circle. Your terms.",
    description: "Closed markets for crews who prefer private competition. Invite-only, peer-confirmed settlement.",
    icon: <IconLock stroke={1} size={32} />,
    size: "col-span-2 md:col-span-2",
    color: "bg-emerald-50/50",
  },
  {
    id: "divergence",
    num: "06",
    title: "Consensus Divergence",
    subtitle: "The minority wins.",
    description: "The option with the fewest votes takes the pot. A structural reward for contrarian thinking.",
    icon: <IconEye stroke={1} size={32} />,
    size: "col-span-2 md:col-span-6", // Full width accent
    color: "bg-slate-900 text-white",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative h-[85vh] w-full flex items-center justify-start overflow-hidden bg-black">
      {/* Background Image - THE INSTINCT IMAGE */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
        <img 
          src="/path-to-your-generated-eye-image.jpg" 
          alt="Human Instinct"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-white/50 text-[10px] font-mono tracking-widest uppercase mb-6">
            The Mechanics of Instinct
          </span>
          <h1 className="text-6xl md:text-8xl font-medium text-white leading-none tracking-tighter mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Six ways to <br />
            <em className="italic font-normal text-white/40">disagree.</em>
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-md">
            Not all prediction is the same act. We've engineered six distinct arenas to test your pattern recognition, empathy, and raw nerve.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default function GameModesPage() {
  return (
    <PageLayout>
      <div className="bg-white">
        <Hero />

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
            <h2 className="text-4xl font-medium text-black/90 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Game Formats
            </h2>
            <p className="text-sm font-mono text-black/40 uppercase tracking-widest">
              Navigate by Strategy
            </p>
          </div>

          {/* Asymmetrical Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
            {gameModes.map((mode, i) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${mode.size} group relative p-8 md:p-10 rounded-[2.5rem] overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1 ${mode.color}`}
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <span className="text-xs font-mono font-bold opacity-30 tracking-tighter">
                      MODE_{mode.num}
                    </span>
                    <div className="opacity-40 group-hover:opacity-100 transition-opacity">
                      {mode.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-medium mb-3 tracking-tight leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {mode.title}
                  </h3>
                  <p className={`text-sm font-mono uppercase tracking-wider mb-6 ${mode.id === 'divergence' ? 'text-white/50' : 'text-black/40'}`}>
                    {mode.subtitle}
                  </p>
                  <p className={`text-base leading-relaxed max-w-xs ${mode.id === 'divergence' ? 'text-white/70' : 'text-black/60'}`}>
                    {mode.description}
                  </p>
                </div>

                <div className="relative z-10 mt-12 flex justify-between items-center">
                   <Link href="/register" className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest font-mono ${mode.id === 'divergence' ? 'text-white' : 'text-black'}`}>
                    Enter Arena
                    <IconArrowRight size={14} />
                  </Link>
                </div>

                {/* Subtle Background Pattern for Divergence */}
                {mode.id === "divergence" && (
                   <div className="absolute inset-0 opacity-10 pointer-events-none" 
                        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} 
                   />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Process Rail - Minimalist */}
        <section className="bg-stone-50 py-24 border-y border-stone-200">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {[
                        { step: "01", title: "Select Arena", text: "Six formats. Six ways to win. Choose where your edge lies." },
                        { step: "02", title: "Lock Position", text: "Commit stakes. The market reacts. The signal hardens." },
                        { step: "03", title: "Instant Settlement", text: "Five minute resolution windows. Liquid payouts." },
                    ].map((item, i) => (
                        <div key={i} className="space-y-4">
                            <span className="text-[10px] font-mono text-black/20 font-bold uppercase tracking-[0.3em]">{item.step}</span>
                            <h4 className="text-xl font-medium text-black/80" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h4>
                            <p className="text-sm text-black/40 leading-relaxed">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </div>
    </PageLayout>
  );
}