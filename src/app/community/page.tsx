"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { 
  IconBrandDiscord, 
  IconBrandTwitter, 
  IconBrandReddit, 
  IconUsersGroup, 
  IconMessages, 
  IconArrowRight, 
  IconChartDots, 
  IconWorldWww,
  IconChartHistogram,
  IconHeartHandshake
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Stats Data with Dashboard-style colors
const stats = [
  { label: "Community Members", value: "12,500+", icon: IconUsersGroup, color: "blue", trend: "+12% this month" },
  { label: "Daily Discussions", value: "45,000+", icon: IconMessages, color: "amber", trend: "Very High Activity" },
  { label: "Global Markets", value: "850+", icon: IconWorldWww, color: "green", trend: "Across 12 countries" },
  { label: "Total Predictions", value: "1.2M", icon: IconChartHistogram, color: "purple", trend: "All-time stats" },
];

const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; blur: string; text: string; icon: string }> = {
    blue: {
      bg: "from-blue-50 via-white to-white",
      blur: "bg-blue-100/50 group-hover:bg-blue-200/50",
      text: "text-blue-900",
      icon: "text-blue-600",
    },
    amber: {
      bg: "from-amber-50 via-white to-white",
      blur: "bg-amber-100/50 group-hover:bg-amber-200/50",
      text: "text-amber-900",
      icon: "text-amber-600",
    },
    green: {
      bg: "from-green-50 via-white to-white",
      blur: "bg-green-100/50 group-hover:bg-green-200/50",
      text: "text-green-900",
      icon: "text-green-600",
    },
    purple: {
      bg: "from-purple-50 via-white to-white",
      blur: "bg-purple-100/50 group-hover:bg-purple-200/50",
      text: "text-purple-900",
      icon: "text-purple-600",
    },
  };
  return colorMap[color] || colorMap.blue;
};

export default function CommunityPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Join the Conversation"
        description="Ante Social is built on community. Connect with thousands of predictors, debate outcomes, and shape the future of social betting."
      />

      <section className="mb-34 px-6 max-w-7xl mx-auto space-y-16">
        
        {/* Reddit Hero Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[3rem] bg-gradient-to-br from-[#FF4500] to-[#E03C00] text-white overflow-hidden relative shadow-2xl shadow-orange-500/20 group cursor-pointer"
        >
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-700">
                <IconBrandReddit className="w-96 h-96" />
            </div>
            
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />

            <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 text-center md:text-left space-y-6">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-2">r/ante-social</h2>
                        <p className="text-white/90 text-xl font-normal max-w-2xl leading-relaxed">
                            The front page of our community. Deep dives, meme wars, and direct access to the dev team.
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <a href="https://reddit.com/r/ante-social" target="_blank" className="cursor-pointer py-2 inline-flex items-center gap-2 px-8 bg-white text-[#FF4500] rounded-full font-medium text-lg hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            Join Subreddit <IconArrowRight className="w-5 h-5" />
                        </a>
                        <div className="flex items-center gap-2 text-white/80 font-semibold px-4">
                            <IconHeartHandshake className="w-5 h-5" />
                            <span>1.2k Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Dashboard Style Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-12 md:my-24">
            {stats.map((stat, index) => {
                const colors = getColorClasses(stat.color);
                return (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                            "relative overflow-hidden rounded-[2rem] border border-black/5 p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 group cursor-pointer bg-gradient-to-br",
                            colors.bg
                        )}
                    >
                         <div className={cn("absolute -right-6 -top-6 h-32 w-32 rounded-full blur-3xl transition-all opacity-60", colors.blur)} />
                         
                         <div className="relative z-10 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className={cn("p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm")}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className={cn("text-xs font-medium px-2 py-1 rounded-full bg-white/50 backdrop-blur-sm border border-black/5")}>
                                    {stat.trend}
                                </span>
                            </div>
                            
                            <div>
                                <h3 className={cn("text-2xl font-medium tracking-tight text-black mb-1")}>
                                    {stat.value}
                                </h3>
                                <p className={cn("font-medium", "opacity-60")}>
                                    {stat.label}
                                </p>
                            </div>
                         </div>
                    </motion.div>
                );
            })}
        </div>

        {/* Discord & Twitter Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Discord */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-10 rounded-[3rem] bg-[#5865F2] text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-[#5865F2]/30 transition-all duration-500 cursor-pointer"
            >
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity transform group-hover:rotate-12 duration-700">
                    <IconBrandDiscord className="w-54 h-54" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full justify-between space-y-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-medium mb-4">Discord</h2>
                        <p className="text-indigo-100 font-medium text-lg leading-relaxed max-w-sm">
                            Real-time trading signals, voice chats, and 24/7 support. The heartbeat of our operations.
                        </p>
                    </div>
                    <a href="https://discord.com" target="_blank" className="cursor-pointer py-2 inline-flex items-center gap-2 px-8 bg-white text-[#5865F2] rounded-full font-medium hover:bg-indigo-50 transition-colors shadow-lg w-fit">
                        Join Server <IconArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </motion.div>

            {/* Twitter */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-10 rounded-[3rem] bg-black text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-neutral-900/30 transition-all duration-500 cursor-pointer"
            >
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity transform group-hover:-rotate-12 duration-700">
                    <IconBrandTwitter className="w-54 h-54" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full justify-between space-y-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-medium mb-4">X / Twitter</h2>
                        <p className="text-neutral-400 font-medium text-lg leading-relaxed max-w-sm">
                            Breaking news, viral market polls, and flash giveaways. Don't miss the alpha.
                        </p>
                    </div>
                    <a href="https://twitter.com" target="_blank" className="cursor-pointer py-2 inline-flex items-center gap-2 px-8 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors shadow-lg w-fit">
                        Follow Us <IconArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </motion.div>
        </div>

      </section>
    </PageLayout>
  );
}

