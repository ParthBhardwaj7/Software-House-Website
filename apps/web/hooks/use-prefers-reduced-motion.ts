"use client";

import { useLayoutEffect, useState } from "react";

/**
 * `prefers-reduced-motion` read after mount so SSR + hydration match (initial `false`),
 * without framer-motion `useReducedMotion` dev warnings.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}
