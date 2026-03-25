import type { Metadata } from "next";
import { WhatWeDeliverSection } from "@/components/what-we-deliver/WhatWeDeliverSection";

export const metadata: Metadata = {
  title: "What We Deliver",
  description:
    "Our delivery process from discovery to handoff — transparent, milestone-driven, and built for long-term product success.",
};

export default function WhatWeDeliverPage() {
  return (
    <div className="page-marketing w-full">
      <WhatWeDeliverSection titleTag="h1" />
    </div>
  );
}
