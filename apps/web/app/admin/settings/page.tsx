"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DEFAULT_FOOTER_CONFIG,
  MAX_FOOTER_PAGE_CONTENT,
  mergeFooterConfig,
  type FooterConfig,
  type FooterLink,
} from "@/lib/footer-defaults";
import { MAX_ABOUT_PAGE_CONTENT } from "@/lib/public-website-settings";

const MAX_LINKS = 12;

type SocialForm = {
  twitter: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  facebook: string;
  github: string;
  telegram: string;
};

const SOCIAL_URL_FIELDS: { key: keyof SocialForm; label: string }[] = [
  { key: "twitter", label: "X (Twitter)" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "facebook", label: "Facebook" },
  { key: "github", label: "GitHub" },
  { key: "telegram", label: "Telegram" },
];

function parseSocialFromApi(raw: string | undefined): SocialForm {
  const empty: SocialForm = {
    twitter: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    facebook: "",
    github: "",
    telegram: "",
  };
  if (!raw?.trim()) return empty;
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    (Object.keys(empty) as (keyof SocialForm)[]).forEach((k) => {
      if (typeof o[k] === "string") empty[k] = o[k];
    });
  } catch {
    /* keep empty */
  }
  return empty;
}

function isInternalFooterHref(href: string): boolean {
  const h = href.trim();
  return h.startsWith("/") && !h.startsWith("//");
}

function cloneFooter(c: FooterConfig): FooterConfig {
  return {
    ...c,
    quickLinks: c.quickLinks.map((l) => ({ ...l })),
    serviceLinks: c.serviceLinks.map((l) => ({ ...l })),
    infoLinks: c.infoLinks.map((l) => ({ ...l })),
  };
}

