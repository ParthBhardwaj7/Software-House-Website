import { Metadata } from "next";
import { FooterManagedPageBody } from "@/components/site/FooterManagedPageBody";
import { firstLineExcerpt, resolveFooterPageByPath } from "@/lib/footer-page-resolve";
import { getPublicFooterConfig } from "@/lib/server-website-settings";
import { getSiteUrlString } from "@/lib/site-url";
import { TERMS_CONDITIONS_DEFAULT_COPY } from "@/lib/terms-conditions-default";

const PATH = "/terms";
const FALLBACK_TITLE = "Terms & Conditions";
const FALLBACK_DESC =
  "Terms of use for APN Codix’s website and services — please read before engaging or submitting inquiries.";

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

export default async function TermsPage() {
  const config = await getPublicFooterConfig();
  const link = resolveFooterPageByPath(config, PATH);
  const title = link?.label?.trim() || FALLBACK_TITLE;
  const body = link?.pageContent?.trim();
  const displayText = body || TERMS_CONDITIONS_DEFAULT_COPY;

  return (
    <div className="page-marketing page-section-y">
      <div className="page-narrow">
        <h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {!body ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Default template below — replace with your final legal text in Website Settings → Footer (Terms & Conditions
            link).
          </p>
        ) : null}
        <FooterManagedPageBody text={displayText} />
      </div>
    </div>
  );
}
