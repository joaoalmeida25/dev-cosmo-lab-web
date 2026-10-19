// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { getLocalizedAlternates, METADATA_BASE, OPEN_GRAPH_IMAGE } from './metadata.util';

describe('Metadata - Unit Test', () => {
  it.each(['pt-BR', 'en', 'es'])(
    'Should generate canonical and locale alternates for %s without losing query or fragment',
    (locale) => {
      // Given: a catalog route with meaningful URL state.
      const href = '/products?q=kit#results';

      // When: building localized metadata through the actual next-intl pathname helper.
      const result = getLocalizedAlternates(href, locale);

      // Then: default Portuguese is unprefixed and all supported alternates remain explicit.
      const prefix = locale === 'pt-BR' ? '' : `/${locale}`;
      expect(result.canonical).toBe(`https://devcosmolab.com${prefix}${href}`);
      expect(result.languages).toEqual({
        'pt-BR': `https://devcosmolab.com${href}`,
        en: `https://devcosmolab.com/en${href}`,
        es: `https://devcosmolab.com/es${href}`,
        'x-default': `https://devcosmolab.com${href}`,
      });
      expect(METADATA_BASE.href).toBe('https://devcosmolab.com/');
      expect(OPEN_GRAPH_IMAGE).toEqual({
        url: 'https://devcosmolab.com/assets/devcosmo/home/dark/hero-1200.webp',
        width: 1200,
        height: 675,
      });
    },
  );
});
