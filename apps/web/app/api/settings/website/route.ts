import { NextResponse } from "next/server";
import { mergePublicWebsiteSettings } from "@/lib/public-website-settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

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
