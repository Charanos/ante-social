"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import type { Method } from "axios";
import type { Market, MarketStatus, Position } from "@/types/market";
import type { UserProfile, UserTier } from "@/types/user";
import { apiClient } from "@/lib/api/client";

const LIVE_USER_REFRESH_EVENT = "ante-social:live-user-refresh";
const LIVE_USER_REFRESH_STORAGE_KEY = "ante-social:live-user-refresh-ts";
const REALTIME_NOTIFICATION_EVENT = "ante-social:notification";
const REALTIME_MARKET_EVENT = "ante-social:market-update";

type SessionUser = {
  id?: string;
  email?: string | null;
  username?: string | null;
  role?: string;
  user_level?: string;
};

export type LiveUser = UserProfile & {
  role?: "admin" | "user" | "moderator" | "group_admin";
  managed_groups?: string[];
};

export type LiveNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_date: string;
};

export type LiveTransaction = {
  id: string;
  type: "deposit" | "withdrawal" | "bet_entry" | "payout" | "refund" | "fee";
  amount: number;
  description: string;
  status: string;
  created_date: string;
};

export type LiveGroupMember = {
  id: string;
  username: string;
  avatar: string;
  role: string;
  joined: string;
  totalPositions: number;
  totalWinnings: number;
  winRate: number;
};

export type LiveGroup = {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  isPublic: boolean;
  memberCount: number;
  activePositionsCount: number;
  createdAt: string;
  creatorId: string;
  members: LiveGroupMember[];
};

const DEFAULT_MARKET_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80";

export const EMPTY_USER: LiveUser = {
  id: "",
  username: "guest",
  fullName: "Guest User",
  email: "",
  avatarUrl: "",
  tier: "novice",
  reputationScore: 0,
  signalAccuracy: 0,
  joinedAt: new Date(0).toISOString(),
  balance: 0,
  totalVolume: 0,
  totalPnl: 0,
  totalWinnings: 0,
  totalLosses: 0,
  followersCount: 0,
  followingCount: 0,
  isVerified: false,
  riskLimit: 250,
  role: "user",
  managed_groups: [],
};

let liveUserCache: LiveUser = EMPTY_USER;
let liveUserCacheAt = 0;
let liveUserFetchPromise: Promise<LiveUser> | null = null;

export function emitLiveUserRefresh() {
  if (typeof window === "undefined") return;
  liveUserCacheAt = 0;
  window.dispatchEvent(new Event(LIVE_USER_REFRESH_EVENT));
  try {
    window.localStorage.setItem(
      LIVE_USER_REFRESH_STORAGE_KEY,
      Date.now().toString(),
    );
  } catch {
    // Ignore storage write errors in restricted environments.
  }
}

async function resolveLiveUser(
  sessionUser: SessionUser,
  force = false,
): Promise<LiveUser> {
  const now = Date.now();
  const isCacheFresh = now - liveUserCacheAt < 15_000;

  if (!force && isCacheFresh) {
    return liveUserCache;
  }

  if (!force && liveUserFetchPromise) {
    return liveUserFetchPromise;
  }

  liveUserFetchPromise = (async () => {
    const [profile, wallet] = await Promise.all([
      fetchJsonOrNull<any>("/api/user/profile"),
      fetchJsonOrNull<any>("/api/wallet/balance"),
    ]);

    const profileSource =
      profile || (liveUserCacheAt > 0 ? (liveUserCache as unknown as Record<string, unknown>) : {});
    const nextUser = normalizeUser(profileSource, wallet || {}, sessionUser);

    if (!wallet && liveUserCacheAt > 0) {
      nextUser.balance = liveUserCache.balance;
      nextUser.totalWinnings = liveUserCache.totalWinnings;
      nextUser.totalLosses = liveUserCache.totalLosses;
      nextUser.totalPnl = liveUserCache.totalPnl;
    }

    liveUserCache = nextUser;
    liveUserCacheAt = Date.now();
    return liveUserCache;
  })();

  try {
    return await liveUserFetchPromise;
  } finally {
    liveUserFetchPromise = null;
  }
}

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeTier(value: unknown): UserTier {
  const tier = toString(value).toLowerCase();
  if (tier === "high_roller" || tier === "whale") return "whale";
  if (tier === "oracle") return "oracle";
  if (tier === "expert") return "expert";
  if (tier === "prognosticator" || tier === "pro") return "prognosticator";
  return "novice";
}

function toRiskLimit(tier: UserTier): number {
  if (tier === "whale" || tier === "oracle") return 1000;
  if (tier === "expert") return 500;
  if (tier === "prognosticator") return 350;
  return 250;
}

