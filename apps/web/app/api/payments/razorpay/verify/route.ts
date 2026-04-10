import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/get-api-url";

const API_URL = getApiUrl();

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
    const paymentId = typeof body.paymentId === "string" ? body.paymentId.trim() : "";
    const signature = typeof body.signature === "string" ? body.signature.trim() : "";
    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ message: "Missing order, payment, or signature" }, { status: 400 });
    }

    const res = await fetch(`${API_URL}/payments/razorpay/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, paymentId, signature }),
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      const msg = typeof data.message === "string" ? data.message : "Verification failed";
      return NextResponse.json({ message: msg }, { status: res.status });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Razorpay verify proxy error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
