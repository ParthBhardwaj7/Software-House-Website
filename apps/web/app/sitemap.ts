import type { MetadataRoute } from "next";
import { api } from "@/lib/api";
import { DUMMY_BLOG_POSTS } from "@/lib/dummy-data";
import { allowDummyMarketingContent } from "@/lib/allow-dummy-content";
import { getSiteUrlString } from "@/lib/site-url";

type BlogPost = { slug: string };
type CustomSitemapRow = { slug: string; updatedAt: string };

const STATIC_PATHS = [
  "",
  "/services",
  "/what-we-deliver",
  "/portfolio",
  "/blog",
  "/contact",
  "/about",
  "/testimonials",
  "/teams",
  "/team",
  "/faqs",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/pay",
  "/cancellation-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrlString();
  const lastModified = new Date();

  let posts: BlogPost[] = [];
  try {
    posts = await api.get<BlogPost[]>("/blogs");
  } catch {
    posts = [];
  }
  /** In production, never list dummy blog URLs unless QA flag is on. */
  if (posts.length === 0 && allowDummyMarketingContent()) {
    posts = DUMMY_BLOG_POSTS.map((p) => ({ slug: p.slug }));
  }

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified,
  }));

  let customPages: CustomSitemapRow[] = [];
  try {
    customPages = await api.get<CustomSitemapRow[]>("/custom-pages/sitemap");
  } catch {
    customPages = [];
  }
  const customEntries: MetadataRoute.Sitemap = (customPages || []).map((p) => ({
    url: `${baseUrl}/site/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : lastModified,
  }));

  return [...staticEntries, ...blogEntries, ...customEntries];
}
