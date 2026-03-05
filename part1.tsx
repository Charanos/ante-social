"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import {
  IconAccessPoint,
  IconArrowRight,
  IconBell,
  IconCircleCheckFilled,
  IconClock,
  IconEye,
  IconEyeOff,
  IconHelpCircle,
  IconLogout,
  IconMoodSmile,
  IconShield,
  IconTrendingUp,
  IconUsers,
  IconTrophy,
  IconGhost,
  IconBolt,
} from "@tabler/icons-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/useToast";
import { fetchJsonOrNull, useLiveUser } from "@/lib/live-data";
import { useCurrency } from "@/lib/utils/currency";
import Image from "next/image";
import { LoadingLogo } from "@/components/ui/LoadingLogo";
import { mapMarketToDetailView, parseApiError } from "@/lib/market-detail-view";
import UserAvatar from "@/components/ui/UserAvatar";
import { MarketChart } from "@/components/markets/MarketChart";

const REFLEX_ICONS = [
  IconLogout,
  IconBell,
  IconHelpCircle,
  IconEyeOff,
  IconMoodSmile,
];

export default function ReflexMarketPage() {
  const params = useParams();
  const toast = useToast();
  const { user } = useLiveUser();
  const marketId = params.id as string;
  const [market, setMarket] = useState<any>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { formatCurrency, symbol, convertAmount, preferredCurrency } = useCurrency();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [countdown, setCountdown] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const sortedParticipants = useMemo(() => {
    if (!market?.participants) return [];
    return [...market.participants].sort((a, b) => b.total_stake - a.total_stake);
  }, [market?.participants]);

  const totalVotes = useMemo(() => {
    if (!market?.options) return 0;
    return market.options.reduce((sum: number, opt: any) => sum + (opt.pool_amount || 0), 0);
  }, [market?.options]);

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setIsCountingDown(false);
      setCountdown(5);
    }
  }, [countdown, isCountingDown]);

  useEffect(() => {
    if (!marketId) return;
    let cancelled = false;

    const load = async () => {
      setIsPageLoading(true);
      const payload = await fetchJsonOrNull<any>(\`/api/markets/\${marketId}\`);
      if (cancelled) return;
      if (!payload) {
        setMarket(null);
        setIsPageLoading(false);
        return;
      }

      const detail = mapMarketToDetailView(payload);
      detail.options = detail.options.map((option, index) => ({
        ...option,
        icon: REFLEX_ICONS[index % REFLEX_ICONS.length],
      }));
      setMarket(detail);
      setIsPageLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [marketId]);

  const handlePlacePrediction = async () => {
    const stakeValuePreferred = Number.parseFloat(stakeAmount);
    const stakeValueKsh = convertAmount(stakeValuePreferred, preferredCurrency, "KSH");

    if (
      !selectedOption ||
      !stakeAmount ||
      !Number.isFinite(stakeValuePreferred) ||
      stakeValueKsh < market.buy_in_amount
    ) {
      toast.error(
        "Invalid Prediction",
        \`Minimum stake is \${formatCurrency(market.buy_in_amount)}\`,
      );
      return;
    }
    if (user.balance < stakeValueKsh) {
      toast.error("Insufficient Balance", "Please top up your wallet to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(\`/api/markets/\${market.id}/predict\`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          outcomeId: selectedOption,
          amount: stakeValueKsh,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(parseApiError(payload, "Failed to place prediction."));
      }

      const selectedOptionText = market.options.find(
        (o: any) => o.id === selectedOption,
      )?.option_text;
      setPredictionResult({
        optionText: selectedOptionText,
        amount: stakeValueKsh,
        timestamp: new Date().toISOString(),
        transactionId: payload?.id || payload?._id,
      });

      toast.success(
        "Prediction Placed!",
        \`You predicted \${formatCurrency(stakeValueKsh)} on "\${selectedOptionText}"\`,
      );
    } catch (error: any) {
      toast.error("Prediction Failed", error?.message || "Unable to place prediction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeRemaining = () => {
    if (!market) return "";
    const diff = market.close_date.getTime() - Date.now();
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return \`\${minutes}m \${seconds}s\`;
  };

  const stakeValuePreferredInput = parseFloat(stakeAmount) || 0;
  const stakeValueKshBase = convertAmount(stakeValuePreferredInput, preferredCurrency, "KSH");
  const platformFeeKsh = stakeValueKshBase * 0.05;
  const totalAmountKsh = stakeValueKshBase + platformFeeKsh;

  if (isPageLoading) {
    return <LoadingLogo fullScreen size="lg" />;
  }
  if (!market) {
    return <div className="p-8 text-sm text-black/50">Market not found.</div>;
  }

  const isClosed = market.status === "closed" || market.status === "settled" || market.status === "resolved";
  const winningOutcomeId = market.winningOutcomeId;
