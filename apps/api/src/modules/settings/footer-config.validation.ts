import { BadRequestException } from '@nestjs/common';

const MAX_LINKS = 12;
const MAX_LABEL = 120;
const MAX_HREF = 2048;
const MAX_TAGLINE = 500;
const MAX_SHORT = 200;
const MAX_OFFICE = 300;
const MAX_PAGE_CONTENT = 50_000;

export type FooterLink = { label: string; href: string; pageContent?: string };

export type FooterConfigParsed = {
  brandTagline: string;
  quickLinksHeading: string;
  quickLinks: FooterLink[];
  servicesHeading: string;
  serviceLinks: FooterLink[];
  infoHeading: string;
  infoLinks: FooterLink[];
  newsletterHeading: string;
  newsletterDescription: string;
  officeHours: string;
  copyrightEntity: string;
};

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new BadRequestException(msg);
}

function isAllowedHref(href: string): boolean {
  const h = href.trim();
  if (!h) return false;
  if (h.startsWith('/')) {
    if (h.startsWith('//')) return false;
    return true;
  }
  try {
    const u = new URL(h);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

function validateLink(item: unknown, path: string): FooterLink {
  assert(item && typeof item === 'object', `${path}: invalid item`);
  const o = item as Record<string, unknown>;
  assert(typeof o.label === 'string', `${path}: label required`);
  assert(typeof o.href === 'string', `${path}: href required`);
  const label = o.label.trim();
  const href = o.href.trim();
  assert(label.length > 0 && label.length <= MAX_LABEL, `${path}: label length invalid`);
  assert(href.length > 0 && href.length <= MAX_HREF, `${path}: href length invalid`);
  assert(isAllowedHref(href), `${path}: href must be http(s) or root-relative`);
  const out: FooterLink = { label, href };
  if (o.pageContent !== undefined) {
    assert(typeof o.pageContent === 'string', `${path}: pageContent must be a string`);
    const pc = o.pageContent.trim();
    assert(
      pc.length <= MAX_PAGE_CONTENT,
      `${path}: pageContent exceeds max length (${MAX_PAGE_CONTENT})`,
    );
    if (pc.length > 0) out.pageContent = pc;
  }
  return out;
}

function parseLinkArray(raw: unknown, key: string): FooterLink[] {
  assert(Array.isArray(raw), `${key} must be an array`);
  assert(raw.length <= MAX_LINKS, `${key}: at most ${MAX_LINKS} items`);
  return raw.map((it, i) => validateLink(it, `${key}[${i}]`));
}

export function parseAndValidateFooterConfigJson(jsonStr: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr) as unknown;
  } catch {
    throw new BadRequestException('footerConfig: invalid JSON');
  }
  assert(parsed && typeof parsed === 'object', 'footerConfig: must be an object');
  const o = parsed as Record<string, unknown>;

  const brandTagline =
    typeof o.brandTagline === 'string' ? o.brandTagline.trim().slice(0, MAX_TAGLINE) : '';
  assert(brandTagline.length > 0, 'brandTagline is required');

  const quickLinksHeading =
    typeof o.quickLinksHeading === 'string'
      ? o.quickLinksHeading.trim().slice(0, MAX_SHORT)
      : 'Quick Links';
  const servicesHeading =
    typeof o.servicesHeading === 'string'
      ? o.servicesHeading.trim().slice(0, MAX_SHORT)
      : 'Services';
  const infoHeading =
    typeof o.infoHeading === 'string' ? o.infoHeading.trim().slice(0, MAX_SHORT) : 'Information';

  const quickLinks = parseLinkArray(o.quickLinks, 'quickLinks');
  const serviceLinks = parseLinkArray(o.serviceLinks, 'serviceLinks');
  const infoLinks = parseLinkArray(o.infoLinks, 'infoLinks');

  assert(quickLinks.length > 0, 'quickLinks: at least one link');
  assert(serviceLinks.length > 0, 'serviceLinks: at least one link');
  assert(infoLinks.length > 0, 'infoLinks: at least one link');

  const newsletterHeading =
    typeof o.newsletterHeading === 'string'
      ? o.newsletterHeading.trim().slice(0, MAX_SHORT)
      : 'Subscribe Our Newsletter';
  assert(newsletterHeading.length > 0, 'newsletterHeading is required');

  const newsletterDescription =
    typeof o.newsletterDescription === 'string'
      ? o.newsletterDescription.trim().slice(0, MAX_TAGLINE)
      : '';
  assert(newsletterDescription.length > 0, 'newsletterDescription is required');

  const officeHours =
    typeof o.officeHours === 'string' ? o.officeHours.trim().slice(0, MAX_OFFICE) : '';
  assert(officeHours.length > 0, 'officeHours is required');

  const copyrightEntity =
    typeof o.copyrightEntity === 'string' ? o.copyrightEntity.trim().slice(0, MAX_SHORT) : '';
  assert(copyrightEntity.length > 0, 'copyrightEntity is required');

  const normalized: FooterConfigParsed = {
    brandTagline,
    quickLinksHeading,
    quickLinks,
    servicesHeading,
    serviceLinks,
    infoHeading,
    infoLinks,
    newsletterHeading,
    newsletterDescription,
    officeHours,
    copyrightEntity,
  };

  return JSON.stringify(normalized);
}
