"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import type { TurnstileWidgetHandle } from "@/lib/turnstile-ref";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TurnstileField } from "@/components/security/TurnstileField";

const HAS_TURNSTILE = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim());

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayConstructor = new (options: {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccess) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}) => { open: () => void };

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("no window"));
      return;
    }
    const w = window as unknown as { Razorpay?: RazorpayConstructor };
    if (w.Razorpay) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("script load failed")), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("script load failed"));
    document.body.appendChild(s);
  });
}

export function PayCheckout({ razorpayKeyId }: { razorpayKeyId: string }) {
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null);

  const pay = useCallback(async () => {
    setMessage(null);
    setLastPaymentId(null);
    const n = Number.parseFloat(amount);
    if (!Number.isFinite(n) || n < 1) {
      setMessage("Enter a valid amount in INR (minimum ₹1).");
      setStatus("error");
      return;
    }
    if (HAS_TURNSTILE && !turnstileToken?.trim()) {
      setMessage("Complete the security check below.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountRupees: n,
          customerName: customerName.trim() || undefined,
          customerEmail: customerEmail.trim() || undefined,
          notes: notes.trim() || undefined,
          turnstileToken: turnstileToken ?? undefined,
        }),
      });
      const data = (await res.json()) as {
        message?: string;
        orderId?: string;
        amountPaise?: number;
        currency?: string;
      };
      if (!res.ok) {
        setMessage(data.message || "Could not start payment");
        setStatus("error");
        return;
      }
      if (!data.orderId || data.amountPaise == null) {
        setMessage("Invalid response from server");
        setStatus("error");
        return;
      }

      setTurnstileToken(null);
      turnstileRef.current?.reset();

      await loadRazorpayScript();
      const w = window as unknown as { Razorpay: RazorpayConstructor };
      const Razorpay = w.Razorpay;
      if (!Razorpay) {
        setMessage("Could not load Razorpay checkout");
        setStatus("error");
        return;
      }

      const rzp = new Razorpay({
        key: razorpayKeyId,
        amount: data.amountPaise,
        currency: data.currency || "INR",
        name: "Payment",
        description: notes.trim() || "Invoice / retainer",
        order_id: data.orderId,
        handler: (resp: RazorpaySuccess) => {
          void (async () => {
            try {
              const v = await fetch("/api/payments/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: resp.razorpay_order_id,
                  paymentId: resp.razorpay_payment_id,
                  signature: resp.razorpay_signature,
                }),
              });
              if (!v.ok) {
                const j = (await v.json().catch(() => ({}))) as { message?: string };
                setMessage(
                  j.message ||
                    "Payment returned from Razorpay but server verification failed. Contact support with your Payment ID."
                );
                setStatus("error");
                setLastPaymentId(resp.razorpay_payment_id);
                return;
              }
              setLastPaymentId(resp.razorpay_payment_id);
              setMessage("Payment verified. Save this ID for your records.");
              setStatus("idle");
            } catch {
              setLastPaymentId(resp.razorpay_payment_id);
              setMessage("Could not verify payment on the server. Save your Payment ID and contact support.");
              setStatus("error");
            }
          })();
        },
        prefill: {
          name: customerName.trim() || undefined,
          email: customerEmail.trim() || undefined,
        },
        theme: { color: "#16A34A" },
        modal: {
          ondismiss() {
            setStatus("idle");
          },
        },
      });
      setStatus("idle");
      rzp.open();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  }, [amount, customerName, customerEmail, notes, razorpayKeyId, turnstileToken]);

  return (
    <div className="mt-6 space-y-4">
      <div>
        <label htmlFor="pay-amount" className="mb-1 block text-sm font-medium text-foreground">
          Amount (INR)
        </label>
        <input
          id="pay-amount"
          type="number"
          min={1}
          step="0.01"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="e.g. 5000"
        />
      </div>
      <div>
        <label htmlFor="pay-name" className="mb-1 block text-sm font-medium text-foreground">
          Name (optional)
        </label>
        <input
          id="pay-name"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div>
        <label htmlFor="pay-email" className="mb-1 block text-sm font-medium text-foreground">
          Email (optional)
        </label>
        <input
          id="pay-email"
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div>
        <label htmlFor="pay-notes" className="mb-1 block text-sm font-medium text-foreground">
          Note / invoice reference (optional)
        </label>
        <input
          id="pay-notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {message ? (
        <p
          className={`text-sm ${status === "error" || message.includes("Could not") ? "text-destructive" : "text-muted-foreground"}`}
        >
          {message}
        </p>
      ) : null}
      {lastPaymentId ? (
        <p className="rounded-md bg-muted px-3 py-2 font-mono text-xs text-foreground">Payment ID: {lastPaymentId}</p>
      ) : null}

      {HAS_TURNSTILE ? <TurnstileField ref={turnstileRef} onToken={setTurnstileToken} size="normal" /> : null}

      <Button type="button" className="w-full sm:w-auto" disabled={status === "loading"} onClick={() => void pay()}>
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Starting…
          </>
        ) : (
          "Pay with Razorpay"
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        You will complete payment on Razorpay’s secure page. For refunds and cancellations, see our{" "}
        <Link href="/refund-policy" className="underline underline-offset-2 hover:text-foreground">
          refund & cancellation policy
        </Link>
        .
      </p>
    </div>
  );
}
