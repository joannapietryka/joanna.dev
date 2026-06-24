import type {Metadata} from 'next';
import {StudioGlass} from '../_components/studio-glass/StudioGlass';
import {absUrl} from '../_lib/site';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const isFr = locale === 'fr';
  const canonicalPath = isFr ? '/fr' : '/en';
  return {
    title: 'Joanna Dev - Digital Product Builder',
    description: isFr ? 'Joanna Dev – Créatrice de produits digitaux' : 'Joanna Dev – Digital Product Builder',
    alternates: {
      canonical: absUrl(canonicalPath),
      languages: {
        en: absUrl('/en'),
        fr: absUrl('/fr'),
        'x-default': absUrl('/en')
      }
    }
  };
}

export default function Home() {
  return <StudioGlass />;
}

