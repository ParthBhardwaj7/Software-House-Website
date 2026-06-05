"use client";

import Image from "next/image";
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
  socialLinks?: SocialLinks;
};

export function HomeHero({
  content = DEFAULT_MARKETING_HOME,
  socialLinks = parseSocialLinksFromRaw(""),
}: HomeHeroProps) {
  const mk = content;
  const { enabled: parallaxEnabled, bgX, bgY, orbX, orbY, reduceMotion } = useHeroParallax();
  const proofPoints = [
    "Product strategy to launch execution",
    "Clean engineering with transparent delivery",
    "Web, mobile and AI systems under one team",
  ];
  const quickStats = [
    { value: "10+", label: "Launch-ready modules" },
    { value: "24/7", label: "Support mindset" },
    { value: "1 team", label: "Design to deployment" },
  ];

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
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#f8fafc] via-[#eef6ff] to-[#e8fdf4]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_50%,transparent_40%,rgba(248,250,252,0.65)_100%)]"
          aria-hidden
        />

        <m.div
          className="pointer-events-none absolute inset-0 z-0 will-change-transform"
          style={{ x: bgX, y: bgY }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-15%,rgba(34,197,94,0.2),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_100%,rgba(56,189,248,0.12),transparent_55%)]" />
        </m.div>

        <m.div
          className="pointer-events-none absolute -right-20 top-[18%] z-0 h-[26rem] w-[26rem] max-w-[95vw] will-change-transform sm:-right-12 md:-right-8 lg:right-0"
          style={{ x: orbX, y: orbY }}
          aria-hidden
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.22),transparent_70%)] blur-3xl" />
        </m.div>

        <div
          className="pointer-events-none absolute -bottom-32 -left-24 z-0 h-[22rem] w-[min(100vw,28rem)] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.18),transparent_68%)] blur-3xl"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.35] [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:48px_48px]"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-28 bg-gradient-to-b from-white/50 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col justify-center gap-10 px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-12 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-x-16 lg:gap-y-8 lg:px-8 lg:py-10 lg:pt-16">
          <m.div
            className="flex min-w-0 flex-col justify-center text-center lg:pt-10 lg:text-left xl:pt-12"
            initial="hidden"
            animate="show"
            variants={container}
          >
            <m.h1
              className="text-balance font-display text-[2.4rem] font-normal leading-[1.02] tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl lg:text-6xl xl:text-[4.25rem] xl:leading-[1.03]"
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
              className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#475569] md:text-lg lg:mx-0 lg:mt-6"
              variants={item}
            >
              {mk.subtext}
            </m.p>

            <m.div
              className="mx-auto mt-6 grid max-w-2xl gap-3 text-left sm:grid-cols-3 lg:mx-0"
              variants={item}
            >
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur-sm"
                >
                  <p className="text-lg font-semibold text-[#0F172A]">{stat.value}</p>
                  <p className="mt-1 text-sm leading-5 text-[#64748B]">{stat.label}</p>
                </div>
              ))}
            </m.div>

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

            <m.ul
              className="mx-auto mt-7 grid max-w-2xl gap-3 text-left sm:grid-cols-3 lg:mx-0"
              variants={item}
            >
              {proofPoints.map((point) => (
                <li
                  key={point}
                  className="rounded-2xl border border-emerald-100/80 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-[#0F172A]"
                >
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#16A34A]" />
                  {point}
                </li>
              ))}
            </m.ul>
          </m.div>

          <m.div
            className="relative mx-auto flex w-full max-w-[min(100%,24rem)] shrink-0 items-center justify-center sm:max-w-xl lg:-mt-12 lg:mx-0 lg:max-w-none xl:-mt-16"
            initial={{ opacity: animReduce ? 1 : 0, scale: animReduce ? 1 : 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: animReduce ? 0 : 0.48,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: animReduce ? 0 : 0.06,
            }}
            aria-hidden
          >
            <m.div
              className="relative w-full max-w-[min(92vw,24rem)] sm:max-w-[28rem] lg:max-w-[min(100%,36rem)] xl:max-w-[min(100%,38rem)]"
              animate={animReduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-x-10 top-8 h-40 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.24),transparent_68%)] blur-3xl" />
              <div className="absolute inset-x-16 bottom-0 h-28 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.2),transparent_70%)] blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-3 shadow-[0_35px_90px_-32px_rgba(15,23,42,0.4)] backdrop-blur-md sm:p-4">
                <div className="rounded-[1.6rem] bg-gradient-to-br from-white via-[#F8FAFC] to-[#ECFDF5] p-2 sm:p-3">
                  <Image
                    src="/hero-professional-illustration.svg"
                    alt="Professional product dashboard and mobile app showcase"
                    width={960}
                    height={960}
                    priority
                    className="h-auto w-full rounded-[1.3rem]"
                  />
                </div>
              </div>

              <div className="absolute -left-3 top-0 rounded-2xl border border-white/85 bg-white/90 px-4 py-3 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.4)] backdrop-blur-md sm:-left-6 sm:top-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#64748B]">
                  Delivery
                </p>
                <p className="mt-2 text-lg font-semibold text-[#0F172A]">Sprint to launch</p>
                <p className="mt-1 text-sm text-[#64748B]">Structured, visible, accountable</p>
              </div>

              <div className="absolute -bottom-4 right-0 rounded-2xl border border-emerald-100 bg-[#0F172A] px-4 py-3 text-white shadow-[0_20px_40px_-24px_rgba(15,23,42,0.55)] sm:-bottom-6 sm:-right-4 lg:right-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
                  Build stack
                </p>
                <p className="mt-2 text-lg font-semibold">Web, mobile, AI</p>
                <p className="mt-1 text-sm text-slate-300">One partner, production-ready output</p>
              </div>
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
