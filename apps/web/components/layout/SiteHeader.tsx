"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSocialLinkDisplayItems } from "@/lib/social-links-display";
import { RollingContactCta } from "./RollingContactCta";
import { DEFAULT_SITE_LOGO_PATH } from "@/lib/brand";
import type { SocialLinks } from "@/lib/public-website-settings";

/** Passed from `app/layout.tsx` (server) so the first paint matches production — no dummy → API flash on refresh. */
export type SiteHeaderInitialSettings = {
  websiteName: string;
  contactEmail: string;
  phoneNumber: string;
  addressLine: string;
  logoUrl: string;
  faviconUrl: string;
  socialLinks: SocialLinks;
};

const STATIC_NAV_START = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/what-we-deliver", label: "What we deliver" },
  { href: "/testimonials", label: "Testimonials" },
] as const;

const STATIC_NAV_END = [
  { href: "/pay", label: "Pay" },
  { href: "/contact", label: "Contact" },
] as const;

function brandMonogram(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0]?.[0] ?? "";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }
  const w = parts[0] ?? name.trim();
  return w.slice(0, 2).toUpperCase();
}

const emptySocial = (): SocialLinks => ({
  twitter: "",
  instagram: "",
  youtube: "",
  linkedin: "",
  facebook: "",
  github: "",
  telegram: "",
});

/** Clear separator under bar — slightly thicker + stronger so it reads vs hero */
const headerSurface = (scrolled: boolean) =>
  cn(
    "w-full border-b-2 border-gray-300/50 bg-transparent shadow-none backdrop-blur-md transition-all duration-300",
    scrolled && "border-gray-300/75 bg-white/80 shadow-sm backdrop-blur-lg"
  );

function BrandMarkBox({
  showFaviconMark,
  faviconUrl,
  monogram,
  onFaviconError,
  boxClassName,
  monogramClassName,
}: {
  showFaviconMark: boolean;
  faviconUrl: string;
  monogram: string;
  onFaviconError: () => void;
  boxClassName: string;
  monogramClassName: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden border border-[#E5E7EB] bg-white shadow-sm",
        boxClassName
      )}
    >
      {showFaviconMark ? (
        // eslint-disable-next-line @next/next/no-img-element -- favicon URLs may be external or arbitrary format
        <img
          src={faviconUrl}
          alt=""
          width={48}
          height={48}
          className="h-full w-full object-cover"
          onError={onFaviconError}
        />
      ) : (
        <span
          className={cn("font-bold tracking-tight text-[#16A34A]", monogramClassName)}
          aria-hidden
        >
          {monogram}
        </span>
      )}
    </span>
  );
}

function SocialIconRow({
  links,
  className,
  showHeading,
}: {
  links: SocialLinks;
  className?: string;
  showHeading?: boolean;
}) {
  const items = getSocialLinkDisplayItems(links);
  if (items.length === 0) return null;
  return (
    <div className={className}>
      {showHeading ? (
        <p className="mb-4 text-xs font-medium uppercase tracking-wider text-[#64748B]">Social Media</p>
      ) : null}
      <div className="flex gap-4 text-[#0F172A]">
        {items.map(({ key, href, label, Icon }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70"
            aria-label={label}
          >
            <Icon className="h-6 w-6" />
          </a>
        ))}
      </div>
    </div>
  );
}

type SiteHeaderProps = {
  initialSettings: SiteHeaderInitialSettings;
  initialCustomNav: { href: string; label: string }[];
};

function initialLogoUrl(logoUrl: string): string {
  const t = logoUrl.trim();
  return t || DEFAULT_SITE_LOGO_PATH;
}

