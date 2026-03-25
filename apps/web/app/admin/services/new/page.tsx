"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewServicePage() {
  const router = useRouter();
  const token = getAccessToken();
  const [form, setForm] = useState({
    title: "",
    description: "",
    problem: "",
    solution: "",
    outcome: "",
    sortOrder: 0,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    await api.post("/admin/services", {
      ...form,
      problem: form.problem || undefined,
      solution: form.solution || undefined,
      outcome: form.outcome || undefined,
    }, token);
    router.push("/admin/services");
    router.refresh();
  }

  return (
    <div>
      <Link href="/admin/services" className="text-sm text-primary hover:underline mb-6 inline-block">
        ← Back to Services
      </Link>
      <h1 className="text-2xl font-bold mb-8">Add Service</h1>
      <Card className="max-w-2xl rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="problem">Problem</Label>
              <Input id="problem" value={form.problem} onChange={(e) => setForm((f) => ({ ...f, problem: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="solution">Solution</Label>
              <Input id="solution" value={form.solution} onChange={(e) => setForm((f) => ({ ...f, solution: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="outcome">Outcome</Label>
              <Input id="outcome" value={form.outcome} onChange={(e) => setForm((f) => ({ ...f, outcome: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input id="sortOrder" type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
            </div>
            <Button type="submit">Create Service</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
