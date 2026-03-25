import { Metadata } from "next";
import { Portfolio } from "@/components/home/Portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected projects we've delivered for clients.",
};

export default function PortfolioPage() {
  return (
    <div className="page-marketing w-full">
      <div className="page-container page-section-y pb-10 text-center md:pb-12">
        <h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">Portfolio</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Explore our work across web, mobile, and AI.
        </p>
      </div>
      <Portfolio showHeading={false} />
    </div>
  );
}
