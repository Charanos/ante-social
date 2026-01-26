"use client";

import { useState, useEffect } from "react";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { VibeMarketCard } from "@/components/dashboard/VibeMarketCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { RefreshCw, DicesIcon, Trophy, X, HelpCircle, ChevronLeft, ChevronRight, Loader2, ScanEye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SpinWheelModal } from "@/components/wheel/SpinWheelModal";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  // Fetch Session for dynamic user info
  const { data: session } = useSession();
  const user = session?.user;

  // UI State
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isReadMeOpen, setIsReadMeOpen] = useState(false);

  // Mock Rank Data (Progress)
  const rank = user?.user_level === "high_roller" ? "High Roller" : "Novice";
  const progress = 75; // Mock percentage
  const nextRank = "High Roller";

  // Mock Live Wins Data (Horizontal)
  const liveWins = [
    { id: 1, name: "CryptoKing", game: "Bitcoin Binary", amount: "$1,250", avatar: "🦁" },
    { id: 2, name: "LuckyStrike", game: "Super Bowl", amount: "$980", avatar: "🦊" },
    { id: 3, name: "VibeCheck", game: "Vibe Poll", amount: "$750", avatar: "🦄" },
    { id: 4, name: "MoonBoy", game: "Solana Pump", amount: "$2,400", avatar: "🚀" },
    { id: 5, name: "RiskTaker", game: "Ladder Bet", amount: "$500", avatar: "🎲" },
  ];

  // State for markets (fetched via useEffect)
  const [markets, setMarkets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Markets logic...
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const res = await fetch("/api/markets?status=active&limit=100");
        const data = await res.json();
        
        if (data.markets) {
            const mapped = data.markets.map((m: any) => ({
                id: m.id,
                title: m.title,
                description: m.description,
                image: m.media_url || "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1000&auto=format&fit=crop", 
                pool: `$${m.total_pool.toLocaleString()}`,
                bets: m.participant_count,
                timeLeft: "24h", 
                tag: m.bet_type === "poll_style" ? "Poll" : "Market"
            }));
            setMarkets(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch markets", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarkets();
  }, []);

  const [activeTab, setActiveTab] = useState("All Markets");
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const getActiveMarkets = () => markets; // Simplified filter
  const activeMarkets = getActiveMarkets();
  const totalPages = Math.ceil(activeMarkets.length / ITEMS_PER_PAGE);
  const currentMarkets = activeMarkets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-10 pb-12 overflow-x-hidden w-full max-w-[100vw]">
      
      {/* 1. Hero / Rank Progress Section */}
      <div className="flex flex-col gap-6">
        
        {/* Header / Pills Row */}
        {/* Custom Dashboard Header */}
        <DashboardHeader user={user} />

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-visible rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-black text-white shadow-2xl p-8 md:p-10 border border-white/10 mb-10"
        >
            {/* Background Accents */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left Info */}
                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
                            Hi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">{user?.username || "High Roller"}</span>
                        </h1>
                        <p className="text-neutral-400 text-lg">Your fortune favors the bold.</p>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="space-y-3 max-w-lg">
                        <div className="flex justify-between text-sm font-medium tracking-wide">
                            <span className="text-amber-400">Current Rank: <span className="text-neutral-300">{rank}</span></span>
                            <span className="text-neutral-500">Next: {nextRank}</span>
                        </div>
                        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                            <motion.div 
                                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-neutral-400">
                            <span>$750 earned</span>
                            <span>Goal: $1,000</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <Button 
                            onClick={() => setIsWheelOpen(true)}
                            className="bg-white/10 cursor-pointer hover:bg-white/20 border border-white/10 text-white backdrop-blur-md rounded-xl px-6 py-2 h-auto text-base font-medium shadow-lg transition-all hover:scale-105"
                        >
                        <DicesIcon className="w-5 h-5 mr-2 text-amber-400" /> Daily Bonus
                        </Button>
                        <Button className="bg-gradient-to-r cursor-pointer from-amber-500 put-yellow-600 to-yellow-500 hover:brightness-110 text-black border-0 rounded-xl px-8 py-2 h-auto text-base font-semibold shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105">
                            Deposit
                        </Button>
                    </div>
                </div>

                {/* Right Illustration (Mascot substitute) - Oversized & Overflowing */}
                <div className="hidden lg:block absolute -right-44 -bottom-80 w-[850px] h-[850px] pointer-events-none z-20 ">
                    <div className="relative w-full h-full flex items-center justify-center animate-game-float">
                        <Image 
                            src="/dashboard-blob.png" 
                            alt="Rank Illustration" 
                            fill
                            className="object-contain drop-shadow-2xl scale-110"
                            priority
                        />
                    </div>
                </div>
            </div>
        </motion.div>
      </div>

      {/* 2. Live Action Feed (Simulated Ticker) */}
      <div className="space-y-8 mb-18">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500 uppercase tracking-widest">
                <ScanEye className="w-4 h-4 text-amber-500" /> Live Feed
           </div>
        </div>

        {/* Glassmorphism Feed Container */}
        <div className="relative w-full bg-white/50 backdrop-blur-md border border-neutral-200 rounded-2xl overflow-hidden py-4">
            <div className="flex gap-8 items-center animate-scroll-left px-4 min-w-max hover:[animation-play-state:paused]">
                {/* Duplicate list for infinite scroll effect logic would ideally be here, 
                    but for now we map the liveWins in a flex row */}
                {[...liveWins, ...liveWins].map((win, idx) => (
                    <div key={`${win.id}-${idx}`} className="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm border border-neutral-100 min-w-[200px] hover:scale-105 transition-transform cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center text-sm">
                            {win.avatar}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-neutral-900">{win.name}</span>
                            <span className="text-[10px] text-neutral-500 font-medium uppercase">{win.game}</span>
                        </div>
                        <div className="ml-auto text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            {win.amount}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Fade Edges */}
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#f8f9fa] to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#f8f9fa] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* 3. Markets Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
             <div className="flex gap-6 border-b border-neutral-200">
                {["All Markets", "Recurring", "One-Time"].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                        className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === tab ? "text-black" : "text-neutral-400 hover:text-neutral-600"}`}
                    >
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full" />}
                    </button>
                ))}
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 rounded-full text-xs" onClick={() => setIsReadMeOpen(true)}>
                    <HelpCircle className="w-3 h-3 mr-1" /> Guide
                </Button>
            </div>
        </div>

        {isLoading ? (
            <div className="flex h-64 items-center justify-center text-neutral-400">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentMarkets.map((market) => (
                    <VibeMarketCard 
                        key={market.id}
                        title={market.title}
                        description={market.description}
                        image={market.image}
                        pool={market.pool}
                        bets={market.bets}
                        timeLeft={market.timeLeft}
                        tag={market.tag}
                    />
                ))}
            </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-4 pt-8">
            <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-neutral-600">
                {currentPage} / {totalPages}
            </span>
            <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
      </div>

      <SpinWheelModal isOpen={isWheelOpen} onClose={() => setIsWheelOpen(false)} />
      
      {/* Read Me Modal implementation remains the same... */}
      <AnimatePresence>
        {isReadMeOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold">How to Play</h3>
                        <button onClick={() => setIsReadMeOpen(false)} className="p-1 hover:bg-neutral-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="prose prose-sm text-neutral-600">
                        <p>Welcome to Ante Social. Rules are simple: majority wins, but smaller groups earn more.</p>
                        <ul>
                            <li>Select a market.</li>
                            <li>Choose an outcome.</li>
                            <li>Wait for settlement.</li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}

