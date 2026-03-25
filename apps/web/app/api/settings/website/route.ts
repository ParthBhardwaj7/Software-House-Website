import { NextResponse } from "next/server";
import { DUMMY_SITE_SETTINGS } from "@/lib/dummy-data";
import { mergeFooterConfig, type FooterConfig } from "@/lib/footer-defaults";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export const dynamic = "force-dynamic";

function mergeWithDummy(data: Record<string, unknown>) {
  const pick = (k: keyof typeof DUMMY_SITE_SETTINGS) => {
    const v = data[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    return DUMMY_SITE_SETTINGS[k];
  };
  const footerRaw = typeof data.footerConfig === "string" ? data.footerConfig : null;
  const footerConfig: FooterConfig = mergeFooterConfig(footerRaw);
  return {
    websiteName: pick("websiteName"),
    contactEmail: pick("contactEmail"),
    phoneNumber: pick("phoneNumber"),
    tagline: typeof data.tagline === "string" && data.tagline.trim() ? data.tagline : DUMMY_SITE_SETTINGS.tagline,
    addressLine:
      typeof data.addressLine === "string" && data.addressLine.trim()
        ? data.addressLine
        : DUMMY_SITE_SETTINGS.addressLine,
    footerConfig,
  };
}

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/settings/website`, {
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      return NextResponse.json(mergeWithDummy({}));
    }
    return NextResponse.json(mergeWithDummy(data));
  } catch (err) {
    console.error("Settings API error:", err);
    return NextResponse.json(mergeWithDummy({}));
  }
}
