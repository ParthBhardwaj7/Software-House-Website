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
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Add your company profile in{" "}
            <strong className="font-medium text-foreground">Admin → Website Settings → About page</strong>. Include
            your company background, core services, operating model, and delivery process so clients and compliance
            reviewers can clearly understand your business.
          </p>
        )}
        <Link href="/contact" className="mt-8 inline-block font-medium text-primary hover:underline">
          Start a conversation →
        </Link>
      </div>
    </div>
  );
}
