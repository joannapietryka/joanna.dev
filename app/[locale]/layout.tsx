import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

import {routing} from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale: localeParam} = await params;

  // Basic guard: if someone hits an unsupported locale, fall back to default.
  // (The middleware should prevent this, but it keeps rendering stable.)
  const locale = routing.locales.includes(localeParam as any)
    ? localeParam
    : routing.defaultLocale;

  const messages = await getMessages({locale});

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

