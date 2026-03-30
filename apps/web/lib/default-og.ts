import type { Metadata } from "next";
import { getSiteUrlString } from "@/lib/site-url";

/** App route `opengraph-image` — 1200×630 (see app/opengraph-image.tsx). */
const BUILT_IN_OG_PATH = "/opengraph-image";

/**
 * Default social preview images for metadata.
 * Set `NEXT_PUBLIC_OG_IMAGE` to an absolute URL for a custom static asset.
 */
export function defaultOgImages(brandName = "Brand"): NonNullable<Metadata["openGraph"]>["images"] {
  const env = process.env.NEXT_PUBLIC_OG_IMAGE?.trim();
  if (env) {
    try {
      const absolute = env.startsWith("http") ? env : new URL(env, getSiteUrlString()).toString();
      return [{ url: absolute, width: 1200, height: 630, alt: brandName }];
    } catch {
      /* use built-in */
    }
  }
  const base = getSiteUrlString();
  return [
    {
      url: `${base}${BUILT_IN_OG_PATH}`,
      width: 1200,
      height: 630,
      alt: `${brandName} — Software studio`,
    },
  ];
}
