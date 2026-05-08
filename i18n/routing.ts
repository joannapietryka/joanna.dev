export const routing = {
  locales: ["en", "fr"],
  defaultLocale: "en",
  // Always prefix locales, e.g. /en/services and /fr/services.
  localePrefix: "always",
} as const;

export type AppLocale = (typeof routing.locales)[number];

