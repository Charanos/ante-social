"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import Link from "next/link";
import { IconArrowRight, IconEye, IconUsers, IconBolt, IconChartBar, IconLock, IconArrowsSplit } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// ─── Data ─────────────────────────────────────────────────────────────────────

const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; blur: string; text: string; icon: string }> = {
    blue: {
      bg: "from-blue-50 via-white to-white",
      blur: "bg-blue-300/40 group-hover:bg-blue-400/50",
      text: "text-blue-900",
      icon: "text-blue-600",
    },
    amber: {
      bg: "from-amber-50 via-white to-white",
      blur: "bg-amber-300/40 group-hover:bg-amber-400/50",
      text: "text-amber-900",
      icon: "text-amber-600",
    },
    green: {
      bg: "from-green-50 via-white to-white",
      blur: "bg-green-300/40 group-hover:bg-green-400/50",
      text: "text-green-900",
      icon: "text-green-600",
    },
    purple: {
      bg: "from-purple-50 via-white to-white",
      blur: "bg-purple-300/40 group-hover:bg-purple-400/50",
      text: "text-purple-900",
      icon: "text-purple-600",
    },
    red: {
      bg: "from-red-50 via-white to-white",
      blur: "bg-red-300/40 group-hover:bg-red-400/50",
      text: "text-red-900",
      icon: "text-red-600",
    },
    slate: {
      bg: "from-slate-100 via-white to-white",
      blur: "bg-slate-300/40 group-hover:bg-slate-400/50",
      text: "text-slate-900",
      icon: "text-slate-600",
    },
  };
  return colorMap[color] || colorMap.blue;
};

const gameModes = [
  {
    id: "consensus",
    num: "01",
    title: "Consensus Markets",
    subtitle: "The crowd is the oracle.",
    description: "Forecast an outcome, and capital flows toward the correct position. The best forecasters compound quietly — everyone else donates.",
    icon: <IconChartBar stroke={1} size={32} />,
    size: "col-span-2 md:col-span-3",
    color: "blue",
  },
  {
    id: "prisoner",
    num: "02",
    title: "Prisoner's Dilemma",
    subtitle: "Trust is finite.",
    description: "Cooperate for shared yield, or Defect to seize liquidity. If everyone defects, the market collapses.",
    icon: <IconUsers stroke={1} size={32} />,
    size: "col-span-2 md:col-span-3",
    color: "red",
  },
  {
    id: "reflex",
    num: "03",
    title: "Reflex Signal Test",
    subtitle: "Five seconds. One take.",
    description: "The window opens for five seconds. Pattern recognition and social calibration over research.",
    icon: <IconBolt stroke={1} size={32} />,
    size: "col-span-2 md:col-span-2",
    color: "amber",
  },
  {
    id: "ladder",
    num: "04",
    title: "Prediction Ladder",
    subtitle: "Applied empathy.",
    description: "Rank options in the order the crowd will rank them. Your personal preferences are a liability here.",
    icon: <IconArrowsSplit stroke={1} size={32} />,
    size: "col-span-2 md:col-span-2",
    color: "purple",
  },
  {
    id: "syndicates",
    num: "05",
    title: "Private Syndicates",
    subtitle: "Your circle. Your terms.",
    description: "Closed markets for crews who prefer private competition. Invite-only, peer-confirmed settlement.",
    icon: <IconLock stroke={1} size={32} />,
    size: "col-span-2 md:col-span-2",
    color: "green",
  },
  {
    id: "divergence",
    num: "06",
    title: "Consensus Divergence",
    subtitle: "The minority wins.",
    description: "The option with the fewest votes takes the pot. A structural reward for contrarian thinking.",
    icon: <IconEye stroke={1} size={32} />,
    size: "col-span-2 md:col-span-6", // Full width accent
    color: "slate",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative rounded-3xl mt-24 m-6 h-[60vh] min-h-[600px] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/about-alt.jpg" 
          alt="Human Instinct"
          className="w-full h-full object-cover opacity-80 scale-110"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
      </div>

      <div className="relative z-20 w-full px-6 md:px-12 pb-16 md:pb-24 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <span className="inline-block px-3 py-1 font-medium rounded-full border border-white/20 text-white/50 text-[12px] font-mono tracking-widest uppercase mb-6">
            The Mechanics of Instinct
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-normal text-white leading-[0.95] tracking-tight mb-8">
            Six ways to play.
          </h1>
          <p className="text-lg text-white/60 leading-relaxed">
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
            {gameModes.map((mode, i) => {
              const colors = getColorClasses(mode.color);
              return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  mode.size,
                  "group relative p-8 md:p-10 rounded-[2.5rem] overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1 border border-black/5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] bg-gradient-to-br",
                  mode.id === 'divergence' ? "bg-slate-900 text-white" : colors.bg
                )}
              >
                {mode.id !== 'divergence' && (
                  <div className={cn("absolute -right-6 -top-6 h-48 w-48 rounded-full blur-3xl transition-all opacity-60 z-0", colors.blur)} />
                )}
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <span className="text-xs font-mono font-semibold tracking-tighter">
                      MODE_{mode.num}
                    </span>
                    <div className="opacity-40 group-hover:opacity-100 transition-opacity">
                      {mode.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-medium mb-3 tracking-tight leading-none">
                    {mode.title}
                  </h3>
                  <p className={`text-sm font-mono uppercase tracking-wider mb-6 ${mode.id === 'divergence' ? 'text-white/50' : 'text-black/50'}`}>
                    {mode.subtitle}
                  </p>
                  <p className={`text-base leading-relaxed max-w-xs ${mode.id === 'divergence' ? 'text-white/70' : 'text-black/60'}`}>
                    {mode.description}
                  </p>
                </div>

                <div className="relative z-10 mt-12 flex justify-between items-center">
                   <Link href="/register" className={`flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest font-mono ${mode.id === 'divergence' ? 'text-white' : 'text-black'}`}>
                    Enter Arena
                    <IconArrowRight size={14} />
                  </Link>
                </div>

                {/* Background Composition for Divergence */}
                {mode.id === "divergence" && (
                  <>
                    <div 
                      className="absolute inset-0 opacity-10 pointer-events-none" 
                      style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} 
                    />
                    
                    {/* Background Glows */}
                    <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute right-12 bottom-12 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

                    {/* Floating Illustration Composition */}
                    <div className="hidden md:block absolute -right-12 -bottom-32 w-[700px] h-[700px] pointer-events-none z-0">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative w-full h-full flex items-center justify-center animate-game-float"
                      >
                        <Image
                          src="/dashboard-blob.png"
                          fill
                          sizes="400px"
                          alt="Divergence Illustration"
                          className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] brightness-90 scale-110"
                          priority
                        />
                      </motion.div>
                    </div>
                  </>
                )}
              </motion.div>
            )})}
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
                            <span className="text-[12px] font-mono text-black/20 font-semibold uppercase tracking-[0.3em]">{item.step}</span>
                            <h4 className="text-xl font-medium text-black/80">{item.title}</h4>
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