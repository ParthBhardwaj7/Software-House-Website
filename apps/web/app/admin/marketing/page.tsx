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
  DEFAULT_MARKETING_DELIVERY,
  DEFAULT_MARKETING_HOME,
  marketingDeliveryToJson,
  marketingHomeToJson,
  type MarketingDeliveryContent,
  type MarketingHomeContent,
} from "@/lib/marketing-defaults";

function cloneHome(h: MarketingHomeContent): MarketingHomeContent {
  return { ...h };
}

function cloneDelivery(d: MarketingDeliveryContent): MarketingDeliveryContent {
  return { ...d, steps: d.steps.map((s) => ({ ...s })) };
}

export default function AdminMarketingPage() {
  const token = getAccessToken();
  const [home, setHome] = useState<MarketingHomeContent>(() => cloneHome(DEFAULT_MARKETING_HOME));
  const [delivery, setDelivery] = useState<MarketingDeliveryContent>(() => cloneDelivery(DEFAULT_MARKETING_DELIVERY));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api
      .get<{
        marketingHomeJson?: string;
        marketingDeliveryJson?: string;
      }>("/admin/settings", token)
      .then((r) => {
        try {
          if (r.marketingHomeJson?.trim()) {
            const o = JSON.parse(r.marketingHomeJson) as MarketingHomeContent;
            setHome(cloneHome({ ...DEFAULT_MARKETING_HOME, ...o }));
          }
        } catch {
          /* keep default */
        }
        try {
          if (r.marketingDeliveryJson?.trim()) {
            const o = JSON.parse(r.marketingDeliveryJson) as MarketingDeliveryContent;
            const steps = Array.isArray(o.steps) && o.steps.length > 0 ? o.steps : DEFAULT_MARKETING_DELIVERY.steps;
            setDelivery(
              cloneDelivery({
                sectionEyebrow: o.sectionEyebrow || DEFAULT_MARKETING_DELIVERY.sectionEyebrow,
                title: o.title || DEFAULT_MARKETING_DELIVERY.title,
                subtitle: o.subtitle || DEFAULT_MARKETING_DELIVERY.subtitle,
                steps: steps.map((s: { title?: string; body?: string }) => ({
                  title: String(s.title || ""),
                  body: String(s.body || ""),
                })),
              })
            );
          }
        } catch {
          /* keep default */
        }
      })
      .catch(() => {});
  }, [token]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await api.put(
        "/admin/settings",
        {
          marketingHomeJson: marketingHomeToJson(home),
          marketingDeliveryJson: marketingDeliveryToJson(delivery),
        },
        token
      );
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed. Check API and field limits.");
    } finally {
      setSaving(false);
    }
  }

  function updateStep(i: number, patch: Partial<{ title: string; body: string }>) {
    setDelivery((d) => ({
      ...d,
      steps: d.steps.map((s, j) => (j === i ? { ...s, ...patch } : s)),
    }));
  }

  function addStep() {
    setDelivery((d) => ({
      ...d,
      steps: [...d.steps, { title: "New step", body: "Describe this phase." }],
    }));
  }

  function removeStep(i: number) {
    setDelivery((d) => ({
      ...d,
      steps: d.steps.length > 1 ? d.steps.filter((_, j) => j !== i) : d.steps,
    }));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Home &amp; delivery content</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Controls the home hero and the &quot;What we deliver&quot; section (also used on /what-we-deliver and the
          process timeline on /services). Save sends validated JSON to the same store as Website Settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <Card className="border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-[#0F172A]">Home hero</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Eyebrow (small caps line)</Label>
              <Input
                className="mt-1 border-[#E5E7EB]"
                value={home.eyebrow}
                onChange={(e) => setHome((h) => ({ ...h, eyebrow: e.target.value }))}
              />
            </div>
            <div>
              <Label>Heading — part before green word</Label>
              <Input
                className="mt-1 border-[#E5E7EB]"
                value={home.headingPrefix}
                onChange={(e) => setHome((h) => ({ ...h, headingPrefix: e.target.value }))}
              />
            </div>
            <div>
              <Label>Green emphasized word</Label>
              <Input
                className="mt-1 border-[#E5E7EB]"
                value={home.headingEmphasis}
                onChange={(e) => setHome((h) => ({ ...h, headingEmphasis: e.target.value }))}
              />
            </div>
            <div>
              <Label>Heading — after green word</Label>
              <Input
                className="mt-1 border-[#E5E7EB]"
                value={home.headingMiddle}
                onChange={(e) => setHome((h) => ({ ...h, headingMiddle: e.target.value }))}
              />
            </div>
            <div>
              <Label>Gradient phrase</Label>
              <Input
                className="mt-1 border-[#E5E7EB]"
                value={home.headingGradient}
                onChange={(e) => setHome((h) => ({ ...h, headingGradient: e.target.value }))}
              />
            </div>
            <div>
              <Label>Heading — closing words</Label>
              <Input
                className="mt-1 border-[#E5E7EB]"
                value={home.headingSuffix}
                onChange={(e) => setHome((h) => ({ ...h, headingSuffix: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Subtext under headline</Label>
              <Textarea
                className="mt-1 border-[#E5E7EB]"
                rows={3}
                value={home.subtext}
                onChange={(e) => setHome((h) => ({ ...h, subtext: e.target.value }))}
              />
            </div>
            <div>
              <Label>Primary CTA path</Label>
              <Input
                className="mt-1 border-[#E5E7EB]"
                value={home.primaryCtaHref}
                onChange={(e) => setHome((h) => ({ ...h, primaryCtaHref: e.target.value }))}
                placeholder="/contact"
              />
            </div>
            <div>
              <Label>Secondary button label</Label>
              <Input
                className="mt-1 border-[#E5E7EB]"
                value={home.secondaryButtonLabel}
                onChange={(e) => setHome((h) => ({ ...h, secondaryButtonLabel: e.target.value }))}
              />
            </div>
            <div>
              <Label>Secondary button path</Label>
              <Input
                className="mt-1 border-[#E5E7EB]"
                value={home.secondaryButtonHref}
                onChange={(e) => setHome((h) => ({ ...h, secondaryButtonHref: e.target.value }))}
                placeholder="/portfolio"
              />
            </div>
            <div>
              <Label>Bottom bar — left label</Label>
              <Input
                className="mt-1 border-[#E5E7EB]"
                value={home.bottomEyebrow}
                onChange={(e) => setHome((h) => ({ ...h, bottomEyebrow: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Bottom bar — right paragraph</Label>
              <Textarea
                className="mt-1 border-[#E5E7EB]"
                rows={2}
                value={home.bottomText}
                onChange={(e) => setHome((h) => ({ ...h, bottomText: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E7EB]">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-[#0F172A]">What we deliver</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addStep}>
                Add step
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Between 1 and 12 steps. Shown on home, /what-we-deliver, and /services timeline.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Section eyebrow</Label>
                <Input
                  className="mt-1 border-[#E5E7EB]"
                  value={delivery.sectionEyebrow}
                  onChange={(e) => setDelivery((d) => ({ ...d, sectionEyebrow: e.target.value }))}
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  className="mt-1 border-[#E5E7EB]"
                  value={delivery.title}
                  onChange={(e) => setDelivery((d) => ({ ...d, title: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-3">
                <Label>Subtitle</Label>
                <Textarea
                  className="mt-1 border-[#E5E7EB]"
                  rows={2}
                  value={delivery.subtitle}
                  onChange={(e) => setDelivery((d) => ({ ...d, subtitle: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-6">
              {delivery.steps.map((step, i) => (
                <div key={i} className="rounded-lg border border-[#E5E7EB] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#0F172A]">Step {i + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => removeStep(i)}
                      disabled={delivery.steps.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={step.title}
                      onChange={(e) => updateStep(i, { title: e.target.value })}
                      className="border-[#E5E7EB]"
                    />
                    <Label className="text-xs">Body</Label>
                    <Textarea
                      rows={4}
                      value={step.body}
                      onChange={(e) => updateStep(i, { body: e.target.value })}
                      className="border-[#E5E7EB]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {saved && <p className="text-sm text-[#22C55E]">Saved. Refresh the public site to see changes.</p>}
        {error && <p className="text-sm text-[#EF4444]">{error}</p>}
        <Button type="submit" disabled={saving} className="bg-[#22C55E] hover:bg-[#16A34A]">
          {saving ? "Saving…" : "Save home & delivery"}
        </Button>
      </form>
    </div>
  );
}
