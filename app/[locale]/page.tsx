import type {Metadata} from 'next';
import {StudioGlass} from '../_components/studio-glass/StudioGlass';
import {absUrl, localeLanguages} from '../_lib/site';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const titles: Record<string, string> = {
    en: 'Joanna Dev — Websites, Landing Pages, Web Apps & Automations',
    fr: 'Joanna Dev — Sites web, landing pages, apps web & automatisations',
    pl: 'Joanna Dev — strony internetowe, landing page, aplikacje webowe',
  };
  const descriptions: Record<string, string> = {
    en: 'Digital Product Builder specializing in websites, landing pages, web apps, fullstack development, and business automations. Fast delivery, clean UX, real results.',
    fr: 'Créatrice de produits digitaux : sites web, landing pages, applications web, fullstack development et automatisations. Livraison rapide, UX soignée, résultats concrets.',
    pl: 'Tworzę strony internetowe, landing page, aplikacje webowe, fullstack development i automatyzacje. Szybka realizacja, czyste UX i realne efekty biznesowe.',
  };
  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    alternates: {
      canonical: absUrl(`/${locale}`),
      languages: localeLanguages()
    }
  };
}

export default function Home() {
  return <StudioGlass />;
}
