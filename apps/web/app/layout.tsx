import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { Marquee } from "@/components/layout/Marquee";
import { BackToTop } from "@/components/layout/BackToTop";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { BoatCursor } from "@/components/effects/BoatCursor";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { defaultOgImages } from "@/lib/default-og";
import { getSiteUrl } from "@/lib/site-url";
import {
  deriveBrandKeywordVariants,
  resolveFaviconUrlForMetadata,
} from "@/lib/public-website-settings";
import { getCustomPagesNav, getPublicWebsiteSettings } from "@/lib/server-website-settings";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getPublicWebsiteSettings();
  const titleDefault = `${s.websiteName} | ${s.seoTitleSuffix}`;
  const ogImages = defaultOgImages(s.websiteName);
  const faviconAbs = resolveFaviconUrlForMetadata(s.faviconUrl);
  const brandKeywords = deriveBrandKeywordVariants(s.websiteName);
  return {
    metadataBase: getSiteUrl(),
    title: {
      default: titleDefault,
      template: `%s | ${s.websiteName}`,
    },
    applicationName: s.websiteName,
    description: s.siteDescription,
    keywords: [
      ...brandKeywords,
      "software development company",
      "web development agency",
      "app development",
      "digital solutions",
    ],
    alternates: {
      canonical: "/",
    },
    robots: { index: true, follow: true },
    verification: {
      google: "FX-W6EPCJZszrR1KI73wOURHYZIu8MEWAk5zswqL43o",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: s.websiteName,
      title: titleDefault,
      description: s.siteDescription,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: titleDefault,
      description: s.siteDescription,
      images: ogImages,
    },
    ...(faviconAbs
      ? {
          icons: {
            icon: [{ url: faviconAbs }],
            apple: [{ url: faviconAbs }],
          },
        }
      : {}),
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8fafc",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [s, initialCustomNav] = await Promise.all([getPublicWebsiteSettings(), getCustomPagesNav()]);

  return (
    <html
      lang="en"
      className={`relative light scroll-pt-24 ${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${sans.className} relative min-h-screen overflow-x-hidden bg-background text-foreground antialiased transition-colors`}
        suppressHydrationWarning
      >
        <SiteJsonLd />
        <ThemeProvider>
          {s.enableBoatCursor ? <BoatCursor /> : null}
          <div className="flex min-h-screen flex-col">
            <SiteHeader
              initialSettings={{
                websiteName: s.websiteName,
                contactEmail: s.contactEmail,
                phoneNumber: s.phoneNumber,
                addressLine: s.addressLine,
                logoUrl: s.logoUrl,
                faviconUrl: s.faviconUrl,
                socialLinks: s.socialLinks,
              }}
              initialCustomNav={initialCustomNav}
            />
            <main className="flex-1 min-w-0 w-full pb-8 pt-20 has-[.home-hero-root]:pt-0 sm:pb-10">
              {children}
            </main>
            <Marquee />
            <Footer />
            <BackToTop />
            <WhatsAppButton whatsappNumber={s.whatsappNumber} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
