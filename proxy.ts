import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

// Next.js 16+ prefers the `proxy` convention over `middleware.ts`.
export default createMiddleware({
  ...routing,
  // Redirect / to the best locale (/en or /fr).
  // This fixes "no redirection from /".
  localeDetection: true
});

export const config = {
  // Skip /api, Next internals, and static files.
  // Also skip SEO endpoints that include dots (robots.txt, sitemap.xml) to avoid
  // treating them as a locale segment.
  matcher: ['/((?!api|_next|robots\\.txt|sitemap\\.xml|.*\\..*).*)']
};

