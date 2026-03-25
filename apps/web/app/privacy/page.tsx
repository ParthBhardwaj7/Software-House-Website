import { Metadata } from "next";
import { FooterManagedPageBody } from "@/components/site/FooterManagedPageBody";
import { firstLineExcerpt, resolveFooterPageByPath } from "@/lib/footer-page-resolve";
import { getPublicFooterConfig } from "@/lib/server-website-settings";
import { getSiteUrlString } from "@/lib/site-url";

const PATH = "/privacy";
const FALLBACK_TITLE = "Privacy Policy";
const FALLBACK_DESC =
  "How HILO collects, uses, and protects your information when you use our website and services.";

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

export default async function PrivacyPage() {
  const config = await getPublicFooterConfig();
  const link = resolveFooterPageByPath(config, PATH);
  const title = link?.label?.trim() || FALLBACK_TITLE;
  const body = link?.pageContent?.trim();

  return (
    <div className="page-marketing page-section-y">
      <div className="page-narrow">
        <h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {body ? (
          <FooterManagedPageBody text={body} />
        ) : (
          <p className="mt-4 text-muted-foreground">Placeholder content. Add your legal text in Website Settings → Footer.</p>
        )}
      </div>
    </div>
  );
}
