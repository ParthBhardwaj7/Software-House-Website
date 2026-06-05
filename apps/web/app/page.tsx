import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { Portfolio } from "@/components/home/Portfolio";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactForm } from "@/components/home/ContactForm";
import { TrustBar } from "@/components/home/TrustBar";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhatWeDeliverSection } from "@/components/what-we-deliver/WhatWeDeliverSection";
import { getTeamMembers } from "@/lib/team";
import { getPublicWebsiteSettings } from "@/lib/server-website-settings";
import { getSiteUrlString } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getPublicWebsiteSettings();
  const base = getSiteUrlString();
  return {
    title: "Home",
    description: s.siteDescription,
    alternates: { canonical: `${base}/` },
  };
}

export default async function HomePage() {
  const [teamMembers, site] = await Promise.all([getTeamMembers(), getPublicWebsiteSettings()]);

  return (
    <>
      <HomeHero content={site.marketingHome} socialLinks={site.socialLinks} />
      <TrustBar />
      <WhatWeDeliverSection titleTag="h2" delivery={site.marketingDelivery} />
      <ServicesSection showHeading={true} compact={true} variant="default" tone="light" />
      <Portfolio showHeading={true} variant="default" />
      <Testimonials variant="default" tone="light" />
      <ContactForm variant="default" teamMembers={teamMembers} />
    </>
  );
}
