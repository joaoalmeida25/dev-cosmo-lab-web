import type { Locale } from 'next-intl';
import { getPathname } from '../navigation';
import { routing } from '../routing';

export const METADATA_BASE = new URL('https://devcosmolab.com');

export const OPEN_GRAPH_IMAGE = {
  url: new URL('/assets/devcosmo/home/dark/hero-1200.webp', METADATA_BASE).href,
  width: 1200,
  height: 675,
};

export const getLocalizedAlternates = (
  href: string,
  locale: Locale,
): { canonical: string; languages: Record<string, string> } => {
  const languages = Object.fromEntries(
    routing.locales.map((supportedLocale) => [
      supportedLocale,
      new URL(getPathname({ href, locale: supportedLocale }), METADATA_BASE).href,
    ]),
  );

  return {
    canonical: new URL(getPathname({ href, locale }), METADATA_BASE).href,
    languages: {
      ...languages,
      'x-default': new URL(getPathname({ href, locale: routing.defaultLocale }), METADATA_BASE)
        .href,
    },
  };
};
