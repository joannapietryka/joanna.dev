import type {Metadata} from 'next';
import {SiteNav} from '../../_components/site-nav/SiteNav';

export function generateMetadata({
  params
}: {
  params: {locale: string};
}): Metadata {
  const isFr = params.locale === 'fr';
  const path = '/approach';
  return {
    title: isFr ? 'Approche — joanna.dev' : 'Approach — joanna.dev',
    description: isFr ? 'Approche (bientôt disponible).' : 'Approach (coming soon).',
    alternates: {
      canonical: isFr ? `/fr${path}` : path,
      languages: {en: path, fr: `/fr${path}`}
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
    </>
  );
}