function mapMarketStatus(value: unknown): MarketStatus {
  const raw = toString(value).toLowerCase();
  if (raw === "active" || raw === "published" || raw === "scheduled") {
    return "active";
  }
  if (raw === "closed" || raw === "settling" || raw === "settled") {
    return "resolved";
  }
  if (raw === "cancelled") {
    return "disputed";
  }
  return "suspended";
}

function normalizeMarketType(value: unknown): Market["type"] {
  const raw = toString(value).toLowerCase();
  if (raw === "poll") return "consensus";
  if (raw === "prisoner_dilemma" || raw === "syndicate") return "betrayal";
  if (raw === "betrayal") return "betrayal";
  if (raw === "reflex" || raw === "ladder" || raw === "consensus") return raw;
  return "consensus";
}

export async function fetchJsonOrNull<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const method = (init?.method || "GET").toUpperCase() as Method;
    const headers = init?.headers as Record<string, string> | undefined;
    const body = init?.body;
    const data =
      typeof body === "string"
        ? body
        : body instanceof FormData
          ? body
          : body instanceof URLSearchParams
            ? body
            : body || undefined;

    const response = await apiClient.request<T>({
      url,
      method,
      data,
      headers,
      signal: init?.signal || undefined,
      withCredentials: false,
    });
    return response.data;
  } catch {
    return null;
  }
}

export function normalizeUser(
  profile: any,
  wallet: any,
  sessionUser: SessionUser | undefined,
): LiveUser {
  const tier = normalizeTier(profile?.tier || sessionUser?.user_level);
  const walletBalances = wallet?.balances?.USD || {};
  const totalWinnings = toNumber(wallet?.totalWinnings);
  const totalLosses = toNumber(wallet?.totalLosses);

  return {
    id: toString(profile?._id || profile?.id || sessionUser?.id),
    username: toString(profile?.username || sessionUser?.username || "guest"),
    fullName: toString(profile?.fullName || profile?.username || sessionUser?.username || "Guest User"),
    email: toString(profile?.email || sessionUser?.email || ""),
    avatarUrl: toString(profile?.avatarUrl || ""),
    tier,
    reputationScore: toNumber(profile?.reputationScore),
    signalAccuracy: toNumber(profile?.signalAccuracy),
    joinedAt: toString(profile?.createdAt || profile?.joinedAt || new Date().toISOString()),
    balance: toNumber(walletBalances?.available),
    totalVolume:
      toNumber(wallet?.totalDeposits) +
      toNumber(wallet?.totalWithdrawals) +
      toNumber(profile?.totalPositions),
    totalPnl: totalWinnings - totalLosses,
    totalWinnings,
    totalLosses,
    followersCount: toNumber(profile?.followersCount),
    followingCount: toNumber(profile?.followingCount),
    isVerified: Boolean(profile?.isVerified),
    riskLimit: toRiskLimit(tier),
    role: (toString(profile?.role || sessionUser?.role || "user") as LiveUser["role"]) || "user",
    managed_groups: toArray<string>(profile?.managed_groups),
  };
}

export function normalizeMarket(raw: any): Market {
  const outcomes = toArray<any>(raw?.outcomes);
  const totalOutcomeAmount = outcomes.reduce((sum, outcome) => sum + toNumber(outcome?.totalAmount), 0);
  const probabilities = outcomes.map((outcome) => {
    if (totalOutcomeAmount <= 0) return 50;
    return Math.round((toNumber(outcome?.totalAmount) / totalOutcomeAmount) * 100);
  });
  const probability = probabilities.length > 0 ? Math.max(...probabilities) : 50;
  const participantCount = toNumber(raw?.participantCount);
  const totalPool = toNumber(raw?.totalPool);
  const maxStake = raw?.maxParticipants !== undefined ? toNumber(raw?.maxParticipants) : undefined;

  return {
    id: toString(raw?._id || raw?.id),
    title: toString(raw?.title || "Untitled Market"),
    description: toString(raw?.description || ""),
    image: toString(raw?.mediaUrl || DEFAULT_MARKET_IMAGE),
    type: normalizeMarketType(raw?.betType || raw?.type || "consensus"),
    category: toString(toArray<string>(raw?.tags)[0] || "General"),
    poolAmount: totalPool,
    volume: totalPool,
    minStake: toNumber(raw?.buyInAmount, 1),
    maxStake,
    createdAt: toString(raw?.createdAt || new Date().toISOString()),
    endsAt: toString(raw?.closeTime || raw?.endsAt || new Date().toISOString()),
    status: mapMarketStatus(raw?.status),
    oracleType: raw?.settlementMethod === "external_api" ? "automated" : "manual",
    resolutionCriteria: toString(raw?.adminReport || "Settled by configured rules"),
    probability,
    signalStrength: Math.min(100, Math.max(10, participantCount * 3 + Math.floor(totalPool / 1000))),
    priceHistory: probabilities.length > 1 ? probabilities : [probability, probability],
    participantCount,
    commentCount: 0,
    shareCount: 0,
    tags: toArray<string>(raw?.tags),
  };
}

