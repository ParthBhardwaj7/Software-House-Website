"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const token = getAccessToken();
  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    quote: "",
    avatarUrl: "",
    rating: 5,
  });

  useEffect(() => {
    if (!token) return;
    api
      .get<{ name: string; role: string; company: string | null; quote: string; avatarUrl: string | null; rating: number | null }>(`/admin/testimonials/${id}`, token)
      .then((p) => setForm({
        name: p.name,
        role: p.role,
        company: p.company || "",
        quote: p.quote,
        avatarUrl: p.avatarUrl || "",
        rating: p.rating || 5,
      }))
      .catch(() => router.push("/anish/testimonials"));
  }, [id, token, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    await api.put(`/admin/testimonials/${id}`, {
      ...form,
      company: form.company || undefined,
      avatarUrl: form.avatarUrl || undefined,
      rating: form.rating || undefined,
    }, token);
    router.push("/anish/testimonials");
    router.refresh();
  }

  return (
    <div>
      <Link href="/anish/testimonials" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
        ← Back to Testimonials
      </Link>
      <h1 className="text-2xl font-bold mb-8">Edit Testimonial</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input id="role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} required />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="quote">Quote</Label>
          <Textarea id="quote" rows={4} value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} required />
        </div>
        <div>
          <ImageUpload
            label="Avatar photo"
            value={form.avatarUrl}
            onChange={(url) => setForm((f) => ({ ...f, avatarUrl: url }))}
            hint="Person's photo. Square image works best."
            previewShape="circle"
          />
        </div>
        <div>
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input id="rating" type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: parseInt(e.target.value) || 5 }))} />
        </div>
        <Button type="submit">Update Testimonial</Button>
      </form>
    </div>
  );
}
