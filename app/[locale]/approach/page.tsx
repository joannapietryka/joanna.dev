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
  const path = '/approach';
  const titles: Record<string, string> = {
    en: 'Approach — Building Websites, Web Apps & Automations | Joanna Dev',
    fr: 'Approche — Sites web, apps web & automatisations | Joanna Dev',
    pl: 'Podejście — strony internetowe, aplikacje webowe, automatyzacje | Joanna Dev',
  };
  const descriptions: Record<string, string> = {
    en: 'How I build websites, landing pages, web apps, fullstack products, and automations. Coming soon.',
    fr: 'Comment je construis sites web, landing pages, applications web, produits fullstack et automatisations. Bientôt disponible.',
    pl: 'Jak buduję strony internetowe, landing page, aplikacje webowe, fullstack development i automatyzacje. Wkrótce.',
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

export default function ApproachPage() {
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
          Approach
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
