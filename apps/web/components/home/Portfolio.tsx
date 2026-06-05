"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Card3DTilt } from "./Card3DTilt";
import { api } from "@/lib/api";
import { MarketingEmptyState } from "@/components/shared/MarketingEmptyState";
import { DUMMY_PROJECTS } from "@/lib/dummy-data";
import { resolveMarketingList } from "@/lib/resolve-marketing-list";
import { cn } from "@/lib/utils";

type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  liveUrl: string | null;
  techStack: string[];
};

type PortfolioProps = {
  showHeading?: boolean;
  variant?: "default" | "stacked";
};

export function Portfolio({ showHeading = true, variant = "default" }: PortfolioProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Project[]>("/projects")
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const displayProjects = useMemo(
    () => resolveMarketingList(projects, DUMMY_PROJECTS as Project[], 6),
    [projects]
  );

  const isStacked = variant === "stacked";

  return (
    <section
      className={cn(
        "section-pop relative w-full",
        isStacked
          ? "flex min-h-0 w-full flex-col justify-center bg-transparent py-0"
          : showHeading
            ? "bg-background py-16 md:py-24"
            : "bg-muted/50 py-16 md:py-24"
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
            <h2 className="font-display text-3xl font-normal tracking-tight text-foreground md:text-4xl">
              Portfolio
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              Selected projects we&apos;ve delivered for clients.
            </p>
          </div>
        )}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-border bg-card p-4 animate-pulse"
              >
                <div className="aspect-video rounded-lg bg-muted" />
                <div className="mt-4 h-4 w-20 rounded bg-muted" />
                <div className="mt-2 h-5 w-2/3 rounded bg-muted" />
                <div className="mt-2 h-4 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : displayProjects.length === 0 ? (
          <MarketingEmptyState
            title="Portfolio coming soon"
            description="We are preparing case studies for our latest work. Contact us to discuss similar projects in the meantime."
            actionHref="/contact"
            actionLabel="Discuss your project"
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayProjects.map((project) => (
              <div key={project.id}>
                <Card3DTilt>
                  <Card className="card-pop overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={`${project.title} project preview`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-subtle">
                          No image
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {project.category}
                      </span>
                      <CardTitle className="text-lg text-card-foreground">{project.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {"techStack" in project && project.techStack?.length ? (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {project.techStack.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <Link
                        href={project.liveUrl || `/portfolio/${project.slug}`}
                        target={project.liveUrl ? "_blank" : undefined}
                        rel={project.liveUrl ? "noopener noreferrer" : undefined}
                        className="text-sm font-medium text-primary hover:text-primary-dark"
                      >
                        {project.liveUrl ? "Live site →" : "View details →"}
                      </Link>
                    </CardContent>
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
