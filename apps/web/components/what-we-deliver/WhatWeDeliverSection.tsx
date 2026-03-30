import { DeliveryTimeline } from "@/components/what-we-deliver/DeliveryTimeline";
import { cn } from "@/lib/utils";
import type { MarketingDeliveryContent } from "@/lib/marketing-defaults";
import { DEFAULT_MARKETING_DELIVERY } from "@/lib/marketing-defaults";

type WhatWeDeliverSectionProps = {
  /** Use `h2` on the home page (hero keeps the main `h1`). Use `h1` on `/what-we-deliver`. */
  titleTag?: "h1" | "h2";
  className?: string;
  id?: string;
  /** From Website Settings → Home & delivery (admin); defaults match shipped copy. */
  delivery?: MarketingDeliveryContent;
};

export function WhatWeDeliverSection({
  titleTag = "h2",
  className,
  id = "what-we-deliver",
  delivery = DEFAULT_MARKETING_DELIVERY,
}: WhatWeDeliverSectionProps) {
  const Title = titleTag;
  const d = delivery;

  return (
    <div id={id} className={cn("w-full scroll-mt-24", className)}>
      <section className="border-b border-[#E5E7EB]/80 bg-white py-10 text-center sm:py-12 md:py-14">
        <div className="page-container">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#64748B]">{d.sectionEyebrow}</p>
          <Title className="mt-3 font-display text-3xl font-normal tracking-tight text-[#0F172A] sm:text-4xl md:text-5xl">
            {d.title}
          </Title>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#64748B] sm:text-lg">{d.subtitle}</p>
        </div>
      </section>
      <DeliveryTimeline steps={d.steps} />
    </div>
  );
}
