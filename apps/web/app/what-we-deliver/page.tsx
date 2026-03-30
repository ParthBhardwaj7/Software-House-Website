import type { Metadata } from "next";
import { WhatWeDeliverSection } from "@/components/what-we-deliver/WhatWeDeliverSection";
import { getPublicWebsiteSettings } from "@/lib/server-website-settings";

export const metadata: Metadata = {
  title: "What We Deliver",
  description:
    "Our delivery process from discovery to handoff — transparent, milestone-driven, and built for long-term product success.",
};

export default async function WhatWeDeliverPage() {
  const { marketingDelivery } = await getPublicWebsiteSettings();

  return (
    <div className="page-marketing w-full">
      <WhatWeDeliverSection titleTag="h1" delivery={marketingDelivery} />
    </div>
  );
}
