/**
 * When API returns some items but fewer than `min`, pad with dummy rows
 * (same slug/id skipped) so lists always show enough cards for QA.
 */
export function fillToMin<T extends { id: string }>(items: T[], dummy: T[], min = 6): T[] {
  if (items.length === 0) return dummy.slice(0, min);
  if (items.length >= min) return items;
  const ids = new Set(items.map((i) => i.id));
  const need = min - items.length;
  const extras = dummy.filter((d) => !ids.has(d.id)).slice(0, need);
  return [...items, ...extras];
}
