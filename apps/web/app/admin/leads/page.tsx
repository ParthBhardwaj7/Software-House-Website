"use client";

import { useEffect, useState } from "react";

const SERVICE_LABELS: Record<string, string> = {
  web_design: "Web Design",
  app_software: "App / Custom Software",
  seo_copy: "SEO / Copywriting",
};
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";

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

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const token = getAccessToken();

  useEffect(() => {
    if (!token) return;
    api.get<Lead[]>("/admin/leads", token).then(setLeads).catch(() => setLeads([]));
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Leads / Contact Messages</h1>
      <p className="text-muted-foreground mb-6">Messages from the contact form appear here.</p>
      <div className="grid gap-6 md:grid-cols-2">
        {leads.length === 0 && (
          <p className="text-muted-foreground">No leads yet.</p>
        )}
        {leads.map((lead) => (
          <Card key={lead.id} className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{lead.name}</p>
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
                  <p className="mt-2">{lead.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Terms accepted: {lead.consentAccepted ? "Yes" : "No"}
                  </p>
                  {lead.source && (
                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-muted">{lead.source}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{new Date(lead.createdAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
