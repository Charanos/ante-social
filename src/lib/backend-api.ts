const DEFAULT_BACKEND_API_URL = "http://localhost:3001";

function getBackendApiBaseUrl() {
  return (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    DEFAULT_BACKEND_API_URL
  );
}

type ProxyBackendOptions = {
  path: string;
  method?: string;
  token?: string;
  searchParams?: URLSearchParams;
  jsonBody?: unknown;
  rawBody?: ArrayBuffer;
  contentType?: string | null;
};

export async function proxyBackendRequest({
  path,
  method = "GET",
  token,
  searchParams,
  jsonBody,
  rawBody,
  contentType,
}: ProxyBackendOptions): Promise<Response> {
  try {
    const url = new URL(path, getBackendApiBaseUrl());

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

    const backendResponse = await fetch(url.toString(), requestInit);
    const responseText = await backendResponse.text();
    const responseHeaders = new Headers();
    const responseType = backendResponse.headers.get("content-type");

    if (responseType) {
      responseHeaders.set("content-type", responseType);
    } else {
      responseHeaders.set("content-type", "application/json");
    }

    return new Response(responseText, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
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
  const token = (session as { access_token?: unknown }).access_token;
  return typeof token === "string" ? token : undefined;
}
