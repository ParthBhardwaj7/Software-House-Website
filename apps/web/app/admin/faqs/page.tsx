"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Faq = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
};

export default function AdminFaqsPage() {
  const [items, setItems] = useState<Faq[]>([]);
  const token = getAccessToken();

  useEffect(() => {
    if (!token) return;
    api.get<Faq[]>("/admin/faqs", token).then(setItems).catch(() => setItems([]));
  }, [token]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">FAQs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Shown on the public /faqs page (order = sort order, then date).</p>
        </div>
        <Button asChild className="bg-[#22C55E] hover:bg-[#16A34A]">
          <Link href="/admin/faqs/new">New FAQ</Link>
        </Button>
      </div>
      <div className="grid gap-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No FAQs yet. Add one to replace demo content on the site.</p>
        ) : null}
        {items.map((item) => (
          <Card key={item.id} className="border-[#E5E7EB]">
            <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Order {item.sortOrder}</p>
                <p className="font-semibold text-[#0F172A]">{item.question}</p>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.answer}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/faqs/${item.id}`}>Edit</Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    if (!confirm("Delete this FAQ?")) return;
                    await api.delete(`/admin/faqs/${item.id}`, token!);
                    setItems((p) => p.filter((x) => x.id !== item.id));
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
