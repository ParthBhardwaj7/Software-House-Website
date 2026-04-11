import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomPageRenderer } from "@/components/site/CustomPageRenderer";
import { parseBlocks } from "@/lib/custom-page-model";
import { loadCustomPage } from "@/lib/custom-page-fetch";
import { defaultOgImages } from "@/lib/default-og";
import { getSiteUrlString } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await loadCustomPage(slug);
  if (!page) return { title: "Page", robots: { index: false, follow: false } };
  const title = page.metaTitle?.trim() || page.headline;
  const description = (page.metaDescription?.trim() || page.subheadline || page.headline).slice(0, 160);
  const base = getSiteUrlString();
  const canonical = `${base}/site/${encodeURIComponent(slug)}`;
  const ogTitle = `${title} | APNCODIX`;
  const images = defaultOgImages();
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: ogTitle,
      description,
      siteName: "APNCODIX",
      locale: "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images,
    },
  };
}

export default async function SiteCustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await loadCustomPage(slug);
  if (!page) notFound();

  const blocks = parseBlocks(page.blocks);

  return (
    <article className="page-marketing page-section-y w-full min-w-0 overflow-x-hidden bg-[#F8FAFC]">
      <div className="page-narrow pb-16 pt-6 sm:pt-8">
        <header className="mb-10 border-b border-[#E2E8F0] pb-10 text-center sm:mb-12 sm:pb-12">
          <h1 className="mx-auto max-w-4xl text-pretty font-display text-3xl font-normal leading-[1.2] tracking-tight text-[#0F172A] md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            {page.headline}
          </h1>
          {page.subheadline ? (
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[#64748B]">
              {page.subheadline}
            </p>
          ) : null}
        </header>
        <CustomPageRenderer blocks={blocks} />
      </div>
    </article>
  );
}
