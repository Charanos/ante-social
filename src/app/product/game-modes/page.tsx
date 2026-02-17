
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { WaveBackground } from "@/components/landing/WaveBackground";
import { IconChartPie3, IconMasksTheater, IconBolt, IconStairsUp, IconShieldLock, IconArrowRight, IconSparkles, IconChartArcs, IconUsersGroup, IconChartDots, IconHierarchy } from "@tabler/icons-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const gameModes = [
  {
    icon: IconChartPie3,
    title: "Poll-Style Markets",
    description: "The classic prediction market. Vote on outcomes, pool your stakes, and let the wisdom of the crowd decide the odds.",
    tag: "Most Popular",
    tagColor: "bg-blue-100 text-blue-800 border-blue-200",
    gradient: "from-blue-500/20 via-purple-500/20 to-transparent",
    image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=2670&auto=format&fit=crop",
    stats: { players: "12.5K", winRate: "68%" }
  },
  {
    icon: IconMasksTheater,
    title: "The Betrayal Game",
    description: "A social experiment in trust. Cooperate for a shared win, or betray for a massive payout. But if everyone betrays, everyone loses.",
    tag: "High Stakes",
    tagColor: "bg-red-100 text-red-800 border-red-200",
    gradient: "from-red-500/20 via-orange-500/20 to-transparent",
    image: "https://images.unsplash.com/photo-1560523159-4a9692d222ef?q=80&w=2669&auto=format&fit=crop",
    stats: { players: "8.2K", winRate: "45%" }
  },
  {
    icon: IconBolt,
    title: "Reflex Reaction",
    description: "Fast-paced prediction on immediate events. Predict the majority's instinct in seconds. Rewards quick thinking.",
    tag: "Fast Paced",
    tagColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    gradient: "from-yellow-500/20 via-amber-500/20 to-transparent",
    image: "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?q=80&w=2688&auto=format&fit=crop",
    stats: { players: "15.1K", winRate: "52%" }
  },
  {
    icon: IconStairsUp,
    title: "Majority Prediction Ladder",
    description: "Rank items based on what you think the majority will choose. A test of empathy and social awareness.",
    tag: "Strategy",
    tagColor: "bg-green-100 text-green-800 border-green-200",
    gradient: "from-green-500/20 via-emerald-500/20 to-transparent",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2670&auto=format&fit=crop",
    stats: { players: "6.8K", winRate: "61%" }
  },
  {
    icon: IconShieldLock,
    title: "Private Group Bets",
    description: "Create exclusive markets for your inner circle. Winner Takes All or Odd One Out. You set the rules.",
    tag: "Private",
    tagColor: "bg-orange-100 text-orange-800 border-orange-200",
    gradient: "from-orange-500/20 via-red-500/20 to-transparent",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2670&auto=format&fit=crop",
    stats: { players: "4.3K", winRate: "73%" }
  }
];

