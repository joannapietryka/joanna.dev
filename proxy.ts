import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

// Next.js 16+ prefers the `proxy` convention over `middleware.ts`.
export default createMiddleware({
  ...routing,
  // Redirect / to the best locale (/en or /fr).
  // This fixes "no redirection from /".
  localeDetection: true,
  // hreflang is set in page metadata (alternates.languages); disable middleware
  // Link headers to avoid www/non-www mismatch and duplicate x-default entries.
  alternateLinks: false
});

export const config = {
  // Skip /api, Next internals, and static files.
  // Also skip SEO endpoints that include dots (robots.txt, sitemap.xml) to avoid
  // treating them as a locale segment.
  matcher: ['/((?!api|_next|robots\\.txt|sitemap\\.xml|.*\\..*).*)']
};

