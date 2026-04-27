import { NextRequest, NextResponse } from "next/server";
import { resolveFaviconUrlForMetadata } from "@/lib/public-website-settings";
import { getPublicWebsiteSettings } from "@/lib/server-website-settings";

export const dynamic = "force-dynamic";

/**
 * Crawler-friendly favicon endpoint.
 * Always serves the current admin-selected favicon when available.
 */
export async function GET(req: NextRequest) {
  const fallbackUrl = new URL("/icon", req.url);

  try {
    const s = await getPublicWebsiteSettings();
    const favicon = resolveFaviconUrlForMetadata(s.faviconUrl);

    if (!favicon) return NextResponse.redirect(fallbackUrl, 307);

    const sourceUrl = new URL(favicon, req.nextUrl.origin);
    const upstream = await fetch(sourceUrl.toString(), { cache: "no-store" });
    if (!upstream.ok) return NextResponse.redirect(fallbackUrl, 307);

    const bytes = await upstream.arrayBuffer();
    return new NextResponse(bytes, {
      headers: {
        "content-type": upstream.headers.get("content-type") || "image/x-icon",
        "cache-control": "public, max-age=300, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.redirect(fallbackUrl, 307);
  }
}
