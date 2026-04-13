import { DEFAULT_SITE_LOGO_PATH } from "@/lib/brand";
import { DUMMY_SITE_SETTINGS } from "@/lib/dummy-data";
import { getSiteUrlString } from "@/lib/site-url";
import { mergeFooterConfig, type FooterConfig } from "@/lib/footer-defaults";
import {
  parseMarketingDeliveryJson,
  parseMarketingHomeJson,
  type MarketingDeliveryContent,
  type MarketingHomeContent,
} from "@/lib/marketing-defaults";

/** Shown in meta / JSON-LD when admin leaves site description empty */
export const DEFAULT_SITE_DESCRIPTION =
  "We build high-performance software solutions for modern businesses — strategy, engineering, and launch with one team.";

export const MAX_ABOUT_PAGE_CONTENT = 100_000;
export const MAX_LOGO_URL_LEN = 2000;
export const MAX_FAVICON_URL_LEN = 2000;

export type SocialLinks = {
  twitter: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  facebook: string;
  github: string;
  telegram: string;
};

export type PublicWebsiteSettings = {
  websiteName: string;
  contactEmail: string;
  phoneNumber: string;
  tagline: string;
  addressLine: string;
  logoUrl: string;
  /** Empty = use built-in app/icon.tsx. Otherwise full https URL or site-relative path /... */
  faviconUrl: string;
  siteDescription: string;
  seoTitleSuffix: string;
  aboutPageContent: string;
  enableBoatCursor: boolean;
  whatsappNumber: string;
  socialLinks: SocialLinks;
  footerConfig: FooterConfig;
  marketingHome: MarketingHomeContent;
  marketingDelivery: MarketingDeliveryContent;
};

const EMPTY_SOCIAL: SocialLinks = {
  twitter: "",
  instagram: "",
  youtube: "",
  linkedin: "",
  facebook: "",
  github: "",
  telegram: "",
};

export function parseSocialLinksFromRaw(raw: unknown): SocialLinks {
  if (typeof raw !== "string" || !raw.trim()) return { ...EMPTY_SOCIAL };
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    const pick = (k: keyof SocialLinks) =>
      typeof o[k] === "string" ? o[k].trim().slice(0, 500) : "";
    return {
      twitter: pick("twitter"),
      instagram: pick("instagram"),
      youtube: pick("youtube"),
      linkedin: pick("linkedin"),
      facebook: pick("facebook"),
      github: pick("github"),
      telegram: pick("telegram"),
    };
  } catch {
    return { ...EMPTY_SOCIAL };
  }
}

function strPick(data: Record<string, unknown>, key: string, fallback: string, max: number): string {
  const v = data[key];
  if (typeof v !== "string") return fallback;
  const t = v.trim();
  if (!t) return fallback;
  return t.slice(0, max);
}

/** Flat API payload (strings) or Next merged object — safe merge with dummy fallbacks */
export function mergePublicWebsiteSettings(data: Record<string, unknown>): PublicWebsiteSettings {
  const pickDummy = (k: keyof typeof DUMMY_SITE_SETTINGS) => {
    const v = data[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    return DUMMY_SITE_SETTINGS[k];
  };

  const footerRaw = typeof data.footerConfig === "string" ? data.footerConfig : null;
  const socialFromApi =
    typeof data.socialLinks === "string"
      ? data.socialLinks
      : typeof data.socialLinks === "object" && data.socialLinks !== null
        ? JSON.stringify(data.socialLinks)
        : "";

  let enableBoatCursor = false;
  const boatKey = data.enableBoatCursor;
  if (typeof boatKey === "string") {
    const s = boatKey.trim().toLowerCase();
    enableBoatCursor = s === "true" || s === "1" || s === "yes";
  }

  const siteDescription = strPick(data, "siteDescription", "", 500);
  const seoTitleSuffix = strPick(data, "seoTitleSuffix", "", 120);

  const wa = strPick(data, "whatsappNumber", "", 40);
  const envWa =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
      ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.trim()
      : "";

  return {
    websiteName: pickDummy("websiteName"),
    contactEmail: pickDummy("contactEmail"),
    phoneNumber: pickDummy("phoneNumber"),
    tagline:
      typeof data.tagline === "string" && data.tagline.trim()
        ? data.tagline.trim().slice(0, 500)
        : DUMMY_SITE_SETTINGS.tagline,
    addressLine:
      typeof data.addressLine === "string" && data.addressLine.trim()
        ? data.addressLine.trim().slice(0, 500)
        : DUMMY_SITE_SETTINGS.addressLine,
    logoUrl: (() => {
      const raw = data.logoUrl;
      if (typeof raw === "string" && raw.trim()) return raw.trim().slice(0, MAX_LOGO_URL_LEN);
      return DEFAULT_SITE_LOGO_PATH;
    })(),
    faviconUrl: strPick(data, "faviconUrl", "", MAX_FAVICON_URL_LEN),
    siteDescription: siteDescription || DEFAULT_SITE_DESCRIPTION,
    seoTitleSuffix: seoTitleSuffix || "Modern Software Agency",
    aboutPageContent: strPick(data, "aboutPageContent", "", MAX_ABOUT_PAGE_CONTENT),
    enableBoatCursor,
    whatsappNumber: wa || envWa,
    socialLinks: parseSocialLinksFromRaw(socialFromApi || JSON.stringify(EMPTY_SOCIAL)),
    footerConfig: mergeFooterConfig(footerRaw),
    marketingHome: parseMarketingHomeJson(
      typeof data.marketingHomeJson === "string" ? data.marketingHomeJson : null
    ),
    marketingDelivery: parseMarketingDeliveryJson(
      typeof data.marketingDeliveryJson === "string" ? data.marketingDeliveryJson : null
    ),
  };
}

/**
 * Extra brand spellings for JSON-LD `alternateName` (e.g. "APN Codix" → "apncodix", "APNCODIX").
 * Helps search engines associate queries without spaces with the same organization.
 */
export function deriveBrandAlternateNames(websiteName: string): string[] {
  const t = websiteName.trim();
  if (!t) return [];
  const noSpace = t.replace(/\s+/g, "");
  const variants = [
    noSpace,
    noSpace.toLowerCase(),
    noSpace.toUpperCase(),
    t.toLowerCase(),
  ];
  const out = new Set<string>();
  for (const v of variants) {
    if (v && v !== t) out.add(v);
  }
  return Array.from(out);
}

/** Absolute URL for Next.js `metadata.icons`, or null to keep file-based `app/icon.tsx`. */
export function resolveFaviconUrlForMetadata(faviconUrl: string): string | null {
  const t = faviconUrl.trim().slice(0, MAX_FAVICON_URL_LEN);
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("/")) {
    const base = getSiteUrlString().replace(/\/$/, "");
    return `${base}${t}`;
  }
  return null;
}
