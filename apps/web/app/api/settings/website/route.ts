import { NextResponse } from "next/server";
import { mergePublicWebsiteSettings } from "@/lib/public-website-settings";
import { getApiUrl } from "@/lib/get-api-url";

const API_URL = getApiUrl();

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/settings/website`, {
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      return NextResponse.json(mergePublicWebsiteSettings({}));
    }
    return NextResponse.json(mergePublicWebsiteSettings(data));
  } catch (err) {
    console.error("Settings API error:", err);
    return NextResponse.json(mergePublicWebsiteSettings({}));
  }
}
