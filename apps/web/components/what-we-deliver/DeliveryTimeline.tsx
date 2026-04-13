"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { DeliveryStepContent } from "@/lib/marketing-defaults";

type Step = DeliveryStepContent;

function AnimatedStepNumber({
  index,
  reduceMotion,
}: {
  index: number;
  reduceMotion: boolean;
}) {
  const label = `${String(index + 1).padStart(2, "0")}.`;

  if (reduceMotion) {
    return (
      <span className="text-6xl font-bold tabular-nums leading-none tracking-tight text-[#0F172A] sm:text-7xl lg:text-8xl xl:text-9xl">
        {label}
      </span>
    );
  }

  /* Fixed counter slot: invisible spacer locks layout; no y on motion — scale + blur only. */
  return (
    <div className="relative inline-block text-6xl font-bold leading-none tracking-tight text-[#0F172A] sm:text-7xl lg:text-8xl xl:text-9xl">
      <span className="invisible select-none tabular-nums" aria-hidden>
        00.
      </span>
      <div className="absolute inset-0 h-[1em] min-w-[3ch] overflow-hidden tabular-nums">
        <AnimatePresence initial={false} mode="wait">
          <m.span
            key={label}
            initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(4px)" }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {label}
          </m.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TimelineStepContent({
  step,
  index,
  isFirst,
  layoutReady,
  onBecomeActive,
}: {
  step: Step;
  index: number;
  isFirst: boolean;
  layoutReady: boolean;
  onBecomeActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: 0.55,
    margin: "-22% 0px -22% 0px",
  });
  const inViewForMotion = layoutReady && isInView;

  useEffect(() => {
    if (isInView) onBecomeActive(index);
  }, [isInView, index, onBecomeActive]);

  return (
    <m.div
      ref={ref}
      initial={false}
      animate={{
        opacity: inViewForMotion ? 1 : 0.66,
        y: inViewForMotion ? 0 : 8,
      }}
      transition={{
        duration: 0.36,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        "flex flex-col justify-start px-4 py-7 text-center sm:px-5 sm:py-8 lg:px-0 lg:py-9 lg:text-left",
        !isFirst && "border-t border-[#E5E7EB]/80"
      )}
    >
      <div className="min-w-0 lg:max-w-none">
        <h2 className="font-display text-2xl font-normal tracking-tight text-[#0F172A] sm:text-3xl lg:text-4xl">
          {step.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-[#64748B] sm:mt-4 sm:text-lg lg:mx-0">
          {step.body}
        </p>
      </div>
    </m.div>
  );
}

function ScrollTrack({
  smoothProgress,
  reduceMotion,
}: {
  smoothProgress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const dotTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-[1] hidden w-[2px] -translate-x-1/2 lg:block lg:left-1/2 lg:-translate-x-1/2"
      aria-hidden
    >
      <div className="relative h-full w-full bg-[#E5E7EB]">
        {reduceMotion ? (
          <div className="absolute inset-0 origin-top bg-[#22C55E]" style={{ transform: "scaleY(1)" }} />
        ) : (
          <m.div className="absolute inset-0 origin-top bg-[#22C55E]" style={{ scaleY: smoothProgress }} />
        )}
      </div>
      {reduceMotion ? (
        <div className="absolute left-1/2 top-full z-[2] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22C55E] shadow-[0_0_18px_rgba(34,197,94,0.55)]" />
      ) : (
        <m.div
          className="absolute left-1/2 z-[2] h-3.5 w-3.5 rounded-full bg-[#22C55E] shadow-[0_0_18px_rgba(34,197,94,0.55)]"
          style={{
            top: dotTop,
            x: "-50%",
            y: "-50%",
          }}
        />
      )}
    </div>
  );
}

type DeliveryTimelineProps = {
  embedded?: boolean;
  steps: Step[];
};

export function DeliveryTimeline({ embedded = false, steps }: DeliveryTimelineProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reduceMotionUI = usePrefersReducedMotion();
  const [layoutReady, setLayoutReady] = useState(false);
  useLayoutEffect(() => {
    setLayoutReady(true);
  }, []);
  const [activeStep, setActiveStep] = useState(0);

  const handleActive = useCallback((i: number) => {
    setActiveStep(i);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 32,
    restDelta: 0.0005,
  });

  return (
    <LazyMotion features={domAnimation}>
    <section
      ref={containerRef}
      className={cn(
        "relative bg-[#F8FAFC] pb-6 sm:pb-8 md:pb-10",
        embedded ? "pt-3 sm:pt-5 md:pt-6" : "pt-5 sm:pt-7 md:pt-8"
      )}
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <ScrollTrack smoothProgress={smoothProgress} reduceMotion={reduceMotionUI} />

        {/* Mobile: sticky single number that increments (same behavior as desktop) */}
        <div className="pointer-events-none sticky top-16 z-[3] -mx-5 mb-3 flex justify-center border-b border-[#E5E7EB]/60 bg-[#F8FAFC]/95 py-1.5 backdrop-blur-sm sm:-mx-6 sm:mb-4 md:top-[4.5rem] lg:hidden">
          <div className="pointer-events-auto">
            <AnimatedStepNumber index={activeStep} reduceMotion={reduceMotionUI} />
          </div>
        </div>

        {/*
          items-stretch + h-full on col1: left column must span full timeline height
          so sticky keeps the number “frozen” in view while right column scrolls.
          (items-start made col1 only as tall as the digit — sticky released immediately.)
        */}
        <div className="relative z-[2] lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-6 lg:gap-y-0">
          {/* Desktop: number stays pinned (sticky) for whole section; value still 01→02 via activeStep */}
          <div className="pointer-events-none relative hidden lg:pointer-events-auto lg:col-span-1 lg:flex lg:min-h-0 lg:h-full lg:flex-col">
            <div className="sticky top-[max(6rem,calc(50vh-4.5rem))] z-[2] py-4">
              <span className="sr-only" aria-live="polite" aria-atomic="true">
                Step {activeStep + 1} of {steps.length}
              </span>
              <AnimatedStepNumber index={activeStep} reduceMotion={reduceMotionUI} />
            </div>
          </div>

          <div className="hidden min-h-0 lg:col-span-1 lg:block" aria-hidden />

          <div className="min-w-0 lg:col-span-1">
            {steps.map((step, i) => (
              <TimelineStepContent
                key={`${i}-${step.title.slice(0, 24)}`}
                step={step}
                index={i}
                isFirst={i === 0}
                layoutReady={layoutReady}
                onBecomeActive={handleActive}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
    </LazyMotion>
  );
}
