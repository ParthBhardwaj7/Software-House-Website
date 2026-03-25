import { mergeFooterConfig, type FooterConfig } from "@/lib/footer-defaults";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

/** Server-only: merged footer config (same merge rules as public settings API). */
export async function getPublicFooterConfig(): Promise<FooterConfig> {
  try {
    const res = await fetch(`${API_URL}/settings/website`, { cache: "no-store" });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    const footerRaw = typeof data.footerConfig === "string" ? data.footerConfig : null;
    return mergeFooterConfig(footerRaw);
  } catch {
    return mergeFooterConfig(null);
  }
}
