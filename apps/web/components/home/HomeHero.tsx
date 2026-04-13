"use client";

import Link from "next/link";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RollingContactCta } from "@/components/layout/RollingContactCta";
import { useHeroParallax } from "@/hooks/use-hero-parallax";
import { cn } from "@/lib/utils";
import type { MarketingHomeContent } from "@/lib/marketing-defaults";
import { DEFAULT_MARKETING_HOME } from "@/lib/marketing-defaults";
import { parseSocialLinksFromRaw, type SocialLinks } from "@/lib/public-website-settings";
import { HeroSocialRail } from "./HeroSocialRail";

type HomeHeroProps = {
  content?: MarketingHomeContent;
  /** Profile URLs from admin; empty links are hidden in the rail. */
  socialLinks?: SocialLinks;
};

export function HomeHero({
  content = DEFAULT_MARKETING_HOME,
  socialLinks = parseSocialLinksFromRaw(""),
}: HomeHeroProps) {
  const mk = content;
  const { enabled: parallaxEnabled, bgX, bgY, orbX, orbY, reduceMotion } = useHeroParallax();

  /** SSR + hydration must match server; then apply real `prefers-reduced-motion` before paint (useLayoutEffect). */
  const [reduceMotionReady, setReduceMotionReady] = useState(false);
  useLayoutEffect(() => {
    setReduceMotionReady(true);
  }, []);
  const animReduce = reduceMotionReady && reduceMotion;

  const container = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: animReduce ? 0 : 0.04,
        delayChildren: animReduce ? 0 : 0.03,
      },
    },
  };

  const item = {
    hidden: { opacity: 1, y: animReduce ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: animReduce ? 0 : 0.42, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <section
        className={cn(
          "home-hero-root section-pop relative z-0 flex min-h-[100dvh] flex-col overflow-hidden text-[#0F172A]",
          parallaxEnabled && "cursor-default"
        )}
      >
        {/* Base — water / sky wash (fills empty areas; static, no animation) */}
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#f8fafc] via-[#eef6ff] to-[#e8fdf4]"
          aria-hidden
        />
        {/* Soft vignette so edges feel intentional */}
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_50%,transparent_40%,rgba(248,250,252,0.65)_100%)]"
          aria-hidden
        />

        {/* Layer 1 — background gradient (parallax) */}
        <m.div
          className="pointer-events-none absolute inset-0 z-0 will-change-transform"
          style={{ x: bgX, y: bgY }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-15%,rgba(34,197,94,0.2),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_100%,rgba(56,189,248,0.12),transparent_55%)]" />
        </m.div>

        {/* Layer 2 — primary orb (parallax) */}
        <m.div
          className="pointer-events-none absolute -right-20 top-[18%] z-0 h-[26rem] w-[26rem] max-w-[95vw] will-change-transform sm:-right-12 md:-right-8 lg:right-0"
          style={{ x: orbX, y: orbY }}
          aria-hidden
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.22),transparent_70%)] blur-3xl" />
        </m.div>

        {/* Layer 3 — secondary glow (bottom-left, fills lower "empty" zone) */}
        <div
          className="pointer-events-none absolute -bottom-32 -left-24 z-0 h-[22rem] w-[min(100vw,28rem)] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.18),transparent_68%)] blur-3xl"
          aria-hidden
        />

        {/* Micro grid — texture, very subtle */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.35] [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:48px_48px]"
          aria-hidden
        />

        {/* Blend under header */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-28 bg-gradient-to-b from-white/50 to-transparent"
          aria-hidden
        />

        {/* Main hero: flex-1 + justify-center fills viewport; grid centers on large screens */}
        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col justify-center gap-8 px-5 pt-16 sm:gap-10 sm:px-6 sm:pt-20 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-2 lg:items-center lg:gap-x-16 lg:gap-y-8 lg:px-8 lg:py-10 lg:pt-24">
          <m.div
            className="flex min-w-0 flex-col justify-center text-center lg:text-left"
            initial="hidden"
            animate="show"
            variants={container}
          >
            <m.h1
              className="text-balance font-display text-[2.125rem] font-normal leading-[1.08] tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl lg:text-6xl xl:text-[4.25rem] xl:leading-[1.05]"
              variants={item}
            >
              {mk.headingPrefix}
              <em className="not-italic text-[#16A34A]">{mk.headingEmphasis}</em>
              {mk.headingMiddle}
              <span className="bg-gradient-to-r from-[#0F172A] to-[#334155] bg-clip-text text-transparent">
                {mk.headingGradient}
              </span>
              {mk.headingSuffix}
            </m.h1>
            <m.p
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#64748B] md:text-lg lg:mx-0 lg:mt-6"
              variants={item}
            >
              {mk.subtext}
            </m.p>
            <m.div
              className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
              variants={item}
            >
              <m.div
                className="inline-flex"
                whileHover={animReduce ? undefined : { scale: 1.02 }}
                whileTap={animReduce ? undefined : { scale: 0.98 }}
              >
                <RollingContactCta
                  variant="consultation"
                  href={mk.primaryCtaHref}
                  label="Book a Consultation"
                  duplicateLabel="It's free"
                  lineClassName="h-12"
                  className="h-12 px-6 py-0 text-base"
                />
              </m.div>
              <m.div
                whileHover={animReduce ? undefined : { scale: 1.02 }}
                whileTap={animReduce ? undefined : { scale: 0.98 }}
                className="inline-flex"
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-[#E5E7EB] bg-white px-6 text-base font-medium text-[#0F172A] shadow-sm hover:bg-[#F8FAFC]"
                >
                  <Link href={mk.secondaryButtonHref}>{mk.secondaryButtonLabel}</Link>
                </Button>
              </m.div>
            </m.div>
          </m.div>

          {/* Right — glass / lagoon focal (scaled up for balance) */}
          <m.div
            className="relative mx-auto flex w-full max-w-[min(100%,22rem)] shrink-0 items-center justify-center sm:max-w-md lg:mx-0 lg:max-w-none"
            initial={{ opacity: animReduce ? 1 : 0, scale: animReduce ? 1 : 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: animReduce ? 0 : 0.48, ease: [0.25, 0.46, 0.45, 0.94], delay: animReduce ? 0 : 0.06 }}
            aria-hidden
          >
            <m.div
              className="relative aspect-square w-full max-w-[min(92vw,20rem)] sm:max-w-[22rem] lg:max-w-[min(100%,28rem)] xl:max-w-[min(100%,30rem)]"
              animate={
                animReduce
                  ? undefined
                  : {
                      y: [0, -12, 0],
                    }
              }
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(ellipse_85%_75%_at_50%_38%,rgba(34,197,94,0.28),rgba(186,230,253,0.35)_45%,transparent_72%)] blur-2xl" />
              <div className="absolute inset-[1%] rounded-[2.25rem] bg-gradient-to-br from-white/95 via-[#F0FDF4] to-[#D1FAE5] shadow-[0_32px_80px_-24px_rgba(34,197,94,0.45),0_0_0_1px_rgba(255,255,255,0.85)_inset] ring-1 ring-emerald-200/60 backdrop-blur-sm" />
              <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(34,197,94,0.25),transparent_58%)]" />
              <div className="absolute inset-[26%] rounded-full border border-white/70 bg-white/85 shadow-[inset_0_2px_24px_rgba(34,197,94,0.12)] ring-1 ring-emerald-100/80" />
              <div className="absolute inset-[40%] rounded-full bg-[radial-gradient(circle_at_50%_48%,rgba(56,189,248,0.15),rgba(34,197,94,0.1)_55%,transparent_72%)]" />
              <div className="absolute inset-[52%] rounded-full border border-[#22C55E]/25 bg-gradient-to-br from-white to-emerald-50/90 shadow-inner" />
            </m.div>
          </m.div>
        </div>

        <HeroSocialRail links={socialLinks} />

        <div className="relative z-10 mt-auto w-full shrink-0 border-t border-emerald-200/25 bg-gradient-to-r from-white/50 via-cyan-50/35 to-emerald-50/45 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-5 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 sm:text-left lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#64748B] sm:text-xs">
              {mk.bottomEyebrow}
            </p>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-[#64748B] sm:mx-0 sm:max-w-lg sm:text-right">
              {mk.bottomText}
            </p>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
