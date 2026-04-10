import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/get-api-url";

const API_URL = getApiUrl();

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ message: "Missing slug" }, { status: 400 });
  }
  try {
    const res = await fetch(`${API_URL}/custom-pages/slug/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { message: typeof data.message === "string" ? data.message : "Not found" },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("custom-pages slug proxy:", e);
    return NextResponse.json({ message: "Upstream error" }, { status: 502 });
  }
}