export function normalizeMarkets(payload: any): Market[] {
  const list = Array.isArray(payload) ? payload : toArray<any>(payload?.data);
  return list.map(normalizeMarket);
}

export function normalizeGroup(raw: any): LiveGroup {
  const members = toArray<any>(raw?.members).map((member) => {
    const user = member?.userId && typeof member.userId === "object" ? member.userId : {};
    return {
      id: toString(user?._id || user?.id || member?.userId),
      username: toString(user?.username || "member"),
      avatar: toString(user?.avatarUrl || ""),
      role: toString(member?.role || "member"),
      joined: toString(member?.joinedAt || raw?.createdAt || new Date().toISOString()),
      totalPositions: 0,
      totalWinnings: 0,
      winRate: 0,
    };
  });

  return {
    id: toString(raw?._id || raw?.id),
    name: toString(raw?.name || "Unnamed Group"),
    description: toString(raw?.description || ""),
    category: toString(raw?.category || "Community"),
    image: toString(raw?.imageUrl || raw?.image || DEFAULT_MARKET_IMAGE),
    isPublic: raw?.isPublic !== false,
    memberCount: toNumber(raw?.memberCount, members.length),
    activePositionsCount: toNumber(raw?.activeBetsCount || raw?.activePositionsCount),
    createdAt: toString(raw?.createdAt || new Date().toISOString()),
    creatorId: toString(raw?.createdBy || raw?.creatorId),
    members,
  };
}

export function normalizeGroups(payload: any): LiveGroup[] {
  const list = Array.isArray(payload) ? payload : toArray<any>(payload?.data);
  return list.map(normalizeGroup);
}

export function normalizeNotification(raw: any): LiveNotification {
  return {
    id: toString(raw?._id || raw?.id),
    type: toString(raw?.type || "system"),
    title: toString(raw?.title || "Notification"),
    message: toString(raw?.message || ""),
    is_read: Boolean(raw?.isRead ?? raw?.is_read),
    created_date: toString(raw?.createdAt || raw?.created_date || new Date().toISOString()),
  };
}

export function normalizeNotifications(payload: any): LiveNotification[] {
  const list = Array.isArray(payload) ? payload : toArray<any>(payload?.data);
  return list.map(normalizeNotification);
}

export function normalizeTransaction(raw: any): LiveTransaction {
  const txType = toString(raw?.type).toLowerCase();
  const mappedType: LiveTransaction["type"] =
    txType === "bet_placed"
      ? "bet_entry"
      : txType === "bet_payout"
        ? "payout"
        : txType === "platform_fee"
          ? "fee"
          : txType === "refund"
            ? "refund"
            : txType === "withdrawal"
              ? "withdrawal"
              : "deposit";

  const signedAmount =
    mappedType === "withdrawal" || mappedType === "bet_entry" || mappedType === "fee"
      ? -Math.abs(toNumber(raw?.amount))
      : Math.abs(toNumber(raw?.amount));

  return {
    id: toString(raw?._id || raw?.id),
    type: mappedType,
    amount: signedAmount,
    description: toString(raw?.description || mappedType),
    status: toString(raw?.status || "pending"),
    created_date: toString(raw?.createdAt || raw?.created_date || new Date().toISOString()),
  };
}

export function normalizeTransactions(payload: any): LiveTransaction[] {
  const list = Array.isArray(payload) ? payload : toArray<any>(payload?.data);
  return list.map(normalizeTransaction);
}

export function normalizePosition(raw: any): Position {
  const market = raw?.market || {};
  const selectedOutcome = raw?.selectedOutcome || {};
  const amount = toNumber(raw?.amountContributed || raw?.stakeAmount);
  const payout = toNumber(raw?.actualPayout);
  const isCancelled = Boolean(raw?.isCancelled);
  const isSettled = Boolean(raw?.payoutProcessed) || payout > 0 || mapMarketStatus(market?.status) === "resolved";
  const status: Position["status"] = isCancelled ? "cancelled" : isSettled ? "settled" : "active";

  return {
    id: toString(raw?._id || raw?.id),
    marketId: toString(raw?.marketId?._id || raw?.marketId || raw?.market?._id),
    userId: toString(raw?.userId?._id || raw?.userId || ""),
    title: toString(market?.title || raw?.title || ""),
    type: normalizeMarketType(market?.betType || raw?.type || "consensus"),
    outcome: toString(selectedOutcome?.optionText || raw?.outcome || "Unknown"),
    stakeAmount: amount,
    entryPrice: toNumber(raw?.entryPrice, 0.5),
    currentValue: status === "active" ? amount : payout,
    potentialWin: toNumber(raw?.potentialPayout, amount),
    status,
    pnl: status === "settled" ? payout - amount : undefined,
    openedAt: toString(raw?.createdAt || raw?.openedAt || new Date().toISOString()),
  };
}