function LinksBlock({
  label,
  links,
  onChange,
}: {
  label: string;
  links: FooterLink[];
  onChange: (next: FooterLink[]) => void;
}) {
  function update(i: number, patch: Partial<FooterLink>) {
    const next = links.map((l, j) => (j === i ? { ...l, ...patch } : l));
    onChange(next);
  }
  function remove(i: number) {
    onChange(links.filter((_, j) => j !== i));
  }
  function add() {
    if (links.length >= MAX_LINKS) return;
    onChange([...links, { label: "New link", href: "/" }]);
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-[#0F172A]">{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={add} disabled={links.length >= MAX_LINKS}>
          Add link
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Use paths like /contact or full https:// URLs. Max {MAX_LINKS} links. For internal URLs only: add optional page
        copy (paragraphs = blank line between blocks). Dedicated routes like /portfolio always use the built-in page.
      </p>
      {links.map((link, i) => (
        <div key={i} className="space-y-3 rounded-lg border border-[#E5E7EB] p-3">
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <div>
              <Label className="text-xs text-muted-foreground">Label</Label>
              <Input
                value={link.label}
                onChange={(e) => update(i, { label: e.target.value })}
                className="mt-1 border-[#E5E7EB]"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">URL</Label>
              <Input
                value={link.href}
                onChange={(e) => update(i, { href: e.target.value })}
                className="mt-1 border-[#E5E7EB]"
                placeholder="/services or https://…"
              />
            </div>
            <div className="flex items-end">
              <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => remove(i)}>
                Remove
              </Button>
            </div>
          </div>
          {isInternalFooterHref(link.href) ? (
            <div>
              <Label className="text-xs text-muted-foreground">Page content (optional)</Label>
              <Textarea
                value={link.pageContent ?? ""}
                onChange={(e) =>
                  update(i, { pageContent: e.target.value.slice(0, MAX_FOOTER_PAGE_CONTENT) })
                }
                className="mt-1 min-h-[120px] border-[#E5E7EB] font-mono text-sm"
                placeholder="Shown on this URL when visitors use the footer link. External URLs ignore this field."
                rows={6}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

const jump = [
  { href: "#site-info", label: "Contact" },
  { href: "#brand-seo", label: "Brand & SEO" },
  { href: "#about-page", label: "About page" },
  { href: "#social-whatsapp", label: "Social & WhatsApp" },
  { href: "#effects", label: "Effects" },
  { href: "#footer", label: "Footer" },
];

export default function AdminSettingsPage() {
  const token = getAccessToken();
  const [form, setForm] = useState({
    websiteName: "APNCODIX",
    contactEmail: "",
    phoneNumber: "",
    tagline: "",
    addressLine: "",
    logoUrl: "",
    faviconUrl: "",
    siteDescription: "",
    seoTitleSuffix: "",
    aboutPageContent: "",
    enableBoatCursor: false,
    whatsappNumber: "",
  });
  const [social, setSocial] = useState<SocialForm>(parseSocialFromApi(undefined));
  const [footer, setFooter] = useState<FooterConfig>(() => cloneFooter(DEFAULT_FOOTER_CONFIG));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api
      .get<{
        websiteName?: string;
        contactEmail?: string;
        phoneNumber?: string;
        footerConfig?: string;
        tagline?: string;
        addressLine?: string;
        logoUrl?: string;
        faviconUrl?: string;
        siteDescription?: string;
        seoTitleSuffix?: string;
        aboutPageContent?: string;
        enableBoatCursor?: string;
        whatsappNumber?: string;
        socialLinks?: string;
      }>("/admin/settings", token)
      .then((r) => {
        setForm({
          websiteName: r.websiteName || "APNCODIX",
          contactEmail: r.contactEmail || "",
          phoneNumber: r.phoneNumber || "",
          tagline: r.tagline || "",
          addressLine: r.addressLine || "",
          logoUrl: r.logoUrl || "",
          faviconUrl: r.faviconUrl || "",
          siteDescription: r.siteDescription || "",
          seoTitleSuffix: r.seoTitleSuffix || "",
          aboutPageContent: r.aboutPageContent || "",
          enableBoatCursor: r.enableBoatCursor === "true" || r.enableBoatCursor === "1" || r.enableBoatCursor === "yes",
          whatsappNumber: r.whatsappNumber || "",
        });
        setSocial(parseSocialFromApi(r.socialLinks));
        setFooter(cloneFooter(mergeFooterConfig(typeof r.footerConfig === "string" ? r.footerConfig : null)));
      })
      .catch(() => {});
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await api.put(
        "/admin/settings",
        {
          websiteName: form.websiteName,
          contactEmail: form.contactEmail,
          phoneNumber: form.phoneNumber,
          tagline: form.tagline,
          addressLine: form.addressLine,
          logoUrl: form.logoUrl,
          faviconUrl: form.faviconUrl,
          siteDescription: form.siteDescription,
          seoTitleSuffix: form.seoTitleSuffix,
          aboutPageContent: form.aboutPageContent,
          enableBoatCursor: form.enableBoatCursor ? "true" : "false",
          whatsappNumber: form.whatsappNumber,
          socialLinks: JSON.stringify(social),
          footerConfig: JSON.stringify(footer),
        },
        token
      );
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save. Is the API running?");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Website Settings</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          One place to control branding, SEO defaults, the About page, social links, optional effects, and the footer.
          Save once at the bottom — all sections update together.
        </p>
        <nav className="mt-4 flex flex-wrap gap-2 text-sm" aria-label="On this page">
          {jump.map((j) => (
            <a
              key={j.href}
              href={j.href}
              className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-[#64748B] transition hover:border-[#22C55E] hover:text-[#0F172A]"
            >
              {j.label}
            </a>
          ))}
        </nav>
      </div>

      <Card className="max-w-3xl border-[#E5E7EB]">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-10">
            <section id="site-info" className="scroll-mt-8 space-y-4">
              <h2 className="text-lg font-semibold text-[#0F172A]">Site & contact</h2>
              <div>
                <Label htmlFor="websiteName">Website name</Label>
                <Input
                  id="websiteName"
                  value={form.websiteName}
                  onChange={(e) => setForm((f) => ({ ...f, websiteName: e.target.value }))}
                  className="mt-1 border-[#E5E7EB]"
                />
                <p className="mt-1 text-xs text-muted-foreground">Shown in header, footer, browser tab, and structured data.</p>
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                  className="mt-1 border-[#E5E7EB]"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input
                  id="phoneNumber"
                  value={form.phoneNumber}
                  onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                  className="mt-1 border-[#E5E7EB]"
                />
              </div>
            </section>

            <section id="brand-seo" className="scroll-mt-8 space-y-4 border-t border-[#E5E7EB] pt-8">
              <h2 className="text-lg font-semibold text-[#0F172A]">Brand & SEO</h2>
              <div>
                <Label htmlFor="tagline">Short tagline</Label>
                <Input
                  id="tagline"
                  value={form.tagline}
                  onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                  className="mt-1 border-[#E5E7EB]"
                  placeholder="e.g. Modern software for ambitious teams"
                />
              </div>
              <div>
                <Label htmlFor="addressLine">Address / location line</Label>
                <Input
                  id="addressLine"
                  value={form.addressLine}
                  onChange={(e) => setForm((f) => ({ ...f, addressLine: e.target.value }))}
                  className="mt-1 border-[#E5E7EB]"
                  placeholder="City, country — shown in mobile menu"
                />
              </div>
              <div>
                <Label htmlFor="logoUrl">Logo image URL</Label>
                <Input
                  id="logoUrl"
                  value={form.logoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                  className="mt-1 border-[#E5E7EB]"
                  placeholder="https://… (PNG/SVG/JPG, https only)"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Leave empty to use the default wordmark. For a custom logo, use a wide transparent PNG or SVG (~480×120px
                  source, or 960×240@2x). The header shows ~40px height; the home hero ~56–68px.
                </p>
              </div>
              <div>
                <Label htmlFor="faviconUrl">Favicon URL</Label>
                <Input
                  id="faviconUrl"
                  value={form.faviconUrl}
                  onChange={(e) => setForm((f) => ({ ...f, faviconUrl: e.target.value }))}
                  className="mt-1 border-[#E5E7EB]"
                  placeholder="https://…/favicon.ico or /favicon.ico"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Browser tab icon. Use a square image (PNG, ICO, or SVG), ideally 32×32 or 64×64. Full{" "}
                  <code className="rounded bg-muted px-1">https://</code> URL or a path on this site like{" "}
                  <code className="rounded bg-muted px-1">/my-icon.png</code>. Leave empty to keep the built-in default icon.
                </p>
              </div>
              <div>
                <Label htmlFor="seoTitleSuffix">Browser tab suffix</Label>
                <Input
                  id="seoTitleSuffix"
                  value={form.seoTitleSuffix}
                  onChange={(e) => setForm((f) => ({ ...f, seoTitleSuffix: e.target.value }))}
                  className="mt-1 border-[#E5E7EB]"
                  placeholder="e.g. Modern Software Agency"
                />
                <p className="mt-1 text-xs text-muted-foreground">Home title becomes: Website name | this suffix.</p>
              </div>
              <div>
                <Label htmlFor="siteDescription">Meta description (search & social)</Label>
                <Textarea
                  id="siteDescription"
                  value={form.siteDescription}
                  onChange={(e) => setForm((f) => ({ ...f, siteDescription: e.target.value.slice(0, 500) }))}
                  className="mt-1 border-[#E5E7EB]"
                  rows={3}
                  placeholder="One or two sentences about what you do."
                />
              </div>
            </section>

            <section id="about-page" className="scroll-mt-8 space-y-4 border-t border-[#E5E7EB] pt-8">
              <h2 className="text-lg font-semibold text-[#0F172A]">About page (/about)</h2>
              <p className="text-sm text-muted-foreground">
                Plain text only. Separate paragraphs with a blank line. This replaces the placeholder on the public About
                page.
              </p>
              <div>
                <Label htmlFor="aboutPageContent">About content</Label>
                <Textarea
                  id="aboutPageContent"
                  value={form.aboutPageContent}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, aboutPageContent: e.target.value.slice(0, MAX_ABOUT_PAGE_CONTENT) }))
                  }
                  className="mt-1 min-h-[200px] border-[#E5E7EB] font-mono text-sm"
                  rows={12}
                  placeholder={"Who you are.\n\nHow you work with clients.\n\nWhere you’re based."}
                />
              </div>
            </section>

            <section id="social-whatsapp" className="scroll-mt-8 space-y-4 border-t border-[#E5E7EB] pt-8">
              <h2 className="text-lg font-semibold text-[#0F172A]">Social & WhatsApp</h2>
              <p className="text-sm text-muted-foreground">
                Full profile URLs (https). Leave blank to hide an icon on the site. Filled links show in the mobile menu
                and as a vertical strip on the right side of the home hero. WhatsApp uses digits only for the floating
                button; leave empty to hide the button.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {SOCIAL_URL_FIELDS.map(({ key, label }) => (
                  <div key={key}>
                    <Label htmlFor={`soc-${key}`}>{label}</Label>
                    <Input
                      id={`soc-${key}`}
                      value={social[key]}
                      onChange={(e) => setSocial((s) => ({ ...s, [key]: e.target.value }))}
                      className="mt-1 border-[#E5E7EB]"
                      placeholder="https://…"
                    />
                  </div>
                ))}
              </div>
              <div>
                <Label htmlFor="whatsappNumber">WhatsApp number</Label>
                <Input
                  id="whatsappNumber"
                  value={form.whatsappNumber}
                  onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
                  className="mt-1 border-[#E5E7EB]"
                  placeholder="+91… or country code + number"
                />
              </div>
            </section>

            <section id="effects" className="scroll-mt-8 space-y-4 border-t border-[#E5E7EB] pt-8">
              <h2 className="text-lg font-semibold text-[#0F172A]">Effects</h2>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="enableBoatCursor"
                  checked={form.enableBoatCursor}
                  onChange={(e) => setForm((f) => ({ ...f, enableBoatCursor: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-[#E5E7EB] text-[#22C55E] focus:ring-[#22C55E]"
                />
                <div>
                  <Label htmlFor="enableBoatCursor" className="cursor-pointer font-normal text-[#0F172A]">
                    Enable boat cursor animation
                  </Label>
                  <p className="text-sm text-muted-foreground">Turn off for a more formal, corporate feel.</p>
                </div>
              </div>
            </section>

            <Card id="footer" className="scroll-mt-8 border-[#E5E7EB] bg-[#F8FAFC]">
              <CardHeader>
                <CardTitle className="text-lg text-[#0F172A]">Footer</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Columns, newsletter copy, office hours, copyright. Internal links can carry optional page text (privacy,
                  terms, etc.).
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="brandTagline">Brand tagline (under logo)</Label>
                  <Textarea
                    id="brandTagline"
                    value={footer.brandTagline}
                    onChange={(e) => setFooter((f) => ({ ...f, brandTagline: e.target.value }))}
                    className="mt-1 border-[#E5E7EB]"
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="quickH">Quick links column title</Label>
                    <Input
                      id="quickH"
                      value={footer.quickLinksHeading}
                      onChange={(e) => setFooter((f) => ({ ...f, quickLinksHeading: e.target.value }))}
                      className="mt-1 border-[#E5E7EB]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="svcH">Services column title</Label>
                    <Input
                      id="svcH"
                      value={footer.servicesHeading}
                      onChange={(e) => setFooter((f) => ({ ...f, servicesHeading: e.target.value }))}
                      className="mt-1 border-[#E5E7EB]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="infoH">Information column title</Label>
                    <Input
                      id="infoH"
                      value={footer.infoHeading}
                      onChange={(e) => setFooter((f) => ({ ...f, infoHeading: e.target.value }))}
                      className="mt-1 border-[#E5E7EB]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="copyEnt">Copyright name (after © year)</Label>
                    <Input
                      id="copyEnt"
                      value={footer.copyrightEntity}
                      onChange={(e) => setFooter((f) => ({ ...f, copyrightEntity: e.target.value }))}
                      className="mt-1 border-[#E5E7EB]"
                    />
                  </div>
                </div>

                <LinksBlock
                  label="Quick links"
                  links={footer.quickLinks}
                  onChange={(quickLinks) => setFooter((f) => ({ ...f, quickLinks }))}
                />
                <LinksBlock
                  label="Service links"
                  links={footer.serviceLinks}
                  onChange={(serviceLinks) => setFooter((f) => ({ ...f, serviceLinks }))}
                />
                <LinksBlock
                  label="Information links"
                  links={footer.infoLinks}
                  onChange={(infoLinks) => setFooter((f) => ({ ...f, infoLinks }))}
                />

                <div>
                  <Label htmlFor="nlH">Newsletter section title</Label>
                  <Input
                    id="nlH"
                    value={footer.newsletterHeading}
                    onChange={(e) => setFooter((f) => ({ ...f, newsletterHeading: e.target.value }))}
                    className="mt-1 border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <Label htmlFor="nlD">Newsletter description</Label>
                  <Textarea
                    id="nlD"
                    value={footer.newsletterDescription}
                    onChange={(e) => setFooter((f) => ({ ...f, newsletterDescription: e.target.value }))}
                    className="mt-1 border-[#E5E7EB]"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="office">Office hours</Label>
                  <Input
                    id="office"
                    value={footer.officeHours}
                    onChange={(e) => setFooter((f) => ({ ...f, officeHours: e.target.value }))}
                    className="mt-1 border-[#E5E7EB]"
                  />
                </div>
              </CardContent>
            </Card>

            {saved && (
              <p className="text-sm text-[#22C55E]">
                Saved. Refresh the public site to see changes. Newsletter signups still appear in Leads (source
                &quot;newsletter&quot;).
              </p>
            )}
            {error && <p className="text-sm text-[#EF4444]">{error}</p>}
            <Button type="submit" disabled={saving} className="bg-[#22C55E] hover:bg-[#16A34A]">
              {saving ? "Saving…" : "Save all settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
