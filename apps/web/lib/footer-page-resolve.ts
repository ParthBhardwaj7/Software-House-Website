import type { FooterConfig, FooterLink } from "@/lib/footer-defaults";

/** Normalize root-relative paths for comparison (trim, strip trailing slash except `/`). */
export function normalizeFooterPath(href: string): string {
  const t = href.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return t;
  if (t.length > 1 && t.endsWith("/")) return t.slice(0, -1);
  return t;
}

function isInternalHref(href: string): boolean {
  const h = href.trim();
  return h.startsWith("/") && !h.startsWith("//");
}

/**
 * First footer link (quick → service → info) whose internal href matches `path`.
 * `path` should be like `/privacy` or `/career`.
 */
export function resolveFooterPageByPath(
  config: FooterConfig,
  path: string
): FooterLink | null {
  const target = normalizeFooterPath(path);
  const groups = [config.quickLinks, config.serviceLinks, config.infoLinks];
  for (const links of groups) {
    for (const link of links) {
      if (!isInternalHref(link.href)) continue;
      if (normalizeFooterPath(link.href) === target) return link;
    }
  }
  return null;
}

export function firstLineExcerpt(text: string, max = 160): string {
  const line = text.trim().split(/\n/)[0]?.trim() ?? "";
  return line.length <= max ? line : `${line.slice(0, max - 1)}…`;
}