export function SiteHeader({ initialSettings, initialCustomNav }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [contactEmail] = useState<string>(initialSettings.contactEmail);
  const [contactPhone] = useState<string>(initialSettings.phoneNumber);
  const [websiteName] = useState<string>(initialSettings.websiteName);
  const [addressLine] = useState<string>(initialSettings.addressLine);
  const [faviconUrl] = useState<string>(initialSettings.faviconUrl.trim());
  const [faviconFailed, setFaviconFailed] = useState(false);
  /** Merged value: custom admin URL or default path — see `showAdminWordmark` */
  const [resolvedLogoUrl] = useState<string>(() => initialLogoUrl(initialSettings.logoUrl));
  const [customLogoFailed, setCustomLogoFailed] = useState(false);
  const [customNav] = useState<{ href: string; label: string }[]>(() => initialCustomNav);
  const [socialLinks] = useState<SocialLinks>(() => ({
    twitter: String(initialSettings.socialLinks.twitter ?? "").trim(),
    instagram: String(initialSettings.socialLinks.instagram ?? "").trim(),
    youtube: String(initialSettings.socialLinks.youtube ?? "").trim(),
    linkedin: String(initialSettings.socialLinks.linkedin ?? "").trim(),
    facebook: String(initialSettings.socialLinks.facebook ?? "").trim(),
    github: String(initialSettings.socialLinks.github ?? "").trim(),
    telegram: String(initialSettings.socialLinks.telegram ?? "").trim(),
  }));

  const overlayLinks = useMemo(
    () => [...STATIC_NAV_START, ...customNav, ...STATIC_NAV_END],
    [customNav]
  );

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  const monogram = useMemo(() => brandMonogram(websiteName), [websiteName]);
  const showFaviconMark = Boolean(faviconUrl.trim()) && !faviconFailed;
  /** Admin uploaded a real logo (not the built-in default asset). */
  const showAdminWordmark = resolvedLogoUrl !== DEFAULT_SITE_LOGO_PATH && !customLogoFailed;

  const navLinkClass = (active: boolean) =>
    cn(
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      active ? "bg-[#0F172A]/5 text-[#0F172A]" : "text-[#475569] hover:bg-black/[0.04] hover:text-[#0F172A]"
    );

  const mobileNavLinkClass = (active: boolean) =>
    cn(
      "min-h-11 py-2 font-display text-3xl font-normal leading-tight tracking-tight",
      active ? "text-[#0F172A]" : "text-[#64748B]"
    );

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 h-16 outline-none md:h-[4.5rem]",
          headerSurface(scrolled)
        )}
      >
        <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:gap-3 sm:px-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-4 lg:px-8">
          <button
            type="button"
            className="flex min-h-11 w-11 shrink-0 items-center justify-center justify-self-start rounded-xl text-[#0F172A] transition hover:bg-black/[0.04] md:hidden"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            suppressHydrationWarning
          >
            <span className="flex flex-col gap-1.5" aria-hidden>
              <span className="h-0.5 w-6 bg-current" />
              <span className="h-0.5 w-6 bg-current" />
              <span className="h-0.5 w-6 bg-current" />
            </span>
          </button>

          <Link
            href="/"
            className={cn(
              "flex min-w-0 max-w-full items-center justify-center gap-2 justify-self-center px-0.5 sm:gap-2.5",
              showAdminWordmark
                ? "max-w-[min(calc(100vw-5rem),20rem)] sm:max-w-[min(calc(100vw-5rem),22rem)] md:max-w-[min(58vw,26rem)] lg:max-w-[min(52vw,28rem)]"
                : "max-w-[min(calc(100vw-5rem),17rem)] md:max-w-[min(60vw,20rem)] lg:max-w-[min(52vw,22rem)]",
              /* Desktop: first column, left-aligned */
              "md:justify-self-start md:justify-start md:gap-3 md:px-0"
            )}
            aria-label={`${websiteName} home`}
          >
            {showAdminWordmark ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG + Cloudinary URLs: native img avoids next/image layout bugs */}
                <img
                  src={resolvedLogoUrl}
                  alt=""
                  width={268}
                  height={96}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-8 w-auto max-h-8 max-w-[6.75rem] shrink-0 object-contain object-center sm:max-w-[7.5rem] md:h-10 md:max-h-10 md:max-w-[8.75rem] md:object-left"
                  onError={() => setCustomLogoFailed(true)}
                />
                <span className="min-w-0 truncate text-center font-display text-base font-semibold leading-tight tracking-tight text-[#0F172A] md:text-left md:text-xl md:leading-none">
                  {websiteName}
                </span>
              </>
            ) : (
              <>
                <BrandMarkBox
                  showFaviconMark={showFaviconMark}
                  faviconUrl={faviconUrl}
                  monogram={monogram}
                  onFaviconError={() => setFaviconFailed(true)}
                  boxClassName="h-9 w-9 rounded-xl md:h-10 md:w-10"
                  monogramClassName="text-xs md:text-sm"
                />
                <span className="min-w-0 truncate text-center font-display text-base font-semibold leading-tight tracking-tight text-[#0F172A] md:text-left md:text-xl md:leading-none">
                  {websiteName}
                </span>
              </>
            )}
          </Link>

          <nav
            className="hidden min-w-0 items-center justify-center gap-0.5 md:flex md:min-w-0 md:flex-1 lg:gap-1"
            aria-label="Main"
          >
            {overlayLinks.map((link) => {
              const active =
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href} className={navLinkClass(active)}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 justify-self-end">
            <RollingContactCta
              variant="consultation"
              href="/contact"
              label="Book a Consultation"
              duplicateLabel="It's free"
              compactLabel="Book"
              compactDuplicate="Free"
              className="inline-flex max-w-[min(100%,9.25rem)] shrink-0 whitespace-nowrap px-2 py-1.5 text-[10px] font-medium leading-tight min-[380px]:max-w-[min(100%,10.5rem)] min-[380px]:px-2.5 min-[380px]:text-[11px] min-[401px]:max-w-[min(100%,12rem)] min-[401px]:px-3 min-[401px]:text-xs sm:max-w-none sm:px-4 sm:py-2 sm:text-sm sm:leading-none"
              lineClassName="h-7 sm:h-9"
            />
          </div>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-[60] flex flex-col bg-[#F8FAFC] md:hidden"
        >
          <div className="flex items-start justify-between gap-3 border-b border-[#E5E7EB] bg-white p-5 sm:p-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {showAdminWordmark ? (
                <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element -- same as header wordmark */}
                  <img
                    src={resolvedLogoUrl}
                    alt=""
                    width={268}
                    height={96}
                    className="h-9 w-auto max-h-9 max-w-[5.5rem] shrink-0 object-contain object-left sm:h-10 sm:max-h-10 sm:max-w-[6.5rem]"
                    onError={() => setCustomLogoFailed(true)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg font-semibold tracking-tight text-[#0F172A] sm:text-xl">
                      {websiteName}
                    </p>
                    {addressLine.trim() ? (
                      <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-[#64748B] sm:text-sm">{addressLine}</p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <>
                  <BrandMarkBox
                    showFaviconMark={showFaviconMark}
                    faviconUrl={faviconUrl}
                    monogram={monogram}
                    onFaviconError={() => setFaviconFailed(true)}
                    boxClassName="h-11 w-11 rounded-xl sm:h-12 sm:w-12"
                    monogramClassName="text-sm sm:text-base"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-semibold tracking-tight text-[#0F172A] sm:text-xl">
                      {websiteName}
                    </p>
                    {addressLine.trim() ? (
                      <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-[#64748B] sm:text-sm">{addressLine}</p>
                    ) : null}
                  </div>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={closeMenu}
              className="min-h-11 min-w-11 rounded-lg p-2 text-[#0F172A] hover:bg-[#F1F5F9]"
              aria-label="Close menu"
              suppressHydrationWarning
            >
              <X className="h-8 w-8" strokeWidth={2} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-12">
            <div className="mt-6">
              <RollingContactCta
                variant="consultation"
                href="/contact"
                label="Book a Consultation"
                duplicateLabel="It's free"
                className="w-full justify-center"
                lineClassName="h-11"
              />
            </div>

            <p className="mb-4 mt-10 text-xs font-medium uppercase tracking-wider text-[#64748B]">Main menu</p>
            <nav className="flex flex-col gap-2" aria-label="Site">
              {overlayLinks.map((link) => {
                const active =
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={mobileNavLinkClass(active)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <p className="mb-3 mt-10 text-xs font-medium uppercase tracking-wider text-[#64748B]">
              For contact inquiries
            </p>
            <a href={`mailto:${contactEmail}`} className="block text-base text-[#0F172A]">
              {contactEmail}
            </a>
            <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="block text-base text-[#0F172A]">
              {contactPhone}
            </a>

            <SocialIconRow
              links={socialLinks}
              className="mt-10"
              showHeading
            />
          </div>
        </div>
      )}
    </>
  );
}
