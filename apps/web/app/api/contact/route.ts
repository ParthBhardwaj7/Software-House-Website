import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      message,
      serviceInterest,
      consentAccepted,
    } = body as Record<string, unknown>;

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Name, email, and message are required" },
        { status: 400 }
      );
    }
    if (consentAccepted !== true) {
      return NextResponse.json(
        { message: "You must accept the terms to continue" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_URL}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone: typeof phone === "string" ? phone : undefined,
        message,
        source: "contact",
        serviceInterest:
          typeof serviceInterest === "string" ? serviceInterest : undefined,
        consentAccepted: true,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { message: (data as { message?: string }).message || "Failed to send message" },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
