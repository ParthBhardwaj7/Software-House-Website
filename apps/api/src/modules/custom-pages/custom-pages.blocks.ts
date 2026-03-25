import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

const MAX_BLOCKS = 80;
const MAX_TEXT = 50_000;
const MAX_SHORT = 500;
const MAX_URL = 2048;
const MAX_LIST_ITEMS = 60;
const MAX_LINK_ITEMS = 30;

export const RESERVED_CUSTOM_PAGE_SLUGS = new Set([
  'admin',
  'api',
  'blog',
  'contact',
  'faqs',
  'portfolio',
  'privacy',
  'services',
  'sitemap',
  'site',
  'teams',
  'team',
  'terms',
  'testimonials',
  'what-we-deliver',
  'about',
  'custom-pages',
  '_next',
  'static',
  'favicon.ico',
  'robots.txt',
]);

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new BadRequestException(msg);
}

function isStr(v: unknown, max: number): v is string {
  return typeof v === 'string' && v.length <= max;
}

function isNonEmptyStr(v: unknown, max: number): v is string {
  return isStr(v, max) && v.trim().length > 0;
}

function isUrlLike(v: string): boolean {
  if (v.length > MAX_URL) return false;
  if (v.startsWith('/')) return true;
  try {
    const u = new URL(v);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

function isEmbedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return (
    h === 'www.youtube.com' ||
    h === 'youtube.com' ||
    h === 'youtu.be' ||
    h === 'www.youtube-nocookie.com' ||
    h === 'player.vimeo.com' ||
    h === 'vimeo.com' ||
    h === 'www.vimeo.com'
  );
}

export function assertValidEmbedUrl(raw: string): void {
  assert(isNonEmptyStr(raw, MAX_URL), 'embed: embedUrl is required');
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    throw new BadRequestException('embed: invalid URL');
  }
  assert(u.protocol === 'https:' || u.protocol === 'http:', 'embed: URL must be http(s)');
  assert(isEmbedHost(u.hostname), 'embed: only YouTube and Vimeo URLs are allowed');
}

function validateLinkItem(item: unknown, i: number): void {
  assert(item && typeof item === 'object', `links[${i}]: invalid item`);
  const o = item as Record<string, unknown>;
  assert(isNonEmptyStr(o.label, 200), `links[${i}]: label required`);
  assert(isNonEmptyStr(o.href, MAX_URL), `links[${i}]: href required`);
  assert(isUrlLike(o.href as string), `links[${i}]: href must be absolute or root-relative`);
  if (o.external !== undefined) assert(typeof o.external === 'boolean', `links[${i}]: external must be boolean`);
}

function validateBlock(b: unknown, index: number): void {
  assert(b && typeof b === 'object', `blocks[${index}]: must be an object`);
  const o = b as Record<string, unknown>;
  const type = o.type;
  assert(typeof type === 'string', `blocks[${index}]: type required`);

  switch (type) {
    case 'h2':
    case 'h3':
      assert(isNonEmptyStr(o.text, MAX_SHORT), `${type}: text required`);
      break;
    case 'paragraph':
      assert(isNonEmptyStr(o.text, MAX_TEXT), 'paragraph: text required');
      break;
    case 'image': {
      assert(isNonEmptyStr(o.url, MAX_URL), 'image: url required');
      assert(isUrlLike(o.url as string), 'image: invalid url');
      assert(isNonEmptyStr(o.alt, 300), 'image: alt required for accessibility');
      if (o.caption !== undefined) assert(isStr(o.caption, 500), 'image: caption too long');
      break;
    }
    case 'video': {
      assert(isNonEmptyStr(o.url, MAX_URL), 'video: url required');
      assert(isUrlLike(o.url as string), 'video: invalid url');
      if (o.posterUrl !== undefined) {
        assert(isStr(o.posterUrl, MAX_URL), 'video: posterUrl too long');
        assert(isUrlLike(o.posterUrl as string), 'video: invalid posterUrl');
      }
      if (o.caption !== undefined) assert(isStr(o.caption, 500), 'video: caption too long');
      break;
    }
    case 'links': {
      assert(Array.isArray(o.items), 'links: items array required');
      assert(o.items.length <= MAX_LINK_ITEMS, `links: max ${MAX_LINK_ITEMS} items`);
      (o.items as unknown[]).forEach((it, j) => validateLinkItem(it, j));
      break;
    }
    case 'divider':
      break;
    case 'bulletList':
    case 'numberedList': {
      assert(Array.isArray(o.items), `${type}: items array required`);
      assert(o.items.length > 0, `${type}: at least one item`);
      assert(o.items.length <= MAX_LIST_ITEMS, `${type}: max ${MAX_LIST_ITEMS} items`);
      (o.items as unknown[]).forEach((it, k) =>
        assert(isNonEmptyStr(it, 2000), `${type}: item ${k} must be non-empty text`),
      );
      break;
    }
    case 'quote': {
      assert(isNonEmptyStr(o.text, MAX_TEXT), 'quote: text required');
      if (o.attribution !== undefined) assert(isStr(o.attribution, 300), 'quote: attribution too long');
      break;
    }
    case 'cta': {
      if (o.title !== undefined) assert(isStr(o.title, 200), 'cta: title too long');
      if (o.body !== undefined) assert(isStr(o.body, 2000), 'cta: body too long');
      assert(isNonEmptyStr(o.buttonLabel, 120), 'cta: buttonLabel required');
      assert(isNonEmptyStr(o.buttonHref, MAX_URL), 'cta: buttonHref required');
      assert(isUrlLike(o.buttonHref as string), 'cta: invalid buttonHref');
      break;
    }
    case 'embed': {
      assert(isNonEmptyStr(o.embedUrl, MAX_URL), 'embed: embedUrl required');
      assertValidEmbedUrl(o.embedUrl as string);
      if (o.title !== undefined) assert(isStr(o.title, 200), 'embed: title too long');
      break;
    }
    case 'spacer': {
      const size = o.size;
      assert(size === 'sm' || size === 'md' || size === 'lg', 'spacer: size must be sm | md | lg');
      break;
    }
    default:
      throw new BadRequestException(`blocks[${index}]: unknown type "${type}"`);
  }
}

export function parseAndValidateBlocks(raw: unknown): Prisma.InputJsonValue {
  assert(Array.isArray(raw), 'blocks must be an array');
  assert(raw.length <= MAX_BLOCKS, `At most ${MAX_BLOCKS} blocks allowed`);
  raw.forEach((b, i) => validateBlock(b, i));
  return raw as Prisma.InputJsonValue;
}

export function assertSlugAllowed(slug: string): void {
  const s = slug.trim().toLowerCase();
  assert(s.length >= 1 && s.length <= 120, 'slug length invalid');
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s), 'slug: use lowercase letters, numbers, single hyphens');
  assert(!RESERVED_CUSTOM_PAGE_SLUGS.has(s), `slug "${s}" is reserved`);
}
