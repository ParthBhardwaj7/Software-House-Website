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

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const token = getAccessToken();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    published: false,
  });

  useEffect(() => {
    if (!token) return;
    api.get<typeof form>(`/admin/blogs/${id}`, token).then(setForm).catch(() => router.push("/admin/blogs"));
  }, [id, token, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    await api.put(`/admin/blogs/${id}`, form, token);
    router.push("/admin/blogs");
    router.refresh();
  }

  return (
    <div>
      <Link href="/admin/blogs" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
        ← Back to Blogs
      </Link>
      <h1 className="text-2xl font-bold mb-8">Edit Blog Post</h1>
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
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input
            id="excerpt"
            value={form.excerpt || ""}
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
          <Label htmlFor="published">Published</Label>
        </div>
        <Button type="submit">Update Post</Button>
      </form>
    </div>
  );
}
