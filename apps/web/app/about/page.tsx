import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "HILO builds modern software for ambitious teams — who we are, how we work, and how we partner from idea to launch.",
};

export default function AboutPage() {
  return (
    <div className="page-marketing page-section-y">
      <div className="page-narrow">
        <h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">About Us</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          HILO builds modern software for ambitious teams. This is a placeholder page — replace with your story.
        </p>
        <Link href="/contact" className="mt-8 inline-block font-medium text-primary hover:underline">
          Contact us →
        </Link>
      </div>
    </div>
  );
}
