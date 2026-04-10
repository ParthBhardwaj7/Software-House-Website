/**
 * Single source of truth for the API base URL.
 *
 * Client-side (browser):
 *   Returns NEXT_PUBLIC_API_URL — baked into the JS bundle at build time.
 *   Must be the publicly reachable URL (e.g. http://167.71.230.103:3001).
 *   Set via GitHub Secret → docker build-arg → next build.
 *
 * Server-side (Next.js API routes, Server Components, SSR):
 *   Prefers API_INTERNAL_URL — the Docker-internal hostname (http://api:3001).
 *   This avoids an unnecessary external network roundtrip when both containers
 *   are on the same Docker network.
 *   Falls back to NEXT_PUBLIC_API_URL if API_INTERNAL_URL is not set
 *   (works in local dev without Docker).
 *
 * NEVER import this file directly in `"use client"` code that runs in the browser
 * and needs the URL at runtime — use process.env.NEXT_PUBLIC_API_URL directly there.
 * For everything else, always use this function.
 */
export function getApiUrl(): string {
  if (typeof window === "undefined") {
    // Server-side path
    return (
      process.env.API_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3001"
    );
  }
  // Client-side path — NEXT_PUBLIC_API_URL is baked in at build time
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
}
