"use client";

import { motion } from "framer-motion";
import { IconHeartHandshake, IconUsersGroup, IconTrophy } from '@tabler/icons-react';

export function VisualShowcase() {
  return (
    <section className="relative py-24 md:py-32 px-4 md:px-6 overflow-hidden bg-orange-50/30">
        {/* Abstract African-inspired geometric patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
       
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-24 text-center max-w-3xl mx-auto space-y-4"
        >
         
          <h2 className="text-4xl md:text-6xl font-normal tracking-tight text-black/90 leading-[1.1]">
            Built for the <span className="italic text-orange-600">Culture</span>
          </h2>
          <p className="text-lg md:text-xl text-black/70 leading-relaxed font-normal">
            More than just betting. It's about who you win with. Join a community that celebrates every victory together.
          </p>
        </motion.div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
          
          {/* Item 1: Large Main Image (Left) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-8 md:row-span-2 relative group overflow-hidden rounded-3xl bg-neutral-900 min-h-[400px]"
          >
             <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/80 z-10" />
             {/* Use a reliable Unsplash ID for "Happy African Friends" */}
             <div className="w-full h-full absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
             
             <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <IconHeartHandshake className="w-4 h-4 text-white" />
                    </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-medium mb-2">Win Together</h3>
                <p className="text-white/80 max-w-lg">Share the thrill. Pools are better when shared with friends.</p>
             </div>
          </motion.div>

          {/* Item 2: Top Right */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-3xl bg-neutral-900 min-h-[300px]"
          >
             <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/70 z-10" />
             {/* "Coworking High Five" */}
              <div className="w-full h-full absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
             
             <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
                <h3 className="text-xl font-medium mb-1">Squad Goals</h3>
                <p className="text-white/80 text-sm">Create your own private leagues.</p>
             </div>
          </motion.div>

          {/* Item 3: Bottom Right */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-3xl bg-neutral-900 min-h-[300px]"
          >
             <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/70 z-10" />
             {/* RELIABLE "Woman Nightlife" Image */}
             <div className="w-full h-full absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />

             <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
                <div className="flex items-center gap-2 mb-2">
                    <IconTrophy className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-xl font-medium mb-1">Instant Payouts</h3>
                <p className="text-white/80 text-sm">Validations in seconds, not days.</p>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
