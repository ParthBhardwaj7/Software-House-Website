/** Default footer config — merged when API has no footerConfig; also used to seed admin form. */

export const MAX_FOOTER_PAGE_CONTENT = 50_000;

export type FooterLink = { label: string; href: string; pageContent?: string };

export type FooterConfig = {
  brandTagline: string;
  quickLinksHeading: string;
  quickLinks: FooterLink[];
  servicesHeading: string;
  serviceLinks: FooterLink[];
  infoHeading: string;
  infoLinks: FooterLink[];
  newsletterHeading: string;
  newsletterDescription: string;
  officeHours: string;
  copyrightEntity: string;
};

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  brandTagline: "Get ready to work together for the better solution for your business.",
  quickLinksHeading: "Quick Links",
  quickLinks: [
    { href: "/about", label: "About Us" },
    { href: "/teams", label: "Our Teams" },
    { href: "/blog", label: "Blogs" },
    { href: "/contact", label: "Contact Us" },
  ],
  servicesHeading: "Services",
  serviceLinks: [
    { href: "/services", label: "Web & Mobile App Development" },
    { href: "/services", label: "Digital Marketing Services" },
    { href: "/services", label: "AI integration" },
    { href: "/services", label: "Automation" },
    { href: "/services", label: "Machine Learning & Cloud Computing Services" },
  ],
  infoHeading: "Information",
  infoLinks: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/faqs", label: "Faqs" },
  ],
  newsletterHeading: "Subscribe Our Newsletter",
  newsletterDescription:
    "Get ready to work together for the better solution for your business",
  officeHours: "Sat– Fri: 10:00 AM – 06:30 PM",
  copyrightEntity: "HILO",
};

function isFooterLink(x: unknown): x is FooterLink {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.label !== "string" || typeof o.href !== "string") return false;
  if (o.pageContent !== undefined && typeof o.pageContent !== "string") return false;
  return true;
}

function trimPageContent(raw: string | undefined): string | undefined {
  if (raw === undefined) return undefined;
  const t = raw.trim();
  if (!t) return undefined;
  return t.slice(0, MAX_FOOTER_PAGE_CONTENT);
}

/** Merge partial/invalid API payload with defaults (per-group fallback). */
export function mergeFooterConfig(raw: string | undefined | null): FooterConfig {
  const d = DEFAULT_FOOTER_CONFIG;
  if (!raw || !raw.trim()) return { ...d, quickLinks: [...d.quickLinks], serviceLinks: [...d.serviceLinks], infoLinks: [...d.infoLinks] };
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    const pickLinks = (key: string, fallback: FooterLink[]): FooterLink[] => {
      const arr = o[key];
      if (!Array.isArray(arr)) return [...fallback];
      const out = arr.filter(isFooterLink).map((l) => {
        const base = { label: l.label.trim(), href: l.href.trim() };
        const pc = trimPageContent(l.pageContent);
        return pc !== undefined ? { ...base, pageContent: pc } : base;
      });
      return out.length > 0 ? out : [...fallback];
    };
    const str = (key: string, fb: string, max: number) => {
      const v = o[key];
      if (typeof v !== "string" || !v.trim()) return fb;
      return v.trim().slice(0, max);
    };
    return {
      brandTagline: str("brandTagline", d.brandTagline, 500),
      quickLinksHeading: str("quickLinksHeading", d.quickLinksHeading, 200),
      quickLinks: pickLinks("quickLinks", d.quickLinks),
      servicesHeading: str("servicesHeading", d.servicesHeading, 200),
      serviceLinks: pickLinks("serviceLinks", d.serviceLinks),
      infoHeading: str("infoHeading", d.infoHeading, 200),
      infoLinks: pickLinks("infoLinks", d.infoLinks),
      newsletterHeading: str("newsletterHeading", d.newsletterHeading, 200),
      newsletterDescription: str("newsletterDescription", d.newsletterDescription, 500),
      officeHours: str("officeHours", d.officeHours, 300),
      copyrightEntity: str("copyrightEntity", d.copyrightEntity, 200),
    };
  } catch {
    return {
      ...d,
      quickLinks: [...d.quickLinks],
      serviceLinks: [...d.serviceLinks],
      infoLinks: [...d.infoLinks],
    };
  }
}

export function footerConfigToJsonString(c: FooterConfig): string {
  return JSON.stringify(c);
}
