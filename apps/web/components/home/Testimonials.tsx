"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { DUMMY_TESTIMONIALS } from "@/lib/dummy-data";
import { fillToMin } from "@/lib/fill-dummy";
import { TestimonialMarquee, type TestimonialMarqueeItem } from "./TestimonialMarquee";

type Testimonial = TestimonialMarqueeItem & {
  avatarUrl?: string | null;
  date?: string;
};

const HEADING_ID = "testimonials-heading";

type TestimonialsProps = {
  variant?: "default" | "stacked";
  tone?: "light" | "dark";
};

export function Testimonials({ variant = "default", tone = "light" }: TestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Testimonial[]>("/testimonials")
      .then(setTestimonials)
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  const display = useMemo(
    () => fillToMin(testimonials, DUMMY_TESTIMONIALS as Testimonial[], 6),
    [testimonials]
  );

  const isStacked = variant === "stacked";
  const isDark = tone === "dark";

  return (
    <section
      className={cn(
        "section-pop relative w-full",
        isStacked
          ? "flex min-h-0 w-full flex-col justify-center bg-transparent py-0"
          : "bg-[#F8FAFC] py-16 md:py-24"
      )}
      aria-labelledby={HEADING_ID}
    >
      <div
        className={cn(
          "mx-auto w-full",
          isStacked ? "" : "container max-w-7xl px-4 sm:px-6 lg:px-8"
        )}
      >
        <div className={cn("text-center", isStacked ? "mb-5 md:mb-6" : "mb-10 md:mb-14")}>
          <h2
            id={HEADING_ID}
            className={cn(
              "font-display text-3xl font-normal tracking-tight md:text-4xl",
              isDark ? "text-white" : "text-foreground"
            )}
          >
            What Our Clients Say
          </h2>
          <p
            className={cn(
              "mx-auto mt-4 max-w-2xl",
              isDark ? "text-slate-400" : "text-muted-foreground"
            )}
          >
            Real feedback from teams we&apos;ve shipped with — quality, speed, and partnership.
          </p>
        </div>
      </div>

      {/* Full-bleed marquee — no max-width so strip uses full viewport */}
      {loading ? (
        <div
          className="w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_5%,black_95%,transparent)]"
          style={{ WebkitMaskImage: "linear-gradient(90deg,transparent,black 5%,black 95%,transparent)" }}
        >
          <div className="flex w-max flex-nowrap gap-6 md:gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="shrink-0 min-w-[260px] w-[260px] md:min-w-[340px] md:w-[340px] rounded-xl border border-border bg-white p-6 shadow-sm"
              >
                  <div className="mb-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} className="h-4 w-4 rounded bg-muted animate-pulse" />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-muted animate-pulse" />
                    <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-4/6 rounded bg-muted animate-pulse" />
                  </div>
                  <div className="mt-4 h-4 w-32 rounded bg-muted animate-pulse" />
                  <div className="mt-2 h-3 w-24 rounded bg-muted animate-pulse" />
                </div>
              ))}
          </div>
        </div>
      ) : (
        <TestimonialMarquee items={display} />
      )}
    </section>
  );
}
