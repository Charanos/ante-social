"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconAward,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconEye,
  IconHelpCircle,
  IconLoader3,
  IconPhoto,
  IconTrendingUp,
  IconX,
  Icon,
  IconEyeDollar,
} from "@tabler/icons-react";

import Image from "next/image";
import Link from "next/link";
import { MarketCard } from "@/components/markets/MarketCard";
import Marquee from "react-fast-marquee";
import LeaderboardSection from "@/components/dashboard/LeaderboardSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { fetchJsonOrNull, useLiveUser, useMarketList } from "@/lib/live-data";
import { useCurrency } from "@/lib/utils/currency";

const LIVE_WIN_EVENT = "ante-social:bet-settled";
const MAX_LIVE_WINS = 20;

type LiveWin = {
  id: string;
  name: string;
  game: string;
  amount: number;
  currency: string;
};

function useLiveWins() {
  const [wins, setWins] = useState<LiveWin[]>([]);

  // Seed with recent settlements from the leaderboard / recent-wins endpoint
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const payload = await fetchJsonOrNull<any>("/api/public/leaderboard?limit=10");
      if (cancelled) return;
      const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
      const seeded: LiveWin[] = items
        .filter((item: any) => item && (item.totalWinnings || item.winnings))
        .slice(0, MAX_LIVE_WINS)
        .map((item: any, idx: number) => ({
          id: String(item._id || item.id || idx),
          name: String(item.username || item.name || "Player"),
          game: String(item.marketTitle || item.game || "Market"),
          amount: Number(item.totalWinnings || item.winnings || 0),
          currency: "KSH", // Base currency for internal tracking
        }));
      if (seeded.length > 0) {
        setWins(seeded);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  // Listen for real-time settlement events from RealtimeBridge
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (!detail) return;
      const win: LiveWin = {
        id: String(detail.positionId || detail.id || Date.now()),
        name: String(detail.username || detail.user || "Player"),
        game: String(detail.marketTitle || detail.title || "Market"),
        amount: Number(detail.payout || detail.amount || 0),
        currency: "KSH", // Base currency for internal tracking
      };
      setWins((prev) => [win, ...prev].slice(0, MAX_LIVE_WINS));
    };
    window.addEventListener(LIVE_WIN_EVENT, handler);
    return () => window.removeEventListener(LIVE_WIN_EVENT, handler);
  }, []);

  return wins;
}

