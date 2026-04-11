"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Spacer for floating header */}
      <div className="h-20 sm:h-24" aria-hidden />

      {/* Floating pill bar - rectangle with half circles on left & right */}
      <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 sm:top-6">
        <div className="rounded-full border border-[#E5E7EB] bg-white/95 px-4 py-2 shadow-lg shadow-black/5 backdrop-blur-md sm:px-6 sm:py-2.5">
          <div className="flex h-12 items-center justify-between gap-3 sm:h-14">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22C55E] sm:h-9 sm:w-9">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <span className="text-base font-bold text-[#0F172A] sm:text-lg">APNCODIX</span>
            </Link>

            <nav className="hidden md:flex md:flex-1 md:justify-center md:gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#64748B] transition-colors hover:text-[#0F172A]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                asChild
                size="sm"
                className="hidden sm:inline-flex rounded-full bg-[#22C55E] px-4 text-white hover:bg-[#16A34A]"
              >
                <Link href="/contact">Get Started</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="sm:hidden rounded-full bg-[#22C55E] px-3 text-xs text-white hover:bg-[#16A34A]"
              >
                <Link href="/contact">Start</Link>
              </Button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] text-[#0F172A] md:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {open && (
          <>
            <div
              className="fixed inset-0 top-0 z-40 bg-[#0F172A]/40 md:hidden"
              aria-hidden
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-4 shadow-xl md:hidden">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-4 py-3 text-base font-medium text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </>
        )}
      </header>
    </>
  );
}
