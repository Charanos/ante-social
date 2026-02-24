"use client";

import { io, type Socket } from "socket.io-client";
import { getSession } from "next-auth/react";

type SocketAuthPayload = { token?: string };

let socketInstance: Socket | null = null;

function getSessionAccessToken(session: unknown) {
  if (!session || typeof session !== "object") return undefined;
  const accessToken =
    (session as { accessToken?: unknown }).accessToken ||
    (session as { access_token?: unknown }).access_token;
  return typeof accessToken === "string" && accessToken.trim()
    ? accessToken
    : undefined;
}

function resolveWsUrl() {
  const configured =
    process.env.NEXT_PUBLIC_WS_URL ||
    process.env.NEXT_PUBLIC_WEBSOCKET_URL ||
    "";
  if (configured.trim()) return configured.trim();

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol === "https:" ? "https:" : "http:";
    return `${protocol}//${window.location.hostname}:3006`;
  }

  return "http://localhost:3006";
}

export function getSocketClient() {
  if (socketInstance) return socketInstance;

  socketInstance = io(resolveWsUrl(), {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1_000,
    reconnectionDelayMax: 10_000,
    auth: async (callback) => {
      const session = await getSession();
      const token = getSessionAccessToken(session);
      callback({ token } satisfies SocketAuthPayload);
    },
  });

  return socketInstance;
}

export function connectSocket() {
  const socket = getSocketClient();
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

export function disconnectSocket() {
  if (!socketInstance) return;
  socketInstance.disconnect();
}

export function joinSocketRoom(room: string) {
  if (!room) return;
  const socket = getSocketClient();
  socket.emit("join_room", { room });
}

export function leaveSocketRoom(room: string) {
  if (!room) return;
  const socket = getSocketClient();
  socket.emit("leave_room", { room });
}

export function onSocketEvent<T = unknown>(
  eventName: string,
  handler: (payload: T) => void,
) {
  const socket = getSocketClient();
  socket.on(eventName, handler);
  return () => {
    socket.off(eventName, handler);
  };
}
