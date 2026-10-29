import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    // Ship route CSS inside the HTML so the first paint does not wait on a stylesheet request.
    inlineCss: true
  }
};

export default withNextIntl(nextConfig);
