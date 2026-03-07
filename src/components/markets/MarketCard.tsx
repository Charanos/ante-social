"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  IconEdit,
  IconTrash,
  IconStar,
  IconSettings,
  IconFlame,
  IconRefresh,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconAccessPoint,
  IconAlertCircle,
  IconArrowRight,
  IconAward,
  IconClipboard,
  IconClock,
  IconCurrencyDollar,
  IconTarget,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import { MarketChart } from "./MarketChart";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { Market } from "@/types/market";
import { useCurrency } from "@/lib/utils/currency";
import { useToast } from "@/hooks/useToast";
import { useLiveUser } from "@/lib/live-data";
import { formatTimeComprehensive } from "@/lib/utils/time";

interface MarketCardProps {
  market: Market;
  index?: number;
  href?: string;
  onDeleted?: (id: string) => void;
}

const formatTimeLeft = (endsAt: string) => {
  const diff = new Date(endsAt).getTime() - new Date().getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h left`;
  return "Ending soon";
};

const getTypeStyles = (type: string) => {
  switch (type.toLowerCase()) {
    case "consensus": return { label: "Consensus", color: "blue", icon: IconClipboard };
    case "reflex":    return { label: "Reflex",    color: "amber",  icon: IconAccessPoint };
    case "ladder":    return { label: "Ladder",    color: "purple", icon: IconAward };
    case "betrayal":
    case "prisoner_dilemma": return { label: "Betrayal", color: "red", icon: IconTarget };
    case "divergence": return { label: "Divergence", color: "indigo", icon: IconTrendingUp };
    case "syndicate":  return { label: "Syndicate",  color: "red",    icon: IconTarget };
    default: return { label: "Market", color: "gray", icon: IconAlertCircle };
  }
};

export function MarketCard({ market, index = 0, href, onDeleted }: MarketCardProps) {
  const router = useRouter();
  const typeInfo = getTypeStyles(market.type);
  const participantsCount = market.participantCount || 0;
  const isExpired = new Date().getTime() > new Date(market.endsAt || Date.now()).getTime();
  const minStake = market.minStake || 0;
  const rawStatus = market.status || "active";
  const status = isExpired && rawStatus === "active" ? "closed" : rawStatus;
  const TypeIcon = typeInfo.icon;
  const { formatCurrency } = useCurrency();
  const toast = useToast();
  const { user } = useLiveUser();
  const isAdmin = user?.role === "admin";

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const typeToSlug: Record<string, string> = {
    poll: "consensus", betrayal: "betrayal", prisoner_dilemma: "betrayal",
    consensus: "consensus", reflex: "reflex", ladder: "ladder",
    divergence: "divergence", syndicate: "betrayal",
  };

  const marketTypeSlug = typeToSlug[market.type.toLowerCase()] || "consensus";
  const linkHref = href || `/dashboard/markets/${market.id}/${marketTypeSlug}`;
  const timeLeft = formatTimeComprehensive(market.endsAt || new Date().toISOString());
  const formattedPool = formatCurrency(market.poolAmount || 0);
  const formattedStake = formatCurrency(minStake);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/markets/${market.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Market Deleted", `"${market.title}" was successfully deleted.`);
      setShowDeleteModal(false);
      onDeleted?.(market.id);
    } catch {
      toast.error("Delete Failed", "Could not delete this market. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="group relative flex flex-col justify-between h-full overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-black/5 hover:border-black/10 hover:bg-white/60 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)] transition-all duration-500"
      >



        <Link href={linkHref} className="block h-full">
          <div className="flex flex-col justify-between h-full">
            {/* Shine */}
            <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent" />

            {/* Image */}
            <div className="relative h-48 top-0 overflow-hidden bg-linear-to-br from-black/5 to-black/10">
              {market.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={market.image} alt={market.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                  <TypeIcon className="w-12 h-12 text-neutral-300" />
                </div>
              )}

              {/* Type Badge */}
              <div className="absolute top-4 left-4 px-3 flex items-center gap-1.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-black/10 shadow-sm">
                <TypeIcon className="w-3 h-3 text-black/80" />
                <span className="text-[10px] font-semibold text-black/70 uppercase tracking-widest">{typeInfo.label}</span>
              </div>

              {/* Time Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-full">
                <IconClock className="w-3 h-3 text-white" />
                <span className="text-[10px] font-semibold font-mono text-white tracking-wider">{timeLeft}</span>
              </div>

              {/* Indicators Badge (Featured, Trending, Recurring) */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                {market.isFeatured && status === "active" && (
                  <div className="px-2 py-1 bg-amber-400/90 backdrop-blur-sm rounded-full border border-amber-400/50 shadow-sm">
                    <IconStar className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                )}
                {market.isTrending && status === "active" && (
                  <div className="px-2 py-1 bg-orange-500/90 backdrop-blur-sm rounded-full border border-orange-400/50 shadow-sm">
                    <IconFlame className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                )}
                {market.isRecurring && (
                  <div className="px-2 py-1 bg-green-500/90 backdrop-blur-sm rounded-full border border-green-400/50 shadow-sm">
                    <IconRefresh className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                {status !== "active" && (
                  <div className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-black/40 shadow-sm">
                    <span className="text-[10px] font-semibold text-white uppercase tracking-widest">{status}</span>
                  </div>
                )}
              </div>

              {/* Admin Controls (Glassmorphism Bottom Right) */}
              {user?.role === 'admin' && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/dashboard/admin/markets/${market.id}/edit`);
                    }}
                    className="p-2 cursor-pointer bg-white/90 hover:bg-white backdrop-blur-sm rounded-full border border-black/10 shadow-lg text-black/70 hover:text-black transition-all"
                    title="Edit Market"
                  >
                    <IconEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowDeleteModal(true);
                    }}
                    className="p-2 cursor-pointer bg-red-500/90 hover:bg-red-500 backdrop-blur-sm rounded-full border border-red-500/20 shadow-lg text-white transition-all"
                    title="Delete Market"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="relative p-4 h-full min-h-[290px] flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black/90 tracking-tight mb-2 line-clamp-1 group-hover:text-black transition-colors">{market.title}</h3>
                <p className="text-sm text-black/80 font-medium line-clamp-2 leading-relaxed">{market.description}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid w-full grid-cols-3 gap-3 border-y py-4 my-1 border-gray-100/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-black/30">
                    <IconCurrencyDollar className="w-3 h-3" />
                    <p className="text-[10px] font-semibold uppercase tracking-wider">Stake</p>
                  </div>
                  <p className="text-xs font-semibold font-mono text-black/80">{formattedStake}</p>
                </div>

                <div className="space-y-1 flex flex-col justify-center">
                  <div className="flex items-center gap-1 text-black/30 mb-1">
                    <IconTrendingUp className="w-3 h-3" />
                    <p className="text-[10px] font-semibold uppercase tracking-wider">Signal {market.signalStrength}%</p>
                  </div>
                  <div className="h-6 w-16">
                    <MarketChart data={market.priceHistory || [50, 50]} height={24} color={market.probability > 50 ? "#10b981" : "#ef4444"} />
                  </div>
                </div>

                <div className="space-y-1 flex flex-col items-center">
                  <div className="flex items-center gap-1 text-black/30">
                    <IconUsers className="w-3 h-3" />
                    <p className="text-[10px] font-semibold uppercase tracking-wider">Active</p>
                  </div>
                  <p className="text-xs font-semibold font-mono text-black/80">{participantsCount}</p>
                </div>
              </div>

              {/* Options Preview Strip */}
              {market.outcomes && market.outcomes.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap py-1">
                  {market.outcomes.slice(0, 5).map((outcome, i) => (
                    <div key={outcome._id || i} className="flex items-center gap-1.5 px-2 py-1 bg-neutral-100/80 rounded-full border border-neutral-200/50 group/opt hover:bg-neutral-200/80 transition-colors">
                      {outcome.mediaUrl && outcome.mediaType !== 'none' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={outcome.mediaUrl}
                          alt={outcome.optionText}
                          className="w-4 h-4 rounded-full object-cover border border-neutral-200 shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : null}
                      <span className="text-[10px] font-semibold text-neutral-700 max-w-[72px] truncate">{outcome.optionText}</span>
                    </div>
                  ))}
                  {market.outcomes.length > 5 && (
                    <span className="text-[10px] font-medium text-neutral-400">+{market.outcomes.length - 5}</span>
                  )}
                </div>
              )}



              {/* CTA Button */}
              <motion.button
                className="mt-1 w-full flex items-center justify-center gap-2 px-6 py-2.5 cursor-pointer bg-black text-white rounded-xl font-semibold tracking-wider text-xs hover:bg-black/90 transition-all shadow-lg shadow-black/5 group/btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                OPEN POSITION
                <IconArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </Link>
      </motion.div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Market"
        message={`Are you sure you want to delete "${market.title}"? This action cannot be undone and all participant data will be affected.`}
        confirmLabel="Delete Market"
        cancelLabel="Keep Market"
        variant="danger"
      />
    </>
  );
}
