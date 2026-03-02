const DEFAULT_BACKEND_API_URL = "http://localhost:3001";
const DEFAULT_AUTH_SERVICE_URL = "http://localhost:3002";
const DEFAULT_MARKET_SERVICE_URL = "http://localhost:3003";
const DEFAULT_WALLET_SERVICE_URL = "http://localhost:3004";
const DEFAULT_NOTIFICATION_SERVICE_URL = "http://localhost:3005";
const DEFAULT_ADMIN_SERVICE_URL = "http://localhost:3007";
const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_TOTAL_TIMEOUT_MS = 60000;

function getBackendApiBaseUrl() {
  const configuredUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (configuredUrl && configuredUrl.trim()) return configuredUrl;
  // Avoid silently proxying to localhost in production deployments (e.g. Vercel).
  if (process.env.NODE_ENV === "production") return "";
  return DEFAULT_BACKEND_API_URL;
}

function shouldUseLocalDirectDefaults(gatewayUrl: string) {
  return gatewayUrl.includes("localhost") || gatewayUrl.includes("127.0.0.1");
}

function getServiceUrl(envValue: string | undefined, localDefault: string, gatewayUrl: string) {
  if (envValue && envValue.trim()) return envValue;
  return shouldUseLocalDirectDefaults(gatewayUrl) ? localDefault : "";
}

