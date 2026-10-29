import type {Metadata} from 'next';
import {SiteFooter} from '../../_components/site-footer/SiteFooter';
import {SiteNav} from '../../_components/site-nav/SiteNav';
import {absUrl, localeLanguages} from '../../_lib/site';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const path = '/journal';
  const titles: Record<string, string> = {
    en: 'Journal — Websites, Web Apps & Automations | Joanna Dev',
    fr: 'Journal — Sites web, apps web & automatisations | Joanna Dev',
    pl: 'Journal — strony internetowe, aplikacje webowe, automatyzacje | Joanna Dev',
  };
  const descriptions: Record<string, string> = {
    en: 'Notes on websites, landing pages, web apps, fullstack development, and automations. Coming soon.',
    fr: 'Notes sur les sites web, landing pages, applications web, fullstack development et automatisations. Bientôt disponible.',
    pl: 'Notatki o stronach internetowych, landing page, aplikacjach webowych, fullstack development i automatyzacjach. Wkrótce.',
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

export default function JournalPage() {
  return (
    <>
      <SiteNav />
      <div
        style={{
          padding: '8rem 3rem 3rem',
          fontFamily: 'var(--font-sora)',
          fontSize: '0.9rem'
        }}
      >
        <p
          style={{
            opacity: 0.45,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: '0.65rem'
          }}
        >
          Journal
        </p>
        <h1
          style={{
            marginTop: '1rem',
            fontSize: '3rem',
            fontWeight: 900,
            letterSpacing: '-0.04em'
          }}
        >
          Coming soon
        </h1>
      </div>
      <SiteFooter />
    </>
  );
}
