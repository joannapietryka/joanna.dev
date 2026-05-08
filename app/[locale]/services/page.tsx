import type {Metadata} from 'next';

import {ServicesPageClient} from './ServicesPageClient';

export function generateMetadata({
  params
}: {
  params: {locale: string};
}): Metadata {
  const isFr = params.locale === 'fr';
  const path = '/services';

  return {
    title: isFr ? 'Services — joanna.dev' : 'Services — joanna.dev',
    description: isFr
      ? 'Services — sites web, apps et automatisations.'
      : 'Services — websites, apps, and automations.',
    alternates: {
      canonical: isFr ? `/fr${path}` : path,
      languages: {
        en: path,
        fr: `/fr${path}`
      }
    }
  };
}

export default function ServicesPage() {
  return <ServicesPageClient />;
}

