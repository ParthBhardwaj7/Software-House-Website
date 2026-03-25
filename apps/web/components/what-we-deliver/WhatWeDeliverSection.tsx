import { DeliveryTimeline } from "@/components/what-we-deliver/DeliveryTimeline";
import { cn } from "@/lib/utils";

type WhatWeDeliverSectionProps = {
  /** Use `h2` on the home page (hero keeps the main `h1`). Use `h1` on `/what-we-deliver`. */
  titleTag?: "h1" | "h2";
  className?: string;
  id?: string;
};

export function WhatWeDeliverSection({
  titleTag = "h2",
  className,
  id = "what-we-deliver",
}: WhatWeDeliverSectionProps) {
  const Title = titleTag;

  return (
    <div id={id} className={cn("w-full scroll-mt-24", className)}>
      <section className="border-b border-[#E5E7EB]/80 bg-white py-10 text-center sm:py-12 md:py-14">
        <div className="page-container">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#64748B]">Process</p>
          <Title className="mt-3 font-display text-3xl font-normal tracking-tight text-[#0F172A] sm:text-4xl md:text-5xl">
            What we deliver
          </Title>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#64748B] sm:text-lg">
            A results-driven workflow you can see end to end — from first workshop to launch and beyond.
          </p>
        </div>
      </section>
      <DeliveryTimeline />
    </div>
  );
}
