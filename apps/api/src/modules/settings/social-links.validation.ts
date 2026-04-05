import { BadRequestException } from '@nestjs/common';

const MAX_URL = 500;

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new BadRequestException(msg);
}

function normalizeUrl(raw: string): string {
  const t = raw.trim().slice(0, MAX_URL);
  if (!t) return '';
  try {
    const u = new URL(t);
    assert(u.protocol === 'https:' || u.protocol === 'http:', 'socialLinks: URLs must be http(s)');
    return t;
  } catch {
    throw new BadRequestException('socialLinks: invalid URL');
  }
}

export type SocialLinksParsed = {
  twitter: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  facebook: string;
  github: string;
  telegram: string;
};

export function parseAndValidateSocialLinksJson(jsonStr: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr) as unknown;
  } catch {
    throw new BadRequestException('socialLinks: invalid JSON');
  }
  assert(parsed && typeof parsed === 'object', 'socialLinks: must be an object');
  const o = parsed as Record<string, unknown>;
  const keys: (keyof SocialLinksParsed)[] = [
    'twitter',
    'instagram',
    'youtube',
    'linkedin',
    'facebook',
    'github',
    'telegram',
  ];
  const out: SocialLinksParsed = {
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    facebook: '',
    github: '',
    telegram: '',
  };
  for (const k of keys) {
    const v = o[k];
    if (typeof v === 'string' && v.trim()) {
      out[k] = normalizeUrl(v);
    }
  }
  return JSON.stringify(out);
}
