"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({ projects: 0, leads: 0 });
  const token = getAccessToken();

  useEffect(() => {
    if (!token) return;
    Promise.all([
      api.get<unknown[]>("/admin/projects", token).then((r) => r.length),
      api.get<unknown[]>("/admin/leads", token).then((r) => r.length),
    ])
      .then(([projects, leads]) => setCounts({ projects, leads }))
      .catch(() => {});
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0F172A] mb-8">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/admin/settings">
          <div className="p-6 border border-[#E5E7EB] rounded-xl bg-[#FFFFFF] hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-[#0F172A]">Website Settings</h2>
            <p className="text-[#64748B] text-sm mt-1">Update site name, email, phone</p>
          </div>
        </Link>
        <Link href="/admin/projects">
          <div className="p-6 border border-[#E5E7EB] rounded-xl bg-[#FFFFFF] hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-[#0F172A]">Portfolio</h2>
            <p className="text-3xl font-bold mt-2 text-[#22C55E]">{counts.projects}</p>
          </div>
        </Link>
        <Link href="/admin/testimonials">
          <div className="p-6 border border-[#E5E7EB] rounded-xl bg-[#FFFFFF] hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-[#0F172A]">Testimonials</h2>
            <p className="text-[#64748B] text-sm mt-1">Manage client quotes</p>
          </div>
        </Link>
        <Link href="/admin/custom-pages">
          <div className="p-6 border border-[#E5E7EB] rounded-xl bg-[#FFFFFF] hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-[#0F172A]">Custom pages</h2>
            <p className="text-[#64748B] text-sm mt-1">Navbar pages with media, headings, links</p>
          </div>
        </Link>
        <Link href="/admin/leads">
          <div className="p-6 border border-[#E5E7EB] rounded-xl bg-[#FFFFFF] hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-[#0F172A]">Leads</h2>
            <p className="text-3xl font-bold mt-2 text-[#22C55E]">{counts.leads}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
