"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [authGate, setAuthGate] = useState(false);

  useEffect(() => {
    setAuthGate(true);
    if (!isLoginPage && !isAuthenticated()) {
      router.replace("/admin/login");
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
      <aside className="fixed left-0 top-14 bottom-0 z-40 w-56 border-r border-[#E5E7EB] bg-[#FFFFFF] p-4 sm:top-16">
        <nav className="space-y-2">
          <Link href="/admin" className="block py-2 text-sm font-medium text-[#64748B] hover:text-[#22C55E]">
            Dashboard
          </Link>
          <Link href="/admin/settings" className="block py-2 text-sm font-medium text-[#64748B] hover:text-[#22C55E]">
            Website Settings
          </Link>
          <Link href="/admin/projects" className="block py-2 text-sm font-medium text-[#64748B] hover:text-[#22C55E]">
            Portfolio
          </Link>
          <Link href="/admin/testimonials" className="block py-2 text-sm font-medium text-[#64748B] hover:text-[#22C55E]">
            Testimonials
          </Link>
          <Link href="/admin/team" className="block py-2 text-sm font-medium text-[#64748B] hover:text-[#22C55E]">
            Team
          </Link>
          <Link href="/admin/services" className="block py-2 text-sm font-medium text-[#64748B] hover:text-[#22C55E]">
            Services
          </Link>
          <Link href="/admin/custom-pages" className="block py-2 text-sm font-medium text-[#64748B] hover:text-[#22C55E]">
            Custom pages
          </Link>
          <Link href="/admin/leads" className="block py-2 text-sm font-medium text-[#64748B] hover:text-[#22C55E]">
            Leads
          </Link>
        </nav>
        <div className="mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.clear();
                router.push("/admin/login");
                router.refresh();
              }
            }}
          >
            Logout
          </Button>
        </div>
      </aside>
      <main className="pl-56 pt-14 sm:pt-16">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
