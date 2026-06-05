import { Metadata } from "next";
import Link from "next/link";
import { FooterManagedPageBody } from "@/components/site/FooterManagedPageBody";
import { getPublicWebsiteSettings } from "@/lib/server-website-settings";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getPublicWebsiteSettings();
  return {
    title: "About Us",
    description: s.aboutPageContent.trim()
      ? s.aboutPageContent.trim().slice(0, 160)
      : `${s.websiteName} — who we are, how we work, and how we partner from idea to launch.`,
  };
}

export default async function AboutPage() {
  const s = await getPublicWebsiteSettings();
  const body = s.aboutPageContent.trim();

  return (
    <div className="page-marketing page-section-y">
      <div className="page-narrow">
        <h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">About Us</h1>
        {body ? (
          <FooterManagedPageBody text={body} />
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-8 sm:px-8">
            <p className="leading-relaxed text-muted-foreground">
              We are updating our company story. In the meantime, explore our{" "}
              <Link href="/services" className="font-medium text-primary hover:underline">
                services
              </Link>
              ,{" "}
              <Link href="/portfolio" className="font-medium text-primary hover:underline">
                portfolio
              </Link>
              , and{" "}
              <Link href="/what-we-deliver" className="font-medium text-primary hover:underline">
                delivery process
              </Link>{" "}
              — or reach out directly.
            </p>
          </div>
        )}
        <Link href="/contact" className="mt-8 inline-block font-medium text-primary hover:underline">
          Start a conversation →
        </Link>
      </div>
    </div>
  );
}