export default function GameModesPage() {
  const FeaturedIcon = gameModes[0].icon;

  return (
    <PageLayout>
      {/* Hero Section with Wave */}
      <div className="relative">
        <PageHeader
          title="Game Modes"
          description="From improved classics to psychological experiments. Discover new ways to play and win."
        />
        <WaveBackground variant="bottom" />
      </div>

      {/* Main Content */}
      <section className="relative pt-10 pb-24 md:pb-32 px-4 md:px-6 overflow-hidden">
        {/* Background Elements - African Inspired Colors */}
        

        <div className="relative max-w-7xl mx-auto">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Card - Large (Poll Style) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl bg-neutral-900 min-h-[500px] cursor-pointer ring-1 ring-white/10 hover:ring-orange-500/50 transition-all duration-500"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                  style={{ backgroundImage: `url('${gameModes[0].image}')` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${gameModes[0].gradient}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-8 md:p-10">
                <div className="flex items-start justify-between">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${gameModes[0].tagColor} backdrop-blur-sm`}>
                    {gameModes[0].tag}
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <FeaturedIcon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-3xl md:text-4xl font-normal text-white">{gameModes[0].title}</h3>
                  <p className="text-white/80 text-lg max-w-xl">{gameModes[0].description}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <IconUsersGroup className="w-5 h-5 text-orange-400" />
                      <span className="text-white/90 font-mono text-sm">{gameModes[0].stats.players}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconChartDots className="w-5 h-5 text-green-400" />
                      <span className="text-white/90 font-mono text-sm">{gameModes[0].stats.winRate} Win Rate</span>
                    </div>
                  </div>

                  <button className="inline-flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full font-normal cursor-pointer hover:bg-orange-500 hover:text-white transition-all group-hover:gap-3">
                    Play Now <IconArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Smaller Cards - Rest of the modes */}
            {gameModes.slice(1).map((mode, index) => {
              const Icon = mode.icon;
              return (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + (index + 1) * 0.1 }}
                className="group relative overflow-hidden rounded-3xl bg-neutral-900 min-h-[300px] cursor-pointer ring-1 ring-white/10 hover:ring-orange-500/50 transition-all duration-500"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                    style={{ backgroundImage: `url('${mode.image}')` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${mode.tagColor} backdrop-blur-sm`}>
                      {mode.tag}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-normal text-white">{mode.title}</h3>
                    <p className="text-white/70 text-sm line-clamp-2">{mode.description}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <IconUsersGroup className="w-4 h-4 text-orange-400" />
                        <span className="text-white/80 font-mono">{mode.stats.players}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconChartDots className="w-4 h-4 text-green-400" />
                        <span className="text-white/80 font-mono">{mode.stats.winRate}</span>
                      </div>
                    </div>

                    <button className="inline-flex items-center gap-2 px-4 cursor-pointer py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-normal hover:bg-white hover:text-black transition-all">
                      Try Now <IconArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )})}
          </div>
        </div>

        {/* NEW: How It Works Section */}
        <div className="relative max-w-7xl mx-auto mt-32 mb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                 <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-black mb-4">
                  How It Works
                </h2>
                <p className="text-black/60 text-lg max-w-2xl mx-auto">
                    Three steps to glory. It's simpler than you think.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
                {[
                    { title: "Pick Your Arena", desc: "Choose a game mode that fits your style. Strategy, speed, or social manipulation?", icon: "01" },
                    { title: "Place Your Stake", desc: "Back your intuition with real stakes. Join the pool and lock in your position.", icon: "02" },
                    { title: "Win & Celebrate", desc: "If the crowd or outcome swings your way, you take the pot. Instant payouts.", icon: "03" }
                ].map((step, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-sm"
                    >
                        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6 text-2xl font-medium text-orange-600 font-serif">
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                        <p className="text-black/60 leading-relaxed">{step.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Why Choose Ante Social Section */}
        <div className="relative max-w-7xl mx-auto mt-32 mb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <SectionHeading title="Why Choose Ante Social?" className="mb-16" />
                <p className="text-black/60 text-lg max-w-2xl mx-auto">
                    More than just predictions, it's a community where every decision matters.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center px-4">
                {[
                    { icon: IconUsersGroup, title: "Community-Driven", desc: "Engage with a vibrant community, share insights, and learn from the collective wisdom." },
                    { icon: IconShieldLock, title: "Fair & Transparent", desc: "Blockchain-powered markets ensure every prediction is recorded and every payout is instant and verifiable." },
                    { icon: IconBolt, title: "Innovative Game Modes", desc: "Beyond traditional markets, explore unique social experiments and fast-paced challenges." },
                    { icon: IconChartDots, title: "Rewarding Experience", desc: "Earn real rewards for your foresight and strategic thinking. The more you play, the more you can win." }
                ].map((feature, i) => {
                    const FeatureIcon = feature.icon;
                    return (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-sm group hover:bg-white/60 transition-colors"
                        >
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-black/60 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    );
                })}
            </div>
        </div>

        <WaveBackground variant="bottom" />
      </section>
    </PageLayout>
  );
}
