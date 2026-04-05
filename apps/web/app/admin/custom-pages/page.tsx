"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Row = {
  id: string;
  slug: string;
  navLabel: string;
  published: boolean;
  showInNav: boolean;
  navSortOrder: number;
  updatedAt: string;
};

export default function AdminCustomPagesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const token = getAccessToken();

  useEffect(() => {
    if (!token) return;
    api.get<Row[]>("/admin/custom-pages", token).then(setRows).catch(() => setRows([]));
  }, [token]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Custom pages</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Create landing-style pages with headings, media, links, and more. <strong>Draft</strong> pages are not public —
            use <strong>Preview</strong> to see them, or turn on <strong>Published</strong> to open{" "}
            <code className="rounded bg-muted px-1">/site/your-slug</code>. Published + &quot;Show in nav&quot; adds a link in
            the mobile menu before Contact.
          </p>
        </div>
        <Button asChild>
          <Link href="/anish/custom-pages/new">New page</Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <Card key={row.id} className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div className="min-w-0">
                <CardTitle className="text-lg leading-snug">{row.navLabel}</CardTitle>
                <p className="mt-1 truncate text-sm text-muted-foreground">/site/{row.slug}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span
                  className={`rounded px-2 py-0.5 text-xs ${row.published ? "bg-green-500/20 text-green-700" : "bg-muted text-muted-foreground"}`}
                >
                  {row.published ? "Published" : "Draft"}
                </span>
                {row.showInNav ? (
                  <span className="text-xs text-muted-foreground">In nav</span>
                ) : (
                  <span className="text-xs text-muted-foreground">Hidden from nav</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {row.published ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/site/${row.slug}`} target="_blank" rel="noreferrer">
                    View live
                  </Link>
                </Button>
              ) : null}
              <Button variant="outline" size="sm" asChild>
                <Link href={`/anish/custom-pages/${row.id}/preview`} target="_blank" rel="noreferrer">
                  Preview
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/anish/custom-pages/${row.id}`}>Edit</Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  if (!confirm(`Delete “${row.navLabel}”?`)) return;
                  await api.delete(`/admin/custom-pages/${row.id}`, token!);
                  setRows((r) => r.filter((x) => x.id !== row.id));
                }}
              >
                Delete
              </Button>
              <p className="w-full text-xs text-muted-foreground">Order: {row.navSortOrder} · Updated {new Date(row.updatedAt).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No pages yet. Create one to add a navbar link.</p>
      ) : null}
    </div>
  );
}
