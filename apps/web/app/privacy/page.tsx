import { Metadata } from "next";
import { FooterManagedPageBody } from "@/components/site/FooterManagedPageBody";
import { firstLineExcerpt, resolveFooterPageByPath } from "@/lib/footer-page-resolve";
import { PRIVACY_POLICY_DEFAULT_COPY } from "@/lib/privacy-policy-default";
import { getPublicFooterConfig } from "@/lib/server-website-settings";
import { getSiteUrlString } from "@/lib/site-url";

const PATH = "/privacy";
const FALLBACK_TITLE = "Privacy Policy";
const FALLBACK_DESC =
  "How APNCODIX collects, uses, and protects your information when you use our website and services.";

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
  const displayText = body || PRIVACY_POLICY_DEFAULT_COPY;

  return (
    <div className="page-marketing page-section-y">
      <div className="page-narrow">
        <h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {!body ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Default template below — replace with your final legal text in Website Settings → Footer (Privacy Policy
            link).
          </p>
        ) : null}
        <FooterManagedPageBody text={displayText} />
      </div>
    </div>
  );
}
