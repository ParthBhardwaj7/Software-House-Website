import { Metadata } from "next";
import { FooterManagedPageBody } from "@/components/site/FooterManagedPageBody";
import { firstLineExcerpt, resolveFooterPageByPath } from "@/lib/footer-page-resolve";
import { DUMMY_FAQS } from "@/lib/dummy-data";
import { getPublicFooterConfig } from "@/lib/server-website-settings";
import { getSiteUrlString } from "@/lib/site-url";

const PATH = "/faqs";
const FALLBACK_TITLE = "FAQs";
const FALLBACK_DESC =
  "Answers to common questions about timelines, engagement models, and working with HILO on web, mobile, and AI projects.";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPublicFooterConfig();
  const link = resolveFooterPageByPath(config, PATH);
  const title = link?.label?.trim() || FALLBACK_TITLE;
  const description =
    link?.pageContent?.trim() ? firstLineExcerpt(link.pageContent) : FALLBACK_DESC;
  const base = getSiteUrlString();
  return {
    title,
    description,
    alternates: { canonical: `${base}${PATH}` },
  };
}

export default async function FaqsPage() {
  const config = await getPublicFooterConfig();
  const link = resolveFooterPageByPath(config, PATH);
  const title = link?.label?.trim() || FALLBACK_TITLE;
  const body = link?.pageContent?.trim();

  return (
    <div className="page-marketing page-section-y">
      <div className="page-narrow">
        <h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {body ? <FooterManagedPageBody text={body} /> : null}
        {!body ? <p className="mt-2 text-muted-foreground">Common questions about working with HILO.</p> : null}
        <ul className="mt-10 space-y-6">
          {DUMMY_FAQS.map((faq) => (
            <li
              key={faq.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-foreground">{faq.question}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{faq.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
