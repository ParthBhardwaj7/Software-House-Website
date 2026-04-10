import { clearTokens } from "./auth";
import { getApiUrl } from "./get-api-url";

/** Nest ValidationPipe returns `message` as string or string[] */
function formatApiErrorMessage(body: unknown): string {
  if (!body || typeof body !== "object") return "";
  const m = (body as { message?: unknown }).message;
  if (typeof m === "string") return m;
  if (Array.isArray(m) && m.every((x) => typeof x === "string")) return m.join(" ");
  return "";
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const base = getApiUrl();
  const url = endpoint.startsWith("http") ? endpoint : `${base}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };
  if (options?.token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${options.token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
    cache: typeof window === "undefined" ? "no-store" : undefined,
  });

  if (!res.ok) {
    /** Don’t redirect on failed sign-in — user stays on login and sees the error */
    if (
      res.status === 401 &&
      typeof window !== "undefined" &&
      !endpoint.includes("/auth/login")
    ) {
      clearTokens();
      window.location.href = "/anish/login";
    }
    const err = await res.json().catch(() => ({ message: res.statusText }));
    const message = formatApiErrorMessage(err);
    throw new Error(message || `API error ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    fetchAPI<T>(endpoint, { method: "GET", token }),
  post: <T>(endpoint: string, body?: unknown, token?: string) =>
    fetchAPI<T>(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined, token }),
  put: <T>(endpoint: string, body?: unknown, token?: string) =>
    fetchAPI<T>(endpoint, { method: "PUT", body: body ? JSON.stringify(body) : undefined, token }),
  delete: <T>(endpoint: string, token?: string) =>
    fetchAPI<T>(endpoint, { method: "DELETE", token }),
};
