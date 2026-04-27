import { NextResponse } from "next/server";
import { mergePublicWebsiteSettings } from "@/lib/public-website-settings";
import { getApiUrl } from "@/lib/get-api-url";

const API_URL = getApiUrl();

/** Backend down / wrong host — fetch fails with nested ECONNREFUSED (Node/undici). */
function isUnreachableBackend(err: unknown): boolean {
  let cur: unknown = err;
  const seen = new Set<unknown>();
  for (let depth = 0; depth < 10 && cur != null && !seen.has(cur); depth++) {
    seen.add(cur);
    if (typeof cur !== "object") break;
    const o = cur as { code?: string; cause?: unknown; errors?: unknown[] };
    if (o.code === "ECONNREFUSED" || o.code === "ENOTFOUND") return true;
    if (Array.isArray(o.errors)) {
      for (const e of o.errors) {
        if (typeof e === "object" && e !== null && "code" in e && (e as { code: string }).code === "ECONNREFUSED") {
          return true;
        }
      }
    }
    cur = o.cause;
  }
  return err instanceof Error && /fetch failed/i.test(err.message);
}

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
    if (isUnreachableBackend(err)) {
      console.warn(
        `[settings/website] Backend unreachable (${API_URL}) — returning merged defaults. Start the API or set NEXT_PUBLIC_API_URL / API_INTERNAL_URL.`
      );
    } else {
      console.error("Settings API error:", err);
    }
    return NextResponse.json(mergePublicWebsiteSettings({}));
  }
}
