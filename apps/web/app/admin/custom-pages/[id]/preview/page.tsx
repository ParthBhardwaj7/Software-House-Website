"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { CustomPageRenderer } from "@/components/site/CustomPageRenderer";
import { parseBlocks } from "@/lib/custom-page-model";

type Loaded = {
  id: string;
  slug: string;
  headline: string;
  subheadline: string | null;
  published: boolean;
  blocks: unknown;
};

function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-muted"
    >
      {children}
    </Link>
  );
}

export default function AdminCustomPagePreviewPage() {
  const params = useParams();
  const id = params.id as string;
  const token = getAccessToken();
  const [page, setPage] = useState<Loaded | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setErr(null);
    api
      .get<Loaded>(`/admin/custom-pages/${id}`, token)
      .then((p) => {
        setPage(p);
        setLoading(false);
      })
      .catch(() => {
        setErr("Could not load page.");
        setLoading(false);
      });
  }, [id, token]);

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div>
        <Link href="/admin/custom-pages" className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <p className="text-muted-foreground">Loading preview…</p>
      </div>
    );
  }

  if (err || !page) {
    return (
      <div>
        <Link href="/admin/custom-pages" className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <p className="text-destructive">{err || "Page not found."}</p>
      </div>
    );
  }

  const blocks = parseBlocks(page.blocks);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Admin preview</p>
          <p className="text-sm text-muted-foreground">
            {page.published ? (
              <>
                This page is published. Public URL:{" "}
                <Link href={`/site/${page.slug}`} className="font-medium text-primary underline" target="_blank" rel="noreferrer">
                  /site/{page.slug}
                </Link>
              </>
            ) : (
              <>
                <strong>Draft</strong> — visitors get 404 until you publish. Public URL will be{" "}
                <code className="rounded bg-muted px-1">/site/{page.slug}</code>
              </>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <ButtonLink href={`/admin/custom-pages/${id}`}>Edit</ButtonLink>
          <ButtonLink href="/admin/custom-pages">All pages</ButtonLink>
        </div>
      </div>

      <article className="overflow-x-hidden rounded-xl border border-border bg-[#F8FAFC]">
        <div className="page-narrow py-10 sm:py-12">
          <header className="mb-10 border-b border-[#E2E8F0] pb-10 text-center sm:mb-12 sm:pb-12">
            <h1 className="mx-auto max-w-4xl text-pretty font-serif text-3xl font-normal leading-[1.2] tracking-tight text-[#0F172A] md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {page.headline}
            </h1>
            {page.subheadline ? (
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[#64748B]">{page.subheadline}</p>
            ) : null}
          </header>
          <CustomPageRenderer blocks={blocks} />
        </div>
      </article>
    </div>
  );
}
