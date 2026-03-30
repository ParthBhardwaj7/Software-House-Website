import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function turnstileSecretConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}

export function getClientIp(req: NextRequest): string | undefined {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  return real || undefined;
}

export async function verifyTurnstileToken(
  token: string | undefined,
  req: NextRequest
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true;
  const t = token?.trim();
  if (!t) return false;
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", t);
  const ip = getClientIp(req);
  if (ip) body.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

/** When TURNSTILE_SECRET_KEY is set, require a valid token. Otherwise no-op. */
export async function requireTurnstile(
  req: NextRequest,
  token: unknown
): Promise<NextResponse | null> {
  if (!turnstileSecretConfigured()) return null;
  const tok = typeof token === "string" ? token : "";
  const ok = await verifyTurnstileToken(tok, req);
  if (!ok) {
    return NextResponse.json({ message: "Security verification failed" }, { status: 400 });
  }
  return null;
}
