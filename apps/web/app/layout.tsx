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

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

const SITE_DESCRIPTION =
  "We build high-performance software solutions for modern businesses — strategy, engineering, and launch with one team.";

const rootOgImages = defaultOgImages();

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "HILO | Modern Software Agency",
    template: "%s | HILO",
  },
  description: SITE_DESCRIPTION,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HILO",
    title: "HILO | Modern Software Agency",
    description: SITE_DESCRIPTION,
    images: rootOgImages,
  },
  twitter: {
    card: "summary_large_image",
    title: "HILO | Modern Software Agency",
    description: SITE_DESCRIPTION,
    images: rootOgImages,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`light scroll-pt-24 ${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${sans.className} min-h-screen overflow-x-hidden bg-background text-foreground antialiased transition-colors`}
      >
        <SiteJsonLd />
        <ThemeProvider>
          <BoatCursor />
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 min-w-0 w-full pb-8 pt-20 has-[.home-hero-root]:pt-0 sm:pb-10">
              {children}
            </main>
            <Marquee />
            <Footer />
            <BackToTop />
            <WhatsAppButton />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
