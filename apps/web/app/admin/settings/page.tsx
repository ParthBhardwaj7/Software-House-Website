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

const MAX_LINKS = 12;

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

export default function AdminSettingsPage() {
  const token = getAccessToken();
  const [form, setForm] = useState({
    websiteName: "HILO",
    contactEmail: "",
    phoneNumber: "",
  });
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
      }>("/admin/settings", token)
      .then((r) => {
        setForm({
          websiteName: r.websiteName || "HILO",
          contactEmail: r.contactEmail || "",
          phoneNumber: r.phoneNumber || "",
        });
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
          ...form,
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
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-[#0F172A]">Website Settings</h1>

      <Card className="max-w-xl border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-[#0F172A]">Site Info</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="websiteName" className="text-[#0F172A]">
                  Website Name
                </Label>
                <Input
                  id="websiteName"
                  value={form.websiteName}
                  onChange={(e) => setForm((f) => ({ ...f, websiteName: e.target.value }))}
                  className="border-[#E5E7EB]"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail" className="text-[#0F172A]">
                  Contact Email
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                  className="border-[#E5E7EB]"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber" className="text-[#0F172A]">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  value={form.phoneNumber}
                  onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                  className="border-[#E5E7EB]"
                />
              </div>
            </div>

            <Card className="border-[#E5E7EB] bg-[#F8FAFC]">
              <CardHeader>
                <CardTitle className="text-lg text-[#0F172A]">Footer</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Controls footer columns, newsletter copy, office hours, and copyright name. Link URLs are validated on save;
                  internal links can include optional page text (careers, refund policy, privacy copy, etc.).
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

                <LinksBlock label="Quick links" links={footer.quickLinks} onChange={(quickLinks) => setFooter((f) => ({ ...f, quickLinks }))} />
                <LinksBlock
                  label="Service links"
                  links={footer.serviceLinks}
                  onChange={(serviceLinks) => setFooter((f) => ({ ...f, serviceLinks }))}
                />
                <LinksBlock label="Information links" links={footer.infoLinks} onChange={(infoLinks) => setFooter((f) => ({ ...f, infoLinks }))} />

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
                Saved. Refresh the site to see footer changes; newsletter signups appear in Leads with source
                &quot;newsletter&quot;.
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
