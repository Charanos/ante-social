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

export function RealtimeBridge() {
  const toast = useToast();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { status } = useSession();

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

    socket.on("wallet_update", onWalletUpdate);
    socket.on("notification", onNotification);
    socket.on("market_update", onMarketUpdate);
    socket.on("bet_placed", onMarketUpdate);

    return () => {
      socket.off("wallet_update", onWalletUpdate);
      socket.off("notification", onNotification);
      socket.off("market_update", onMarketUpdate);
      socket.off("bet_placed", onMarketUpdate);
    };
  }, [queryClient, status, toast]);

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

  return null;
}

export const realtimeEventNames = {
  notification: EVENT_NOTIFICATION,
  marketUpdate: EVENT_MARKET_UPDATE,
  walletUpdate: EVENT_WALLET_UPDATE,
};
