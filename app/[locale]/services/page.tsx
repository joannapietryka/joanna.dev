import type {Metadata} from 'next';

import {ServicesPageClient} from './ServicesPageClient';
import {absUrl, localeLanguages} from '../../_lib/site';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const path = '/services';
  const titles: Record<string, string> = {
    en: 'Services — Websites, Landing Pages, Web Apps & Automations | Joanna Dev',
    fr: 'Services — Sites web, landing pages, apps web & automatisations | Joanna Dev',
    pl: 'Oferta — strony internetowe, landing page, aplikacje webowe | Joanna Dev',
  };
  const descriptions: Record<string, string> = {
    en: 'End-to-end services: websites, landing pages, web apps, fullstack development, and automations — from discovery to launch.',
    fr: 'Services de A à Z : sites web, landing pages, applications web, fullstack development et automatisations — de la découverte au lancement.',
    pl: 'Kompleksowa oferta: strony internetowe, landing page, aplikacje webowe, fullstack development i automatyzacje — od discovery po launch.',
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    alternates: {
      canonical: absUrl(`/${locale}${path}`),
      languages: localeLanguages(path)
    }
  };
}

export default function ServicesPage() {
  return <ServicesPageClient />;
}
