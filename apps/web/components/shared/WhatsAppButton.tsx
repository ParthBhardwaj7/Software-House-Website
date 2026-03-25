"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890";

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;
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
