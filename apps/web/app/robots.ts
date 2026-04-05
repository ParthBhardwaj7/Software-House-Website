import type { MetadataRoute } from "next";
import { getSiteUrlString } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrlString();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/anish"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
