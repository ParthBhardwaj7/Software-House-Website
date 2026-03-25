"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string | null;
  quote: string;
  rating: number | null;
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const token = getAccessToken();

  useEffect(() => {
    if (!token) return;
    api.get<Testimonial[]>("/admin/testimonials", token).then(setItems).catch(() => setItems([]));
  }, [token]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Button asChild>
          <Link href="/admin/testimonials/new">New Testimonial</Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="rounded-2xl shadow-sm">
            <CardContent className="pt-6 flex flex-row justify-between">
              <div>
                <p className="font-semibold">{item.name} - {item.role}{item.company ? ` at ${item.company}` : ""}</p>
                <p className="text-sm text-muted-foreground mt-1">&ldquo;{item.quote.slice(0, 100)}...&rdquo;</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/testimonials/${item.id}`}>Edit</Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    if (confirm("Delete this testimonial?")) {
                      await api.delete(`/admin/testimonials/${item.id}`, token!);
                      setItems((p) => p.filter((x) => x.id !== item.id));
                    }
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
