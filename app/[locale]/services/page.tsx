import type {Metadata} from 'next';

import {ServicesPageClient} from './ServicesPageClient';
import {absUrl} from '../../_lib/site';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const isFr = locale === 'fr';
  const path = '/services';

  return {
    title: isFr ? 'Services — Joanna Dev' : 'Services — Joanna Dev',
    description: isFr
      ? 'Services — sites web, apps et automatisations.'
      : 'Services — websites, apps, and automations.',
    alternates: {
      canonical: absUrl(`/${locale}${path}`),
      languages: {
        en: absUrl(`/en${path}`),
        fr: absUrl(`/fr${path}`),
        'x-default': absUrl(`/en${path}`)
      }
    }
  };
}

export default function ServicesPage() {
  return <ServicesPageClient />;
}

