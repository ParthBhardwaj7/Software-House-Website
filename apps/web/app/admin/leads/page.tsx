"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SERVICE_LABELS: Record<string, string> = {
  web_design: "Web Design",
  app_software: "App / Custom Software",
  seo_copy: "SEO / Copywriting",
};

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  source: string | null;
  serviceInterest: string | null;
  consentAccepted: boolean;
  createdAt: string;
};

type LeadFilter = "all" | "contact" | "newsletter";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<LeadFilter>("all");
  const token = getAccessToken();

  useEffect(() => {
    if (!token) return;
    api.get<Lead[]>("/admin/leads", token).then(setLeads).catch(() => setLeads([]));
  }, [token]);

  const filtered = useMemo(() => {
    if (filter === "newsletter") return leads.filter((l) => l.source === "newsletter");
    if (filter === "contact") return leads.filter((l) => l.source === "contact" || !l.source);
    return leads;
  }, [leads, filter]);

  const counts = useMemo(() => {
    const newsletter = leads.filter((l) => l.source === "newsletter").length;
    const contact = leads.filter((l) => l.source === "contact" || !l.source).length;
    return { all: leads.length, contact, newsletter };
  }, [leads]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-[#0F172A]">Leads</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Contact form submissions and footer newsletter signups (same database, filtered by source).
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ["all", "All", counts.all],
            ["contact", "Contact form", counts.contact],
            ["newsletter", "Newsletter", counts.newsletter],
          ] as const
        ).map(([key, label, n]) => (
          <Button
            key={key}
            type="button"
            variant={filter === key ? "default" : "outline"}
            size="sm"
            className={filter === key ? "bg-[#22C55E] hover:bg-[#16A34A]" : ""}
            onClick={() => setFilter(key)}
          >
            {label} ({n})
          </Button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.length === 0 && <p className="text-muted-foreground">No items in this view.</p>}
        {filtered.map((lead) => (
          <Card key={lead.id} className="rounded-2xl border-[#E5E7EB] shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-[#0F172A]">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                  {lead.phone && <p className="text-sm">{lead.phone}</p>}
                  {lead.serviceInterest && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Service:{" "}
                      <span className="font-medium text-foreground">
                        {SERVICE_LABELS[lead.serviceInterest] ?? lead.serviceInterest}
                      </span>
                    </p>
                  )}
                  <p className="mt-2 whitespace-pre-wrap text-sm">{lead.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Terms accepted: {lead.consentAccepted ? "Yes" : "No"}
                  </p>
                  {lead.source && (
                    <span className="mt-2 inline-block rounded bg-muted px-2 py-1 text-xs">{lead.source}</span>
                  )}
                </div>
                <p className="shrink-0 text-sm text-muted-foreground">
                  {new Date(lead.createdAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
