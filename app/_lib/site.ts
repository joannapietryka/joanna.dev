export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || 'https://joanna.dev').replace(/\/+$/, '');

/** Primary outbound CTA for “start project” style buttons */
export const MALT_PROFILE_URL = 'https://www.malt.fr/profile/joannapietryka';

export function absUrl(pathname: string) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_URL}${path}`;
}

