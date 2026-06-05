/** Shared public navigation (header + docs for footer defaults). */

export const PRIMARY_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/what-we-deliver", label: "What we deliver" },
  { href: "/team", label: "Team" },
  { href: "/blog", label: "Blog" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
] as const;

export type NavLink = { href: string; label: string };

/** Header: primary links except Home (logo goes home) and Contact (header CTA). */
export const HEADER_NAV_LINKS: NavLink[] = PRIMARY_NAV.filter(
  (l) => l.href !== "/" && l.href !== "/contact"
).map((l) => ({ href: l.href, label: l.label }));
