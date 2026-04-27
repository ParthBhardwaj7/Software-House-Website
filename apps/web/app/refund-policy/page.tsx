import { Metadata } from "next";
import { FooterManagedPageBody } from "@/components/site/FooterManagedPageBody";
import { firstLineExcerpt, resolveFooterPageByPath } from "@/lib/footer-page-resolve";
import { REFUND_POLICY_DEFAULT_COPY } from "@/lib/refund-policy-default";
import { getPublicFooterConfig } from "@/lib/server-website-settings";
import { getSiteUrlString } from "@/lib/site-url";

const PATH = "/refund-policy";
const FALLBACK_TITLE = "Refund and Cancellation Policy";
const FALLBACK_DESC =
  "How we handle cancellations, milestones, retainers, and refunds for services and online payments.";

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

export default async function RefundPolicyPage() {
  const config = await getPublicFooterConfig();
  const link = resolveFooterPageByPath(config, PATH);
  const title = link?.label?.trim() || FALLBACK_TITLE;
  const body = link?.pageContent?.trim();
  const displayText = body || REFUND_POLICY_DEFAULT_COPY;

  return (
    <div className="page-marketing page-section-y">
      <div className="page-narrow">
        <h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {!body ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Default template below — replace with your final legal text in Website Settings → Footer (Refund & cancellation
            link).
          </p>
        ) : null}
        <FooterManagedPageBody text={displayText} />
      </div>
    </div>
  );
}
