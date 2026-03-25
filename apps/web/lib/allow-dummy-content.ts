/**
 * Placeholder / sample marketing content (dummy blog posts, sitemap entries, etc.).
 * Disabled in production unless explicitly enabled — keeps SEO and public URLs honest.
 */
export function allowDummyMarketingContent(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_USE_DUMMY_SITEMAP === "true";
}
