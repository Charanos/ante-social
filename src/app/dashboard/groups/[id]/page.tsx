"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconActivity,
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
  IconDeviceFloppy,
  IconDots,
  IconEdit,
  IconEye,
  IconInfoCircle,
  IconLoader2,
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
} from "@tabler/icons-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/toast-notification";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { mockUser, mockMyBets } from "@/lib/mockData";
import { isGroupMember, joinGroup, leaveGroup } from "@/lib/membership";
import Link from "next/link";
import Image from "next/image";
import LeaderboardSection from "@/components/dashboard/LeaderboardSection";

// Types
interface GroupMember {
  id: string;
  username: string;
  avatar: string;
  role: string;
  joined: string;
  totalBets: number;
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
}

interface GroupBet {
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
  is_public: boolean;
  isPublic?: boolean;
  member_count: number;
  active_bets: number;
  created_at: string | Date;
  creator_id: string;
  image: string;
  members?: (string | GroupMember)[];
  activeBets?: GroupBet[];
  activityFeed?: GroupActivity[];
}

// Extended mock data
const mockGroupDetails: UnifiedGroup = {
  id: 1,
  name: "Premier League Fanatics",
  description:
    "Discuss matches, predict outcomes, and bet on your favorite teams. Weekly analysis and live match betting.",
  category: "Sports",
  is_public: true,
  isPublic: true,
  member_count: 1240,
  active_bets: 15,
  created_at: "2024-01-15",
  creator_id: "user_001",
  image:
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop",
  members: [
    {
      id: "user_001",
      username: "MatchGuru",
      avatar: "MG",
      role: "admin",
      joined: "2024-01-15",
      totalBets: 234,
      totalWinnings: 456700,
      winRate: 78,
    },
    {
      id: "user_002",
      username: "GoalKeeper",
      avatar: "GK",
      role: "member",
      joined: "2024-01-16",
      totalBets: 189,
      totalWinnings: 398200,
      winRate: 72,
    },
    {
      id: "user_003",
      username: "ScorePredictor",
      avatar: "SP",
      role: "member",
      joined: "2024-01-18",
      totalBets: 156,
      totalWinnings: 345100,
      winRate: 69,
    },
    {
      id: "user_004",
      username: "PenaltyKing",
      avatar: "PK",
      role: "member",
      joined: "2024-01-20",
      totalBets: 142,
      totalWinnings: 298400,
      winRate: 65,
    },
    {
      id: "user_005",
      username: "TacticsExpert",
      avatar: "TE",
      role: "member",
      joined: "2024-01-22",
      totalBets: 98,
      totalWinnings: 245600,
      winRate: 61,
    },
  ],
  activeBets: [],
  activityFeed: [
    {
      id: "act_001",
      type: "bet_settled",
      user: "MatchGuru",
      action: "settled bet",
      details: "Chelsea vs Arsenal",
      amount: "32,400 KSH",
      timestamp: "2026-02-03T14:30:00",
    },
    {
      id: "act_002",
      type: "bet_created",
      user: "ScorePredictor",
      action: "created bet",
      details: "Least popular team",
      amount: "28,400 KSH",
      timestamp: "2026-02-03T12:15:00",
    },
    {
      id: "act_003",
      type: "member_joined",
      user: "TacticsExpert",
      action: "joined the group",
      timestamp: "2026-02-03T10:45:00",
    },
    {
      id: "act_004",
      type: "bet_participated",
      user: "PenaltyKing",
      action: "placed bet",
      details: "Man Utd vs Liverpool",
      amount: "2,500 KSH",
      timestamp: "2026-02-03T09:20:00",
    },
    {
      id: "act_005",
      type: "bet_disputed",
      user: "GoalKeeper",
      action: "disputed result",
      details: "Top scorer",
      timestamp: "2026-02-02T16:30:00",
    },
  ],
};

