import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const candidate = await requestLocale;
  const normalized = candidate?.split('-')[0];
  const locale =
    normalized && routing.locales.includes(normalized as (typeof routing.locales)[number])
      ? (normalized as (typeof routing.locales)[number])
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

