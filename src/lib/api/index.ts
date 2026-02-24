"use client";

import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
} from "@/lib/api/client";

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

function buildQuery(params?: QueryParams) {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export type PaginatedMeta = {
  total?: number;
  limit?: number;
  offset?: number;
  page?: number;
};

export type PaginatedResponse<T> = {
  data?: T[];
  meta?: PaginatedMeta;
};

export type AdminUser = {
  _id: string;
  username: string;
  email: string;
  role: string;
  tier: string;
  createdAt: string;
  isVerified: boolean;
  isFlagged?: boolean;
  isBanned?: boolean;
};

export type NotificationItem = {
  id?: string;
  _id?: string;
  type: string;
  title: string;
  message: string;
  isRead?: boolean;
  is_read?: boolean;
  createdAt?: string;
  created_date?: string;
};

export const adminApi = {
  getUsers: (params?: QueryParams) =>
    apiGet<PaginatedResponse<AdminUser>>(`/api/admin/users${buildQuery(params)}`),
  getUserById: (userId: string) => apiGet(`/api/admin/users/${userId}`),
  updateUserTier: (userId: string, tier: string) =>
    apiPatch(`/api/admin/users/${userId}/tier`, { tier }),
  suspendUser: (userId: string, reason?: string) =>
    apiPatch(`/api/admin/users/${userId}/suspend`, { reason }),
  unsuspendUser: (userId: string) =>
    apiPatch(`/api/admin/users/${userId}/unsuspend`, {}),
  deleteUser: (userId: string) => apiDelete(`/api/admin/users/${userId}`),
  getStats: () => apiGet("/api/admin/stats"),
  getComplianceFlags: (params?: QueryParams) =>
    apiGet<PaginatedResponse<Record<string, unknown>>>(
      `/api/admin/compliance${buildQuery(params)}`,
    ),
  applyComplianceAction: (userId: string, action: "freeze" | "unfreeze", reason?: string) =>
    apiPost("/api/admin/compliance", { userId, action, reason }),
  getWithdrawals: (params?: QueryParams) =>
    apiGet(`/api/admin/withdrawals${buildQuery(params)}`),
  approveWithdrawal: (transactionId: string) =>
    apiPost("/api/admin/withdrawals", { transactionId, action: "approve" }),
  rejectWithdrawal: (transactionId: string, reason: string) =>
    apiPost("/api/admin/withdrawals", { transactionId, action: "reject", reason }),
  getMaintenanceTasks: () => apiGet("/api/admin/maintenance"),
  runMaintenanceTask: (taskId: string) =>
    apiPost("/api/admin/maintenance", { taskId }),
};

export const walletApi = {
  getBalance: () => apiGet("/api/wallet/balance"),
  getTransactions: (params?: QueryParams) =>
    apiGet(`/api/wallet/transactions${buildQuery(params)}`),
  deposit: (payload: Record<string, unknown>) => apiPost("/api/wallet/deposit", payload),
  withdraw: (payload: Record<string, unknown>) => apiPost("/api/wallet/withdraw", payload),
};

export const marketsApi = {
  list: (params?: QueryParams) => apiGet(`/api/markets${buildQuery(params)}`),
  getById: (marketId: string) => apiGet(`/api/markets/${marketId}`),
  create: (payload: Record<string, unknown>) => apiPost("/api/markets", payload),
  update: (marketId: string, payload: Record<string, unknown>) =>
    apiPatch(`/api/markets/${marketId}`, payload),
  remove: (marketId: string) => apiDelete(`/api/markets/${marketId}`),
  placeBet: (marketId: string, payload: Record<string, unknown>) =>
    apiPost(`/api/markets/${marketId}/bet`, payload),
  close: (marketId: string) => apiPut(`/api/markets/${marketId}/close`),
  settle: (marketId: string, payload: Record<string, unknown>) =>
    apiPost(`/api/markets/${marketId}/settle`, payload),
  getMyPositions: (params?: QueryParams) =>
    apiGet(`/api/markets/my/positions${buildQuery(params)}`),
  updatePosition: (positionId: string, payload: Record<string, unknown>) =>
    apiPatch(`/api/markets/my/positions/${positionId}`, payload),
  cancelPosition: (positionId: string) =>
    apiDelete(`/api/markets/my/positions/${positionId}`),
};

export const groupsApi = {
  list: (params?: QueryParams) => apiGet(`/api/groups${buildQuery(params)}`),
  create: (payload: Record<string, unknown>) => apiPost("/api/groups", payload),
  getById: (groupId: string) => apiGet(`/api/groups/${groupId}`),
  update: (groupId: string, payload: Record<string, unknown>) =>
    apiPatch(`/api/groups/${groupId}`, payload),
  join: (groupId: string) => apiPost(`/api/groups/${groupId}/join`),
  leave: (groupId: string) => apiPost(`/api/groups/${groupId}/leave`),
  getMarkets: (groupId: string, params?: QueryParams) =>
    apiGet(`/api/groups/${groupId}/markets${buildQuery(params)}`),
  createMarket: (groupId: string, payload: Record<string, unknown>) =>
    apiPost(`/api/groups/${groupId}/markets`, payload),
};

export const notificationsApi = {
  list: (params?: QueryParams) => apiGet(`/api/notifications${buildQuery(params)}`),
  markRead: (id: string) => apiPut("/api/notifications", { id }),
  markAllRead: () => apiPut("/api/notifications", { id: "all" }),
  remove: (id: string) => apiDelete(`/api/notifications${buildQuery({ id })}`),
};

export const profileApi = {
  get: () => apiGet("/api/user/profile"),
  update: (payload: Record<string, unknown>) => apiPut("/api/user/profile", payload),
  getActivity: (params?: QueryParams) => apiGet(`/api/user/activity${buildQuery(params)}`),
  getPublic: (userId: string) => apiGet(`/api/users/${userId}/profile`),
};

export const authApi = {
  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiPost("/api/auth/password", payload),
  setupTwoFactor: () => apiPost("/api/auth/2fa/setup", {}),
  verifyTwoFactorSetup: (token: string) => apiPost("/api/auth/2fa/verify", { token }),
  disableTwoFactor: (token: string) => apiPost("/api/auth/2fa/disable", { token }),
};
