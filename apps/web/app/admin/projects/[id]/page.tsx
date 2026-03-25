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

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const token = getAccessToken();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    imageUrl: "",
    liveUrl: "",
    techStack: "",
  });

  useEffect(() => {
    if (!token) return;
    api
      .get<{ title: string; slug: string; description: string; category: string; imageUrl: string | null; liveUrl: string | null; techStack: string[] }>(`/admin/projects/${id}`, token)
      .then((p) => setForm({
        ...p,
        imageUrl: p.imageUrl || "",
        liveUrl: p.liveUrl || "",
        techStack: p.techStack?.join(", ") || "",
      }))
      .catch(() => router.push("/admin/projects"));
  }, [id, token, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    await api.put(`/admin/projects/${id}`, {
      ...form,
      techStack: form.techStack ? form.techStack.split(",").map((s) => s.trim()) : [],
    }, token);
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <div>
      <Link href="/admin/projects" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
        ← Back to Projects
      </Link>
      <h1 className="text-2xl font-bold mb-8">Edit Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required />
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input id="liveUrl" value={form.liveUrl} onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
          <Input id="techStack" value={form.techStack} onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))} />
        </div>
        <Button type="submit">Update Project</Button>
      </form>
    </div>
  );
}
