"use client";

import { useEffect } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

function clamp01(n: number) {
  return Math.max(-1, Math.min(1, n));
}

/**
 * Lightweight hero parallax: window-normalized pointer + springs.
 * Off when reduced motion, coarse pointer, or &lt; lg.
 */
export function useHeroParallax() {
  const reduceMotion = useReducedMotion();
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");

  const enabled = !reduceMotion && isLg && !isCoarsePointer;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, {
    stiffness: 85,
    damping: 28,
    mass: 0.5,
  });
  const springY = useSpring(rawY, {
    stiffness: 85,
    damping: 28,
    mass: 0.5,
  });

  // 1) Background gradient — moves more
  const bgX = useTransform(springX, [-1, 1], [18, -18]);
  const bgY = useTransform(springY, [-1, 1], [14, -14]);

  // 2) Blob — moves less
  const orbX = useTransform(springX, [-1, 1], [10, -10]);
  const orbY = useTransform(springY, [-1, 1], [8, -8]);

  useEffect(() => {
    if (!enabled) {
      rawX.set(0);
      rawY.set(0);
      return;
    }

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      rawX.set(clamp01(nx));
      rawY.set(clamp01(ny));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return {
    enabled,
    bgX,
    bgY,
    orbX,
    orbY,
    reduceMotion: !!reduceMotion,
  };
}
