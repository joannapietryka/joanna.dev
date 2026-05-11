import type {MetadataRoute} from 'next';

import {absUrl, SITE_URL} from './_lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: absUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}

