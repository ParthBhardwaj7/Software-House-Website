import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="font-display text-6xl font-normal text-muted-foreground">404</h1>
      <p className="mt-4 text-muted-foreground">Page not found</p>
      <Button asChild className="mt-8">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
