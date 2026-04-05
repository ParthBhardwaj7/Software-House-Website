"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Card3DTilt } from "./Card3DTilt";
import { api } from "@/lib/api";
import { DUMMY_SERVICES } from "@/lib/dummy-data";
import { fillToMin } from "@/lib/fill-dummy";
import { cn } from "@/lib/utils";

type Service = {
  id: string;
  title: string;
  description: string;
  problem?: string | null;
  solution?: string | null;
  outcome?: string | null;
};

type ServicesSectionProps = {
  showHeading?: boolean;
  compact?: boolean;
  /** Stacked band: transparent bg, no vertical padding on this section */
  variant?: "default" | "stacked";
  /** Typography for dark stacked bands */
  tone?: "light" | "dark";
};

export function ServicesSection({
  showHeading = true,
  compact = false,
  variant = "default",
  tone = "light",
}: ServicesSectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Service[]>("/services")
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const display: Service[] = useMemo(
    () => fillToMin(services, DUMMY_SERVICES as Service[], 6),
    [services]
  );

  const isStacked = variant === "stacked";
  const isDark = tone === "dark";

  return (
    <section
      className={cn(
        "section-pop relative w-full",
        isStacked
          ? "flex min-h-0 w-full flex-col justify-center bg-transparent py-0"
          : "bg-muted/40 py-16 md:py-24"
      )}
    >
      <div
        className={cn(
          "mx-auto w-full",
          isStacked ? "" : "container max-w-7xl px-5 sm:px-6 lg:px-8"
        )}
      >
        {showHeading && (
          <div className={cn("text-center", isStacked ? "mb-6 md:mb-8" : "mb-12 md:mb-16")}>
            <h2
              className={cn(
                "font-display text-3xl font-normal tracking-tight md:text-4xl",
                isDark ? "text-white" : "text-foreground"
              )}
            >
              Our Services
            </h2>
            <p
              className={cn(
                "mx-auto mt-4 max-w-2xl",
                isDark ? "text-slate-400" : "text-muted-foreground"
              )}
            >
              End-to-end capabilities for digital products, growth, and intelligent systems.
            </p>
            <Link
              href="/services"
              className={cn(
                "mt-4 inline-block text-sm font-medium",
                isDark ? "text-[#22C55E] hover:text-emerald-300" : "text-primary hover:text-primary-dark"
              )}
            >
              View all services →
            </Link>
          </div>
        )}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-2xl border p-6 animate-pulse",
                  isDark ? "border-slate-700/60 bg-slate-900/40" : "border-border bg-card"
                )}
              >
                <div className={cn("h-12 w-12 rounded-xl", isDark ? "bg-slate-700" : "bg-muted")} />
                <div className={cn("mt-4 h-5 w-2/3 rounded", isDark ? "bg-slate-700" : "bg-muted")} />
                <div className={cn("mt-2 h-4 w-full rounded", isDark ? "bg-slate-700" : "bg-muted")} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {display.map((s) => (
              <div key={s.id}>
                <Card3DTilt>
                  <Card className="card-pop rounded-2xl border border-border bg-card shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCFCE7]">
                        <span className="text-lg font-bold text-primary">{s.title.charAt(0)}</span>
                      </div>
                      <CardTitle className="text-lg text-card-foreground">{s.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">{s.description}</CardDescription>
                      {!compact && s.problem ? (
                        <div className="mt-3 space-y-1 text-sm">
                          <p>
                            <span className="font-medium text-muted-subtle">Problem:</span>{" "}
                            <span className="text-muted-foreground">{s.problem}</span>
                          </p>
                          {s.solution ? (
                            <p>
                              <span className="font-medium text-muted-subtle">Solution:</span>{" "}
                              <span className="text-muted-foreground">{s.solution}</span>
                            </p>
                          ) : null}
                          {s.outcome ? (
                            <p>
                              <span className="font-medium text-primary">Outcome:</span>{" "}
                              <span className="text-muted-foreground">{s.outcome}</span>
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </CardHeader>
                  </Card>
                </Card3DTilt>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
