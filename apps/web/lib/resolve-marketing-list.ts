import { allowDummyMarketingContent } from "@/lib/allow-dummy-content";
import { fillToMin } from "@/lib/fill-dummy";

/**
 * Public marketing lists: real API data only in production unless QA flag is on.
 * In dev, pads to `min` with dummy rows for layout QA.
 */
export function resolveMarketingList<T extends { id: string }>(
  items: T[],
  dummy: T[],
  min = 6
): T[] {
  if (!allowDummyMarketingContent()) return items;
  return fillToMin(items, dummy, min);
}

export function isDummyId(id: string): boolean {
  return id.startsWith("dummy-") || id.startsWith("dummy");
}
