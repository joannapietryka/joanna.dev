import type {MetadataRoute} from 'next';

import {absUrl} from './_lib/site';
import {routing} from '../i18n/routing';

const PAGES = ['', '/services', '/work', '/journal', '/approach'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: absUrl(`/${locale}${path}`),
      lastModified,
      alternates: {
        languages: {
          en: absUrl(`/en${path}`),
          fr: absUrl(`/fr${path}`),
          'x-default': absUrl(`/en${path}`)
        }
      }
    }))
  );
}

