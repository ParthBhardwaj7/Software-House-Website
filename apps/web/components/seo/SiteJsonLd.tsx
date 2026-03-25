import { getSiteUrlString } from "@/lib/site-url";

const DESCRIPTION =
  "We build high-performance software solutions for modern businesses — strategy, engineering, and launch with one team.";

export function SiteJsonLd() {
  const url = getSiteUrlString();
  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${url}/#organization`,
      name: "HILO",
      url,
      description: DESCRIPTION,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${url}/#website`,
      name: "HILO",
      url,
      description: DESCRIPTION,
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
