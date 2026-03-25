"use client";

import { DeliveryTimeline } from "@/components/what-we-deliver/DeliveryTimeline";

/**
 * Scroll-linked process timeline for /services (plan: line + dot + step activation).
 * Implementation lives in {@link DeliveryTimeline}; this section adds services-page framing copy.
 */
export function DeliveryProcessSection() {
  return (
    <div className="w-full border-b border-[#E5E7EB]/80 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 pb-2 pt-12 text-center sm:px-6 sm:pt-14 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#64748B]">Process</p>
        <h2 className="mt-2 font-display text-2xl font-normal tracking-tight text-[#0F172A] sm:text-3xl">
          How we deliver
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#64748B] sm:text-base">
          From discovery to handoff — the milestones we use on every engagement.
        </p>
      </div>
      <DeliveryTimeline embedded />
    </div>
  );
}
