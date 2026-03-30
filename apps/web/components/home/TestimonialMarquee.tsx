"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export type TestimonialMarqueeItem = {
  id: string;
  name: string;
  role: string;
  company: string | null;
  quote: string;
  rating: number | null;
};

type Props = {
  items: TestimonialMarqueeItem[];
  className?: string;
};

/** Fixed width per breakpoint so translateX(-50%) stays seamless (narrower on mobile). */
const CARD_FIXED =
  "shrink-0 min-w-[260px] w-[260px] md:min-w-[340px] md:w-[340px] rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm";

function StarRow({ rating }: { rating: number }) {
  const n = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="mb-3 flex gap-0.5 text-[#22C55E]" aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current stroke-[1.5]" />
      ))}
    </div>
  );
}

function TestimonialCard({
  t,
  ariaHidden,
  onCardEnter,
  onCardLeave,
}: {
  t: TestimonialMarqueeItem;
  ariaHidden?: boolean;
  onCardEnter: () => void;
  onCardLeave: () => void;
}) {
  const rating = t.rating ?? 5;

  return (
    <article
      className={cn(CARD_FIXED)}
      aria-hidden={ariaHidden || undefined}
      role={ariaHidden ? undefined : "listitem"}
      onMouseEnter={onCardEnter}
      onMouseLeave={onCardLeave}
    >
      <StarRow rating={rating} />
      <p className="mb-4 line-clamp-4 text-sm italic leading-relaxed text-[#64748B] md:text-[15px]">
        &ldquo;{t.quote}&rdquo;
      </p>
      <p className="font-semibold text-[#0F172A]">{t.name}</p>
      <p className="mt-1 text-sm text-[#94A3B8]">
        {t.role}
        {t.company ? ` · ${t.company}` : ""}
      </p>
    </article>
  );
}

/**
 * Infinite marquee: duplicate items, translate3d(-50%). Full-width outer; pause only on card hover.
 */
export function TestimonialMarquee({ items, className }: Props) {
  const reduce = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [durationSec, setDurationSec] = useState(25);
  /** Nested hover count so moving between cards does not resume mid-row */
  const [hoverDepth, setHoverDepth] = useState(0);
  const paused = hoverDepth > 0;

  const onCardEnter = () => setHoverDepth((d) => d + 1);
  const onCardLeave = () => setHoverDepth((d) => Math.max(0, d - 1));

  useLayoutEffect(() => {
    if (reduce || items.length === 0) return;
    const el = trackRef.current;
    if (!el) return;

    const update = () => {
      const w = el.scrollWidth;
      if (w < 4) return;
      const halfPx = w / 2;
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      const pxPerSec = mobile ? 22 : 42;
      const sec = halfPx / pxPerSec;
      if (mobile) {
        setDurationSec(Math.min(42, Math.max(28, Math.round(sec * 10) / 10)));
      } else {
        setDurationSec(Math.min(30, Math.max(20, Math.round(sec * 10) / 10)));
      }
    };

    update();
    const ro = new ResizeObserver(() => requestAnimationFrame(update));
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [items, reduce]);

  if (items.length === 0) {
    return null;
  }

  if (reduce) {
    return (
      <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)} role="list">
        {items.map((t) => (
          <div key={t.id} role="listitem">
            <TestimonialCard t={t} onCardEnter={() => {}} onCardLeave={() => {}} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("relative w-full", className)}
      role="region"
      aria-label="Scrolling client testimonials"
    >
      <div
        className="w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_5%,black_95%,transparent)]"
        style={{
          WebkitMaskImage: "linear-gradient(90deg,transparent,black 5%,black 95%,transparent)",
        }}
      >
        <div
          ref={trackRef}
          role="list"
          className={cn("flex w-max flex-nowrap gap-6 md:gap-8", "animate-testimonial-marquee")}
          style={{
            animationDuration: `${durationSec}s`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {items.map((t) => (
            <TestimonialCard
              key={`${t.id}-a`}
              t={t}
              onCardEnter={onCardEnter}
              onCardLeave={onCardLeave}
            />
          ))}
          {items.map((t) => (
            <TestimonialCard
              key={`${t.id}-b`}
              t={t}
              ariaHidden
              onCardEnter={onCardEnter}
              onCardLeave={onCardLeave}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
