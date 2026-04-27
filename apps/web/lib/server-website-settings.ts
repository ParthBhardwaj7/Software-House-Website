import { cache } from "react";
import { mergeFooterConfig, type FooterConfig } from "@/lib/footer-defaults";
import {
  mergePublicWebsiteSettings,
  type PublicWebsiteSettings,
} from "@/lib/public-website-settings";
import { getApiUrl } from "@/lib/get-api-url";

const API_URL = getApiUrl();

/** Server-only: full merged public settings (same rules as `/api/settings/website`). Cached per request. */
export const getPublicWebsiteSettings = cache(async (): Promise<PublicWebsiteSettings> => {
  try {
    const res = await fetch(`${API_URL}/settings/website`, { cache: "no-store" });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) return mergePublicWebsiteSettings({});
    return mergePublicWebsiteSettings(data);
  } catch {
    return mergePublicWebsiteSettings({});
  }
});

export type CustomNavItem = { href: string; label: string };

/** Server-only: navbar extras from custom published pages (same as client `/custom-pages/nav`). */
export const getCustomPagesNav = cache(async (): Promise<CustomNavItem[]> => {
  try {
    const res = await fetch(`${API_URL}/custom-pages/nav`, { cache: "no-store" });
    const raw = (await res.json().catch(() => [])) as unknown;
    if (!res.ok || !Array.isArray(raw)) return [];
    return raw
      .map((it: unknown) => {
        if (typeof it !== "object" || it === null) return null;
        const o = it as { slug?: string; navLabel?: string };
        if (typeof o.slug !== "string" || typeof o.navLabel !== "string") return null;
        const slug = o.slug.trim();
        const navLabel = o.navLabel.trim();
        if (!slug || !navLabel) return null;
        return { href: `/site/${slug}`, label: navLabel } as CustomNavItem;
      })
      .filter((x): x is CustomNavItem => x !== null);
  } catch {
    return [];
  }
});

/** Server-only: merged footer config (same merge rules as public settings API). */
export async function getPublicFooterConfig(): Promise<FooterConfig> {
  const s = await getPublicWebsiteSettings();
  return s.footerConfig;
}
