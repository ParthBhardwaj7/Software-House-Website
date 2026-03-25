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

export default function NewBlogPage() {
  const router = useRouter();
  const token = getAccessToken();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    published: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    await api.post("/admin/blogs", form, token);
    router.push("/admin/blogs");
    router.refresh();
  }

  return (
    <div>
      <Link href="/admin/blogs" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
        ← Back to Blogs
      </Link>
      <h1 className="text-2xl font-bold mb-8">New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug (optional)</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="auto-generated from title"
          />
        </div>
        <div>
          <Label htmlFor="excerpt">Excerpt (optional)</Label>
          <Input
            id="excerpt"
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            rows={10}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
          />
          <Label htmlFor="published">Publish immediately</Label>
        </div>
        <Button type="submit">Create Post</Button>
      </form>
    </div>
  );
}
