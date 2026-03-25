"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="page-marketing flex min-h-[min(70vh,32rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Please try again. If the problem continues, return home or contact us from the header.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