function normalizeBaseUrl(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function rewritePath(path: string, fromPrefix: string, toPrefix: string) {
  if (!path.startsWith(fromPrefix)) return path;
  return `${toPrefix}${path.slice(fromPrefix.length)}`;
}

type Target = {
  baseUrl: string;
  path: string;
};

function buildTargetCandidates(path: string): Target[] {
  const gatewayBaseUrl = normalizeBaseUrl(getBackendApiBaseUrl());

  const authServiceUrl = getServiceUrl(
    process.env.AUTH_SERVICE_URL || process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
    DEFAULT_AUTH_SERVICE_URL,
    gatewayBaseUrl,
  );
  const marketServiceUrl = getServiceUrl(
    process.env.MARKET_SERVICE_URL || process.env.NEXT_PUBLIC_MARKET_SERVICE_URL,
    DEFAULT_MARKET_SERVICE_URL,
    gatewayBaseUrl,
  );
  const walletServiceUrl = getServiceUrl(
    process.env.WALLET_SERVICE_URL || process.env.NEXT_PUBLIC_WALLET_SERVICE_URL,
    DEFAULT_WALLET_SERVICE_URL,
    gatewayBaseUrl,
  );
  const notificationServiceUrl = getServiceUrl(
    process.env.NOTIFICATION_SERVICE_URL || process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL,
    DEFAULT_NOTIFICATION_SERVICE_URL,
    gatewayBaseUrl,
  );
  const adminServiceUrl = getServiceUrl(
    process.env.ADMIN_SERVICE_URL || process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL,
    DEFAULT_ADMIN_SERVICE_URL,
    gatewayBaseUrl,
  );

  const targets: Target[] = [];

  if (authServiceUrl) {
    let directPath = path;
    directPath = rewritePath(directPath, "/api/v1/auth", "/auth");
    directPath = rewritePath(directPath, "/api/v1/user", "/user");
    directPath = rewritePath(directPath, "/api/v1/users", "/users");
    if (directPath !== path) {
      targets.push({ baseUrl: normalizeBaseUrl(authServiceUrl), path: directPath });
    }
  }

  if (marketServiceUrl) {
    let directPath = path;
    directPath = rewritePath(directPath, "/api/v1/markets", "/markets");
    directPath = rewritePath(directPath, "/api/v1/predictions", "/predictions");
    directPath = rewritePath(directPath, "/api/v1/groups", "/groups");
    if (directPath !== path) {
      targets.push({ baseUrl: normalizeBaseUrl(marketServiceUrl), path: directPath });
    }
  }

  if (walletServiceUrl) {
    const directPath = rewritePath(path, "/api/v1/wallet", "/wallet");
    if (directPath !== path) {
      targets.push({ baseUrl: normalizeBaseUrl(walletServiceUrl), path: directPath });
    }
  }

  if (notificationServiceUrl) {
    const directPath = rewritePath(path, "/api/v1/notifications", "/notifications");
    if (directPath !== path) {
      targets.push({ baseUrl: normalizeBaseUrl(notificationServiceUrl), path: directPath });
    }
  }

  if (adminServiceUrl) {
    let directPath = path;
    const adminRewrite = rewritePath(directPath, "/api/v1/admin", "/admin");
    if (adminRewrite !== directPath) {
      targets.push({ baseUrl: normalizeBaseUrl(adminServiceUrl), path: adminRewrite });
    }
    const publicRewrite = rewritePath(directPath, "/api/v1/public", "/public");
    if (publicRewrite !== directPath) {
      targets.push({ baseUrl: normalizeBaseUrl(adminServiceUrl), path: publicRewrite });
    }
  }

  // Keep gateway as final fallback even in local mode to support setups
  // where only the gateway is directly reachable from the frontend runtime.
  if (gatewayBaseUrl) {
    targets.push({ baseUrl: gatewayBaseUrl, path });
  }

  // Preserve order while removing duplicate target URLs.
  const deduped: Target[] = [];
  const seen = new Set<string>();
  for (const target of targets) {
    const key = `${target.baseUrl}${target.path}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(target);
  }

  return deduped;
}

type ProxyBackendOptions = {
  path: string;
  method?: string;
  token?: string;
  searchParams?: URLSearchParams;
  jsonBody?: unknown;
  rawBody?: ArrayBuffer;
  contentType?: string | null;
  suppressTargetErrors?: boolean;
};

export async function proxyBackendRequest({
  path,
  method = "GET",
  token,
  searchParams,
  jsonBody,
  rawBody,
  contentType,
  suppressTargetErrors = false,
}: ProxyBackendOptions): Promise<Response> {
  const timeoutMs = Number(process.env.BACKEND_PROXY_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  const totalTimeoutMs = Number(
    process.env.BACKEND_PROXY_TOTAL_TIMEOUT_MS || DEFAULT_TOTAL_TIMEOUT_MS,
  );
  const targets = buildTargetCandidates(path);
  if (targets.length === 0) {
    return Response.json(
      {
        success: false,
        error: {
          code: "BACKEND_URL_NOT_CONFIGURED",
          message: "Set BACKEND_API_URL for this environment",
        },
      },
      { status: 503 },
    );
  }
  const startedAt = Date.now();
  let lastStatus = 502;
  let lastBody = "";
  let lastContentType = "application/json";

  try {
    for (const target of targets) {
      const elapsedMs = Date.now() - startedAt;
      const remainingMs = totalTimeoutMs - elapsedMs;
      if (remainingMs <= 200) break;

      const url = new URL(target.path, target.baseUrl);

      if (searchParams) {
        searchParams.forEach((value, key) => {
          url.searchParams.append(key, value);
        });
      }

      const headers = new Headers();

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      if (contentType) {
        headers.set("content-type", contentType);
      }

      if (jsonBody !== undefined && !headers.has("content-type")) {
        headers.set("content-type", "application/json");
      }

      const requestInit: RequestInit = {
        method,
        headers,
        cache: "no-store",
      };

      if (rawBody !== undefined) {
        requestInit.body = rawBody;
      } else if (jsonBody !== undefined) {
        requestInit.body = JSON.stringify(jsonBody);
      }

      const controller = new AbortController();
      const requestTimeoutMs = Math.max(500, Math.min(timeoutMs, remainingMs));
      const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
      requestInit.signal = controller.signal;

      try {
        const backendResponse = await fetch(url.toString(), requestInit);
        clearTimeout(timeout);

        const responseText = await backendResponse.text();
        const responseType = backendResponse.headers.get("content-type") || "application/json";
        const isApiPath = path.startsWith("/api/");
        const looksLikeHtml =
          responseType.includes("text/html") ||
          /^\s*<!doctype html/i.test(responseText) ||
          /^\s*<html/i.test(responseText);

        // Some misconfigured upstreams may return HTML with 200. Treat that as invalid
        // for API routes and continue to the next fallback target.
        if (backendResponse.ok && isApiPath && looksLikeHtml) {
          lastStatus = 502;
          lastBody = "";
          continue;
        }

        if (
          backendResponse.ok ||
          (backendResponse.status < 500 && backendResponse.status !== 404 && backendResponse.status !== 408)
        ) {
          return new Response(responseText, {
            status: backendResponse.status,
            headers: { "content-type": responseType },
          });
        }

        lastStatus = backendResponse.status;
        lastBody = responseText;
        lastContentType = responseType;
      } catch (error) {
        clearTimeout(timeout);
        if (!suppressTargetErrors) {
          console.error("Backend proxy target error:", target.baseUrl, target.path, error);
        }
      }
    }

    if (lastBody) {
      return new Response(lastBody, {
        status: lastStatus,
        headers: { "content-type": lastContentType },
      });
    }

    return Response.json(
      {
        success: false,
        error: { code: "UPSTREAM_UNAVAILABLE", message: "Backend service unavailable" },
      },
      { status: 502 },
    );
  } catch (error) {
    console.error("Backend proxy error:", error);
    return Response.json(
      { success: false, error: { code: "UPSTREAM_UNAVAILABLE", message: "Backend service unavailable" } },
      { status: 502 },
    );
  }
}

export function getSessionToken(session: unknown): string | undefined {
  if (!session || typeof session !== "object") return undefined;
  const token =
    (session as { access_token?: unknown }).access_token ||
    (session as { accessToken?: unknown }).accessToken;
  return typeof token === "string" ? token : undefined;
}
