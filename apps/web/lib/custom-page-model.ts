/** Mirrors API block shapes — keep in sync with custom-pages.blocks.ts */

export type LinkItem = { label: string; href: string; external?: boolean };

export type CustomPageBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; url: string; alt: string; caption?: string }
  | { type: "video"; url: string; posterUrl?: string; caption?: string }
  | { type: "links"; items: LinkItem[] }
  | { type: "divider" }
  | { type: "bulletList"; items: string[] }
  | { type: "numberedList"; items: string[] }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "cta"; title?: string; body?: string; buttonLabel: string; buttonHref: string }
  | { type: "embed"; embedUrl: string; title?: string }
  | { type: "spacer"; size: "sm" | "md" | "lg" };

export type CustomPageNavItem = {
  slug: string;
  navLabel: string;
  navSortOrder: number;
};

export type CustomPagePayload = {
  id: string;
  slug: string;
  navLabel: string;
  headline: string;
  subheadline: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  blocks: unknown;
};

export const CUSTOM_PAGE_BLOCK_TYPES: { value: CustomPageBlock["type"]; label: string; hint: string }[] = [
  { value: "h2", label: "Heading 2", hint: "Section title" },
  { value: "h3", label: "Heading 3", hint: "Subsection" },
  { value: "paragraph", label: "Paragraph", hint: "Body text (multiple lines)" },
  { value: "image", label: "Image", hint: "URL + alt text; optional caption" },
  { value: "video", label: "Video / file", hint: "MP4/WebM URL or YouTube/Vimeo page link" },
  { value: "embed", label: "Embed (YouTube/Vimeo)", hint: "Paste watch URL — iframe only" },
  { value: "links", label: "Link list", hint: "Buttons or text links" },
  { value: "bulletList", label: "Bullet list", hint: "One item per line in editor" },
  { value: "numberedList", label: "Numbered list", hint: "Ordered steps" },
  { value: "quote", label: "Quote", hint: "Pull quote + optional attribution" },
  { value: "cta", label: "Call to action", hint: "Title, text, button" },
  { value: "divider", label: "Divider", hint: "Visual separator" },
  { value: "spacer", label: "Spacer", hint: "Vertical gap sm / md / lg" },
];

export function emptyBlock(t: CustomPageBlock["type"]): CustomPageBlock {
  switch (t) {
    case "h2":
    case "h3":
      return { type: t, text: "" };
    case "paragraph":
      return { type: "paragraph", text: "" };
    case "image":
      return { type: "image", url: "", alt: "" };
    case "video":
      return { type: "video", url: "" };
    case "embed":
      return { type: "embed", embedUrl: "" };
    case "links":
      return { type: "links", items: [{ label: "Link", href: "https://", external: true }] };
    case "divider":
      return { type: "divider" };
    case "bulletList":
    case "numberedList":
      return { type: t, items: [""] };
    case "quote":
      return { type: "quote", text: "" };
    case "cta":
      return { type: "cta", buttonLabel: "Get started", buttonHref: "/contact" };
    case "spacer":
      return { type: "spacer", size: "md" };
  }
}

export function parseBlocks(raw: unknown): CustomPageBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw as CustomPageBlock[];
}

export function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url.trim());
    const h = u.hostname.toLowerCase();
    if ((h === "youtube.com" || h === "www.youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube-nocookie.com/embed/${u.searchParams.get("v")}`;
    }
    if (h === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function toVimeoEmbed(url: string): string | null {
  try {
    const u = new URL(url.trim());
    const h = u.hostname.toLowerCase();
    if (h === "vimeo.com" || h === "www.vimeo.com") {
      const id = u.pathname.replace(/^\//, "").split("/").filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function videoUrlToPlayer(url: string): { kind: "iframe"; src: string } | { kind: "video"; src: string } | { kind: "link"; href: string } {
  const trimmed = url.trim();
  const yt = toYouTubeEmbed(trimmed);
  if (yt) return { kind: "iframe", src: yt };
  const vm = toVimeoEmbed(trimmed);
  if (vm) return { kind: "iframe", src: vm };
  const lower = trimmed.toLowerCase();
  if (lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".ogg")) {
    return { kind: "video", src: trimmed };
  }
  return { kind: "link", href: trimmed };
}

export function embedWatchUrlToIframeSrc(embedUrl: string): string | null {
  const t = embedUrl.trim();
  return toYouTubeEmbed(t) || toVimeoEmbed(t);
}

export function slugifyNavLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Normalize blocks before POST/PUT so API validation passes. */
export function sanitizeBlocksForSubmit(blocks: CustomPageBlock[]): CustomPageBlock[] {
  return blocks.map((b) => {
    if (b.type === "bulletList" || b.type === "numberedList") {
      const items = b.items.map((s) => s.trim()).filter((s) => s.length > 0);
      return { ...b, items };
    }
    if (b.type === "links") {
      return {
        ...b,
        items: b.items
          .map((it) => ({
            label: it.label.trim(),
            href: it.href.trim(),
            external: it.external,
          }))
          .filter((it) => it.label.length > 0 && it.href.length > 0),
      };
    }
    return b;
  });
}

export function validateBlocksClient(blocks: CustomPageBlock[]): string | null {
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "bulletList" || b.type === "numberedList") {
      if (b.items.length === 0) {
        return `List block #${i + 1}: add at least one non-empty line.`;
      }
    }
    if (b.type === "links" && b.items.length === 0) {
      return `Links block #${i + 1}: add at least one link, or remove the block.`;
    }
    if (b.type === "h2" || b.type === "h3") {
      if (!b.text.trim()) return `Heading block #${i + 1}: text is required.`;
    }
    if (b.type === "paragraph" && !b.text.trim()) {
      return `Paragraph block #${i + 1}: add text or remove the block.`;
    }
    if (b.type === "image") {
      if (!b.url.trim() || !b.alt.trim()) return `Image block #${i + 1}: URL and alt text are required.`;
    }
    if (b.type === "video" && !b.url.trim()) {
      return `Video block #${i + 1}: URL is required.`;
    }
    if (b.type === "embed" && !b.embedUrl.trim()) {
      return `Embed block #${i + 1}: URL is required.`;
    }
    if (b.type === "quote" && !b.text.trim()) {
      return `Quote block #${i + 1}: text is required.`;
    }
    if (b.type === "cta") {
      if (!b.buttonLabel.trim() || !b.buttonHref.trim()) {
        return `CTA block #${i + 1}: button label and URL are required.`;
      }
    }
  }
  return null;
}
