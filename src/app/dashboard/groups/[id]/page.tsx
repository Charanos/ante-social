"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconAccessPoint,
  IconAlertCircle,
  IconArrowRight,
  IconAward,
  IconBell,
  IconCalendar,
  IconCheck,
  IconCircleCheckFilled,
  IconClock,
  IconCopy,
  IconCrown,
  IconCurrencyDollar,
  IconDots,
  IconEye,
  IconInfoCircle,
  IconLoader3,
  IconLogout,
  IconPhoto,
  IconSettings,
  IconShare2,
  IconShield,
  IconStar,
  IconTrendingDown,
  IconTrendingUp,
  IconTrophy,
  IconUser,
  IconUserMinus,
  IconUserPlus,
  IconUsers,
  IconX,
  IconPlus,
  IconTrash,
  IconGhost3,
} from "@tabler/icons-react";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/toast-notification";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import LeaderboardSection from "@/components/dashboard/LeaderboardSection";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { MarketChart } from "@/components/markets/MarketChart";
import {
  fetchJsonOrNull,
  normalizeGroup,
  normalizePositions,
  useLiveUser,
} from "@/lib/live-data";
import { useCurrency } from "@/lib/utils/currency";
import { groupsApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api/client";
import { MarketCreationForm } from "@/components/market/MarketCreationForm";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

// Types
interface GroupMember {
  id: string;
  username: string;
  avatar: string;
  role: string;
  joined: string;
  totalPositions: number;
  totalWinnings: number;
  winRate: number;
}

interface GroupActivity {
  id: string;
  type: string;
  user: string;
  action: string;
  details?: string;
  amount?: string;
  timestamp: string;
  marketId?: string;
  marketTitle?: string;
  outcome?: string;
  status?: string;
  stakeAmount?: number;
  currentValue?: number;
}

interface GroupPosition {
  id: string;
  type: string;
  title: string;
  creator: string;
  pool: string;
  participants: number;
  endsAt: string;
  status: string;
}

interface UnifiedGroup {
  id: string | number;
  name: string;
  description: string;
  category?: string;
  isPublic: boolean;
  memberCount: number;
  activePositionsCount: number;
  createdAt: string | Date;
  creatorId: string;
  image: string;
  admins: string[];
  members?: (string | GroupMember)[];
  activePositions?: GroupPosition[];
  activityFeed?: GroupActivity[];
}

const defaultGroupDetails: UnifiedGroup = {
  id: "",
  name: "Group",
  description: "",
  category: "Community",
  isPublic: true,
  memberCount: 0,
  activePositionsCount: 0,
  createdAt: new Date().toISOString(),
  creatorId: "",
  image: "",
  admins: [],
  members: [],
  activePositions: [],
  activityFeed: [],
};

const ActivityIcon = ({ type }: { type: string }) => {
  const icons = {
    forecastSettled: <IconCircleCheckFilled className="w-4 h-4 text-green-600" />,
    forecastCreated: <IconStar className="w-4 h-4 text-blue-600" />,
    member_joined: <IconUserPlus className="w-4 h-4 text-purple-600" />,
    forecastParticipated: <IconTrendingUp className="w-4 h-4 text-orange-600" />,
    forecastDisputed: <IconAlertCircle className="w-4 h-4 text-red-600" />,
  };
  return (
    icons[type as keyof typeof icons] || (
      <IconAccessPoint className="w-4 h-4 text-black/40" />
    )
  );
};

// NEW FORECAST PLACEMENT COMPONENT (for Featured Markets)
const PlaceForecastSlip = ({
  group,
  activeMarket,
  selectedOption,
  setSelectedOption,
  forecastSuccess,
  setForecastSuccess,
  onForecastPlaced
}: any) => {
  const { user } = useLiveUser();
  const { formatCurrency, symbol, convertAmount, preferredCurrency } = useCurrency();
  const [stakeAmount, setStakeAmount] = useState("");
  const [isSubmittingForecast, setIsSubmittingForecast] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const stakeValuePreferredInput = parseFloat(stakeAmount) || 0;
  const stakeValueKshBase = convertAmount(stakeValuePreferredInput, preferredCurrency, "KSH");
  const platformFeeKsh = stakeValueKshBase * 0.05;
  const totalAmountKsh = stakeValueKshBase + platformFeeKsh;

  const availableOptions = useMemo(() => {
    const rawOptions = Array.isArray(activeMarket?.options) ? activeMarket.options : [];
    const normalized = rawOptions
      .map((option: any, index: number) => {
        const text = typeof option === "string" ? option : option?.optionText || option?.text || "";
        if (!text) return null;
        const total = Number(activeMarket?.totalPool || 0);
        const equalShare = rawOptions.length > 0 ? Math.round(100 / rawOptions.length) : 0;
        const percentage = total > 0 ? equalShare : equalShare;
        return {
          id: `opt${index + 1}`,
          text,
          percentage,
          image:
            "https://images.unsplash.com/photo-1610237736387-991eb8151475?auto=format&fit=crop&q=80&w=400",
        };
      })
      .filter(Boolean);

    if (normalized.length >= 2) return normalized;
    return [
      {
        id: "opt1",
        text: "Option A",
        percentage: 50,
        image: "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=400&auto=format&fit=crop",
      },
      {
        id: "opt2",
        text: "Option B",
        percentage: 50,
        image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&auto=format&fit=crop",
      },
    ];
  }, [activeMarket]);

  const selectedOptionData = availableOptions.find((option: any) => option.id === selectedOption);

  const handlePlaceForecast = useCallback(async () => {
    const stakeValuePreferred = parseFloat(stakeAmount);
    const stakeValueKsh = convertAmount(stakeValuePreferred, preferredCurrency, "KSH");

    if (!selectedOptionData || !stakeAmount || stakeValueKsh < 50 || !activeMarket?.id) return;

    // Check balance
    if (user.balance < stakeValueKsh) {
      toast.error(
        "Insufficient Balance",
        "Please top up your wallet to place this forecast."
      );
      setTimeout(() => {
        router.push("/dashboard/wallet/checkout");
      }, 1000);
      return;
    }

    setIsSubmittingForecast(true);
    try {
      const response = await fetch(`/api/groups/${group.id}/markets/${activeMarket.id}/join`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          selectedOption: selectedOptionData.text,
          amount: stakeValueKsh,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || payload?.error || "Failed to place forecast");
      }

      setForecastSuccess(true);
      toast.success("Forecast Submitted!", "Your group position was created.");

      setTimeout(() => {
        setForecastSuccess(false);
        setStakeAmount("");
        setSelectedOption(null);
        if (onForecastPlaced) {
          onForecastPlaced(payload || {
            id: `${activeMarket.id}-${Date.now()}`,
            marketId: activeMarket.id,
          });
        }
      }, 1200);
    } catch (error: any) {
      toast.error("Error", error?.message || "Failed to place forecast");
    } finally {
      setIsSubmittingForecast(false);
    }
  }, [
    selectedOptionData,
    stakeAmount,
    user.balance,
    toast,
    router,
    activeMarket?.id,
    group.id,
    onForecastPlaced,
    setForecastSuccess,
    setSelectedOption,
  ]);

  return (
    <AnimatePresence mode="wait">
      {forecastSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="h-full rounded-3xl bg-linear-to-br from-green-500 to-green-600 text-white shadow-2xl flex flex-col items-center justify-center text-center space-y-6 p-10"
        >
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <IconCircleCheckFilled className="w-14 h-14" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Forecast Confirmed!</h3>
            <p className="text-sm text-white/90">
              Ticket #GRP-{Math.floor(Math.random() * 10000)} locked
            </p>
          </div>
          <div className="pt-4">
            <p className="text-xs text-white/70">Redirecting...</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="slip"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="overflow-hidden rounded-3xl bg-white shadow-2xl border border-black/5"
        >
          {/* Header */}
          <div className="bg-linear-to-br from-black to-neutral-800 text-white p-6 pb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                  <IconEye className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">
                    Place Forecast
                  </p>
                  <p className="text-sm font-semibold">Live Market</p>
                </div>
              </div>
              <h3 className="text-xl font-semibold leading-relaxed">
                {activeMarket?.title || "Select a market"}
              </h3>
            </div>
          </div>

          {/* Selected Option Card */}
          <div className="relative -mt-6 mx-6 z-20">
            <div className="bg-white border-2 border-black/10 rounded-2xl py-2 px-4 shadow-xl">
              <p className="text-[10px] font-semibold text-black/40 uppercase tracking-widest mb-2">
                Your Selection
              </p>
              {selectedOption ? (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-black">
                      {selectedOptionData?.text || "Selection"}
                    </p>
                    <p className="text-xs text-black/50 mt-1">
                      {selectedOptionData?.percentage || 0}%{" "}
                      consensus
                    </p>
                  </div>
                  <IconCircleCheckFilled className="w-6 h-6 text-green-600" />
                </div>
              ) : (
                <p className="text-base text-black/40 italic flex items-center gap-2">
                  <IconAlertCircle className="w-4 h-4" />
                  No option selected
                </p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-6 space-y-6">
            {/* Stake Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between my-4">
                <label className="text-xs font-semibold text-black/80 uppercase tracking-widest">
                  Stake Amount ({symbol})
                </label>
                <span className="text-xs font-semibold text-black/30">
                  Min: {formatCurrency(50)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-md font-semibold text-black/30">
                  {symbol}
                </span>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e: { target: { value: string } }) =>
                    setStakeAmount(e.target.value)
                  }
                  placeholder="50"
                  min="50"
                  className="w-full pl-16 pr-1 py-2 bg-neutral-50 border-2 border-black/10 rounded-xl font-mono font-semibold text-lg text-black focus:border-black focus:bg-white focus:outline-none transition-all placeholder:text-black/20"
                />
              </div>
              {stakeValueKshBase > 0 && stakeValueKshBase < 50 && (
                <p className="text-xs text-red-600 flex items-center gap-1.5">
                  <IconAlertCircle className="w-3.5 h-3.5" />
                  Minimum stake is {formatCurrency(50)}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-3 pt-4 border-t border-dashed border-black/10">
              <div className="flex justify-between text-sm">
                <span className="text-black/50 font-normal">
                  Platform Fee (5%)
                </span>
                <span className="font-mono font-semibold text-black/70">
                  {formatCurrency(platformFeeKsh)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-linear-to-br from-neutral-50 to-white border border-black/10">
                <span className="text-sm font-semibold text-black/70 uppercase tracking-wide">
                  Total to Pay
                </span>
                <span className="text-lg font-semibold font-mono text-black">
                  {formatCurrency(totalAmountKsh)}
                </span>
              </div>
            </div>

            {/* Group Stats */}
            <div className="space-y-3 pt-4 border-t border-dashed border-black/10">
              <div className="flex justify-between items-center p-4 rounded-xl bg-linear-to-br from-neutral-50 to-white border border-black/10">
                <span className="text-sm font-semibold text-black/70 uppercase tracking-wide">
                  Group Members
                </span>
                <span className="text-lg font-semibold font-mono text-black">
                  {group.memberCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-linear-to-br from-neutral-50 to-white border border-black/10">
                <span className="text-sm font-semibold text-black/70 uppercase tracking-wide">
                  Active Forecasts
                </span>
                <span className="text-lg font-semibold font-mono text-black">
                  {group.activePositionsCount}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={
                !selectedOption ||
                !stakeAmount ||
                stakeValueKshBase < 50 ||
                isSubmittingForecast
              }
              onClick={handlePlaceForecast}
              className={cn(
                "w-full py-3 rounded-xl font-semibold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2",
                !selectedOption || !stakeAmount || stakeValueKshBase < 50
                  ? "bg-black/5 text-black/30 cursor-not-allowed"
                  : "bg-black text-white hover:bg-neutral-900 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer",
              )}
            >
              {isSubmittingForecast ? (
                <>
                  <IconLoader3 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <IconCircleCheckFilled className="w-5 h-5" />
                  Confirm & Submit Forecast
                </>
              )}
            </button>

            {/* Info */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex gap-3">
                <IconInfoCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-blue-900">
                    How it works
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Winners split the pool proportionally. 5% platform fee
                    applies to all forecasts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// EXISTING FORECAST MANAGEMENT COMPONENT (for Activity Feed & Positions Tab)
const ManageForecastSlip = ({
  position,
  onClose,
  onPositionCancelled,
}: {
  position: any;
  onClose: () => void;
  onPositionCancelled?: (positionId: string) => void;
}) => {
  const { formatCurrency } = useCurrency();
  const [isCancelling, setIsCancelling] = useState(false);
  const toast = useToast();

  const positionPlacedAt = new Date(
    position.date || position.timestamp || Date.now(),
  ).getTime();
  const now = Date.now();
  const minutesSincePlacement = (now - positionPlacedAt) / (1000 * 60);
  const isWithinWindow =
    minutesSincePlacement < 5 && position.status === "active";
  const timeRemaining = isWithinWindow
    ? Math.max(0, 5 - Math.floor(minutesSincePlacement))
    : 0;
  const canCancelForecast =
    isWithinWindow && position.source === "market_position";
  const stakeAmount = Number(position.stakeAmount || position.amount || 0);
  const projectedPayout = Number(position.potentialWin || stakeAmount * 1.95);

  const handleCancelForecast = async () => {
    if (!canCancelForecast) return;
    const shouldCancel = confirm(
      "Are you sure you want to cancel this forecast? Your stake will be refunded.",
    );
    if (!shouldCancel) return;

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/markets/my/positions/${position.id}`, {
        method: "DELETE",
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          payload?.message || payload?.error || "Failed to cancel forecast",
        );
      }

      toast.success("Forecast Cancelled", "Funds returned to your wallet");
      onPositionCancelled?.(position.id);
      onClose();
    } catch (error) {
      toast.error(
        "Cancel Failed",
        error instanceof Error ? error.message : "Failed to cancel forecast",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const StatusIcon =
    position.status === "won"
      ? IconTrophy
      : position.status === "lost"
        ? IconX
        : IconClock;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="overflow-hidden rounded-3xl bg-white shadow-2xl border border-black/5"
    >
      <div className="bg-linear-to-br from-neutral-800 to-black text-white p-6 pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
              <StatusIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">
                Position Status
              </p>
              <p className="text-sm font-semibold capitalize">
                {position.status || "Active"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <IconX className="w-4 h-4 text-white/70" />
          </button>
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-semibold leading-relaxed mb-2">
            {position.title}
          </h3>
          <p className="text-xs text-white/50">
            Ticket #{position.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      </div>

      <div className="relative -mt-6 mx-6 z-20">
        <div className="bg-white border-2 border-black/10 rounded-2xl py-2 px-5 shadow-xl">
          <p className="text-[10px] font-semibold text-black/40 uppercase tracking-widest my-2">
            Your Pick
          </p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-black">
              {position.outcome || position.details || "Selection"}
            </p>
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <IconTrendingDown className="w-5 h-5 text-black/40" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pt-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center my-3 justify-between">
            <label className="text-xs font-semibold text-black/80 uppercase tracking-widest">
              Stake Amount
            </label>
            <span className="text-[10px] font-semibold text-black/40 uppercase tracking-wider">
              Fixed at entry
            </span>
          </div>
          <div className="px-5 py-2 rounded-xl bg-linear-to-br from-neutral-50 to-white border border-black/10">
            <p className="text-xl font-mono font-semibold text-black">
              {formatCurrency(stakeAmount)}
            </p>
          </div>
        </div>

        <div className="px-5 py-2 rounded-xl bg-linear-to-br from-green-50 to-white border border-green-200">
          <p className="text-xs font-semibold text-green-800 uppercase tracking-widest mb-2">
            {position.status === "won" ? "Total Won" : "Potential Payout"}
          </p>
          <p className="text-xl font-mono font-semibold text-green-700">
            {formatCurrency(projectedPayout)}
          </p>
        </div>

        {isWithinWindow && (
          <div className="py-2 px-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex gap-3">
              <IconClock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-amber-900">
                  Update Window Active
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  {canCancelForecast
                    ? `You have ${timeRemaining} minute${timeRemaining !== 1 ? "s" : ""} left to cancel this forecast.`
                    : "This position is read-only in this panel."}
                </p>
              </div>
            </div>
          </div>
        )}

        {canCancelForecast && (
          <button
            onClick={handleCancelForecast}
            disabled={isCancelling}
            className="w-full py-2 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-all disabled:opacity-70"
          >
            {isCancelling ? "Cancelling Forecast..." : "Cancel Forecast & Refund"}
          </button>
        )}

        <Link
          href={`/dashboard/markets/${position.marketId || position.id}`}
          className="block w-full py-3 rounded-xl border border-black/10 text-center text-xs font-semibold text-black/80 hover:bg-neutral-50 hover:text-black transition-all uppercase tracking-widest"
        >
          View Market Details &rarr;
        </Link>
      </div>
    </motion.div>
  );
};

export default function GroupPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const groupId = params.id as string;
  const router = useRouter();
  const toast = useToast();
  const { user, isLoading: isUserLoading } = useLiveUser();
  const { formatCurrency } = useCurrency();

  // State
  const [activeTab, setActiveTab] = useState("feed");
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showMemberActions, setShowMemberActions] = useState<string | null>(
    null,
  );
  const [isNotificationsOn, setIsNotificationsOn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // NEW: Separate state for Featured Market trading
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [forecastSuccess, setForecastSuccess] = useState(false);
  const [activeMarket, setActiveMarket] = useState<any>(null);
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [group, setGroup] = useState<UnifiedGroup>({
    ...defaultGroupDetails,
    id: groupId,
  });
  const [groupMarkets, setGroupMarkets] = useState<any[]>([]);
  const [userForecasts, setUserForecasts] = useState<any[]>([]);

  // NEW: State for managing existing positions from Activity/Positions tab
  const [selectedForecastToManage, setSelectedForecastToManage] = useState<any | null>(
    null,
  );
  const [showCreateMarketModal, setShowCreateMarketModal] = useState(false);
  const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false);
  const [isDeletingGroup, setIsDeletingGroup] = useState(false);
  const [isCreatingMarket, setIsCreatingMarket] = useState(false);

  const isPlatformAdmin = user.role === "admin";
  const groupAdmins = Array.isArray(group.admins) ? group.admins : [];
  const isGroupAdmin = group.creatorId === user.id || groupAdmins.includes(user.id);
  const canManageMembers = isPlatformAdmin || isGroupAdmin;

  const [isMember, setIsMember] = useState(false);
  const inviteCodeFromUrl = searchParams?.get("invite") || "";

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const [groupPayload, marketsPayload, positionsPayload] = await Promise.all([
        fetchJsonOrNull<any>(`/api/groups/${groupId}`),
        fetchJsonOrNull<any>(`/api/groups/${groupId}/markets`),
        fetchJsonOrNull<any>("/api/markets/my/positions?limit=200&offset=0"),
      ]);

      if (groupPayload) {
        const normalized = normalizeGroup(groupPayload);
        const memberMatch = normalized.members.some((member) => member.id === user.id);
        setIsMember(memberMatch);
        setGroup({
          id: normalized.id,
          name: normalized.name,
          description: normalized.description,
          category: normalized.category,
          isPublic: normalized.isPublic,
          memberCount: normalized.memberCount,
          activePositionsCount: normalized.activePositionsCount,
          createdAt: normalized.createdAt,
          creatorId: normalized.creatorId,
          image: normalized.image,
          admins: normalized.admins || [],
          members: normalized.members,
          activePositions: [],
          activityFeed: [],
        });
      }

      const rawMarkets = Array.isArray(marketsPayload)
        ? marketsPayload
        : Array.isArray(marketsPayload?.data)
          ? marketsPayload.data
          : [];

      const mappedMarkets = rawMarkets.map((market: any) => ({
        id: market._id || market.id,
        title: market.title || "Untitled Forecast",
        description: market.description || "",
        image:
          market.imageUrl ||
          "https://images.unsplash.com/photo-1610237736387-991eb8151475?auto=format&fit=crop&q=80&w=800",
        type:
          market.marketType === "winner_takes_all"
            ? "winner_takes_all"
            : "odd_one_out",
        totalPool: Number(market.totalPool || 0),
        pool: formatCurrency(Number(market.totalPool || 0)),
        participants: Array.isArray(market.participants)
          ? market.participants.length
          : 0,
        participantsRaw: Array.isArray(market.participants)
          ? market.participants
          : [],
        buyInAmount: Number(market.buyInAmount || 0),
        options: Array.isArray(market.options)
          ? market.options
          : Array.isArray(market.outcomes)
            ? market.outcomes.map((outcome: any) => outcome?.optionText).filter(Boolean)
            : [],
        endsAt: market.createdAt || new Date().toISOString(),
        status: market.status || "active",
        isFeatured: Boolean(market.isFeatured),
        isRecurring: Boolean(market.isRecurring),
      }));
      setGroupMarkets(mappedMarkets);
      setActiveMarket(mappedMarkets[0] || null);
      setGroup((prev) => ({
        ...prev,
        activePositions: mappedMarkets,
        activePositionsCount: mappedMarkets.filter((market: any) => market.status === "active").length || mappedMarkets.length,
      }));

      const normalizedPositions = normalizePositions(positionsPayload)
        .filter((position) =>
          mappedMarkets.some((market: any) => market.id === position.marketId),
        )
        .map((position) => ({
          ...position,
          source: "market_position",
        }));

      const resolveUserId = (value: any) => {
        if (!value) return "";
        if (typeof value === "string") return value;
        if (typeof value === "object") return String(value._id || value.id || "");
        return "";
      };

      const groupParticipantForecasts = mappedMarkets.flatMap((market: any) => {
        return (market.participantsRaw || [])
          .filter((participant: any) => resolveUserId(participant?.userId) === user.id)
          .map((participant: any, index: number) => ({
            id: `${market.id}-${resolveUserId(participant?.userId)}-${index}`,
            marketId: market.id,
            title: market.title,
            outcome: participant?.selectedOption || "Selection",
            stakeAmount: market.buyInAmount || 0,
            currentValue: Number(participant?.payoutAmount || market.buyInAmount || 0),
            status: market.status === "settled" ? "settled" : "active",
            pnl:
              market.status === "settled"
                ? Number(participant?.payoutAmount || 0) - Number(market.buyInAmount || 0)
                : undefined,
            openedAt: participant?.joinedAt || market.endsAt || new Date().toISOString(),
            source: "group_position",
          }));
      });

      const combined = [...groupParticipantForecasts, ...normalizedPositions].filter(
        (forecast, index, allForecasts) =>
          allForecasts.findIndex((item) => item.id === forecast.id) === index,
      );
      setUserForecasts(combined);
      setForecasts(combined);

      const participantActivities: GroupActivity[] = mappedMarkets.flatMap((market: any) =>
        (market.participantsRaw || []).map((participant: any, index: number) => {
          const participantUser =
            participant?.userId && typeof participant.userId === "object"
              ? participant.userId
              : {};
          const participantId =
            resolveUserId(participant?.userId) || `${market.id}-member-${index}`;
          const username =
            String(participantUser?.username || participant?.username || "").trim() ||
            `member_${index + 1}`;
          const settled = String(market.status || "").toLowerCase() === "settled";
          const stakeAmount = Number(market.buyInAmount || 0);
          const currentValue = Number(participant?.payoutAmount || stakeAmount || 0);
          return {
            id: `${market.id}-${participantId}-${settled ? "settled" : "joined"}`,
            type: settled ? "forecastSettled" : "forecastParticipated",
            user: username,
            action: settled ? "settled a forecast in" : "joined a forecast in",
            details: market.title,
            amount: formatCurrency(settled ? currentValue : stakeAmount),
            timestamp: String(
              participant?.joinedAt ||
                participant?.createdAt ||
                market.endsAt ||
                new Date().toISOString(),
            ),
            marketId: String(market.id),
            marketTitle: market.title,
            outcome: String(participant?.selectedOption || ""),
            status: settled ? "settled" : "active",
            stakeAmount,
            currentValue,
          };
        }),
      );

      const personalActivities: GroupActivity[] = normalizedPositions.map((position) => ({
        id: `position-${position.id}`,
        type: position.status === "settled" ? "forecastSettled" : "forecastParticipated",
        user: user.username || "You",
        action:
          position.status === "settled"
            ? "settled a personal forecast in"
            : "placed a personal forecast in",
        details: position.title,
        amount: formatCurrency(Number(position.stakeAmount || 0)),
        timestamp: String(position.openedAt || new Date().toISOString()),
        marketId: String(position.marketId || ""),
        marketTitle: position.title,
        outcome: position.outcome,
        status: position.status,
        stakeAmount: Number(position.stakeAmount || 0),
        currentValue: Number(position.currentValue || 0),
      }));

      const activityFeed = [...participantActivities, ...personalActivities]
        .filter((activity, index, allActivities) => {
          return (
            allActivities.findIndex((item) => item.id === activity.id) === index
          );
        })
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .slice(0, 50);

      setGroup((prev) => ({
        ...prev,
        activityFeed,
      }));
      setIsLoading(false);
    };
    void load();
  }, [groupId, user.id, user.username]);

  const leaderboard = useMemo(() => {
    const members = (group.members || [])
      .filter((m): m is GroupMember => typeof m !== "string")
      .sort((a, b) => b.totalWinnings - a.totalWinnings)
      .slice(0, 5);
    return members;
  }, [group.members]);

  const timeUntil = useCallback((date: string) => {
    const now = new Date();
    const target = new Date(date);
    const diff = target.getTime() - now.getTime();
    if (diff < 0) return "Ended";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  }, []);

  const timeAgo = useCallback((date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }, []);

  const activeMarketOptions = useMemo(() => {
    const rawOptions = Array.isArray(activeMarket?.options) ? activeMarket.options : [];
    const normalized = rawOptions
      .map((option: any, index: number) => {
        const text = typeof option === "string" ? option : option?.optionText || option?.text || "";
        if (!text) return null;
        return {
          id: `opt${index + 1}`,
          text,
          percentage: rawOptions.length > 0 ? Math.round(100 / rawOptions.length) : 0,
          image:
            "https://images.unsplash.com/photo-1610237736387-991eb8151475?auto=format&fit=crop&q=80&w=400",
        };
      })
      .filter(Boolean);

    return normalized;
  }, [activeMarket]);

  // Handlers
  const handleToggleNotifications = useCallback(() => {
    setIsActionLoading(true);
    const newState = !isNotificationsOn;
    try {
      setIsNotificationsOn(newState);
      setShowSettingsMenu(false);
      toast.success(
        newState ? "Notifications Enabled" : "Notifications Muted",
        newState
          ? "You'll stay updated on all group activity."
          : "You won't receive updates for this group.",
      );
    } catch (error) {
      toast.error("Error", "Failed to update notification settings");
    } finally {
      setIsActionLoading(false);
    }
  }, [isNotificationsOn, toast]);

  const handleJoinGroup = useCallback(async () => {
    setIsJoining(true);
    try {
      await groupsApi.joinWithInvite(groupId, inviteCodeFromUrl || undefined);
      setIsMember(true);
      toast.success("Joined Group Successfully", `Welcome to ${group.name}!`);
    } catch (error) {
      toast.error("Error", getApiErrorMessage(error, "Failed to join group"));
    } finally {
      setIsJoining(false);
    }
  }, [groupId, inviteCodeFromUrl, group.name, toast]);

  const handleLeaveGroup = useCallback(async () => {
    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/leave`, {
        method: "POST",
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || payload?.error || "Failed to leave group");
      }
      setIsMember(false);
      setShowSettingsMenu(false);
      toast.info("Group Left", "You are no longer a member of this group.");
      router.push("/dashboard/groups");
    } catch (error) {
      toast.error("Error", "Failed to leave group");
    } finally {
      setIsActionLoading(false);
    }
  }, [groupId, toast, router]);

  const handleInvite = useCallback(async () => {
    let url = `${window.location.origin}/dashboard/groups/${group.id}`;
    try {
      const payload = await groupsApi.invite(String(group.id));
      const invitePath = String((payload as { invitePath?: string }).invitePath || "");
      if (invitePath) {
        url = `${window.location.origin}${invitePath}`;
      }
    } catch (error) {
      toast.error("Invite Error", getApiErrorMessage(error, "Could not generate invite link."));
      return;
    }

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `Join ${group.name} on Ante Social`,
          text: `Check out this group: ${group.description}`,
          url: url,
        });
        toast.success("Shared Successfully", "Invitation sent!");
      } catch (error) {
        navigator.clipboard.writeText(url);
        toast.success("Link Copied", "Share this group with your friends!");
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link Copied", "Share this group with your friends!");
    }
  }, [group, toast]);

  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      setIsActionLoading(true);
      try {
        const response = await fetch(`/api/groups/${groupId}/members/${memberId}/remove`, {
          method: "POST",
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(payload?.message || payload?.error || "Failed to remove member");
        }

        setGroup((prev) => ({
          ...prev,
          members: (prev.members || []).filter((memberItem) => {
            if (typeof memberItem === "string") return memberItem !== memberId;
            return memberItem.id !== memberId;
          }),
          memberCount: Math.max(0, prev.memberCount - 1),
        }));
        setShowMemberActions(null);
        toast.success("Member Removed", "User has been removed from the group");
      } catch (error: any) {
        toast.error("Error", error?.message || "Failed to remove member");
      } finally {
        setIsActionLoading(false);
      }
    },
    [groupId, toast],
  );

  const handlePromoteMember = useCallback(
    async (memberId: string) => {
      setIsActionLoading(true);
      try {
        const response = await fetch(`/api/groups/${groupId}/members/${memberId}/role`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ role: "admin" }),
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(payload?.message || payload?.error || "Failed to promote member");
        }

        setGroup((prev) => ({
          ...prev,
          members: (prev.members || []).map((memberItem) => {
            if (typeof memberItem === "string") return memberItem;
            if (memberItem.id === memberId) return { ...memberItem, role: "admin" };
            return memberItem;
          }),
        }));
        setShowMemberActions(null);
        toast.success("Member Promoted", "User is now a group admin");
      } catch (error: any) {
        toast.error("Error", error?.message || "Failed to promote member");
      } finally {
        setIsActionLoading(false);
      }
    },
    [groupId, toast],
  );

  const handleDemoteMember = useCallback(
    async (memberId: string) => {
      setIsActionLoading(true);
      try {
        const response = await fetch(`/api/groups/${groupId}/members/${memberId}/role`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ role: "member" }),
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(payload?.message || payload?.error || "Failed to demote member");
        }

        setGroup((prev) => ({
          ...prev,
          members: (prev.members || []).map((memberItem) => {
            if (typeof memberItem === "string") return memberItem;
            if (memberItem.id === memberId) return { ...memberItem, role: "member" };
            return memberItem;
          }),
        }));
        setShowMemberActions(null);
        toast.success("Member Demoted", "User is now a regular member");
      } catch (error: any) {
        toast.error("Error", error?.message || "Failed to demote member");
      } finally {
        setIsActionLoading(false);
      }
    },
    [groupId, toast],
  );

  const handleDeleteGroup = async () => {
    setIsDeletingGroup(true);
    try {
      await fetch(`/api/groups/${groupId}`, { method: "DELETE" });
      toast.success("Group Deleted", "The group and all its data have been removed.");
      router.push("/dashboard/groups");
    } catch (error) {
      toast.error("Error", "Failed to delete group");
    } finally {
      setIsDeletingGroup(false);
      setShowDeleteGroupConfirm(false);
    }
  };

  const handleCreateMarketSubmit = async (data: any) => {
    setIsCreatingMarket(true);
    try {
      const payload = {
        ...data,
        groupId,
        isGroupMarket: true,
      };
      const response = await fetch(`/api/groups/${groupId}/markets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to create market");
      toast.success("Market Created", "Your new group market is live!");
      setShowCreateMarketModal(false);
      // Refresh markets
      const marketsPayload = await fetchJsonOrNull<any>(`/api/groups/${groupId}/markets`);
      if (marketsPayload) setGroupMarkets(marketsPayload);
    } catch (error) {
      toast.error("Error", "Failed to create group market");
    } finally {
      setIsCreatingMarket(false);
    }
  };

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (tabId === activeTab) return;
      setActiveTab(tabId);
      setIsTabLoading(true);
      // Close any open forecast management panel when switching tabs
      setSelectedForecastToManage(null);
      setTimeout(() => setIsTabLoading(false), 500);
    },
    [activeTab],
  );

  if (isUserLoading || isLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  return (
    <div className="space-y-10 pb-20 pl-0 md:pl-8 w-full px-2">
      {/* Group Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl">
        {group.image && (
          <div className="absolute inset-0">
            <Image
              src={group.image}
              alt={group.name}
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-neutral-900 via-neutral-900/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 p-5 md:p-10 space-y-6 md:space-y-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-medium text-white">
                      {group.name}
                    </h1>
                    {!group.isPublic && (
                      <IconShield className="w-5 h-5 text-white/50" />
                    )}
                  </div>
                  <p className="text-base text-white/70 font-normal max-w-2xl my-3 leading-relaxed">
                    {group.description}
                  </p>
                </div>

                <div className="flex items-center gap-8 flex-wrap w-full">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-white/90 uppercase tracking-wider">
                    {group.category}
                  </span>
                  <span className="text-sm text-white/50 font-normal flex items-center gap-1.5">
                    <IconCalendar className="w-3.5 h-3.5" />
                    Created{" "}
                    {group.createdAt
                      ? new Date(group.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </span>
                  {isMember && (
                    <span className="text-sm text-green-400 font-normal flex items-center gap-1.5">
                      <IconCircleCheckFilled className="w-3.5 h-3.5" />
                      Member
                    </span>
                  )}
                  {isMember && (
                    <button
                      onClick={handleInvite}
                      className="text-sm text-orange-500/80 hover:text-orange-500 font-normal flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <IconShare2 className="w-3.5 h-3.5" />
                      Invite
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AnimatePresence mode="wait">
                {!isMember && (
                  <motion.button
                    key="join-button"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={handleJoinGroup}
                    disabled={isJoining}
                    className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold uppercase tracking-wider text-[10px] hover:bg-neutral-100 transition-all shadow-lg cursor-pointer flex items-center gap-2 disabled:opacity-70"
                  >
                    {isJoining ? (
                      <IconLoader3 className="w-3 h-3 animate-spin" />
                    ) : (
                      <IconUserPlus className="w-3 h-3" />
                    )}
                    {isJoining ? "Joining..." : "Join Group"}
                  </motion.button>
                )}
              </AnimatePresence>

              <div className="relative">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer backdrop-blur-sm border border-white/10"
                >
                  <IconDots className="w-5 h-5 text-white/80" />
                </button>

                <AnimatePresence>
                  {showSettingsMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 right-0 w-56 bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      <button
                        onClick={handleToggleNotifications}
                        disabled={isActionLoading}
                        className="w-full px-4 py-3 text-left text-sm font-normal text-black/70 hover:bg-black/5 transition-colors flex items-center gap-3 cursor-pointer disabled:opacity-50"
                      >
                        {isActionLoading ? (
                          <IconLoader3 className="w-4 h-4 animate-spin" />
                        ) : isNotificationsOn ? (
                          <IconBell className="w-4 h-4" />
                        ) : (
                          <IconBell className="w-4 h-4" />
                        )}
                        {isActionLoading
                          ? "Updating..."
                          : isNotificationsOn
                            ? "Mute Notifications"
                            : "Enable Notifications"}
                      </button>

                      {(isPlatformAdmin || isGroupAdmin) && (
                        <Link href={`/dashboard/groups/${groupId}/settings`}>
                          <button className="w-full px-4 py-3 text-left text-sm font-normal text-black/70 hover:bg-black/5 transition-colors flex items-center gap-3 cursor-pointer border-t border-black/5">
                            <IconSettings className="w-4 h-4" />
                            Group Settings
                          </button>
                        </Link>
                      )}

                      <button
                        onClick={handleLeaveGroup}
                        disabled={isActionLoading}
                        className="w-full px-4 py-3 text-left text-sm font-normal text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 cursor-pointer border-t border-black/5 disabled:opacity-50"
                      >
                        {isActionLoading ? (
                          <IconLoader3 className="w-4 h-4 animate-spin" />
                        ) : (
                          <IconLogout className="w-4 h-4" />
                        )}
                        {isActionLoading ? "Leaving..." : "Leave Group"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div className="space-y-1">
              <p className="text-sm font-normal text-white/50">Members</p>
              <p className="text-2xl font-medium text-white font-mono">
                {group.memberCount.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-white/50">Active Forecasts</p>
              <p className="text-2xl font-medium text-green-400 font-mono">
                {group.activePositionsCount}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-white/50">Total Pool</p>
              <p className="text-2xl font-medium text-white font-mono">
                {formatCurrency(93200)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions Bar */}
      {(isPlatformAdmin || isGroupAdmin) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-black/5 shadow-sm"
        >
          <div className="flex items-center gap-2 px-3 border-r border-black/5 mr-2">
            <IconShield className="w-5 h-5 text-black/40" />
            <span className="text-sm font-semibold text-black/70">Admin Controls</span>
          </div>
          <div className="flex items-center gap-3 flex-1">
            <Link href={`/dashboard/groups/${groupId}/settings`}>
              <button className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-black/70 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer">
                <IconSettings className="w-4 h-4" />
                Edit Settings
              </button>
            </Link>
            <button
              onClick={() => setShowCreateMarketModal(true)}
              className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-neutral-900 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <IconPlus className="w-4 h-4" />
              Create Market
            </button>
          </div>
          <button
            onClick={() => setShowDeleteGroupConfirm(true)}
            className="px-4 py-2 rounded-xl border border-red-100 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <IconTrash className="w-4 h-4" />
            Delete Group
          </button>
        </motion.div>
      )}

      {/* Market Creation Modal */}
      <AnimatePresence>
        {showCreateMarketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCreateMarketModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-black/5">
                      <IconTrendingUp className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-black">Create Group Market</h2>
                      <p className="text-sm text-black/40">Launch a new prediction for your members</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCreateMarketModal(false)}
                    className="p-2 hover:bg-black/5 rounded-full transition-all"
                  >
                    <IconX className="w-6 h-6 text-black/40" />
                  </button>
                </div>

                <MarketCreationForm
                  onSubmit={handleCreateMarketSubmit}
                  isSubmitting={isCreatingMarket}
                  onCancel={() => setShowCreateMarketModal(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={showDeleteGroupConfirm}
        onClose={() => setShowDeleteGroupConfirm(false)}
        onConfirm={handleDeleteGroup}
        isLoading={isDeletingGroup}
        title="Delete Group?"
        message="This action cannot be undone. All markets, members, and data will be permanently removed."
        confirmLabel="Yes, Delete Forever"
        cancelLabel="Cancel"
        variant="danger"
      />

      {/* Featured Market Trading Section */}
      {isMember && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <SectionHeading
              title="Featured Market"
              className="my-10 md:my-16"
              icon={<IconTrendingUp className="w-4 h-4 text-green-500" />}
            />
            {group.activePositions && group.activePositions.length > 1 && (
              <Link
                href={`/dashboard/groups/${group.id}/markets`}
                className="text-sm font-medium text-black/40 hover:text-black/80 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Browse All <IconArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {group.activePositions && group.activePositions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Market Display */}
            <div className="lg:col-span-8">
              <div className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/50 opacity-60" />

                <div className="py-8 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {activeMarket?.isFeatured ? (
                          <div className="px-2.5 py-1.5 rounded-full bg-amber-400 border border-amber-500 shadow-sm">
                             <IconStar className="w-4 h-4 text-white fill-white" />
                          </div>
                        ) : (
                          <div className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                              <IconAccessPoint className="w-3 h-3" />
                              Active Market
                            </span>
                          </div>
                        )}
                        <div className="px-2.5 py-1 rounded-full bg-black/5 border border-black/10">
                          <span className="text-[10px] font-semibold text-black/40 uppercase tracking-widest flex items-center gap-1.5">
                            <IconClock className="w-3 h-3" />
                            {group.activePositions && group.activePositions[0]
                              ? timeUntil(group.activePositions[0].endsAt)
                              : "2h 15m"}{" "}
                            left
                          </span>
                        </div>
                        <div className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                          <span className="text-[10px] font-semibold text-green-700 uppercase tracking-widest flex items-center gap-1.5">
                            <IconCurrencyDollar className="w-3 h-3" />
                            Min: {formatCurrency(50)}
                          </span>
                        </div>
                      </div>
                      <h2 className="text-2xl my-3 mt-6 font-semibold text-black tracking-tight leading-relaxed">
                        {group.activePositions && group.activePositions[0]
                          ? group.activePositions[0].title
                          : "Who wins Man United vs Liverpool?"}
                      </h2>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">
                        Total Pool
                      </p>
                      <p className="text-xl font-semibold font-mono text-black">
                        {group.activePositions && group.activePositions[0]
                          ? formatCurrency(Number((group.activePositions[0] as any).totalPool || 0))
                          : formatCurrency(45600)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 gap-4">
                      {activeMarketOptions.map((option: any, index: number) => {
                        const isSelected = selectedOption === option.id;

                        return (
                          <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => {
                              setSelectedOption(option.id);
                              setForecastSuccess(false);
                            }}
                            className={cn(
                              "relative p-4 rounded-xl border transition-all overflow-hidden text-left flex items-center justify-between group cursor-pointer",
                              isSelected
                                ? "bg-black text-white border-black shadow-lg"
                                : "bg-white border-black/5 hover:border-black/10",
                            )}
                          >
                            <div className="relative z-10 flex items-center gap-4 flex-1">
                               <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden relative">
                                  <Image src={option.image} alt={option.text} fill className="object-cover" />
                               </div>
                               <div>
                                  <p className={cn("text-[9px] font-semibold uppercase tracking-widest mb-1", isSelected ? "text-white/40" : "text-black/30")}>
                                    {option.percentage}% signal
                                  </p>
                                  <p className={cn("font-semibold text-sm", isSelected ? "text-white" : "text-black")}>
                                    {option.text}
                                  </p>
                               </div>
                            </div>

                            <div className="text-right shrink-0">
                               <p className={cn("text-xs font-medium font-mono", isSelected ? "text-white/80" : "text-black/60")}>
                                 {option.percentage}%
                               </p>
                            </div>

                            {isSelected && (
                              <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent pointer-events-none" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="p-6 rounded-2xl bg-black/5 border border-black/5 space-y-4">
                       <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-medium text-black/40 uppercase tracking-widest">Market Performance</p>
                            <p className="text-xs text-black/20 font-semibold">Historical Consensus movement</p>
                          </div>
                          <p className="text-xs font-medium text-green-600">+12% Confidence</p>
                       </div>
                       <MarketChart 
                          data={[40, 42, 45, 48, 52, 58, 62, 65]} 
                           height={275}
                          color="#000" 
                          showAxes 
                       />
                    </div>
                  </div>
              </div>
            </div>
            </div>
            <div className="lg:col-span-4 sticky top-24 self-start">
              <PlaceForecastSlip
                group={group}
                activeMarket={activeMarket}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                forecastSuccess={forecastSuccess}
                setForecastSuccess={setForecastSuccess}
                onForecastPlaced={(_newForecast: any) => {
                  toast.success("Position confirmed!");
                  setActiveTab("forecasts");
                }}
              />
            </div>
          </div>
          ) : (
          <div className="flex flex-col items-center justify-center py-24 px-6 bg-white/30 backdrop-blur-sm border border-black/5 rounded-3xl text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 rotate-3">
              <IconGhost3 className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-black/90 mb-2">No Markets Available</h3>
            <p className="text-sm text-black/60 max-w-sm mx-auto">
              There are currently no active markets. Check back later or create one below!
            </p>
          </div>
          )}
        </motion.div>
      )}

      {/* Leaderboard Section */}
      {isMember && leaderboard.length > 0 && (
        <LeaderboardSection
          title="Group Leaderboard"
          icon={<IconAward className="w-4 h-4 text-amber-500" />}
          data={leaderboard.map((member, index) => ({
            rank: index + 1,
            username: member.username,
            avatarUrl: member.id.startsWith('user_00') ? `https://i.pravatar.cc/150?u=${member.username}` : null,
            totalWinnings: member.totalWinnings,
            winRate: member.winRate,
            activePositions: member.totalPositions,
            trend: "same",
          }))}
        />
      )}

      {isMember ? (
        <>
          <SectionHeading title="Group Activity" className="my-12 md:my-18" />

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-black/5">
            {[
              {
                id: "feed",
                label: "Activity Feed",
                icon: IconAccessPoint,
                count: null,
              },
              {
                id: "forecasts",
                label: "Active Forecasts",
                icon: IconAward,
                count: userForecasts.length,
              },
              {
                id: "members",
                label: "Members",
                icon: IconUsers,
                count: group.memberCount,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "pb-4 px-2 text-sm font-medium transition-all relative flex items-center gap-2 cursor-pointer",
                  activeTab === tab.id
                    ? "text-black/90"
                    : "text-black/40 hover:text-black/80",
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== null && tab.count !== undefined && (
                  <span className="ml-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-black/5 text-black/40">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeGroupTab"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "feed" && (
              <motion.div
                key="feed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Activity List */}
                <div className="lg:col-span-8 space-y-4">
                  {isTabLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-2xl bg-white/40 border border-black/5 space-y-3"
                      >
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-3 w-1/4" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      {(group.activityFeed || []).length === 0 ? (
                        <div className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 text-center">
                          <p className="text-sm font-medium text-black/60">No activity yet.</p>
                          <p className="text-xs text-black/40 mt-1">
                            Group activity appears here as members place and settle forecasts.
                          </p>
                        </div>
                      ) : null}
                      {group.activityFeed?.map(
                        (activity: GroupActivity, index: number) => (
                          <motion.div
                            key={`${activity.id}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              // If it's a forecast-related activity, show management slip
                              if (activity.type.includes("forecast")) {
                                setSelectedForecastToManage({
                                  id: activity.id.replace(/^position-/, ""),
                                  title:
                                    activity.marketTitle ||
                                    activity.details ||
                                    activity.action,
                                  amount:
                                    Number(activity.stakeAmount || 0) ||
                                    parseInt(
                                      activity.amount?.replace(/[^\d]/g, "") || "0",
                                    ),
                                  potentialWin:
                                    Number(activity.currentValue || 0) ||
                                    Number(activity.stakeAmount || 0) * 1.95,
                                  status:
                                    activity.status ||
                                    (activity.type === "forecastSettled"
                                      ? "settled"
                                      : "active"),
                                  outcome: activity.outcome || activity.details || "Unknown",
                                  date: activity.timestamp,
                                  marketId: activity.marketId || "",
                                  source: "group_position",
                                });
                              }
                            }}
                            className="p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white hover:border-black/10 transition-all cursor-pointer"
                          >

                            <div className="flex items-start gap-4">
                              <UserAvatar 
                                name={activity.user} 
                                size="md" 
                                border={false}
                                className="shrink-0"
                              />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <p className="text-sm font-normal text-black/90">
                                      <span className="font-medium">
                                        {activity.user}
                                      </span>{" "}
                                      {activity.action}
                                      {activity.details && (
                                        <span className="text-black/80">
                                          {" "}
                                          {activity.details}
                                        </span>
                                      )}
                                    </p>
                                    {activity.amount && (
                                      <p className="text-xs font-mono font-medium text-green-600 mt-1">
                                        {activity.amount}
                                      </p>
                                    )}
                                  </div>
                                  <span className="text-xs text-black/40 font-normal shrink-0">
                                    {timeAgo(activity.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ),
                      )}
                      {(group.activityFeed || []).length > 0 ? (
                        <p className="text-center text-sm text-black/30 font-normal py-4">
                          End of activity
                        </p>
                      ) : null}
                    </>
                  )}
                </div>

                {/* Manage Forecast Slip Sidebar - ONLY SHOWS WHEN FORECAST IS SELECTED */}
                <div className="lg:col-span-4">
                  <AnimatePresence mode="wait">
                    {selectedForecastToManage ? (
                      <ManageForecastSlip
                        position={selectedForecastToManage}
                        onClose={() => setSelectedForecastToManage(null)}
                        onPositionCancelled={(positionId) => {
                          setUserForecasts((prev) =>
                            prev.filter((item: any) => item.id !== positionId),
                          );
                          setForecasts((prev) =>
                            prev.filter((item: any) => item.id !== positionId),
                          );
                          setSelectedForecastToManage(null);
                        }}
                      />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-8 rounded-3xl bg-linear-to-br from-neutral-50 to-white border border-black/5 text-center space-y-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto">
                          <IconAccessPoint className="w-8 h-8 text-black/20" />
                        </div>
                        <div>
                          <p className="font-medium text-black/80 mb-2">
                            Select a Forecast
                          </p>
                          <p className="text-sm text-black/40 leading-relaxed">
                            Click on any activity to view details and manage
                            your position
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === "forecasts" && (
              <motion.div
                key="forecasts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                 {/* Forecast List */}
                 <div className="lg:col-span-8 space-y-4">
                    {userForecasts.map((forecast, index) => {
                      const market = groupMarkets.find((m) => m.id === forecast.marketId);
                      const isWon = forecast.status === 'settled' && (forecast.pnl || 0) > 0;
                      const isLost = forecast.status === 'settled' && (forecast.pnl || 0) <= 0;
                      
                      return (
                      <motion.div
                        key={forecast.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedForecastToManage(forecast)}
                        className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white hover:border-black/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                              isWon
                                ? "bg-green-100 text-green-600"
                                : isLost
                                  ? "bg-red-100 text-red-600"
                                  : "bg-blue-100 text-blue-600",
                            )}
                          >
                            {isWon ? (
                              <IconCircleCheckFilled className="w-5 h-5" />
                            ) : isLost ? (
                              <IconX className="w-5 h-5" />
                            ) : (
                              <IconTrendingUp className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-black/90">{market?.title || "Unknown Market"}</h4>
                            <div className="flex items-center gap-3 mt-1 text-sm text-black/50 font-normal">
                              <span>Opened {new Date(forecast.openedAt).toLocaleDateString()}</span>
                              <span className="text-black/70">
                                Pick: {forecast.outcome}
                              </span>
                            </div>
                          </div>
                        </div>
  
                        <div className="flex items-center gap-6 md:text-right w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-black/5">
                          <div>
                            <p className="text-xs uppercase tracking-wider font-semibold text-black/30">
                              Stake
                            </p>
                            <p className="font-mono font-medium">{formatCurrency(forecast.stakeAmount)}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider font-semibold text-black/30">
                              Value
                            </p>
                            <p
                              className={cn(
                                "font-mono font-semibold",
                                isWon
                                  ? "text-green-600"
                                  : "text-black/90",
                              )}
                            >
                               {forecast.status === 'active' ? formatCurrency(forecast.currentValue) : (isWon ? `+${formatCurrency(forecast.pnl)}` : `-${formatCurrency(forecast.stakeAmount)}`)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                      );
                    })}
                 </div>

                {/* Manage Forecast Slip Sidebar */}
                <div className="lg:col-span-4">
                  <AnimatePresence mode="wait">
                    {selectedForecastToManage ? (
                      <ManageForecastSlip
                        position={selectedForecastToManage}
                        onClose={() => setSelectedForecastToManage(null)}
                        onPositionCancelled={(positionId) => {
                          setUserForecasts((prev) =>
                            prev.filter((item: any) => item.id !== positionId),
                          );
                          setForecasts((prev) =>
                            prev.filter((item: any) => item.id !== positionId),
                          );
                          setSelectedForecastToManage(null);
                        }}
                      />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-8 rounded-3xl bg-linear-to-br from-neutral-50 to-white border border-black/5 text-center space-y-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto">
                          <IconAward className="w-8 h-8 text-black/20" />
                        </div>
                        <div>
                          <p className="font-medium text-black/80 mb-2">
                            Select a Forecast
                          </p>
                          <p className="text-sm text-black/40 leading-relaxed">
                            Click on any forecast to view details and manage cancellation
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === "members" && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  {isTabLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="p-5 rounded-2xl bg-white/40 border border-black/5 space-y-3"
                        >
                          <div className="flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-1/3" />
                              <Skeleton className="h-3 w-1/4" />
                            </div>
                          </div>
                        </div>
                      ))
                    : group.members?.map((memberItem, index) => {
                        const member =
                          typeof memberItem === "string"
                            ? ({
                                id: memberItem,
                                username: memberItem,
                                avatar: "U",
                                role: "member",
                                joined: (group.createdAt as any)?.toString() || new Date().toISOString(),
                                totalPositions: 0,
                                totalWinnings: 0,
                                winRate: 0,
                              } as GroupMember)
                            : (memberItem as GroupMember);

                        return (
                          <motion.div
                            key={member.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                              "p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white hover:border-black/10 transition-all relative",
                              showMemberActions === member.id ? "z-50" : "z-0",
                            )}
                          >
                            <div className="flex items-center justify-between z-10">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-base font-medium text-black/70">
                                  {member.avatar}
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-base font-medium text-black/90">
                                      {member.username}
                                    </h4>
                                    {member.role === "admin" && (
                                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-medium text-orange-700 uppercase tracking-wider">
                                        <IconCrown className="w-3 h-3" />
                                        Admin
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-black/50 font-normal">
                                    Joined{" "}
                                    {new Date(member.joined).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-sm font-mono font-medium text-black/90">
                                    {member.totalPositions}
                                  </p>
                                  <p className="text-xs text-black/40 font-normal">
                                    Total Forecasts
                                  </p>
                                </div>

                                {canManageMembers && member.id !== user.id && (
                                  <div className="relative">
                                    <button
                                      onClick={() =>
                                        setShowMemberActions(
                                          showMemberActions === member.id
                                            ? null
                                            : member.id,
                                        )
                                      }
                                      className="p-2  hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                                    >
                                      <IconDots className="w-4 h-4 text-black/40" />
                                    </button>

                                    <AnimatePresence>
                                      {showMemberActions === member.id && (
                                        <motion.div
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -10 }}
                                          className="absolute top-full mt-2 right-0 w-48 bg-white border border-black/10 rounded-xl shadow-xl overflow-hidden z-9999"
                                        >
                                          {member.role === "member" ? (
                                            <button
                                              onClick={() =>
                                                handlePromoteMember(member.id)
                                              }
                                              disabled={isActionLoading}
                                              className="w-full px-4 py-3 text-left text-sm font-normal text-black/70 hover:bg-black/5 transition-colors flex items-center gap-3 cursor-pointer"
                                            >
                                              <IconSettings className="w-4 h-4" />
                                              Promote to Admin
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() =>
                                                handleDemoteMember(member.id)
                                              }
                                              disabled={isActionLoading}
                                              className="w-full px-4 py-3 text-left text-sm font-normal text-black/70 hover:bg-black/5 transition-colors flex items-center gap-3 cursor-pointer"
                                            >
                                              <IconUserMinus className="w-4 h-4" />
                                              Remove Admin
                                            </button>
                                          )}
                                          <button
                                            onClick={() =>
                                              handleRemoveMember(member.id)
                                            }
                                            disabled={isActionLoading}
                                            className="w-full px-4 py-3 text-left text-sm font-normal text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 cursor-pointer border-t border-black/5"
                                          >
                                            <IconUserMinus className="w-4 h-4" />
                                            Remove from Group
                                          </button>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-8 py-4 w-full md:px-6 md:py-12 rounded-2xl bg-black/5 backdrop-blur-md border border-black/5 shadow-lg"
        >
          <div className="w-full mx-auto space-y-8 flex items-center flex-col justify-between">
            {/* Header */}
            <div className="text-center space-y-4 py-4">
              <h2 className="text-3xl md:text-4xl font-medium text-black tracking-tight">
                Join to unlock full access
              </h2>
              <p className="text-base text-black/60 leading-relaxed max-w-xl mx-auto">
                Become a member to participate in forecasts, view live activity, and compete on the leaderboard.
              </p>
            </div>

            {/* What you'll get */}
            <div className="grid grid-cols-1 text-center place-items-center md:grid-cols-3 gap-6 pt-6">
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-black/90 mb-1">Live Activity Feed</h3>
                  <p className="text-sm text-black/50 leading-relaxed">
                    Track every forecast, win, and update in real-time
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-black/90 mb-1">Group Leaderboard</h3>
                  <p className="text-sm text-black/50 leading-relaxed">
                    Compete with members and climb the rankings
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-black/90 mb-1">Exclusive Markets</h3>
                  <p className="text-sm text-black/50 leading-relaxed">
                    Access group-specific unique markets
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-6 border-t border-black/5">
              <div className="text-center">
                <p className="text-2xl font-semibold font-mono text-black">
                  {group.memberCount.toLocaleString()}
                </p>
                <p className="text-xs text-black/40 uppercase tracking-wider font-medium mt-1">
                  Members
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold font-mono text-green-600">
                  {group.activePositionsCount}
                </p>
                <p className="text-xs text-black/40 uppercase tracking-wider font-medium mt-1">
                  Active Forecasts
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold font-mono text-black">
                  {formatCurrency(93200)}
                </p>
                <p className="text-xs text-black/40 uppercase tracking-wider font-medium mt-1">
                  Total Pool
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <button
                onClick={handleJoinGroup}
                disabled={isJoining}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-black text-white font-semibold text-sm hover:bg-neutral-900 transition-all shadow-lg cursor-pointer hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isJoining ? (
                  <>
                    <IconLoader3 className="w-4 h-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <IconUserPlus className="w-4 h-4" />
                    Join Group
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
