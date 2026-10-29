export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.joannadev.com').replace(/\/+$/, '');

/** Primary outbound CTA for “start project” style buttons */
export const MALT_PROFILE_URL = 'https://www.malt.fr/profile/joannapietryka';

/** Polish-market CTA (UseMe) */
export const USEME_PROFILE_URL =
  'https://useme.com/pl/roles/contractor/joanna-pietryka,653019/';

/** Locale-aware profile URL for primary CTAs */
export function getCtaProfileUrl(locale?: string | null) {
  const base = (locale ?? 'en').split('-')[0];
  return base === 'pl' ? USEME_PROFILE_URL : MALT_PROFILE_URL;
}

export function absUrl(pathname: string) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_URL}${path}`;
}

/** Shared hreflang map for metadata + sitemap (path without locale prefix). */
export function localeLanguages(path = '') {
  const suffix = !path || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return {
    en: absUrl(`/en${suffix}`),
    fr: absUrl(`/fr${suffix}`),
    pl: absUrl(`/pl${suffix}`),
    'x-default': absUrl(`/en${suffix}`),
  };
}