export function normalizePositions(payload: any): Position[] {
  const list = Array.isArray(payload) ? payload : toArray<any>(payload?.data);
  return list.map(normalizePosition);
}

export function useLiveUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<LiveUser>(liveUserCache);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async (force = false) => {
    if (status === "loading") return;
    if (force || liveUserCacheAt === 0) {
      setIsLoading(true);
    }

    const sessionUser = (session?.user || {}) as SessionUser;
    const nextUser = await resolveLiveUser(sessionUser, force);
    setUser(nextUser);
    setIsLoading(false);
  }, [session, status]);

  useEffect(() => {
    void refresh(false);
  }, [refresh]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleRefreshEvent = () => {
      void refresh(true);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== LIVE_USER_REFRESH_STORAGE_KEY) return;
      void refresh(true);
    };

    window.addEventListener(LIVE_USER_REFRESH_EVENT, handleRefreshEvent);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(LIVE_USER_REFRESH_EVENT, handleRefreshEvent);
      window.removeEventListener("storage", handleStorage);
    };
  }, [refresh]);

  return { user, isLoading, refresh };
}

export function useUnreadNotificationsCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    const load = async () => {
      const payload = await fetchJsonOrNull<any>("/api/notifications");
      if (cancelled) return;
      const notifications = normalizeNotifications(payload);
      setCount(notifications.filter((notification) => !notification.is_read).length);
    };

    void load();
    const handleRealtimeNotification = () => {
      void load();
    };

    window.addEventListener(REALTIME_NOTIFICATION_EVENT, handleRealtimeNotification);
    const interval = window.setInterval(load, 30000);
    return () => {
      cancelled = true;
      window.removeEventListener(REALTIME_NOTIFICATION_EVENT, handleRealtimeNotification);
      window.clearInterval(interval);
    };
  }, []);

  return count;
}

export function useMarketList() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    let payload = await fetchJsonOrNull<any>("/api/markets?limit=200&offset=0");

    if (!payload) {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/+$/, "");
      if (apiBase) {
        payload = await fetchJsonOrNull<any>(`${apiBase}/api/v1/markets?limit=200&offset=0`);
      }
    }

    setMarkets(normalizeMarkets(payload));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    void refresh();
    const handleRealtimeMarketUpdate = () => {
      void refresh();
    };
    window.addEventListener(REALTIME_MARKET_EVENT, handleRealtimeMarketUpdate);
    const interval = window.setInterval(() => {
      void refresh();
    }, 30_000);
    return () => {
      window.removeEventListener(REALTIME_MARKET_EVENT, handleRealtimeMarketUpdate);
      window.clearInterval(interval);
    };
  }, [refresh]);

  return { markets, isLoading, refresh };
}

export function useGroupList() {
  const [groups, setGroups] = useState<LiveGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const payload = await fetchJsonOrNull<any>("/api/groups?limit=200&offset=0");
    setGroups(normalizeGroups(payload));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    void refresh();
    const interval = window.setInterval(() => {
      void refresh();
    }, 60_000);
    return () => {
      window.clearInterval(interval);
    };
  }, [refresh]);

  return { groups, isLoading, refresh };
}

export function useMarketById(marketId: string | undefined) {
  const [market, setMarket] = useState<Market | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!marketId) return;
    setIsLoading(true);
    const payload = await fetchJsonOrNull<any>(`/api/markets/${marketId}`);
    setMarket(payload ? normalizeMarket(payload) : null);
    setIsLoading(false);
  }, [marketId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    void refresh();
    const handleRealtimeMarketUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ marketId?: string }>).detail;
      if (!detail?.marketId || !marketId || detail.marketId === marketId) {
        void refresh();
      }
    };
    window.addEventListener(REALTIME_MARKET_EVENT, handleRealtimeMarketUpdate);
    return () => {
      window.removeEventListener(REALTIME_MARKET_EVENT, handleRealtimeMarketUpdate);
    };
  }, [refresh]);

  return { market, isLoading, refresh };
}

export function useNormalizedLimits(user: LiveUser, mode: "deposit" | "withdrawal") {
  return useMemo(() => {
    const isHighTier = user.tier === "whale" || user.tier === "oracle";
    if (mode === "deposit") {
      return { min: 10, max: isHighTier ? 5000 : 500 };
    }
    return { min: 10, max: isHighTier ? 1000 : 250 };
  }, [mode, user.tier]);
}

export function useLandingContent() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const payload = await fetchJsonOrNull<any>("/api/public/content/landing-page");
    setContent(payload);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    void refresh();
  }, [refresh]);

  return { content, isLoading, refresh };
}
