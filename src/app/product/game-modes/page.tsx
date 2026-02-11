
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconChartBar, IconUsers, IconBolt, IconSortAscending, IconLock, IconArrowRight } from "@tabler/icons-react";

const gameModes = [
  {
    icon: IconChartBar,
    title: "Poll-Style Markets",
    description: "The classic prediction market. Vote on outcomes, pool your stakes, and let the wisdom of the crowd decide the odds.",
    tag: "Most Popular",
    gradient: "from-blue-500/10 to-purple-500/10"
  },
  {
    icon: IconUsers,
    title: "The Betrayal Game",
    description: "A social experiment in trust. Cooperate for a shared win, or betray for a massive payout. But if everyone betrays, everyone loses.",
    tag: "High Stakes",
    gradient: "from-red-500/10 to-orange-500/10"
  },
  {
    icon: IconBolt,
    title: "Reflex Reaction",
    description: "Fast-paced prediction on immediate events. Predict the majority's instinct in seconds. Rewards quick thinking.",
    tag: "Fast Paced",
    gradient: "from-yellow-500/10 to-amber-500/10"
  },
  {
    icon: IconSortAscending,
    title: "Majority Prediction Ladder",
    description: "Rank items based on what you think the majority will choose. A test of empathy and social awareness.",
    tag: "Strategy",
    gradient: "from-green-500/10 to-emerald-500/10"
  },
  {
    icon: IconLock,
    title: "Private Group Bets",
    description: "Create exclusive markets for your inner circle. Winner Takes All or Odd One Out. You set the rules.",
    tag: "Private",
    gradient: "from-gray-500/10 to-slate-500/10"
  }
];

export default function GameModesPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Game Modes"
        description="From improved classics to psychological experiments. Discover new ways to play and win."
      />

      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <SectionHeading title="Available Modes" className="mb-12" />

        <div className="space-y-8">
          {gameModes.map((mode, index) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-white border border-neutral-100 p-8 md:p-12 hover:border-black/5 transition-all duration-300 hover:shadow-xl"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-linear-to-br ${mode.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="w-20 h-20 rounded-2xl bg-white border border-black/5 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <mode.icon className="w-10 h-10 text-black/80" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="text-3xl font-medium text-black tracking-tight">
                      {mode.title}
                    </h3>
                    <span className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-black/5 text-black/70 rounded-full border border-black/5">
                      {mode.tag}
                    </span>
                  </div>
                  <p className="text-xl text-neutral-600 font-medium max-w-3xl leading-relaxed">
                    {mode.description}
                  </p>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <a href="/dashboard" className="inline-flex w-full md:w-auto items-center justify-center gap-2 px-8 py-2 rounded-full border border-black/10 text-base font-medium text-black hover:bg-black hover:text-white transition-all">
                    Play Now <IconArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
