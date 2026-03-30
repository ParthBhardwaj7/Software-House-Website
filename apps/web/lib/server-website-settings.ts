import { cache } from "react";
import { mergeFooterConfig, type FooterConfig } from "@/lib/footer-defaults";
import {
  mergePublicWebsiteSettings,
  type PublicWebsiteSettings,
} from "@/lib/public-website-settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

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

/** Server-only: merged footer config (same merge rules as public settings API). */
export async function getPublicFooterConfig(): Promise<FooterConfig> {
  const s = await getPublicWebsiteSettings();
  return s.footerConfig;
}
