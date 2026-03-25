let warnedMissingSiteUrl = false;

/** Canonical site origin for metadata, sitemap, and JSON-LD. */
export function getSiteUrlString(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) return env.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  if (
    process.env.NODE_ENV === "production" &&
    !env &&
    !vercel &&
    !warnedMissingSiteUrl &&
    typeof console !== "undefined"
  ) {
    warnedMissingSiteUrl = true;
    console.warn(
      "[site-url] NEXT_PUBLIC_SITE_URL and VERCEL_URL are unset — using http://localhost:3000 for canonical/OG. Set NEXT_PUBLIC_SITE_URL in production."
    );
  }
  return "http://localhost:3000";
}

export function getSiteUrl(): URL {
  return new URL(getSiteUrlString());
}
