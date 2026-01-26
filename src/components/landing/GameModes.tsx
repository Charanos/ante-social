"use client";

import { motion } from "framer-motion";
import { Users, Zap, Brain, ShieldAlert, Trophy, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const gameModes = [
  {
    id: "poll",
    title: "Poll-Style Betting",
    description: "The classic. Option with the most votes wins. Winners split the pool pro-rata.",
    icon: Users,
    quote: "The wisdom of the crowd... or the folly?",
  },
  {
    id: "betrayal",
    title: "The Betrayal Game",
    description: "Cooperate for a small win, or Betray for a big one. If everyone betrays, everyone loses.",
    icon: ShieldAlert,
    quote: "Trust is a currency. Spend it wisely.",
  },
  {
    id: "reflex",
    title: "Reflex Reaction",
    description: "Predict the majority's instinct in 5 seconds. Don't think, just react.",
    icon: Zap,
    quote: "Fortune favors the absurd.",
  },
  {
    id: "majority",
    title: "Majority Ladder",
    description: "Rank items based on what you think the crowd will choose. Predict the consensus.",
    icon: Brain,
    quote: "You joined the parade, not the rebellion.",
  },
  {
    id: "private",
    title: "Private Groups",
    description: "Winner Takes All or Odd One Out. Create your own markets with friends.",
    icon: Trophy,
    quote: "Keep your friends close, and your bets closer.",
  },
];

export function GameModes() {
  const [activeMode, setActiveMode] = useState(0);

  return (
    <section className="py-32 px-6 bg-[#f9f9f9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-black/80 mb-4 text-shadow-neumorphic">
            Choose Your Arena
          </h2>
          <p className="text-neutral-600 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            High-stakes strategy meets social experiment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Neumorphic Menu */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {gameModes.map((mode, index) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(index)}
                className={cn(
                  "group relative flex items-center gap-6 p-6 rounded-2xl text-left transition-all duration-300 cursor-pointer outline-none",
                  activeMode === index
                    ? "neumorphic-pressed text-black scale-[0.98]"
                    : "neumorphic-flat text-neutral-500 hover:text-black hover:-translate-y-1"
                )}
              >
                <div
                  className={cn(
                    "w-12 h-8 rounded-xl flex items-center justify-center transition-all duration-300",
                    activeMode === index
                      ? "neumorphic-icon-pressed text-black"
                      : "neumorphic-icon-flat text-neutral-400 group-hover:text-black"
                  )}
                >
                  <mode.icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-medium tracking-tight">
                    {mode.title}
                  </h3>
                </div>

                <ArrowRight 
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    activeMode === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  )} 
                />
              </button>
            ))}
          </div>

          {/* Neumorphic Display Card */}
          <div className="lg:col-span-7 relative min-h-[500px]">
            {gameModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, scale: 0.95, display: "none" }}
                animate={
                  activeMode === index
                    ? { opacity: 1, scale: 1, display: "flex" }
                    : { opacity: 0, scale: 0.95, transitionEnd: { display: "none" } }
                }
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 flex-col justify-between p-12 rounded-[3rem] neumorphic-flat"
              >
                <div>
                  <div className="w-18 h-18 rounded-full neumorphic-concave flex items-center justify-center mb-10 mx-auto lg:mx-0">
                    <mode.icon className="w-8 h-8 text-black/80" />
                  </div>
                  
                  <h3 className="text-4xl  font-medium text-black/80 mb-6 tracking-tight">
                    {mode.title}
                  </h3>
                  <p className="text-lg text-neutral-600 font-medium leading-relaxed max-w-xl">
                    {mode.description}
                  </p>
                </div>
                
                <div className="pt-10 mt-auto border-t border-black/5">
                  <div className="neumorphic-pressed p-6 rounded-2xl">
                    <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest mb-2">
                      Ante Social Wisdom
                    </p>
                    <p className="text-lg text-black/70 italic font-medium">
                      "{mode.quote}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .neumorphic-flat {
          background: #E0E5EC;
          box-shadow: 9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5);
        }
        .neumorphic-pressed {
          background: #E0E5EC;
          box-shadow: inset 6px 6px 10px 0 rgba(163,177,198, 0.7), inset -6px -6px 10px 0 rgba(255,255,255, 0.8);
        }
        .neumorphic-concave {
          background: linear-gradient(145deg, #cacaca, #f0f0f0);
          box-shadow:  20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
        }
        .neumorphic-icon-flat {
          background: #E0E5EC;
          box-shadow: 5px 5px 10px #b8b9be, -5px -5px 10px #ffffff;
        }
        .neumorphic-icon-pressed {
          background: #E0E5EC;
          box-shadow: inset 3px 3px 7px #b8b9be, inset -3px -3px 7px #ffffff;
        }
        .text-shadow-neumorphic {
          text-shadow: 2px 2px 4px rgba(163,177,198,0.4), -2px -2px 4px rgba(255,255,255,0.4);
        }
      `}</style>
    </section>
  );
}
