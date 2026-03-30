import { BadRequestException } from '@nestjs/common';

const MAX_SHORT = 200;
const MAX_MEDIUM = 2000;
const MAX_STEP_BODY = 4000;
const MIN_STEPS = 1;
const MAX_STEPS = 12;

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new BadRequestException(msg);
}

function str(v: unknown, key: string, max: number, required = true): string {
  if (v === undefined || v === null) {
    assert(!required, `${key} is required`);
    return '';
  }
  assert(typeof v === 'string', `${key} must be a string`);
  const t = v.trim().slice(0, max);
  if (required) assert(t.length > 0, `${key} cannot be empty`);
  return t;
}

export type MarketingHomeParsed = {
  eyebrow: string;
  headingPrefix: string;
  headingEmphasis: string;
  headingMiddle: string;
  headingGradient: string;
  headingSuffix: string;
  subtext: string;
  bottomEyebrow: string;
  bottomText: string;
  primaryCtaHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
};

export type MarketingDeliveryParsed = {
  sectionEyebrow: string;
  title: string;
  subtitle: string;
  steps: { title: string; body: string }[];
};

export function parseAndValidateMarketingHomeJson(jsonStr: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr) as unknown;
  } catch {
    throw new BadRequestException('marketingHomeJson: invalid JSON');
  }
  assert(parsed && typeof parsed === 'object', 'marketingHomeJson: must be an object');
  const o = parsed as Record<string, unknown>;

  const primaryCtaHref = str(o.primaryCtaHref, 'primaryCtaHref', 500, false) || '/contact';
  const secondaryButtonLabel = str(o.secondaryButtonLabel, 'secondaryButtonLabel', 80, false) || 'Learn more';
  const secondaryButtonHref = str(o.secondaryButtonHref, 'secondaryButtonHref', 500, false) || '/portfolio';

  const out: MarketingHomeParsed = {
    eyebrow: str(o.eyebrow, 'eyebrow', 120),
    headingPrefix: str(o.headingPrefix, 'headingPrefix', MAX_SHORT),
    headingEmphasis: str(o.headingEmphasis, 'headingEmphasis', 80),
    headingMiddle: str(o.headingMiddle, 'headingMiddle', MAX_SHORT),
    headingGradient: str(o.headingGradient, 'headingGradient', 200),
    headingSuffix: str(o.headingSuffix, 'headingSuffix', 120),
    subtext: str(o.subtext, 'subtext', MAX_MEDIUM),
    bottomEyebrow: str(o.bottomEyebrow, 'bottomEyebrow', 80),
    bottomText: str(o.bottomText, 'bottomText', MAX_MEDIUM),
    primaryCtaHref,
    secondaryButtonLabel,
    secondaryButtonHref,
  };

  for (const h of [out.primaryCtaHref, out.secondaryButtonHref]) {
    assert(h.startsWith('/') || /^https?:\/\//i.test(h), 'CTA hrefs must be relative paths or http(s) URLs');
  }

  return JSON.stringify(out);
}

export function parseAndValidateMarketingDeliveryJson(jsonStr: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr) as unknown;
  } catch {
    throw new BadRequestException('marketingDeliveryJson: invalid JSON');
  }
  assert(parsed && typeof parsed === 'object', 'marketingDeliveryJson: must be an object');
  const o = parsed as Record<string, unknown>;

  const sectionEyebrow = str(o.sectionEyebrow, 'sectionEyebrow', 80);
  const title = str(o.title, 'title', 200);
  const subtitle = str(o.subtitle, 'subtitle', MAX_MEDIUM);

  assert(Array.isArray(o.steps), 'steps must be an array');
  assert(
    o.steps.length >= MIN_STEPS && o.steps.length <= MAX_STEPS,
    `steps: between ${MIN_STEPS} and ${MAX_STEPS} items`,
  );

  const steps: { title: string; body: string }[] = [];
  (o.steps as unknown[]).forEach((item, i) => {
    assert(item && typeof item === 'object', `steps[${i}] invalid`);
    const s = item as Record<string, unknown>;
    const titleStep = str(s.title, `steps[${i}].title`, 200);
    const bodyStep = str(s.body, `steps[${i}].body`, MAX_STEP_BODY);
    steps.push({ title: titleStep, body: bodyStep });
  });

  const out: MarketingDeliveryParsed = { sectionEyebrow, title, subtitle, steps };
  return JSON.stringify(out);
}
