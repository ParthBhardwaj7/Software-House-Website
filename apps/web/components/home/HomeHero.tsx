"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RollingContactCta } from "@/components/layout/RollingContactCta";
import { useHeroParallax } from "@/hooks/use-hero-parallax";
import { cn } from "@/lib/utils";

export function HomeHero() {
  const { enabled: parallaxEnabled, bgX, bgY, orbX, orbY, reduceMotion } = useHeroParallax();

  const container = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
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
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 will-change-transform"
        style={{ x: bgX, y: bgY }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-15%,rgba(34,197,94,0.2),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_100%,rgba(56,189,248,0.12),transparent_55%)]" />
      </motion.div>

      {/* Layer 2 — primary orb (parallax) */}
      <motion.div
        className="pointer-events-none absolute -right-20 top-[18%] z-0 h-[26rem] w-[26rem] max-w-[95vw] will-change-transform sm:-right-12 md:-right-8 lg:right-0"
        style={{ x: orbX, y: orbY }}
        aria-hidden
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.22),transparent_70%)] blur-3xl" />
      </motion.div>

      {/* Layer 3 — secondary glow (bottom-left, fills lower “empty” zone) */}
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
      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col justify-center gap-12 px-4 pt-16 sm:gap-14 sm:px-6 sm:pt-20 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-2 lg:items-center lg:gap-x-20 lg:gap-y-10 lg:px-8 lg:py-10 lg:pt-24">
        <motion.div
          className="flex min-w-0 flex-col justify-center text-center lg:text-left"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.p
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#64748B] sm:text-xs"
            variants={item}
          >
            HILO Studio
          </motion.p>
          <motion.h1
            className="text-balance font-display text-[2.125rem] font-normal leading-[1.08] tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl lg:text-6xl xl:text-[4.25rem] xl:leading-[1.05]"
            variants={item}
          >
            Powering the <em className="not-italic text-[#16A34A]">next</em> generation of{" "}
            <span className="bg-gradient-to-r from-[#0F172A] to-[#334155] bg-clip-text text-transparent">
              AI &amp; software
            </span>{" "}
            brands.
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#64748B] md:text-lg lg:mx-0 lg:mt-8"
            variants={item}
          >
            We build high-performance software solutions. Clean, scalable, and built for growth — strategy,
            engineering, and launch with one team.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            variants={item}
          >
            <motion.div
              className="inline-flex"
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <RollingContactCta lineClassName="h-12" className="h-12 px-6 py-0 text-base" />
            </motion.div>
            <motion.div
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="inline-flex"
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-[#E5E7EB] bg-white px-6 text-base font-medium text-[#0F172A] shadow-sm hover:bg-[#F8FAFC]"
              >
                <Link href="/portfolio">Learn more</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right — glass / lagoon focal (scaled up for balance) */}
        <motion.div
          className="relative mx-auto flex w-full max-w-[min(100%,22rem)] shrink-0 items-center justify-center sm:max-w-md lg:mx-0 lg:max-w-none"
          initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.1 }}
          aria-hidden
        >
          <motion.div
            className="relative aspect-square w-full max-w-[min(92vw,20rem)] sm:max-w-[22rem] lg:max-w-[min(100%,28rem)] xl:max-w-[min(100%,30rem)]"
            animate={
              reduceMotion
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
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10 mt-auto w-full shrink-0 border-t border-emerald-200/25 bg-gradient-to-r from-white/50 via-cyan-50/35 to-emerald-50/45 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#64748B] sm:text-xs">
            / Scroll
          </p>
          <p className="max-w-md text-left text-sm leading-relaxed text-[#64748B] sm:max-w-lg sm:text-right">
            Community-first delivery, creative product thinking, and cutting-edge engineering for teams that want to
            ship fast — without cutting corners.
          </p>
        </div>
      </div>
    </section>
  );
}
