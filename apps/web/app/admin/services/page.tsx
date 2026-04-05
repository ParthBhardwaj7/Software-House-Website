"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Service = {
  id: string;
  title: string;
  description: string;
  problem: string | null;
  solution: string | null;
  outcome: string | null;
  sortOrder: number;
};

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const token = getAccessToken();

  useEffect(() => {
    if (!token) return;
    api.get<Service[]>("/admin/services", token).then(setItems).catch(() => setItems([]));
  }, [token]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button asChild variant="default">
          <Link href="/anish/services/new">Add Service</Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="card-pop rounded-2xl border border-[#E5E7EB] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/anish/services/${item.id}`}>Edit</Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    if (confirm("Delete this service?")) {
                      await api.delete(`/admin/services/${item.id}`, token!);
                      setItems((p) => p.filter((x) => x.id !== item.id));
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
