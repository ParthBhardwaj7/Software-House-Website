import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { Portfolio } from "@/components/home/Portfolio";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactForm } from "@/components/home/ContactForm";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhatWeDeliverSection } from "@/components/what-we-deliver/WhatWeDeliverSection";
import { getTeamMembers } from "@/lib/team";

export const metadata: Metadata = {
  title: "Home",
  description:
    "We build high-performance software solutions for modern businesses — strategy, engineering, and launch with one team.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const teamMembers = await getTeamMembers();

  return (
    <>
      <HomeHero />
      <WhatWeDeliverSection titleTag="h2" />
      <ServicesSection showHeading={true} compact={true} variant="default" tone="light" />
      <Portfolio showHeading={true} variant="default" />
      <Testimonials variant="default" tone="light" />
      <ContactForm variant="default" teamMembers={teamMembers} />
    </>
  );
}
