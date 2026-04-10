import { NextRequest, NextResponse } from "next/server";
import { requireTurnstile } from "@/lib/turnstile-verify";
import { getApiUrl } from "@/lib/get-api-url";

const API_URL = getApiUrl();

const MIN_INR = 1;
const MAX_INR = 500_000;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    const captcha = await requireTurnstile(req, body.turnstileToken);
    if (captcha) return captcha;

    const amountRaw = body.amountRupees;
    const n =
      typeof amountRaw === "number"
        ? amountRaw
        : typeof amountRaw === "string"
          ? Number.parseFloat(amountRaw)
          : NaN;
    if (!Number.isFinite(n) || n < MIN_INR || n > MAX_INR) {
      return NextResponse.json(
        { message: `Amount must be between ₹${MIN_INR} and ₹${MAX_INR}` },
        { status: 400 }
      );
    }
    const amountPaise = Math.round(n * 100);
    const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
    const customerEmail = typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";

    const res = await fetch(`${API_URL}/payments/razorpay/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amountPaise,
        customerName: customerName || undefined,
        customerEmail: customerEmail || undefined,
        notes: notes || undefined,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      const msg = typeof data.message === "string" ? data.message : "Could not create payment";
      return NextResponse.json({ message: msg }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("Razorpay order proxy error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
