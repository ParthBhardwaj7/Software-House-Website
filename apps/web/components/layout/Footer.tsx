"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DEFAULT_SITE_LOGO_PATH } from "@/lib/brand";
import { DUMMY_SITE_SETTINGS } from "@/lib/dummy-data";
import { DEFAULT_FOOTER_CONFIG, type FooterConfig, type FooterLink } from "@/lib/footer-defaults";
import { FooterNewsletter } from "./FooterNewsletter";
import { FooterContact } from "./FooterContact";

type WebsitePayload = {
  websiteName: string;
  contactEmail: string;
  phoneNumber: string;
  logoUrl: string;
  footerConfig: FooterConfig;
};

const initialPayload: WebsitePayload = {
  websiteName: DUMMY_SITE_SETTINGS.websiteName,
  contactEmail: DUMMY_SITE_SETTINGS.contactEmail,
  phoneNumber: DUMMY_SITE_SETTINGS.phoneNumber,
  logoUrl: "",
  footerConfig: {
    ...DEFAULT_FOOTER_CONFIG,
    quickLinks: [...DEFAULT_FOOTER_CONFIG.quickLinks],
    serviceLinks: [...DEFAULT_FOOTER_CONFIG.serviceLinks],
    infoLinks: [...DEFAULT_FOOTER_CONFIG.infoLinks],
  },
};

function FooterNavLink({ href, label, className }: FooterLink & { className: string }) {
  const external = /^https?:\/\//i.test(href);
  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function Footer() {
  const [data, setData] = useState<WebsitePayload>(initialPayload);

  useEffect(() => {
    fetch("/api/settings/website")
      .then((r) => (r.ok ? r.json() : Promise.resolve(null)))
      .then((json: unknown) => {
        if (!json || typeof json !== "object") return;
        const o = json as Record<string, unknown>;
        const fc = o.footerConfig;
        const footerConfig: FooterConfig =
          fc && typeof fc === "object" && "quickLinks" in (fc as object)
            ? (fc as FooterConfig)
            : initialPayload.footerConfig;
        const logoRaw =
          typeof o.logoUrl === "string" && o.logoUrl.trim()
            ? o.logoUrl.trim()
            : DEFAULT_SITE_LOGO_PATH;
        setData({
          websiteName:
            typeof o.websiteName === "string" && o.websiteName.trim()
              ? o.websiteName.trim()
              : initialPayload.websiteName,
          contactEmail:
            typeof o.contactEmail === "string" && o.contactEmail.trim()
              ? o.contactEmail.trim()
              : initialPayload.contactEmail,
          phoneNumber:
            typeof o.phoneNumber === "string" && o.phoneNumber.trim()
              ? o.phoneNumber.trim()
              : initialPayload.phoneNumber,
          logoUrl: logoRaw,
          footerConfig: {
            ...footerConfig,
            quickLinks: [...footerConfig.quickLinks],
            serviceLinks: [...footerConfig.serviceLinks],
            infoLinks: [...footerConfig.infoLinks],
          },
        });
      })
      .catch(() => {});
  }, []);

  const fc = data.footerConfig;
  const linkClass =
    "text-sm text-[#94A3B8] transition-colors duration-200 hover:text-[#22C55E]";
  const copyrightName = fc.copyrightEntity.trim() || data.websiteName.trim() || "Company";

  return (
    <footer className="relative bg-[#0F172A] text-[#F8FAFC]">
      <div
        className="pointer-events-none h-16 bg-gradient-to-b from-[#F8FAFC] via-[#e2e8f0]/90 to-[#0F172A] sm:h-20"
        aria-hidden
      />
      <div className="relative py-8 transition-opacity duration-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-4 sm:flex-row sm:gap-12">
          <FooterContact
            variant="strip"
            contactEmail={data.contactEmail}
            phoneNumber={data.phoneNumber}
            officeHours={fc.officeHours}
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617]/30" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="relative flex h-9 min-w-[7rem] max-w-[10rem] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16A34A] px-2 shadow-lg shadow-[#22C55E]/20 sm:h-10 sm:min-w-[8rem] sm:max-w-[11rem]">
                <Image
                  src={data.logoUrl || DEFAULT_SITE_LOGO_PATH}
                  alt=""
                  width={176}
                  height={40}
                  className="h-7 w-auto max-h-full object-contain object-left sm:h-8"
                  unoptimized
                />
              </div>
              <span className="font-display text-lg font-semibold text-white">{data.websiteName}</span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-[#94A3B8]">{fc.brandTagline}</p>
            <FooterContact
              contactEmail={data.contactEmail}
              phoneNumber={data.phoneNumber}
              officeHours={fc.officeHours}
            />
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              {fc.quickLinksHeading}
            </h3>
            <ul className="space-y-3">
              {fc.quickLinks.map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <FooterNavLink href={l.href} label={l.label} className={linkClass} />
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              {fc.servicesHeading}
            </h3>
            <ul className="space-y-3">
              {fc.serviceLinks.map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <FooterNavLink href={l.href} label={l.label} className={linkClass} />
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              {fc.infoHeading}
            </h3>
            <ul className="space-y-3">
              {fc.infoLinks.map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <FooterNavLink href={l.href} label={l.label} className={linkClass} />
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              {fc.newsletterHeading}
            </h3>
            <p className="mb-4 text-sm text-[#94A3B8]">{fc.newsletterDescription}</p>
            <FooterNewsletter />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-[#64748B] transition-colors duration-300 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {copyrightName}
          </span>
          <span>All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
