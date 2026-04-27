import { DELIVERY_STEPS } from "@/lib/dummy-data";

export type MarketingHomeContent = {
  eyebrow: string;
  headingPrefix: string;
  headingEmphasis: string;
  headingMiddle: string;
  headingGradient: string;
  headingSuffix: string;
  subtext: string;
  bottomEyebrow: string;
  bottomText: string;
  primaryCtaHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
};

export type DeliveryStepContent = { title: string; body: string };

export type MarketingDeliveryContent = {
  sectionEyebrow: string;
  title: string;
  subtitle: string;
  steps: DeliveryStepContent[];
};

export const DEFAULT_MARKETING_HOME: MarketingHomeContent = {
  eyebrow: "APNCODIX",
  headingPrefix: "Engineering ",
  headingEmphasis: "reliable",
  headingMiddle: " digital products for ",
  headingGradient: "growth-focused businesses",
  headingSuffix: ".",
  subtext:
    "APN Codix designs, builds, and scales web platforms, mobile apps, and AI-enabled systems with clear milestones, transparent communication, and production-grade quality.",
  bottomEyebrow: "Trusted Delivery",
  bottomText:
    "From discovery to post-launch support, we work as an accountable engineering partner focused on outcomes, performance, and long-term maintainability.",
  primaryCtaHref: "/contact",
  secondaryButtonLabel: "View our work",
  secondaryButtonHref: "/portfolio",
};

export const DEFAULT_MARKETING_DELIVERY: MarketingDeliveryContent = {
  sectionEyebrow: "Process",
  title: "What we deliver",
  subtitle:
    "A results-driven workflow you can see end to end — from first workshop to launch and beyond.",
  steps: DELIVERY_STEPS.map(({ title, body }) => ({ title, body })),
};

export function parseMarketingHomeJson(raw: string | undefined | null): MarketingHomeContent {
  if (!raw?.trim()) return { ...DEFAULT_MARKETING_HOME };
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    const d = DEFAULT_MARKETING_HOME;
    const pick = (k: keyof MarketingHomeContent) =>
      typeof o[k] === "string" && o[k].trim() ? (o[k] as string).trim() : d[k];
    return {
      eyebrow: pick("eyebrow"),
      headingPrefix: pick("headingPrefix"),
      headingEmphasis: pick("headingEmphasis"),
      headingMiddle: pick("headingMiddle"),
      headingGradient: pick("headingGradient"),
      headingSuffix: pick("headingSuffix"),
      subtext: pick("subtext"),
      bottomEyebrow: pick("bottomEyebrow"),
      bottomText: pick("bottomText"),
      primaryCtaHref: pick("primaryCtaHref"),
      secondaryButtonLabel: pick("secondaryButtonLabel"),
      secondaryButtonHref: pick("secondaryButtonHref"),
    };
  } catch {
    return { ...DEFAULT_MARKETING_HOME };
  }
}

export function parseMarketingDeliveryJson(raw: string | undefined | null): MarketingDeliveryContent {
  if (!raw?.trim()) return { ...DEFAULT_MARKETING_DELIVERY, steps: [...DEFAULT_MARKETING_DELIVERY.steps] };
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    const d = DEFAULT_MARKETING_DELIVERY;
    const sectionEyebrow =
      typeof o.sectionEyebrow === "string" && o.sectionEyebrow.trim()
        ? o.sectionEyebrow.trim()
        : d.sectionEyebrow;
    const title = typeof o.title === "string" && o.title.trim() ? o.title.trim() : d.title;
    const subtitle =
      typeof o.subtitle === "string" && o.subtitle.trim() ? o.subtitle.trim() : d.subtitle;
    let steps: DeliveryStepContent[] = d.steps.map((s) => ({ ...s }));
    if (Array.isArray(o.steps) && o.steps.length > 0) {
      const parsed: DeliveryStepContent[] = [];
      for (const item of o.steps) {
        if (!item || typeof item !== "object") continue;
        const s = item as Record<string, unknown>;
        const t = typeof s.title === "string" ? s.title.trim() : "";
        const b = typeof s.body === "string" ? s.body.trim() : "";
        if (t && b) parsed.push({ title: t, body: b });
      }
      if (parsed.length > 0) steps = parsed;
    }
    return { sectionEyebrow, title, subtitle, steps };
  } catch {
    return { ...DEFAULT_MARKETING_DELIVERY, steps: [...DEFAULT_MARKETING_DELIVERY.steps] };
  }
}

export function marketingHomeToJson(c: MarketingHomeContent): string {
  return JSON.stringify(c, null, 2);
}

export function marketingDeliveryToJson(c: MarketingDeliveryContent): string {
  return JSON.stringify(c, null, 2);
}
