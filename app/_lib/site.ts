export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || 'https://joanna.dev').replace(/\/+$/, '');

export function absUrl(pathname: string) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_URL}${path}`;
}

