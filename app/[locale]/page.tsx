import type {Metadata} from 'next';
import {StudioGlass} from '../_components/studio-glass/StudioGlass';

export function generateMetadata({
  params
}: {
  params: {locale: string};
}): Metadata {
  const isFr = params.locale === 'fr';
  return {
    title: 'joanna.dev',
    description: isFr ? 'joanna.dev – Créatrice de produits digitaux' : 'joanna.dev – Digital Product Builder',
    alternates: {
      canonical: isFr ? '/fr' : '/',
      languages: {
        en: '/',
        fr: '/fr'
      }
    }
  };
}

export default function Home() {
  return <StudioGlass />;
}

