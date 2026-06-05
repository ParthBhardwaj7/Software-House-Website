import { cn } from "@/lib/utils";

const STATS = [
  { value: "50+", label: "Projects delivered" },
  { value: "8+", label: "Years building products" },
  { value: "24h", label: "Typical response time" },
  { value: "100%", label: "Milestone-based delivery" },
] as const;

type TrustBarProps = {
  className?: string;
};

/** Lightweight credibility strip — edit copy via future admin field if needed. */
export function TrustBar({ className }: TrustBarProps) {
  return (
    <section
      className={cn("w-full border-y border-border/80 bg-white/90 py-8 sm:py-10", className)}
      aria-label="Company highlights"
    >
      <div className="page-container">
        <ul className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <li key={label} className="text-center sm:text-left">
              <p className="font-display text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
                {value}
              </p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">{label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
