import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getPathname } from './navigation';
import { routing } from './routing';

export const getLocalizedAlternates = (
  href: string,
  locale: Locale,
): NonNullable<Metadata['alternates']> => {
  const languages = Object.fromEntries(
    routing.locales.map((supportedLocale) => [
      supportedLocale,
      getPathname({ href, locale: supportedLocale }),
    ]),
  );

  return {
    canonical: getPathname({ href, locale }),
    languages: {
      ...languages,
      'x-default': getPathname({ href, locale: routing.defaultLocale }),
    },
  };
};
