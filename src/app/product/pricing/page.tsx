
"use client";

import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { IconCheck, IconX, IconTrendingUp } from "@tabler/icons-react";

export default function PricingPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Simple, Transparent Pricing."
        description="No hidden fees. No monthly subscriptions. We only win when you play."
      />

      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Traditional Model */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 md:p-16 rounded-[2.5rem] bg-neutral-50 border border-neutral-200/60 opacity-60 hover:opacity-100 transition-opacity duration-500"
          >
            <h3 className="text-lg font-semibold text-neutral-500 uppercase tracking-widest mb-4">Traditional Casinos</h3>
            <div className="text-5xl font-medium text-neutral-400 mb-8 tracking-tighter">House Edge</div>
            <ul className="space-y-6">
              {[
                  "Hidden odds manipulation", 
                  "Betting against the house", 
                  "Opaque fee structures", 
                  "Slow withdrawals"
              ].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-neutral-500 font-medium text-lg">
                    <IconX className="w-6 h-6 text-neutral-400" />
                    <span>{item}</span>
                  </li>
              ))}
            </ul>
          </motion.div>

          {/* Ante Social Model */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 md:p-16 rounded-[2.5rem] bg-black text-white relative overflow-hidden shadow-2xl"
          >
            {/* Ambient Background Effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neutral-800 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32 pointer-events-none" />
            
            <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-neutral-400 uppercase tracking-widest mb-4">Ante Social</h3>
                <div className="flex items-baseline gap-3 mb-10">
                    <span className="text-7xl font-medium tracking-tighter">5%</span>
                    <span className="text-xl text-neutral-400 font-medium">Flat Fee</span>
                </div>
                
                <ul className="space-y-6 flex-1">
                    {[
                        "Fee taken from winning pool only",
                        "No house float - Peer-to-Peer",
                        "Instant automated settlements",
                        "Transparent smart contracts"
                    ].map((item) => (
                        <li key={item} className="flex items-center gap-4 font-medium text-lg">
                            <div className="p-1.5 rounded-full bg-white/10">
                                <IconCheck className="w-4 h-4 text-white" />
                            </div>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-12 pt-12 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-400 font-medium">No deposit fees</p>
                            <p className="text-sm text-neutral-400 font-medium">No withdrawal fees</p>
                        </div>
                        <a href="/register" className="px-8 py-2 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors">
                            Start Betting
                        </a>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
