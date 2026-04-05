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

export default function NewProjectPage() {
  const router = useRouter();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    await api.post("/admin/projects", {
      ...form,
      techStack: form.techStack ? form.techStack.split(",").map((s) => s.trim()) : [],
    }, token);
    router.push("/anish/projects");
    router.refresh();
  }

  return (
    <div>
      <Link href="/anish/projects" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
        ← Back to Projects
      </Link>
      <h1 className="text-2xl font-bold mb-8">New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
        </div>
        <div>
          <Label htmlFor="slug">Slug (optional)</Label>
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
          <Input id="techStack" value={form.techStack} onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))} placeholder="Next.js, PostgreSQL" />
        </div>
        <Button type="submit">Create Project</Button>
      </form>
    </div>
  );
}
