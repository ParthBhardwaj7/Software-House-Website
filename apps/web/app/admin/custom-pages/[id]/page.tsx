"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomPageBlocksForm } from "@/components/admin/CustomPageBlocksForm";
import {
  type CustomPageBlock,
  parseBlocks,
  sanitizeBlocksForSubmit,
  validateBlocksClient,
} from "@/lib/custom-page-model";

type Loaded = {
  id: string;
  slug: string;
  navLabel: string;
  headline: string;
  subheadline: string | null;
  showInNav: boolean;
  navSortOrder: number;
  published: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  blocks: unknown;
};

export default function EditCustomPagePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const token = getAccessToken();
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    slug: "",
    navLabel: "",
    headline: "",
    subheadline: "",
    showInNav: true,
    navSortOrder: 0,
    published: false,
    metaTitle: "",
    metaDescription: "",
  });
  const [blocks, setBlocks] = useState<CustomPageBlock[]>([]);

  useEffect(() => {
    if (!token) return;
    api
      .get<Loaded>(`/admin/custom-pages/${id}`, token)
      .then((p) => {
        setForm({
          slug: p.slug,
          navLabel: p.navLabel,
          headline: p.headline,
          subheadline: p.subheadline ?? "",
          showInNav: p.showInNav,
          navSortOrder: p.navSortOrder,
          published: p.published,
          metaTitle: p.metaTitle ?? "",
          metaDescription: p.metaDescription ?? "",
        });
        setBlocks(parseBlocks(p.blocks));
      })
      .catch(() => router.push("/anish/custom-pages"));
  }, [id, token, router]);

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
      await api.put(
        `/admin/custom-pages/${id}`,
        {
          ...form,
          subheadline: form.subheadline.trim() || null,
          metaTitle: form.metaTitle.trim() || null,
          metaDescription: form.metaDescription.trim() || null,
          blocks: sanitized,
        },
        token
      );
      router.push("/anish/custom-pages");
      router.refresh();
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : "Save failed");
    }
  }

  return (
    <div>
      <Link href="/anish/custom-pages" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Back to custom pages
      </Link>
      <h1 className="mb-8 text-2xl font-bold">Edit custom page</h1>
      {err ? <p className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{err}</p> : null}
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="navLabel">Navbar label</Label>
            <Input
              id="navLabel"
              required
              value={form.navLabel}
              onChange={(e) => setForm((f) => ({ ...f, navLabel: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              required
              pattern="[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="navSortOrder">Nav order</Label>
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
              Show in navbar
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              />
              Published
            </label>
            <Button type="button" variant="outline" size="sm" asChild>
              <Link href={`/anish/custom-pages/${id}/preview`} target="_blank" rel="noreferrer">
                Preview
              </Link>
            </Button>
            {form.published ? (
              <Button type="button" variant="outline" size="sm" asChild>
                <Link href={`/site/${form.slug}`} target="_blank" rel="noreferrer">
                  Open live site
                </Link>
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground">Publish to enable /site/… for visitors.</span>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="mb-4 text-lg font-semibold">Page content (blocks)</h2>
          <CustomPageBlocksForm blocks={blocks} onChange={setBlocks} />
        </div>

        <Button type="submit">Save changes</Button>
      </form>
    </div>
  );
}
