import type { MetadataRoute } from "next";
import { getPublicWebsiteSettings } from "@/lib/server-website-settings";
import { getSiteUrlString } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getPublicWebsiteSettings();
  const base = getSiteUrlString();
  const short = s.websiteName.trim().slice(0, 12) || "Site";

  return {
    name: s.websiteName,
    short_name: short,
    description: s.siteDescription.slice(0, 240),
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#22c55e",
    orientation: "portrait-primary",
    icons: [
      {
        src: `${base}/icon`,
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${base}/apple-icon`,
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
