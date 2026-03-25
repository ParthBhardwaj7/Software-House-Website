"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomPageBlocksForm } from "@/components/admin/CustomPageBlocksForm";
import {
  type CustomPageBlock,
  sanitizeBlocksForSubmit,
  slugifyNavLabel,
  validateBlocksClient,
} from "@/lib/custom-page-model";

export default function NewCustomPagePage() {
  const router = useRouter();
  const token = getAccessToken();
  const [err, setErr] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    navLabel: "",
    headline: "",
    subheadline: "",
    showInNav: true,
    navSortOrder: 10,
    published: false,
    metaTitle: "",
    metaDescription: "",
  });
  const [blocks, setBlocks] = useState<CustomPageBlock[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!token) return;
    const sanitized = sanitizeBlocksForSubmit(blocks);
    const v = validateBlocksClient(sanitized);
    if (v) {
      setErr(v);
      return;
    }
    try {
      await api.post("/admin/custom-pages", { ...form, blocks: sanitized }, token);
      router.push("/admin/custom-pages");
      router.refresh();
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : "Save failed");
    }
  }

  return (
    <div>
      <Link href="/admin/custom-pages" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Back to custom pages
      </Link>
      <h1 className="mb-2 text-2xl font-bold">New custom page</h1>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Slug becomes the URL path after <code className="rounded bg-muted px-1">/site/</code>. Avoid reserved names like{" "}
        <code className="rounded bg-muted px-1">blog</code>, <code className="rounded bg-muted px-1">admin</code>, etc.
      </p>
      {err ? <p className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{err}</p> : null}
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="navLabel">Navbar label</Label>
            <Input
              id="navLabel"
              required
              value={form.navLabel}
              onChange={(e) => {
                const navLabel = e.target.value;
                setForm((f) => ({
                  ...f,
                  navLabel,
                  slug: slugTouched ? f.slug : slugifyNavLabel(navLabel),
                }));
              }}
              placeholder="e.g. Case studies"
            />
            <Button
              type="button"
              variant="link"
              className="mt-1 h-auto p-0 text-xs"
              onClick={() => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: slugifyNavLabel(f.navLabel) }));
              }}
            >
              Generate slug from label
            </Button>
          </div>
          <div>
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              required
              pattern="[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*"
              title="Letters, numbers, hyphens only"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: e.target.value }));
              }}
              placeholder="case-studies"
            />
          </div>
          <div>
            <Label htmlFor="navSortOrder">Nav order (lower = earlier)</Label>
            <Input
              id="navSortOrder"
              type="number"
              min={0}
              value={form.navSortOrder}
              onChange={(e) => setForm((f) => ({ ...f, navSortOrder: Number(e.target.value) || 0 }))}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="headline">Page headline (H1)</Label>
            <Input
              id="headline"
              required
              value={form.headline}
              onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="subheadline">Subheadline (optional)</Label>
            <Textarea
              id="subheadline"
              rows={3}
              value={form.subheadline}
              onChange={(e) => setForm((f) => ({ ...f, subheadline: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="metaTitle">SEO title (optional)</Label>
            <Input
              id="metaTitle"
              value={form.metaTitle}
              onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="metaDescription">SEO description (optional)</Label>
            <Input
              id="metaDescription"
              value={form.metaDescription}
              onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
            />
          </div>
          <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.showInNav}
                onChange={(e) => setForm((f) => ({ ...f, showInNav: e.target.checked }))}
              />
              Show in navbar (only when published)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              />
              Published
            </label>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="mb-4 text-lg font-semibold">Page content (blocks)</h2>
          <CustomPageBlocksForm blocks={blocks} onChange={setBlocks} />
        </div>

        <Button type="submit">Create page</Button>
      </form>
    </div>
  );
}
