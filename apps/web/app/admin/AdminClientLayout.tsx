"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function NavLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] first:pt-0">
      {children}
    </p>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/anish" && pathname.startsWith(href + "/"));
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-lg px-2 py-2 text-sm font-medium transition-colors",
        active ? "bg-[#F0FDF4] text-[#15803D]" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
      )}
    >
      {children}
    </Link>
  );
}

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/anish/login";
  const [authGate, setAuthGate] = useState(false);

  useEffect(() => {
    setAuthGate(true);
    if (!isLoginPage && !isAuthenticated()) {
      router.replace("/anish/login");
    }
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#F8FAFC]">{children}</div>;
  }

  if (!authGate || !isAuthenticated()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm text-[#64748B]">
        Checking session…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <aside className="fixed bottom-0 left-0 top-14 z-40 w-60 overflow-y-auto border-r border-[#E5E7EB] bg-[#FFFFFF] p-3 sm:top-16">
        <nav className="pb-8">
          <NavLabel>Overview</NavLabel>
          <NavLink href="/anish">Dashboard</NavLink>

          <NavLabel>Site &amp; pages</NavLabel>
          <NavLink href="/anish/settings">Website settings</NavLink>
          <NavLink href="/anish/marketing">Home &amp; delivery</NavLink>
          <NavLink href="/anish/faqs">FAQs</NavLink>

          <NavLabel>Content</NavLabel>
          <NavLink href="/anish/projects">Portfolio</NavLink>
          <NavLink href="/anish/services">Services</NavLink>
          <NavLink href="/anish/testimonials">Testimonials</NavLink>
          <NavLink href="/anish/team">Team</NavLink>
          <NavLink href="/anish/blogs">Blog posts</NavLink>
          <NavLink href="/anish/custom-pages">Custom pages</NavLink>

          <NavLabel>Inbox</NavLabel>
          <NavLink href="/anish/leads">Leads</NavLink>
        </nav>
        <div className="sticky bottom-0 border-t border-[#E5E7EB] bg-white pt-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.clear();
                router.push("/anish/login");
                router.refresh();
              }
            }}
          >
            Logout
          </Button>
        </div>
      </aside>
      <main className="min-w-0 pl-60 pt-14 sm:pt-16">
        <div className="p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
