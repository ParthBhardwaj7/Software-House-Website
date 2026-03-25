"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed z-40 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#0F172A] shadow-md transition hover:bg-[#F8FAFC] motion-reduce:transition-none bottom-[calc(6rem+env(safe-area-inset-bottom,0px))] right-[calc(1.5rem+env(safe-area-inset-right,0px))]"
      aria-label="Back to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}
