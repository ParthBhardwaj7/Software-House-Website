import { getPublicWebsiteSettings } from "@/lib/server-website-settings";
import { getSiteUrlString } from "@/lib/site-url";

export async function SiteJsonLd() {
  const s = await getPublicWebsiteSettings();
  const url = getSiteUrlString();
  const sameAs = [
    s.socialLinks.twitter,
    s.socialLinks.instagram,
    s.socialLinks.youtube,
    s.socialLinks.linkedin,
    s.socialLinks.telegram,
  ].filter(Boolean);

  const organization: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: s.websiteName,
    url,
    description: s.siteDescription,
  };
  if (s.logoUrl) organization.logo = s.logoUrl;
  if (sameAs.length) organization.sameAs = sameAs;
  if (s.contactEmail) {
    organization.contactPoint = {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: s.contactEmail,
    };
  }

  const graph = [
    organization,
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${url}/#website`,
      name: s.websiteName,
      url,
      description: s.siteDescription,
      inLanguage: "en",
      publisher: { "@id": `${url}/#organization` },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
