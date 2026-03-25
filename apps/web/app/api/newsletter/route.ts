import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as { email?: string } | null;
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const res = await fetch(`${API_URL}/leads/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { message: typeof data.message === "string" ? data.message : "Subscription failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("Newsletter proxy error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
