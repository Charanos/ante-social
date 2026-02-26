"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast-notification";
import { emitLiveUserRefresh } from "@/lib/live-data";
import {
  connectSocket,
  disconnectSocket,
  getSocketClient,
  joinSocketRoom,
  leaveSocketRoom,
} from "@/lib/socket/client";

const EVENT_NOTIFICATION = "ante-social:notification";
const EVENT_MARKET_UPDATE = "ante-social:market-update";
const EVENT_WALLET_UPDATE = "ante-social:wallet-update";
const EVENT_BET_SETTLED = "ante-social:bet-settled";
const EVENT_GROUP_ACTIVITY = "ante-social:group-activity";

type NotificationEventPayload = {
  title?: string;
  message?: string;
  type?: string;
  actionUrl?: string;
};

type MarketEventPayload = {
  marketId?: string;
  type?: string;
};

type BetSettledPayload = {
  positionId?: string;
  marketId?: string;
  marketTitle?: string;
  username?: string;
  payout?: number;
  amount?: number;
  outcome?: string;
};

type GroupActivityPayload = {
  groupId?: string;
  type?: string;
  message?: string;
};

function emitBrowserEvent<T>(eventName: string, detail: T) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

function getActiveRoom(pathname: string | null) {
  if (!pathname) return null;

  const marketMatch = pathname.match(/\/dashboard\/markets\/([^/]+)/);
  if (marketMatch?.[1]) return `market:${marketMatch[1]}`;

  const groupMarketMatch = pathname.match(
    /\/dashboard\/groups\/([^/]+)\/markets\/([^/]+)/,
  );
  if (groupMarketMatch?.[2]) return `market:${groupMarketMatch[2]}`;

  return null;
}

function getActiveGroupRoom(pathname: string | null) {
  if (!pathname) return null;

  const groupMatch = pathname.match(/\/dashboard\/groups\/([^/]+)/);
  if (groupMatch?.[1] && groupMatch[1] !== "create" && groupMatch[1] !== "discover") {
    return `group:${groupMatch[1]}`;
  }

  return null;
}

export function RealtimeBridge() {
  const toast = useToast();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { status } = useSession();

  // Main socket event listeners
  useEffect(() => {
    if (status !== "authenticated") {
      disconnectSocket();
      return;
    }

    const socket = connectSocket();

    const onWalletUpdate = (payload: unknown) => {
      emitLiveUserRefresh();
      emitBrowserEvent(EVENT_WALLET_UPDATE, payload);
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["live-user"] });
    };

    const onNotification = (payload: NotificationEventPayload) => {
      emitBrowserEvent(EVENT_NOTIFICATION, payload);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      const title =
        typeof payload?.title === "string" && payload.title.trim()
          ? payload.title
          : "New notification";
      const description =
        typeof payload?.message === "string" && payload.message.trim()
          ? payload.message
          : "You have a new update.";
      toast.info(title, description);
    };

    const onMarketUpdate = (payload: MarketEventPayload) => {
      emitBrowserEvent(EVENT_MARKET_UPDATE, payload);
      queryClient.invalidateQueries({ queryKey: ["markets"] });
      if (payload?.marketId) {
        queryClient.invalidateQueries({
          queryKey: ["market", payload.marketId],
        });
      }
    };

    const onMarketSettled = (payload: MarketEventPayload) => {
      onMarketUpdate(payload);
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["my-positions"] });
    };

    const onBetSettled = (payload: BetSettledPayload) => {
      emitBrowserEvent(EVENT_BET_SETTLED, payload);
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["my-positions"] });
      emitLiveUserRefresh();
    };

    const onGroupActivity = (payload: GroupActivityPayload) => {
      emitBrowserEvent(EVENT_GROUP_ACTIVITY, payload);
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      if (payload?.groupId) {
        queryClient.invalidateQueries({
          queryKey: ["group", payload.groupId],
        });
      }
    };

    // Register all event handlers — handle both underscore and colon naming conventions
    socket.on("wallet_update", onWalletUpdate);
    socket.on("wallet:updated", onWalletUpdate);
    socket.on("notification", onNotification);
    socket.on("notification:new", onNotification);
    socket.on("market_update", onMarketUpdate);
    socket.on("market:pool_updated", onMarketUpdate);
    socket.on("market:settled", onMarketSettled);
    socket.on("bet_placed", onMarketUpdate);
    socket.on("prediction:result", onBetSettled);
    socket.on("bet_settled", onBetSettled);
    socket.on("group:activity", onGroupActivity);

    return () => {
      socket.off("wallet_update", onWalletUpdate);
      socket.off("wallet:updated", onWalletUpdate);
      socket.off("notification", onNotification);
      socket.off("notification:new", onNotification);
      socket.off("market_update", onMarketUpdate);
      socket.off("market:pool_updated", onMarketUpdate);
      socket.off("market:settled", onMarketSettled);
      socket.off("bet_placed", onMarketUpdate);
      socket.off("prediction:result", onBetSettled);
      socket.off("bet_settled", onBetSettled);
      socket.off("group:activity", onGroupActivity);
    };
  }, [queryClient, status, toast]);

  // Market room subscription based on active page
  useEffect(() => {
    if (status !== "authenticated") return;

    const room = getActiveRoom(pathname);
    if (!room) return;

    const socket = getSocketClient();
    if (!socket.connected) {
      socket.connect();
    }
    joinSocketRoom(room);

    return () => {
      leaveSocketRoom(room);
    };
  }, [pathname, status]);

  // Group room subscription based on active page
  useEffect(() => {
    if (status !== "authenticated") return;

    const groupRoom = getActiveGroupRoom(pathname);
    if (!groupRoom) return;

    const socket = getSocketClient();
    if (!socket.connected) {
      socket.connect();
    }
    joinSocketRoom(groupRoom);

    return () => {
      leaveSocketRoom(groupRoom);
    };
  }, [pathname, status]);

  return null;
}

export const realtimeEventNames = {
  notification: EVENT_NOTIFICATION,
  marketUpdate: EVENT_MARKET_UPDATE,
  walletUpdate: EVENT_WALLET_UPDATE,
  betSettled: EVENT_BET_SETTLED,
  groupActivity: EVENT_GROUP_ACTIVITY,
};

