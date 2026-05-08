import type {Metadata} from 'next';
import {StudioGlass} from '../_components/studio-glass/StudioGlass';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const isFr = locale === 'fr';
  return {
    title: 'joanna.dev',
    description: isFr ? 'joanna.dev – Créatrice de produits digitaux' : 'joanna.dev – Digital Product Builder',
    alternates: {
      canonical: isFr ? '/fr' : '/en',
      languages: {
        en: '/en',
        fr: '/fr'
      }
    }
  };
}

export default function Home() {
  return <StudioGlass />;
}

