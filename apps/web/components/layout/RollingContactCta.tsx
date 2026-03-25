"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  className?: string;
  /** Line height in px for the rolling strip (match button padding) */
  lineClassName?: string;
  label?: string;
  duplicateLabel?: string;
  /** `navbar` = white pill / dark text (legacy dark glass bar) */
  /** `consultation` = green pill, sentence case, roll to duplicate (e.g. It's free) */
  variant?: "default" | "navbar" | "consultation";
};

/** Fast vertical roll on hover — same pattern as nav, ~150ms */
export function RollingContactCta({
  href = "/contact",
  className,
  lineClassName = "h-10",
  label = "Get in Touch",
  duplicateLabel = "Get in Touch",
  variant = "default",
}: Props) {
  const isNav = variant === "navbar";
  const isConsultation = variant === "consultation";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        isConsultation && "transition-all duration-300",
        !isConsultation && "transition-colors",
        isConsultation &&
          "rounded-full bg-[#22C55E] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#16A34A] hover:shadow-md focus-visible:outline-[#22C55E] normal-case tracking-normal",
        isNav &&
          "bg-white text-[#0F172A] text-xs uppercase tracking-[0.12em] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.35)] hover:bg-white/95 focus-visible:outline-white/50",
        variant === "default" &&
          "gap-2 bg-[#22C55E] text-xs uppercase tracking-[0.12em] text-white shadow-md shadow-[#22C55E]/20 hover:bg-[#16A34A] focus-visible:outline-[#22C55E]",
        className
      )}
    >
      <span className={cn("block overflow-hidden", lineClassName)}>
        <span className="flex flex-col transition-transform duration-150 ease-out group-hover:-translate-y-1/2 motion-reduce:transform-none">
          <span
            className={cn(
              "flex shrink-0 items-center justify-center text-center",
              lineClassName,
              isConsultation && "leading-none"
            )}
          >
            {label}
          </span>
          <span
            className={cn(
              "flex shrink-0 items-center justify-center text-center",
              lineClassName,
              isConsultation && "leading-none",
              isNav ? "text-[#0F172A]" : "text-white"
            )}
          >
            {duplicateLabel}
          </span>
        </span>
      </span>
      {variant === "default" && (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white">
          <ArrowRight className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden />
        </span>
      )}
    </Link>
  );
}
