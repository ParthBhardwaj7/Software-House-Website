"use client";

import { useEffect, useMemo, useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Star } from "lucide-react";
import { api } from "@/lib/api";
import { DUMMY_TESTIMONIALS } from "@/lib/dummy-data";
import { MarketingEmptyState } from "@/components/shared/MarketingEmptyState";
import { resolveMarketingList } from "@/lib/resolve-marketing-list";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string | null;
  quote: string;
  avatarUrl: string | null;
  rating: number | null;
  date?: string;
  createdAt?: string;
};

const ACCENT = "#FF8A00";
const BG = "#F2F2F2";
const TEXT = "#333333";
const MUTED = "#777777";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const headerMotion = {
  hidden: { opacity: 1, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="mb-4 flex gap-0.5" style={{ color: ACCENT }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current stroke-[1.5]" />
      ))}
    </div>
  );
}

export function TestimonialsPageView() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Testimonial[]>("/testimonials")
      .then((data) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const display = useMemo(() => {
    const merged = resolveMarketingList(items, DUMMY_TESTIMONIALS as Testimonial[], 6);
    return merged.map((t) => ({
      ...t,
      date:
        t.date ||
        (t.createdAt
          ? new Date(t.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : undefined),
    }));
  }, [items]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen pb-28" style={{ backgroundColor: BG }}>
        <div className="page-wide pb-20 pt-6 sm:pt-8 lg:pt-10">
          <m.header
            className="mb-14 md:mb-20"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 1 },
              show: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
          >
            <m.p
              variants={headerMotion}
              className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#777777] sm:text-xs"
            >
              / Community Trust — Testimonials
            </m.p>
            <m.h1
              variants={headerMotion}
              className="font-display text-4xl font-normal leading-[1.1] tracking-tight md:text-5xl lg:text-6xl"
              style={{ color: TEXT }}
            >
              What{" "}
              <span className="relative inline-block" style={{ color: ACCENT }}>
                people
              </span>{" "}
              say
            </m.h1>
            <m.p
              variants={headerMotion}
              className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl"
              style={{ color: MUTED }}
            >
              A few thoughts from people who have experienced the value of working together.
            </m.p>
          </m.header>

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-2xl bg-white/60"
                />
              ))}
            </div>
          )}

          {!loading && display.length === 0 && (
            <MarketingEmptyState
              title="Testimonials"
              description="Client feedback will appear here once published."
              className="bg-white"
            />
          )}

          {!loading && display.length > 0 && (
            <m.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
            >
              {display.map((t) => (
                <m.article
                  key={t.id}
                  variants={item}
                  className="flex flex-col rounded-2xl border border-black/[0.04] bg-white p-6 shadow-sm"
                >
                  <Stars count={t.rating ?? 5} />
                  <p className="flex-1 leading-relaxed" style={{ color: TEXT }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <hr className="my-5 border-[#E5E5E5]" />
                  <div>
                    <p className="font-semibold" style={{ color: TEXT }}>
                      {t.name}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: MUTED }}>
                      {t.role}
                      {t.company ? ` · ${t.company}` : ""}
                    </p>
                    {t.date && (
                      <p className="mt-3 text-xs" style={{ color: "#999" }}>
                        {t.date}
                      </p>
                    )}
                  </div>
                </m.article>
              ))}
            </m.div>
          )}
        </div>
      </div>
    </LazyMotion>
  );
}
