
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { IconTrophy, IconTrendingUp, IconCrown } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const leaders = [
  { rank: 1, name: "CryptoKing_KE", winRate: "88%", profit: "+450K AP", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop" },
  { rank: 2, name: "Nairobi_Bets", winRate: "82%", profit: "+320K AP", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
  { rank: 3, name: "Sarah_W", winRate: "79%", profit: "+210K AP", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=150&auto=format&fit=crop" },
  { rank: 4, name: "John_D", winRate: "75%", profit: "+180K AP", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" },
  { rank: 5, name: "BetMaster_99", winRate: "72%", profit: "+150K AP", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=100&auto=format&fit=crop" },
];

export default function LeaderboardPage() {
    const [timeframe, setTimeframe] = useState<"weekly" | "all-time">("weekly");

  return (
    <PageLayout>
      <PageHeader
        title="Hall of Fame"
        description="See who's dominating the markets. Compete, climb the ranks, and earn your place among the elite."
      />

      <section className="pb-24 px-6 max-w-5xl mx-auto">
        
        {/* Timeframe Toggle */}
        <div className="flex justify-center mb-12">
            <div className="bg-neutral-100 p-1 rounded-full flex items-center">
                <button 
                    onClick={() => setTimeframe("weekly")}
                    className={cn("px-6 py-2 rounded-full text-sm font-medium transition-all", timeframe === "weekly" ? "bg-white shadow-sm text-black" : "text-neutral-500 hover:text-black")}
                >
                    This Week
                </button>
                <button 
                    onClick={() => setTimeframe("all-time")}
                    className={cn("px-6 py-2 rounded-full text-sm font-medium transition-all", timeframe === "all-time" ? "bg-white shadow-sm text-black" : "text-neutral-500 hover:text-black")}
                >
                    All Time
                </button>
            </div>
        </div>

        {/* Podium - Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
            {/* Second Place */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="order-2 md:order-1 p-6 rounded-[2.5rem] bg-white border border-neutral-200/60 shadow-lg flex flex-col items-center text-center relative overflow-hidden"
            >
                <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-neutral-100 to-transparent pointer-events-none" />
                <div className="relative mb-4">
                     <div className="w-20 h-20 rounded-full border-4 border-neutral-200 overflow-hidden relative z-10">
                        <Image src={leaders[1].avatar} alt={leaders[1].name} fill className="object-cover" />
                     </div>
                     <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-neutral-200 text-neutral-600 text-xs font-medium px-3 py-1 rounded-full z-20">
                        #2
                     </div>
                </div>
                <h3 className="text-lg font-medium text-black mb-1">{leaders[1].name}</h3>
                <div className="text-sm font-medium text-neutral-500 mb-3">{leaders[1].winRate} Win Rate</div>
                <div className="text-2xl font-mono font-medium text-green-600">{leaders[1].profit}</div>
            </motion.div>

            {/* First Place */}
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                className="order-1 md:order-2 p-8 rounded-[2.5rem] bg-linear-to-b from-yellow-50 to-white border border-yellow-200 shadow-xl flex flex-col items-center text-center relative overflow-hidden transform md:-translate-y-8 z-10"
            >
                <div className="absolute top-0 inset-x-0 h-32 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-yellow-200/40 to-transparent pointer-events-none" />
                <IconCrown className="w-8 h-8 text-yellow-500 mb-4 relative z-10" fill="currentColor" />
                
                <div className="relative mb-4">
                     <div className="w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden relative z-10 ring-4 ring-yellow-100">
                        <Image src={leaders[0].avatar} alt={leaders[0].name} fill className="object-cover" />
                     </div>
                     <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-white text-sm font-medium px-4 py-1 rounded-full z-20 shadow-md">
                        #1
                     </div>
                </div>
                <h3 className="text-xl font-medium text-black mb-1">{leaders[0].name}</h3>
                <div className="text-sm font-medium text-neutral-500 mb-3">{leaders[0].winRate} Win Rate</div>
                <div className="text-3xl font-mono font-medium text-green-600">{leaders[0].profit}</div>
            </motion.div>

             {/* Third Place */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="order-3 md:order-3 p-6 rounded-[2.5rem] bg-white border border-amber-100/60 shadow-lg flex flex-col items-center text-center relative overflow-hidden"
            >
                <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-amber-50 to-transparent pointer-events-none" />
                <div className="relative mb-4">
                     <div className="w-20 h-20 rounded-full border-4 border-amber-200 overflow-hidden relative z-10">
                        <Image src={leaders[2].avatar} alt={leaders[2].name} fill className="object-cover" />
                     </div>
                     <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-xs font-medium px-3 py-1 rounded-full z-20">
                        #3
                     </div>
                </div>
                <h3 className="text-lg font-medium text-black mb-1">{leaders[2].name}</h3>
                <div className="text-sm font-medium text-neutral-500 mb-3">{leaders[2].winRate} Win Rate</div>
                <div className="text-2xl font-mono font-medium text-green-600">{leaders[2].profit}</div>
            </motion.div>
        </div>


        {/* The Rest of the List */}
        <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-8">
                <h3 className="text-lg font-semibold text-black mb-6 pl-2">Runner Ups</h3>
                <div className="space-y-2">
                    {leaders.slice(3).map((leader, index) => (
                        <motion.div 
                            key={leader.name}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-6 p-4 rounded-2xl hover:bg-neutral-50 border border-transparent hover:border-black/5 transition-all group"
                        >
                            <span className="text-lg font-medium w-8 text-center text-neutral-400">
                                #{leader.rank}
                            </span>
                            
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-black/5">
                                <Image src={leader.avatar} alt={leader.name} fill className="object-cover" />
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="font-medium text-black group-hover:text-black transition-colors">{leader.name}</h3>
                            </div>
                            
                            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-neutral-500 mr-8">
                                <IconTrendingUp className="w-4 h-4" />
                                {leader.winRate} Win Rate
                            </div>

                            <div className="text-right">
                                <div className="font-mono font-medium text-green-600">{leader.profit}</div>
                            </div>
                        </motion.div>
                    ))}
                     {/* Placeholder Rows to show interactivity */}
                     {[6,7,8].map((rank) => (
                         <div key={rank} className="flex items-center gap-6 p-4 rounded-2xl opacity-40 grayscale">
                             <span className="text-lg font-medium w-8 text-center text-neutral-400">#{rank}</span>
                             <div className="w-10 h-10 rounded-full bg-neutral-200" />
                             <div className="flex-1 h-4 bg-neutral-200 rounded w-24" />
                             <div className="w-20 h-4 bg-neutral-200 rounded" />
                         </div>
                     ))}
                </div>
                
                <div className="mt-8 text-center p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <p className="text-neutral-500 font-medium mb-4">
                        This could be you. Start trading today to climb the ranks.
                    </p>
                    <a href="/register" className="inline-block px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1">
                        Join the Competition
                    </a>
                </div>
            </div>
        </div>
      </section>
    </PageLayout>
  );
}