function LiveWinCard({ win }: { win: LiveWin }) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="w-60 shrink-0 px-2">
      <div className="flex items-center gap-3 px-4 py-3 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-black/5 hover:bg-white/80 hover:border-black/10 hover:shadow-md transition-all cursor-pointer group">
        <UserAvatar 
          name={win.name} 
          size="sm" 
          border={false}
          className="group-hover:scale-110 transition-transform"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-semibold text-black/90 truncate">
            {win.name}
          </span>
          <span className="text-xs text-black/50 font-medium truncate">
            {win.game}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-semibold text-green-700">Won</span>
          <span className="text-sm font-semibold font-mono text-green-600">
            {formatCurrency(win.amount)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useLiveUser();
  const { markets, isLoading } = useMarketList();
  const liveWins = useLiveWins();
  const { formatCurrency } = useCurrency();
  const [isReadMeOpen, setIsReadMeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Featured");
  const [currentPage, setCurrentPage] = useState(1);

  const totalWinnings = user?.totalWinnings || 0;
  
  const tierConfig = [
    { id: "novice", name: "Novice", goal: 10000 },
    { id: "prognosticator", name: "Prognosticator", goal: 50000 },
    { id: "expert", name: "Expert", goal: 250000 },
    { id: "oracle", name: "Oracle", goal: 1000000 },
    { id: "whale", name: "Whale", goal: 5000000 },
  ];

  const currentTierId = user?.tier || "novice";
  const currentIndex = tierConfig.findIndex(t => t.id === currentTierId);
  const currentTier = tierConfig[currentIndex === -1 ? 0 : currentIndex];
  const nextTier = tierConfig[currentIndex + 1] || currentTier;
  
  const rank = currentTier.name;
  const nextRank = nextTier.name;
  const goalAmount = nextTier.goal;
  const progress = Math.min(100, Math.max(5, (totalWinnings / goalAmount) * 100));

  const ITEMS_PER_PAGE = 9;

  // Filter markets based on active tab
  const activeMarkets = activeTab === "Recurring"
    ? markets.filter((m) => m.isRecurring)
    : activeTab === "One-Time"
    ? markets.filter((m) => !m.isRecurring)
    : activeTab === "Featured"
    ? markets.filter((m) => m.isFeatured)
    : markets;

  const totalPages = Math.max(1, Math.ceil(activeMarkets.length / ITEMS_PER_PAGE));
  const currentMarkets = activeMarkets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6 md:space-y-10 pb-12 pl-0 md:pl-8 overflow-x-hidden w-full max-w-[100vw]">

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-visible rounded-3xl bg-linear-to-br from-neutral-900 via-neutral-800 to-black text-white shadow-2xl p-6 md:p-10 border border-white/10 mb-6 md:mb-10"
      >
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-6 w-full">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-3xl md:text-5xl font-medium tracking-tight">
                Hi,{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-yellow-500">
                  {user?.username || "Guest"}
                </span>
              </h1>
              <p className="text-neutral-500 text-base md:text-lg">
                fortune favors the bold.
              </p>
            </div>

            <div className="space-y-3 max-w-lg">
              <div className="flex justify-between text-xs md:text-sm font-medium tracking-wide">
                <span className="text-amber-400">
                  Current Rank: <span className="text-neutral-300">{rank}</span>
                </span>
                <span className="text-neutral-600">Next: {nextRank}</span>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                <motion.div
                  className="h-full bg-linear-to-r from-orange-400 to-orange-600 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-neutral-500 font-mono">
                <span>{formatCurrency(totalWinnings)} earned</span>
                <span>Goal: {formatCurrency(goalAmount)}</span>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 pt-2">
              <Link href="/dashboard/profile/achievements" className="flex-1 md:flex-none">
                <motion.button
                  className="w-full md:w-auto bg-white/10 cursor-pointer hover:bg-white/20 border border-white/10 text-white backdrop-blur-md rounded-xl px-4 md:px-6 py-2 text-sm md:text-base font-medium tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconAward className="w-5 h-5 text-amber-400" /> Achievements
                </motion.button>
              </Link>
              <Link href="/dashboard/wallet" className="flex-1 md:flex-none">
                <motion.button
                  className="w-full md:w-auto bg-linear-to-r cursor-pointer from-amber-500 to-yellow-500 hover:brightness-110 text-black border-0 rounded-xl px-4 md:px-8 py-2 text-sm md:text-base font-medium tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Deposit
                </motion.button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute -right-44 -bottom-60 w-[750px] h-[750px] pointer-events-none z-20">
            <div className="relative w-full h-full flex items-center justify-center animate-game-float">
              <Image
                src="/dashboard-blob.png"
                fill
                sizes="(max-width: 1024px) 100vw, 750px"
                alt="Rank Illustration"
                className="object-contain drop-shadow-2xl scale-110"
                priority
              />
            </div>
          </div>
        </div>
      </motion.div>

      {liveWins.length > 0 && (
        <>
          <SectionHeading
            title="Live Wins"
            className="my-16 md:my-18"
            icon={<IconEyeDollar className="w-4 h-4 text-orange-500" />}
          />

          <div className="relative w-full overflow-hidden bg-white/30 backdrop-blur-sm border border-black/5 rounded-2xl py-4 -mx-2 md:mx-0 w-[calc(100%+16px)] md:w-full">
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-linear-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-linear-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

            <Marquee
              gradient={false}
              speed={40}
              pauseOnHover={true}
              autoFill={true}
            >
              {liveWins.map((win, index) => (
                <LiveWinCard key={`${win.id}-${index}`} win={win} />
              ))}
            </Marquee>
          </div>
        </>
      )}

      <LeaderboardSection />

      <SectionHeading
        title="Active Markets"
        className="my-16 md:my-18"
        icon={<IconTrendingUp className="w-4 h-4 text-orange-500" />}
      />

      {/* Markets Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between px-2 gap-4">
          <div className="flex w-full md:w-auto gap-4 md:gap-6 border-b border-black/5 overflow-x-auto no-scrollbar">
            {["Featured", "Recurring", "One-Time"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`pb-3 text-sm cursor-pointer font-semibold transition-all relative whitespace-nowrap ${
                  activeTab === tab
                    ? "text-black/90"
                    : "text-black/40 hover:text-black/80"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          <motion.button
            onClick={() => setIsReadMeOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 cursor-pointer px-4 py-2 bg-white/40 backdrop-blur-sm border border-black/5 rounded-full hover:bg-white/60 hover:border-black/10 transition-all text-sm font-semibold text-black/70"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconHelpCircle className="w-4 h-4" /> Guide
          </motion.button>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <IconLoader3 className="w-8 h-8 animate-spin text-black/40" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMarkets.map((market, index) => (
              <MarketCard key={market.id} market={market} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 pt-8">
          <motion.button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex cursor-pointer items-center justify-center rounded-full bg-white/40 backdrop-blur-sm border border-black/5 hover:bg-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconChevronLeft className="w-4 h-4" />
          </motion.button>

          <span className="text-sm font-semibold font-mono text-black/70">
            {currentPage} / {totalPages}
          </span>

          <motion.button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex cursor-pointer items-center justify-center rounded-full bg-white/40 backdrop-blur-sm border border-black/5 hover:bg-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Guide Modal */}
      <AnimatePresence>
        {isReadMeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsReadMeOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden p-8 border border-black/5"
            >
              <button
                onClick={() => setIsReadMeOpen(false)}
                className="absolute cursor-pointer top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <IconX className="w-5 h-5 text-black" />
              </button>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-black/90 mb-2">
                    How to Play
                  </h3>
                  <p className="text-base text-black/80 font-medium">
                    Welcome to Ante Social. Simple rules, strategic gameplay.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      text: "Browse active markets and choose your game mode",
                    },
                    {step: 2, text: "Select an outcome and place your stake (MP or USDT)"},
                    {
                      step: 3,
                      text: "Wait for market settlement - results are instant",
                    },
                    {
                      step: 4,
                      text: "Winners split the prize pool pro-rata by stake",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold font-mono text-black/70">
                          {item.step}
                        </span>
                      </div>
                      <p className="text-sm text-black/70 font-medium leading-relaxed pt-1">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-black/5">
                  <div className="flex items-start gap-3 p-4 bg-black/5 rounded-2xl">
                    <IconCircleCheckFilled className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-black/90 mb-1">
                        Pro Tip
                      </p>
                      <p className="text-xs text-black/80 font-medium leading-relaxed">
                        Smaller groups often mean higher payouts. Be contrarian,
                        think different, win big.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
