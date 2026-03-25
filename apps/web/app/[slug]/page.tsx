import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FooterManagedPageBody } from "@/components/site/FooterManagedPageBody";
import { firstLineExcerpt, resolveFooterPageByPath } from "@/lib/footer-page-resolve";
import { getPublicFooterConfig } from "@/lib/server-website-settings";
import { getSiteUrlString } from "@/lib/site-url";

/** Avoid shadowing `/site/*` custom pages (no `app/site/page.tsx` — this segment would otherwise match here). */
function assertNotReservedSlug(slug: string) {
  if (slug === "site") notFound();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  assertNotReservedSlug(slug);
  const path = `/${slug}`;
  const config = await getPublicFooterConfig();
  const link = resolveFooterPageByPath(config, path);
  if (!link) notFound();
  const desc = link.pageContent?.trim()
    ? firstLineExcerpt(link.pageContent)
    : `${link.label} — details coming soon.`;
  const base = getSiteUrlString();
  return {
    title: link.label,
    description: desc,
    alternates: { canonical: `${base}${path}` },
    robots: { index: true, follow: true },
  };
}

export default async function FooterManagedSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  assertNotReservedSlug(slug);
  const path = `/${slug}`;
  const config = await getPublicFooterConfig();
  const link = resolveFooterPageByPath(config, path);
  if (!link) notFound();

  const body = link.pageContent?.trim();

  return (
    <div className="page-marketing page-section-y">
      <div className="page-narrow">
        <h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">{link.label}</h1>
        {body ? (
          <FooterManagedPageBody text={body} />
        ) : (
          <p className="mt-6 text-muted-foreground">Content coming soon.</p>
        )}
      </div>
    </div>
  );
}
