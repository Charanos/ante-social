"use client";

import { motion } from "framer-motion";
import { Coins, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

export function CurrencySection() {
  return (
    <section className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 text-sm font-medium text-black">
              <Wallet className="w-4 h-4" />
              <span>Real Money Betting</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-black leading-[1.1]">
              Bet with real money. <br />
              <span className="text-neutral-400">Win real rewards.</span>
            </h2>
            
            <p className="text-xl text-neutral-600 leading-relaxed max-w-xl font-medium">
              Ante Social is a social casino platform for the Kenyan market featuring real money betting with USD and KSH. 
              Secure deposits via M-Pesa and crypto, with transparent tier-based limits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-100">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-700 uppercase tracking-wider">Novice Tier Deposit</p>
                    <p className="text-lg font-medium text-green-900 numeric">Up to $500/day</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-700 uppercase tracking-wider">High Roller Tier</p>
                    <p className="text-lg font-medium text-blue-900 numeric">Up to $5,000/day</p>
                  </div>
               </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Wallet Dashboard Mockup */}
            <div className="relative z-10 p-8 rounded-3xl bg-white border border-neutral-100 shadow-2xl">
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-medium text-black">Wallet</h3>
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-black" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <p className="text-sm text-neutral-500 font-medium mb-1">Current Balance (USD)</p>
                  <p className="text-3xl font-medium text-black tracking-tight numeric">$1,250.50</p>
                </div>
                <div className="p-6 rounded-2xl bg-green-50/50 border border-green-100/50">
                  <p className="text-sm text-green-600 font-medium mb-1">Total Winnings</p>
                  <p className="text-3xl font-medium text-green-700 tracking-tight numeric">+$980.50</p>
                </div>
              </div>

              <div className="space-y-8">
                <p className="text-sm font-medium text-neutral-900">Recent Transactions</p>
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-50 transition-colors cursor-default">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i === 2 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                        {i === 2 ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">
                          {i === 0 ? "M-Pesa Deposit" : i === 1 ? "Won Bet: 'Best Meme'" : "Bet Entry: 'Risk It All'"}
                        </p>
                        <p className="text-xs text-neutral-500">Today, 10:2{i} AM</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium numeric ${i === 2 ? 'text- red-500' : 'text-green-600'}`}>
                      {i === 2 ? "-$50" : "+$150"}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-50 blur-[80px] rounded-full pointer-events-none opacity-50" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-green-50 blur-[80px] rounded-full pointer-events-none opacity-50" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
