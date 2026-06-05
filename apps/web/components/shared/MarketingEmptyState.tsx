import Link from "next/link";
import { cn } from "@/lib/utils";

type MarketingEmptyStateProps = {
  title: string;
  description: string;
  className?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function MarketingEmptyState({
  title,
  description,
  className,
  actionHref = "/contact",
  actionLabel = "Get in touch",
}: MarketingEmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-lg rounded-2xl border border-dashed border-border bg-card/80 px-6 py-10 text-center sm:px-8",
        className
      )}
    >
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">{title}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
      <Link
        href={actionHref}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:bg-primary-dark"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
