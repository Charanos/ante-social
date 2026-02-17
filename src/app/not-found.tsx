"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconMoodConfuzed, IconHome, IconCards } from "@tabler/icons-react";
import { WaveBackground } from "@/components/landing/WaveBackground";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-neutral-900 text-white overflow-hidden flex flex-col items-center justify-center">
      {/* Background Gradients - Similar to Landing Page */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-orange-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-[500px] bg-red-600/10 blur-[120px] pointer-events-none" />
      
      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           }}
      />

      <WaveBackground variant="top" className="absolute top-0 left-0 right-0 opacity-20" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center px-6 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 mb-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl shadow-orange-500/10">
            <IconMoodConfuzed className="w-12 h-12 text-orange-400" stroke={1.5} />
        </div>

        
        <h2 className="text-2xl md:text-3xl font-medium text-white mb-6">
          Looks like a bad beat...
        </h2>
        
        <p className="text-lg text-white/60 mb-10 leading-relaxed">
          The market you're looking for doesn't exist, has been settled, or maybe the odds just weren't in your favor. 
          Don't worry, there's always another game to play.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/"
            className="group relative inline-flex items-center gap-2 px-8 py-2 bg-white text-black font-semibold rounded-full hover:bg-orange-50 hover:scale-105 transition-all duration-300"
          >
            <IconHome className="w-5 h-5 group-hover:text-orange-600 transition-colors" />
            Return Home
          </Link>
          
          <Link 
            href="/product/game-modes"
            className="group inline-flex items-center gap-2 px-8 py-2 bg-white/10 text-white font-medium rounded-full border border-white/10 hover:bg-white/20 transition-all duration-300"
          >
             <IconCards className="w-5 h-5 text-orange-400 group-hover:text-white transition-colors" />
            Explore Game Modes
          </Link>
        </div>
      </motion.div>

      <WaveBackground variant="bottom" className="absolute bottom-0 left-0 right-0 opacity-20" />
    </div>
  );
}
