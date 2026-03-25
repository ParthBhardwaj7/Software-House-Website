"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { DELIVERY_STEPS } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

type Step = (typeof DELIVERY_STEPS)[number];

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
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TimelineStepContent({
  step,
  index,
  isFirst,
  onBecomeActive,
}: {
  step: Step;
  index: number;
  isFirst: boolean;
  onBecomeActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: 0.42,
    margin: "-12% 0px -12% 0px",
  });

  useEffect(() => {
    if (isInView) onBecomeActive(index);
  }, [isInView, index, onBecomeActive]);

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{
        opacity: isInView ? 1 : 0.4,
        y: isInView ? 0 : 40,
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "flex min-h-[min(88vh,52rem)] flex-col justify-center py-8 pl-8 sm:pl-10 lg:min-h-[min(85vh,52rem)] lg:py-12 lg:pl-0",
        !isFirst && "border-t border-[#E5E7EB]/80"
      )}
    >
      <div className="min-w-0">
        <h2 className="font-display text-2xl font-normal tracking-tight text-[#0F172A] sm:text-3xl lg:text-4xl">
          {step.title}
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#64748B] sm:text-lg">{step.body}</p>
      </div>
    </motion.div>
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
      className="pointer-events-none absolute bottom-0 left-4 top-0 z-[1] w-[2px] lg:left-1/2 lg:-translate-x-1/2"
      aria-hidden
    >
      <div className="relative h-full w-full bg-[#E5E7EB]">
        {reduceMotion ? (
          <div className="absolute inset-0 origin-top bg-[#22C55E]" style={{ transform: "scaleY(1)" }} />
        ) : (
          <motion.div className="absolute inset-0 origin-top bg-[#22C55E]" style={{ scaleY: smoothProgress }} />
        )}
      </div>
      {reduceMotion ? (
        <div className="absolute left-1/2 top-full z-[2] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22C55E] shadow-[0_0_18px_rgba(34,197,94,0.55)]" />
      ) : (
        <motion.div
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
};

export function DeliveryTimeline({ embedded = false }: DeliveryTimelineProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  const handleActive = useCallback((i: number) => {
    setActiveStep(i);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.0005,
  });

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative bg-[#F8FAFC] pb-8 sm:pb-12 md:pb-16",
        embedded ? "pt-4 sm:pt-6 md:pt-8" : "pt-8 sm:pt-12 md:pt-16"
      )}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollTrack smoothProgress={smoothProgress} reduceMotion={!!reduceMotion} />

        {/* Mobile: sticky single number that increments (same behavior as desktop) */}
        <div className="pointer-events-none sticky top-20 z-[3] -mx-4 mb-6 flex justify-center border-b border-[#E5E7EB]/60 bg-[#F8FAFC]/90 py-3 backdrop-blur-sm sm:-mx-6 lg:hidden">
          <div className="pointer-events-auto">
            <AnimatedStepNumber index={activeStep} reduceMotion={!!reduceMotion} />
          </div>
        </div>

        {/*
          items-stretch + h-full on col1: left column must span full timeline height
          so sticky keeps the number “frozen” in view while right column scrolls.
          (items-start made col1 only as tall as the digit — sticky released immediately.)
        */}
        <div className="relative z-[2] lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-8 lg:gap-y-0">
          {/* Desktop: number stays pinned (sticky) for whole section; value still 01→02 via activeStep */}
          <div className="pointer-events-none relative hidden lg:pointer-events-auto lg:col-span-1 lg:flex lg:min-h-0 lg:h-full lg:flex-col">
            <div className="sticky top-[max(6rem,calc(50vh-4.5rem))] z-[2] py-6">
              <span className="sr-only" aria-live="polite" aria-atomic="true">
                Step {activeStep + 1} of {DELIVERY_STEPS.length}
              </span>
              <AnimatedStepNumber index={activeStep} reduceMotion={!!reduceMotion} />
            </div>
          </div>

          <div className="hidden min-h-0 lg:col-span-1 lg:block" aria-hidden />

          <div className="min-w-0 lg:col-span-1">
            {DELIVERY_STEPS.map((step, i) => (
              <TimelineStepContent
                key={step.num}
                step={step}
                index={i}
                isFirst={i === 0}
                onBecomeActive={handleActive}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
