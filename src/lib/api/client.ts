"use client";

import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getSession } from "next-auth/react";

type RetryableConfig = InternalAxiosRequestConfig & {
  _retryCount?: number;
  _retryAuth?: boolean;
  _tokenSnapshot?: string;
};

const API_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || 15_000);
const MAX_RETRIES = Math.max(
  0,
  Number(process.env.NEXT_PUBLIC_API_RETRY_COUNT || 2),
);
const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/+$/, "") || "";

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getSessionAccessToken(session: unknown) {
  if (!session || typeof session !== "object") return undefined;
  const accessToken =
    (session as { accessToken?: unknown }).accessToken ||
    (session as { access_token?: unknown }).access_token;
  return typeof accessToken === "string" && accessToken.trim()
    ? accessToken
    : undefined;
}

function isNetworkError(error: AxiosError) {
  return !error.response;
}

function isRetryableStatus(status?: number) {
  if (!status) return false;
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

function getBackoffMs(retryCount: number) {
  const base = 250;
  return Math.min(2_000, base * 2 ** Math.max(0, retryCount - 1));
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const retryableConfig = config as RetryableConfig;
    const session = await getSession();
    const token = getSessionAccessToken(session);

    if (token) {
      const headers = AxiosHeaders.from(config.headers || {});
      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
      retryableConfig._tokenSnapshot = token;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;
    if (!config) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    if (status === 401 && !config._retryAuth) {
      config._retryAuth = true;

      const refreshedSession = await getSession();
      const refreshedToken = getSessionAccessToken(refreshedSession);
      const tokenChanged =
        Boolean(refreshedToken) && refreshedToken !== config._tokenSnapshot;

      if (tokenChanged && refreshedToken) {
        const headers = AxiosHeaders.from(config.headers || {});
        headers.set("Authorization", `Bearer ${refreshedToken}`);
        config.headers = headers;
        config._tokenSnapshot = refreshedToken;
        return apiClient.request(config);
      }

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    const shouldRetry = isNetworkError(error) || isRetryableStatus(status);
    const currentRetry = config._retryCount || 0;

    if (shouldRetry && currentRetry < MAX_RETRIES) {
      config._retryCount = currentRetry + 1;
      await delay(getBackoffMs(config._retryCount));
      return apiClient.request(config);
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(
  error: unknown,
  fallback = "Request failed",
): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: unknown; error?: unknown; details?: unknown }
      | undefined;
    const message =
      (typeof responseData?.message === "string" && responseData.message) ||
      (typeof responseData?.error === "string" && responseData.error) ||
      (typeof responseData?.details === "string" && responseData.details) ||
      error.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export async function apiRequest<T = unknown>(
  config: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.request<T>(config);
  return response.data;
}

export async function apiGet<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
) {
  return apiRequest<T>({ ...config, url, method: "GET" });
}

export async function apiPost<T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
) {
  return apiRequest<T>({ ...config, url, data: body, method: "POST" });
}

export async function apiPatch<T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
) {
  return apiRequest<T>({ ...config, url, data: body, method: "PATCH" });
}

export async function apiPut<T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
) {
  return apiRequest<T>({ ...config, url, data: body, method: "PUT" });
}

export async function apiDelete<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
) {
  return apiRequest<T>({ ...config, url, method: "DELETE" });
}

export type ApiResponse<T = unknown> = AxiosResponse<T>;
