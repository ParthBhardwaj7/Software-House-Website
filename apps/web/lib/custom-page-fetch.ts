import { cache } from "react";
import { headers } from "next/headers";
import type { CustomPagePayload } from "@/lib/custom-page-model";

/**
 * One fetch per request for both generateMetadata and the page (React cache).
 * Uses same-origin Next proxy for reliable SSR (see /api/custom-pages/slug/[slug]).
 */
export const loadCustomPage = cache(async (slug: string): Promise<CustomPagePayload | null> => {
  if (!slug?.trim()) return null;
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? "http";
    const url = `${proto}://${host}/api/custom-pages/slug/${encodeURIComponent(slug)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as CustomPagePayload;
  } catch {
    return null;
  }
});
