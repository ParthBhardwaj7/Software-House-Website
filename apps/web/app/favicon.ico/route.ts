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
    // Prevent accidental self-loop when someone saves `/favicon.ico` as favicon URL.
    if (sourceUrl.pathname === "/favicon.ico") {
      return NextResponse.redirect(fallbackUrl, 307);
    }

    const upstream = await fetch(sourceUrl.toString(), {
      // Revalidate in the background in production to reduce origin load.
      next: { revalidate: 300 },
    });
    if (!upstream.ok) return NextResponse.redirect(fallbackUrl, 307);

    const contentType = upstream.headers.get("content-type") || "";
    if (!contentType.toLowerCase().startsWith("image/")) {
      return NextResponse.redirect(fallbackUrl, 307);
    }

    const bytes = await upstream.arrayBuffer();
    return new NextResponse(bytes, {
      headers: {
        "content-type": contentType || "image/x-icon",
        "cache-control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    return NextResponse.redirect(fallbackUrl, 307);
  }
}