const ActivityIcon = ({ type }: { type: string }) => {
  const icons = {
    bet_settled: <IconCircleCheckFilled className="w-4 h-4 text-green-600" />,
    bet_created: <IconStar className="w-4 h-4 text-blue-600" />,
    member_joined: <IconUserPlus className="w-4 h-4 text-purple-600" />,
    bet_participated: <IconTrendingUp className="w-4 h-4 text-orange-600" />,
    bet_disputed: <IconAlertCircle className="w-4 h-4 text-red-600" />,
  };
  return (
    icons[type as keyof typeof icons] || (
      <IconActivity className="w-4 h-4 text-black/40" />
    )
  );
};

// NEW BET PLACEMENT COMPONENT (for Featured Markets)
const PlaceBetSlip = ({
  activeMarket,
  selectedOption,
  setSelectedOption,
  betSuccess,
  setBetSuccess,
}: any) => {
  const [stakeAmount, setStakeAmount] = useState("");
  const [isSubmittingBet, setIsSubmittingBet] = useState(false);
  const toast = useToast();

  const platformFee = useMemo(() => {
    return stakeAmount ? parseFloat(stakeAmount) * 0.05 : 0;
  }, [stakeAmount]);

  const totalAmount = useMemo(() => {
    return stakeAmount ? parseFloat(stakeAmount) + platformFee : 0;
  }, [stakeAmount, platformFee]);

  const handlePlaceBet = useCallback(() => {
    if (!selectedOption || !stakeAmount || parseFloat(stakeAmount) < 50) return;

    setIsSubmittingBet(true);
    setTimeout(() => {
      try {
        setBetSuccess(true);
        toast.success("Bet Placed!", "Your prediction has been recorded.");

        // Reset after 3 seconds
        setTimeout(() => {
          setBetSuccess(false);
          setStakeAmount("");
          setSelectedOption(null);
        }, 3000);
      } catch (error) {
        toast.error("Error", "Failed to place bet");
      } finally {
        setIsSubmittingBet(false);
      }
    }, 1500);
  }, [selectedOption, stakeAmount, toast, setBetSuccess, setSelectedOption]);

  return (
    <AnimatePresence mode="wait">
      {betSuccess ? (
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
            <h3 className="text-2xl font-semibold mb-2">Bet Confirmed!</h3>
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
                    Place Bet
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
                      {selectedOption === "opt1"
                        ? "Man United Win"
                        : selectedOption === "opt2"
                          ? "Draw"
                          : "Liverpool Win"}
                    </p>
                    <p className="text-xs text-black/50 mt-1">
                      {selectedOption === "opt1"
                        ? "45%"
                        : selectedOption === "opt2"
                          ? "25%"
                          : "30%"}{" "}
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
                <label className="text-xs font-semibold text-black/60 uppercase tracking-widest">
                  Stake Amount (KSH)
                </label>
                <span className="text-xs font-semibold text-black/30">
                  Min: 50
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-md font-semibold text-black/30">
                  KSH
                </span>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="50"
                  min="50"
                  className="w-full pl-16 pr-1 py-2 bg-neutral-50 border-2 border-black/10 rounded-xl font-mono font-semibold text-lg text-black focus:border-black focus:bg-white focus:outline-none transition-all placeholder:text-black/20"
                />
              </div>
              {stakeAmount && parseFloat(stakeAmount) < 50 && (
                <p className="text-xs text-red-600 flex items-center gap-1.5">
                  <IconAlertCircle className="w-3.5 h-3.5" />
                  Minimum stake is 50 KSH
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
                  {platformFee.toFixed(2)} KSH
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-linear-to-br from-neutral-50 to-white border border-black/10">
                <span className="text-sm font-semibold text-black/70 uppercase tracking-wide">
                  Total to Pay
                </span>
                <span className="text-lg font-semibold font-mono text-black">
                  {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={
                !selectedOption ||
                !stakeAmount ||
                parseFloat(stakeAmount) < 50 ||
                isSubmittingBet
              }
              onClick={handlePlaceBet}
              className={cn(
                "w-full py-3 rounded-xl font-semibold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2",
                !selectedOption || !stakeAmount || parseFloat(stakeAmount) < 50
                  ? "bg-black/5 text-black/30 cursor-not-allowed"
                  : "bg-black text-white hover:bg-neutral-900 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer",
              )}
            >
              {isSubmittingBet ? (
                <>
                  <IconLoader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <IconCircleCheckFilled className="w-5 h-5" />
                  Confirm & Place Bet
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
                    applies to all bets.
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

// EXISTING BET MANAGEMENT COMPONENT (for Activity Feed & Bets Tab)
const ManageBetSlip = ({ bet, onClose }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState(
    bet.amount?.toString() || "0",
  );
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  // Calculate if bet can still be edited (within 5 minutes of placement)
  const betPlacedAt = new Date(
    bet.date || bet.timestamp || Date.now(),
  ).getTime();
  const now = Date.now();
  const minutesSincePlacement = (now - betPlacedAt) / (1000 * 60);
  const canEdit = minutesSincePlacement < 5 && bet.status === "active";
  const timeRemaining = canEdit
    ? Math.max(0, 5 - Math.floor(minutesSincePlacement))
    : 0;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast.success("Stake Updated", `New stake: ${editedAmount} KSH`);
    }, 1000);
  };

  const handleCancel = () => {
    if (
      confirm(
        "Are you sure you want to cancel this bet? Your stake will be refunded.",
      )
    ) {
      toast.info("Bet Cancelled", "Funds returned to your wallet");
      setTimeout(onClose, 1500);
    }
  };

  const StatusIcon =
    bet.status === "won"
      ? IconTrophy
      : bet.status === "lost"
        ? IconX
        : IconClock;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="overflow-hidden rounded-3xl bg-white shadow-2xl border border-black/5"
    >
      {/* Header */}
      <div className="bg-linear-to-br from-neutral-800 to-black text-white p-6 pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
              <StatusIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">
                Bet Status
              </p>
              <p className="text-sm font-semibold capitalize">
                {bet.status || "Active"}
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
            {bet.title}
          </h3>
          <p className="text-xs text-white/50">
            Ticket #{bet.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      </div>

      {/* Selected Option Card */}
      <div className="relative -mt-6 mx-6 z-20">
        <div className="bg-white border-2 border-black/10 rounded-2xl py-2 px-5 shadow-xl">
          <p className="text-[10px] font-semibold text-black/40 uppercase tracking-widest my-2">
            Your Pick
          </p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-black">
              {bet.outcome || bet.details || "Selection"}
            </p>
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <IconTrendingDown className="w-5 h-5 text-black/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-6 space-y-6">
        {/* Stake Section */}
        <div className="space-y-3">
          <div className="flex items-center my-3 justify-between">
            <label className="text-xs font-semibold text-black/60 uppercase tracking-widest">
              Stake Amount
            </label>
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
              >
                <IconEdit className="w-3 h-3" />
                IconEdit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-semibold text-black/30">
                  KSH
                </span>
                <input
                  type="number"
                  value={editedAmount}
                  onChange={(e) => setEditedAmount(e.target.value)}
                  className="w-full pl-14 pr-4 py-2 bg-neutral-50 border-2 border-black/10 rounded-xl font-mono font-semibold text-xl focus:border-black focus:bg-white outline-none"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="py-3 bg-black text-white rounded-xl font-semibold text-sm hover:bg-neutral-900 transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <IconLoader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <IconDeviceFloppy className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedAmount(bet.amount?.toString() || "0");
                  }}
                  className="py-3 bg-neutral-100 text-black/70 rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="px-5 py-2 rounded-xl bg-linear-to-br from-neutral-50 to-white border border-black/10">
              <p className="text-xl font-mono font-semibold text-black">
                {bet.amount || editedAmount} KSH
              </p>
            </div>
          )}
        </div>

        {/* Potential Payout */}
        <div className="px-5 py-2 rounded-xl bg-linear-to-br from-green-50 to-white border border-green-200">
          <p className="text-xs font-semibold text-green-800 uppercase tracking-widest mb-2">
            {bet.status === "won" ? "Total Won" : "Potential Payout"}
          </p>
          <p className="text-xl font-mono font-semibold text-green-700">
            {bet.potentialWin || (parseFloat(editedAmount) * 1.95).toFixed(2)}{" "}
            KSH
          </p>
        </div>

        {/* IconEdit Time Warning */}
        {canEdit && (
          <div className="py-2 px-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex gap-3">
              <IconClock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-amber-900">
                  IconEdit Window Active
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  You have {timeRemaining} minute
                  {timeRemaining !== 1 ? "s" : ""} left to edit or cancel this
                  bet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {canEdit && (
          <button
            onClick={handleCancel}
            className="w-full py-2 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-all"
          >
            Cancel Bet & Refund
          </button>
        )}

        {/* Market Link */}
        <Link
          href={`/dashboard/markets/${bet.marketId || bet.id}`}
          className="block w-full py-3 rounded-xl border border-black/10 text-center text-xs font-semibold text-black/60 hover:bg-neutral-50 hover:text-black transition-all uppercase tracking-widest"
        >
          View Market Details →
        </Link>
      </div>
    </motion.div>
  );
};

export default function GroupPage() {
  const params = useParams();
  const groupId = params.id as string;
  const router = useRouter();
  const toast = useToast();

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

  // NEW: Separate state for Featured Market betting
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [betSuccess, setBetSuccess] = useState(false);

  // NEW: State for managing existing bets from Activity/Bets tab
  const [selectedBetToManage, setSelectedBetToManage] = useState<any | null>(
    null,
  );

  // Memoized group data
  const group = useMemo((): UnifiedGroup => {
    const details = { ...mockGroupDetails };
    if (!details.activeBets || details.activeBets.length === 0) {
      details.activeBets = [
        {
          id: "bet_001",
          type: "winner_takes_all",
          title: "Who wins Man United vs Liverpool?",
          creator: "MatchGuru",
          pool: "45,600 KSH",
          participants: 23,
          endsAt: "2026-02-05T15:00:00",
          status: "active",
        },
      ];
    }
    return details;
  }, []);

  const isPlatformAdmin = mockUser.role === "admin";
  const isGroupAdmin = group.creator_id === mockUser.id;
  const canManageMembers = isPlatformAdmin || isGroupAdmin;

  const [isMember, setIsMember] = useState(() => isGroupMember(groupId));

  useEffect(() => {
    if (!isJoining) {
      setIsMember(isGroupMember(groupId));
    }
  }, [groupId, isJoining]);

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

  // Handlers
  const handleToggleNotifications = useCallback(() => {
    setIsActionLoading(true);
    const newState = !isNotificationsOn;
    setTimeout(() => {
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
    }, 800);
  }, [isNotificationsOn, toast]);

  const handleJoinGroup = useCallback(() => {
    setIsJoining(true);
    setTimeout(() => {
      try {
        joinGroup(groupId);
        setIsMember(true);
        toast.success("Joined Group Successfully", `Welcome to ${group.name}!`);
      } catch (error) {
        toast.error("Error", "Failed to join group");
      } finally {
        setIsJoining(false);
      }
    }, 1200);
  }, [groupId, group.name, toast]);

  const handleLeaveGroup = useCallback(() => {
    setIsActionLoading(true);
    setTimeout(() => {
      try {
        leaveGroup(groupId);
        setIsMember(false);
        setShowSettingsMenu(false);
        toast.info("Group Left", "You are no longer a member of this group.");
        router.push("/dashboard/groups");
      } catch (error) {
        toast.error("Error", "Failed to leave group");
      } finally {
        setIsActionLoading(false);
      }
    }, 1000);
  }, [groupId, toast, router]);

  const handleInvite = useCallback(async () => {
    const slug = group.name.toLowerCase().replace(/\s+/g, "-");
    const url = `${window.location.origin}/dashboard/groups/join/${slug}-${group.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${group.name} on Ante Social`,
          text: `IconCheck out this group: ${group.description}`,
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
    (memberId: string) => {
      setIsActionLoading(true);
      setTimeout(() => {
        try {
          setShowMemberActions(null);
          toast.success(
            "Member Removed",
            "IconUser has been removed from the group",
          );
        } catch (error) {
          toast.error("Error", "Failed to remove member");
        } finally {
          setIsActionLoading(false);
        }
      }, 800);
    },
    [toast],
  );

  const handlePromoteMember = useCallback(
    (memberId: string) => {
      setIsActionLoading(true);
      setTimeout(() => {
        try {
          setShowMemberActions(null);
          toast.success("Member Promoted", "IconUser is now a group admin");
        } catch (error) {
          toast.error("Error", "Failed to promote member");
        } finally {
          setIsActionLoading(false);
        }
      }, 800);
    },
    [toast],
  );

  const handleDemoteMember = useCallback(
    (memberId: string) => {
      setIsActionLoading(true);
      setTimeout(() => {
        try {
          setShowMemberActions(null);
          toast.success("Member Demoted", "IconUser is now a regular member");
        } catch (error) {
          toast.error("Error", "Failed to demote member");
        } finally {
          setIsActionLoading(false);
        }
      }, 800);
    },
    [toast],
  );

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (tabId === activeTab) return;
      setActiveTab(tabId);
      setIsTabLoading(true);
      // Close any open bet management when switching tabs
      setSelectedBetToManage(null);
      setTimeout(() => setIsTabLoading(false), 500);
    },
    [activeTab],
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }

  return (
    <div className="space-y-10 pb-20 pl-0 md:pl-8 w-full">
      <DashboardHeader
        user={mockUser}
        subtitle="Discover communities and join the conversation"
      />

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

        <div className="relative z-10 p-8 md:p-10 space-y-8">
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
                    {group.created_at
                      ? new Date(group.created_at).toLocaleDateString()
                      : "Unknown"}
                  </span>
                  {isMember && (
                    <span className="text-sm text-green-400 font-normal flex items-center gap-1.5">
                      <IconCircleCheckFilled className="w-3.5 h-3.5" />
                      Member
                    </span>
                  )}
                  <button
                    onClick={handleInvite}
                    className="text-sm text-orange-500/80 hover:text-orange-500 font-normal flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <IconShare2 className="w-3.5 h-3.5" />
                    Invite
                  </button>
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
                      <IconLoader2 className="w-3 h-3 animate-spin" />
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
                          <IconLoader2 className="w-4 h-4 animate-spin" />
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
                            Group IconSettings
                          </button>
                        </Link>
                      )}

                      <button
                        onClick={handleLeaveGroup}
                        disabled={isActionLoading}
                        className="w-full px-4 py-3 text-left text-sm font-normal text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 cursor-pointer border-t border-black/5 disabled:opacity-50"
                      >
                        {isActionLoading ? (
                          <IconLoader2 className="w-4 h-4 animate-spin" />
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
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div className="space-y-1">
              <p className="text-sm font-normal text-white/50">Members</p>
              <p className="text-2xl font-medium text-white font-mono">
                {group.member_count.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-white/50">Active Bets</p>
              <p className="text-2xl font-medium text-green-400 font-mono">
                {group.active_bets}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-normal text-white/50">Total Pool</p>
              <p className="text-2xl font-medium text-white font-mono">
                93.2K KSH
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Market Betting Section */}
      {isMember && group.activeBets && group.activeBets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <SectionHeading
              title="Featured Market"
              icon={<IconTrendingUp className="w-4 h-4 text-green-500" />}
            />
            <Link
              href={`/dashboard/markets`}
              className="text-sm font-medium text-black/40 hover:text-black/60 transition-colors flex items-center gap-1 cursor-pointer"
            >
              Browse All <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Market Display */}
            <div className="lg:col-span-8">
              <div className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/50 opacity-60" />

                <div className="py-8 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                          <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                            <IconActivity className="w-3 h-3" />
                            Active Market
                          </span>
                        </div>
                        <div className="px-2.5 py-1 rounded-full bg-black/5 border border-black/10">
                          <span className="text-[10px] font-semibold text-black/40 uppercase tracking-widest flex items-center gap-1.5">
                            <IconClock className="w-3 h-3" />
                            {group.activeBets && group.activeBets[0]
                              ? timeUntil(group.activeBets[0].endsAt)
                              : "2h 15m"}{" "}
                            left
                          </span>
                        </div>
                        <div className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                          <span className="text-[10px] font-semibold text-green-700 uppercase tracking-widest flex items-center gap-1.5">
                            <IconCurrencyDollar className="w-3 h-3" />
                            Min: 50 KSH
                          </span>
                        </div>
                      </div>
                      <h2 className="text-2xl my-3 mt-6 font-semibold text-black tracking-tight leading-relaxed">
                        {group.activeBets && group.activeBets[0]
                          ? group.activeBets[0].title
                          : "Who wins Man United vs Liverpool?"}
                      </h2>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">
                        Total Pool
                      </p>
                      <p className="text-xl font-semibold font-mono text-black">
                        {group.activeBets && group.activeBets[0]
                          ? group.activeBets[0].pool
                          : "45,600 KSH"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        id: "opt1",
                        text: "Man United Win",
                        percentage: 45,
                        image:
                          "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=400&auto=format&fit=crop",
                      },
                      {
                        id: "opt2",
                        text: "Draw",
                        percentage: 25,
                        image:
                          "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&auto=format&fit=crop",
                      },
                      {
                        id: "opt3",
                        text: "Liverpool Win",
                        percentage: 30,
                        image:
                          "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400&auto=format&fit=crop",
                      },
                    ].map((option, index) => {
                      const isSelected = selectedOption === option.id;

                      return (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedOption(option.id);
                            setBetSuccess(false);
                          }}
                          className={cn(
                            "relative p-6 rounded-2xl border transition-all overflow-hidden text-left h-full flex flex-col justify-between group cursor-pointer",
                            isSelected
                              ? "bg-black text-white border-black shadow-xl scale-[1.02]"
                              : "bg-white border-black/5 hover:border-black/10 hover:shadow-md",
                          )}
                        >
                            <div className="relative h-24 -mx-6 -mt-6 mb-4 overflow-hidden">
                            <Image
                              src={option.image}
                              alt={option.text}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/30" />
                            {isSelected && (
                              <div className="absolute top-3 right-3 bg-blue-500 rounded-full p-1 z-10">
                                <IconCircleCheckFilled className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>

                          <div className="relative z-10 space-y-4">
                            <div className="space-y-1">
                              <p
                                className={cn(
                                  "text-[10px] font-semibold uppercase tracking-widest",
                                  isSelected
                                    ? "text-white/40"
                                    : "text-black/30",
                                )}
                              >
                                {option.percentage}% consensus
                              </p>
                              <p
                                className={cn(
                                  "font-semibold text-sm leading-snug",
                                  isSelected ? "text-white" : "text-black",
                                )}
                              >
                                {option.text}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div
                                className={cn(
                                  "h-1.5 rounded-full overflow-hidden",
                                  isSelected ? "bg-white/20" : "bg-black/5",
                                )}
                              >
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${option.percentage}%` }}
                                  transition={{
                                    duration: 1,
                                    ease: "easeOut",
                                    delay: 0.3 + index * 0.1,
                                  }}
                                  className={cn(
                                    "h-full rounded-full",
                                    isSelected ? "bg-white" : "bg-black/40",
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent pointer-events-none" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Place Bet Slip Sidebar - ONLY FOR PLACING NEW BETS */}
            <div className="lg:col-span-4">
              <PlaceBetSlip
                activeMarket={group.activeBets[0]}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                betSuccess={betSuccess}
                setBetSuccess={setBetSuccess}
              />
            </div>
          </div>
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
            avatar: (
              <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-black/70">
                {member.avatar}
              </div>
            ),
            totalWinnings: member.totalWinnings,
            winRate: member.winRate,
            activeBets: member.totalBets,
            trend: "same",
          }))}
        />
      )}

      <SectionHeading title="Group Activity" />

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-black/5">
        {[
          {
            id: "feed",
            label: "Activity Feed",
            icon: IconActivity,
            count: null,
          },
          {
            id: "bets",
            label: "Active Bets",
            icon: IconAward,
            count: mockMyBets.length,
          },
          {
            id: "members",
            label: "Members",
            icon: IconUsers,
            count: group.member_count,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "pb-4 px-2 text-sm font-medium transition-all relative flex items-center gap-2 cursor-pointer",
              activeTab === tab.id
                ? "text-black/90"
                : "text-black/40 hover:text-black/60",
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
                  {group.activityFeed?.map(
                    (activity: GroupActivity, index: number) => (
                      <motion.div
                        key={`${activity.id}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          // If it's a bet-related activity, show management slip
                          if (activity.type.includes("bet")) {
                            setSelectedBetToManage({
                              id: activity.id,
                              title: activity.details || activity.action,
                              amount: parseInt(
                                activity.amount?.replace(/[^\d]/g, "") || "0",
                              ),
                              potentialWin:
                                parseInt(
                                  activity.amount?.replace(/[^\d]/g, "") || "0",
                                ) * 1.95,
                              status:
                                activity.type === "bet_settled"
                                  ? "settled"
                                  : "active",
                              outcome: activity.details || "Unknown",
                              date: activity.timestamp,
                              marketId: "market_001",
                            });
                          }
                        }}
                        className="p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white hover:border-black/10 transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                            <ActivityIcon type={activity.type} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-sm font-normal text-black/90">
                                  <span className="font-medium">
                                    {activity.user}
                                  </span>{" "}
                                  {activity.action}
                                  {activity.details && (
                                    <span className="text-black/60">
                                      {" "}
                                      "{activity.details}"
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
                  <p className="text-center text-sm text-black/30 font-normal py-4">
                    End of activity
                  </p>
                </>
              )}
            </div>

            {/* Manage Bet Slip Sidebar - ONLY SHOWS WHEN BET IS SELECTED */}
            <div className="lg:col-span-4">
              <AnimatePresence mode="wait">
                {selectedBetToManage ? (
                  <ManageBetSlip
                    bet={selectedBetToManage}
                    onClose={() => setSelectedBetToManage(null)}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 rounded-3xl bg-linear-to-br from-neutral-50 to-white border border-black/5 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto">
                      <IconActivity className="w-8 h-8 text-black/20" />
                    </div>
                    <div>
                      <p className="font-medium text-black/60 mb-2">
                        Select a Bet
                      </p>
                      <p className="text-sm text-black/40 leading-relaxed">
                        Click on any bet activity to view details and manage
                        your stake
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {activeTab === "bets" && (
          <motion.div
            key="bets"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Bets List */}
            <div className="lg:col-span-8 space-y-4">
              {mockMyBets.map((bet, index) => (
                <motion.div
                  key={bet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedBetToManage(bet)}
                  className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white hover:border-black/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                        bet.status === "won"
                          ? "bg-green-100 text-green-600"
                          : bet.status === "lost"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600",
                      )}
                    >
                      {bet.status === "won" ? (
                        <IconCircleCheckFilled className="w-5 h-5" />
                      ) : bet.status === "lost" ? (
                        <IconX className="w-5 h-5" />
                      ) : (
                        <IconTrendingUp className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-black/90">{bet.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-black/50 font-normal">
                        <span>{new Date(bet.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-black/70">
                          Pick: {bet.outcome}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 md:text-right w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-black/5">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-black/30">
                        Stake
                      </p>
                      <p className="font-mono font-medium">{bet.amount} KSH</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-black/30">
                        Potential
                      </p>
                      <p
                        className={cn(
                          "font-mono font-semibold",
                          bet.status === "won"
                            ? "text-green-600"
                            : "text-black/90",
                        )}
                      >
                        {bet.potentialWin} KSH
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Manage Bet Slip Sidebar */}
            <div className="lg:col-span-4">
              <AnimatePresence mode="wait">
                {selectedBetToManage ? (
                  <ManageBetSlip
                    bet={selectedBetToManage}
                    onClose={() => setSelectedBetToManage(null)}
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
                      <p className="font-medium text-black/60 mb-2">
                        Select a Bet
                      </p>
                      <p className="text-sm text-black/40 leading-relaxed">
                        Click on any bet to view details, edit stake, or cancel
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
                            username: `IconUser ${memberItem}`,
                            avatar: "U",
                            role: "member",
                            joined: group.created_at,
                            totalBets: 0,
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
                                {member.totalBets}
                              </p>
                              <p className="text-xs text-black/40 font-normal">
                                Total Bets
                              </p>
                            </div>

                            {canManageMembers && member.id !== mockUser.id && (
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
    </div>
  );
}
