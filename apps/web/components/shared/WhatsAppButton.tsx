"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

export function WhatsAppButton() {
  const [wa, setWa] = useState<string | null>(null);

  useEffect(() => {
    const env = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER : undefined;
    const envDigits = env ? digitsOnly(env) : "";
    fetch("/api/settings/website")
      .then((r) => (r.ok ? r.json() : Promise.resolve({})))
      .then((data: { whatsappNumber?: string }) => {
        const fromApi = typeof data.whatsappNumber === "string" ? digitsOnly(data.whatsappNumber) : "";
        const n = fromApi || envDigits;
        setWa(n || null);
      })
      .catch(() => {
        setWa(envDigits || null);
      });
  }, []);

  if (!wa) return null;

  const href = `https://wa.me/${wa}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-lg ring-2 ring-white/90 transition-all hover:scale-105 hover:bg-[#16A34A] motion-reduce:transition-none bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] right-[calc(1.5rem+env(safe-area-inset-right,0px))]"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </Link>
  );
}
