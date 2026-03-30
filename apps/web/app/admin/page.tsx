"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

type Counts = {
  projects: number;
  leads: number;
  blogs: number;
  services: number;
  team: number;
  faqs: number;
  testimonials: number;
};

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts>({
    projects: 0,
    leads: 0,
    blogs: 0,
    services: 0,
    team: 0,
    faqs: 0,
    testimonials: 0,
  });
  const token = getAccessToken();

  useEffect(() => {
    if (!token) return;
    Promise.all([
      api.get<unknown[]>("/admin/projects", token).then((r) => r.length),
      api.get<unknown[]>("/admin/leads", token).then((r) => r.length),
      api.get<unknown[]>("/admin/blogs", token).then((r) => r.length),
      api.get<unknown[]>("/admin/services", token).then((r) => r.length),
      api.get<unknown[]>("/admin/team-members", token).then((r) => r.length),
      api.get<unknown[]>("/admin/faqs", token).then((r) => r.length),
      api.get<unknown[]>("/admin/testimonials", token).then((r) => r.length),
    ])
      .then(([projects, leads, blogs, services, team, faqs, testimonials]) =>
        setCounts({ projects, leads, blogs, services, team, faqs, testimonials })
      )
      .catch(() => {});
  }, [token]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-[#0F172A]">Dashboard</h1>
      <p className="mb-8 max-w-2xl text-sm text-[#64748B]">
        Manage everything that appears on the public site: copy, team, portfolio, blog, custom pages, and inbound
        leads.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link href="/admin/settings">
          <div className="h-full rounded-xl border border-[#E5E7EB] bg-white p-5 transition-shadow hover:shadow-md">
            <h2 className="text-lg font-semibold text-[#0F172A]">Website settings</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Name, logo, SEO, About text, social, WhatsApp, footer columns, legal link content
            </p>
          </div>
        </Link>
        <Link href="/admin/marketing">
          <div className="h-full rounded-xl border border-[#E5E7EB] bg-white p-5 transition-shadow hover:shadow-md">
            <h2 className="text-lg font-semibold text-[#0F172A]">Home &amp; delivery</h2>
            <p className="mt-1 text-sm text-[#64748B]">Hero headline, CTAs, and process steps (home + /what-we-deliver + /services)</p>
          </div>
        </Link>
        <Link href="/admin/faqs">
          <div className="h-full rounded-xl border border-[#E5E7EB] bg-white p-5 transition-shadow hover:shadow-md">
            <h2 className="text-lg font-semibold text-[#0F172A]">FAQs</h2>
            <p className="text-3xl font-bold text-[#22C55E]">{counts.faqs}</p>
            <p className="mt-1 text-sm text-[#64748B]">Questions on /faqs</p>
          </div>
        </Link>
        <Link href="/admin/projects">
          <div className="h-full rounded-xl border border-[#E5E7EB] bg-white p-5 transition-shadow hover:shadow-md">
            <h2 className="text-lg font-semibold text-[#0F172A]">Portfolio</h2>
            <p className="text-3xl font-bold text-[#22C55E]">{counts.projects}</p>
            <p className="mt-1 text-sm text-[#64748B]">Case studies &amp; gallery</p>
          </div>
        </Link>
        <Link href="/admin/services">
          <div className="h-full rounded-xl border border-[#E5E7EB] bg-white p-5 transition-shadow hover:shadow-md">
            <h2 className="text-lg font-semibold text-[#0F172A]">Services</h2>
            <p className="text-3xl font-bold text-[#22C55E]">{counts.services}</p>
            <p className="mt-1 text-sm text-[#64748B]">Offerings on /services</p>
          </div>
        </Link>
        <Link href="/admin/testimonials">
          <div className="h-full rounded-xl border border-[#E5E7EB] bg-white p-5 transition-shadow hover:shadow-md">
            <h2 className="text-lg font-semibold text-[#0F172A]">Testimonials</h2>
            <p className="text-3xl font-bold text-[#22C55E]">{counts.testimonials}</p>
            <p className="mt-1 text-sm text-[#64748B]">Client quotes</p>
          </div>
        </Link>
        <Link href="/admin/team">
          <div className="h-full rounded-xl border border-[#E5E7EB] bg-white p-5 transition-shadow hover:shadow-md">
            <h2 className="text-lg font-semibold text-[#0F172A]">Team</h2>
            <p className="text-3xl font-bold text-[#22C55E]">{counts.team}</p>
            <p className="mt-1 text-sm text-[#64748B]">/team &amp; contact dropdown</p>
          </div>
        </Link>
        <Link href="/admin/blogs">
          <div className="h-full rounded-xl border border-[#E5E7EB] bg-white p-5 transition-shadow hover:shadow-md">
            <h2 className="text-lg font-semibold text-[#0F172A]">Blog</h2>
            <p className="text-3xl font-bold text-[#22C55E]">{counts.blogs}</p>
            <p className="mt-1 text-sm text-[#64748B]">Posts &amp; SEO</p>
          </div>
        </Link>
        <Link href="/admin/custom-pages">
          <div className="h-full rounded-xl border border-[#E5E7EB] bg-white p-5 transition-shadow hover:shadow-md">
            <h2 className="text-lg font-semibold text-[#0F172A]">Custom pages</h2>
            <p className="mt-1 text-sm text-[#64748B]">Extra nav pages at /site/…</p>
          </div>
        </Link>
        <Link href="/admin/leads">
          <div className="h-full rounded-xl border border-[#E5E7EB] bg-white p-5 transition-shadow hover:shadow-md">
            <h2 className="text-lg font-semibold text-[#0F172A]">Leads</h2>
            <p className="text-3xl font-bold text-[#22C55E]">{counts.leads}</p>
            <p className="mt-1 text-sm text-[#64748B]">Contact form + newsletter</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
