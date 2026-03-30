import { Metadata } from "next";
import { ServicesSection } from "@/components/home/ServicesSection";
import { DeliveryProcessSection } from "@/components/services/DeliveryProcessSection";
import { getPublicWebsiteSettings } from "@/lib/server-website-settings";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web & Mobile App Development, Digital Marketing, AI Integration, Automation, Machine Learning & Cloud Computing.",
};

export default async function ServicesPage() {
  const { marketingDelivery } = await getPublicWebsiteSettings();

  return (
    <div className="page-marketing w-full">
      <section className="bg-[#0F172A] py-14 text-center sm:py-16 md:py-20 lg:py-24">
        <div className="page-container">
          <h1 className="font-display text-3xl font-normal tracking-tight text-white sm:text-4xl md:text-5xl">
            Our Services
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            From AI automation to custom software, we deliver solutions that scale.
          </p>
        </div>
      </section>
      <DeliveryProcessSection steps={marketingDelivery.steps} />
      <ServicesSection showHeading={false} compact={false} />
    </div>
  );
}
