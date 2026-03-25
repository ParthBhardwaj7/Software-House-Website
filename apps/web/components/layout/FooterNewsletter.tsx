"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; duplicate?: boolean };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Try again.");
        return;
      }
      setStatus("success");
      setMessage(
        data.duplicate ? "You are already subscribed." : "Thanks for subscribing!"
      );
      setEmail("");
      setTimeout(() => {
        setStatus("idle");
        setMessage(null);
      }, 4000);
    } catch {
      setStatus("error");
      setMessage("Network error. Check your connection.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-2">
      <Input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        disabled={status === "loading"}
        onChange={(e) => setEmail(e.target.value)}
        className="min-w-0 flex-1 border-[#334155] bg-[#1e293b] text-white placeholder:text-[#64748B] focus-visible:ring-[#22C55E] focus-visible:ring-offset-[#0F172A]"
      />
      <Button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-lg bg-[#22C55E] px-6 text-white transition-all hover:bg-[#16A34A] hover:shadow-lg hover:shadow-[#22C55E]/20"
      >
        {status === "loading" ? "…" : "Subscribe"}
      </Button>
      {message ? (
        <p
          className={`text-xs sm:col-span-full ${status === "error" ? "text-red-400" : "text-[#22C55E]"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
