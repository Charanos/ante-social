
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { IconBrandDiscord, IconBrandTwitter, IconUsers, IconMessageCircle, IconArrowRight } from "@tabler/icons-react";

export default function CommunityPage() {
  return (
    <PageLayout>
      <PageHeader
        title="More than just a platform."
        description="Ante Social is a community of predictors, thinkers, and risk-takers. Join the conversation."
      />

      <section className="pb-24 px-6 max-w-6xl mx-auto">
        
        {/* Live Stats Wrapper */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {[
                { label: "Active Members", value: "12,405" },
                { label: "Daily Messages", value: "45K+" },
                { label: "Markets Discussed", value: "850+" },
                { label: "Online Now", value: "1,204", live: true },
            ].map((stat, i) => (
                <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="bg-white border border-neutral-100 p-6 rounded-2xl text-center shadow-sm"
                >
                    <div className="text-2xl md:text-3xl font-medium text-black mb-1 flex items-center justify-center gap-2">
                        {stat.value}
                        {stat.live && <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />}
                    </div>
                    <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Discord Card */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-12 rounded-[3rem] bg-[#5865F2] text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-[#5865F2]/40 transition-all duration-500 cursor-pointer"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://assets-global.website-files.com/6257adef93867e56f84d3092/6259cecf93867e6c384d3444_discord-logo-color.svg')] bg-center opacity-5 bg-no-repeat bg-[length:150%]" />
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity transform group-hover:rotate-12 duration-700">
                    <IconBrandDiscord className="w-48 h-48" />
                </div>
                
                <div className="relative z-10 space-y-8">
                    <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                        <IconBrandDiscord className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-medium mb-4 tracking-tight">Discord</h2>
                        <p className="text-white/80 font-medium text-xl leading-relaxed max-w-md">
                            The heart of our community. Chat with traders, join voice events, and get live support.
                        </p>
                    </div>
                    
                    <div className="space-y-3 pt-4">
                        <div className="flex items-center gap-3 text-white/90 font-medium">
                            <IconUsers className="w-5 h-5 opacity-70" />
                            <span>Exclusive trading signals</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/90 font-medium">
                            <IconMessageCircle className="w-5 h-5 opacity-70" />
                            <span>24/7 Market discussions</span>
                        </div>
                    </div>

                    <div className="pt-6">
                        <a href="https://discord.com" target="_blank" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#5865F2] rounded-full font-medium hover:bg-neutral-100 transition-colors shadow-lg hover:shadow-xl">
                            Join Server <IconArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </motion.div>

            {/* Twitter Card */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-12 rounded-[3rem] bg-black text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-black/40 transition-all duration-500 cursor-pointer"
            >
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity transform group-hover:-rotate-12 duration-700">
                    <IconBrandTwitter className="w-48 h-48" />
                </div>
                
                <div className="relative z-10 space-y-8">
                    <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                        <IconBrandTwitter className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-medium mb-4 tracking-tight">X / Twitter</h2>
                        <p className="text-white/80 font-medium text-xl leading-relaxed max-w-md">
                            Stay ahead of the curve. Breaking news, platform updates, and viral market moments.
                        </p>
                    </div>

                    <div className="space-y-3 pt-4">
                        <div className="flex items-center gap-3 text-white/90 font-medium">
                            <IconUsers className="w-5 h-5 opacity-70" />
                            <span>Flash giveaways & airdrops</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/90 font-medium">
                            <IconMessageCircle className="w-5 h-5 opacity-70" />
                            <span>Viral market polls</span>
                        </div>
                    </div>

                    <div className="pt-6">
                        <a href="https://twitter.com" target="_blank" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-neutral-100 transition-colors shadow-lg hover:shadow-xl">
                            Follow @antesocial <IconArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
