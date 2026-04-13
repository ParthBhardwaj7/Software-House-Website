"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSocialLinkDisplayItems } from "@/lib/social-links-display";
import { RollingContactCta } from "./RollingContactCta";
import { DEFAULT_SITE_LOGO_PATH } from "@/lib/brand";
import { DUMMY_SITE_SETTINGS } from "@/lib/dummy-data";
import type { SocialLinks } from "@/lib/public-website-settings";

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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [contactEmail, setContactEmail] = useState<string>(DUMMY_SITE_SETTINGS.contactEmail);
  const [contactPhone, setContactPhone] = useState<string>(DUMMY_SITE_SETTINGS.phoneNumber);
  const [websiteName, setWebsiteName] = useState<string>(DUMMY_SITE_SETTINGS.websiteName);
  const [addressLine, setAddressLine] = useState<string>(DUMMY_SITE_SETTINGS.addressLine);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [customNav, setCustomNav] = useState<{ href: string; label: string }[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(emptySocial);

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    fetch(`${apiUrl}/custom-pages/nav`)
      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
      .then((items: { slug: string; navLabel: string }[]) => {
        if (!Array.isArray(items)) return;
        setCustomNav(items.map((it) => ({ href: `/site/${it.slug}`, label: it.navLabel })));
      })
      .catch(() => setCustomNav([]));
  }, []);

  useEffect(() => {
    fetch("/api/settings/website")
      .then((r) => (r.ok ? r.json() : Promise.resolve({})))
      .then(
        (data: {
          contactEmail?: string;
          phoneNumber?: string;
          websiteName?: string;
          addressLine?: string;
          logoUrl?: string;
          socialLinks?: SocialLinks;
        }) => {
          const e = typeof data.contactEmail === "string" ? data.contactEmail.trim() : "";
          const p = typeof data.phoneNumber === "string" ? data.phoneNumber.trim() : "";
          const w = typeof data.websiteName === "string" ? data.websiteName.trim() : "";
          const a = typeof data.addressLine === "string" ? data.addressLine.trim() : "";
          const l = typeof data.logoUrl === "string" ? data.logoUrl.trim() : "";
          if (e) setContactEmail(e);
          if (p) setContactPhone(p);
          if (w) setWebsiteName(w);
          if (a) setAddressLine(a);
          if (l) setLogoUrl(l);
          if (data.socialLinks && typeof data.socialLinks === "object") {
            setSocialLinks({
              twitter: String(data.socialLinks.twitter ?? "").trim(),
              instagram: String(data.socialLinks.instagram ?? "").trim(),
              youtube: String(data.socialLinks.youtube ?? "").trim(),
              linkedin: String(data.socialLinks.linkedin ?? "").trim(),
              facebook: String(data.socialLinks.facebook ?? "").trim(),
              github: String(data.socialLinks.github ?? "").trim(),
              telegram: String(data.socialLinks.telegram ?? "").trim(),
            });
          }
        }
      )
      .catch(() => {});
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

  const headerLogoSrc = logoUrl.trim() || DEFAULT_SITE_LOGO_PATH;

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 h-16 outline-none md:h-[4.5rem]",
          headerSurface(scrolled)
        )}
      >
        <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 sm:gap-3 sm:px-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-4 lg:px-8">
          <button
            type="button"
            className="flex min-h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#0F172A] transition hover:bg-black/[0.04] md:hidden"
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
            className="flex min-w-0 max-w-full items-center justify-center gap-2 px-0.5 min-[380px]:gap-2.5 md:max-w-[min(48vw,24rem)] md:justify-start md:px-0 lg:max-w-[min(44vw,28rem)] lg:gap-3"
            aria-label={`${websiteName} home`}
          >
            <span className="relative h-8 w-[4.75rem] shrink-0 sm:h-9 sm:w-[5.75rem] md:h-9 md:w-[7rem] lg:h-10 lg:w-[8.25rem]">
              <Image
                src={headerLogoSrc}
                alt=""
                fill
                className="object-contain object-left"
                sizes="(max-width: 640px) 92px, (max-width: 1024px) 112px, 132px"
                unoptimized
              />
            </span>
            <span className="min-w-0 truncate text-left font-display text-[13px] font-semibold leading-tight tracking-tight text-[#0F172A] min-[380px]:text-sm sm:text-base md:text-base lg:text-lg">
              {websiteName}
            </span>
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
          <div className="flex items-start justify-between border-b border-[#E5E7EB] bg-white p-6">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#22C55E] text-lg font-bold text-white">
                <Image
                  src={headerLogoSrc}
                  alt=""
                  width={56}
                  height={56}
                  className="h-full w-full object-contain p-1"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-xs text-[#64748B]">{addressLine}</p>
                <p className="text-xs text-[#64748B]">
                  {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })}{" "}
                  IST
                </p>
              </div>
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
