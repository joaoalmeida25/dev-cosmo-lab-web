import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLocalized } from '../../../test/render-localized';
import { serverIntl } from '../../../test/server-intl';
import { Catalog } from './catalog.component';
import { DEFAULT_CATALOG_FILTERS } from './utils/catalog-query/catalog-query.util';
import { productsRepository } from '@/features/products/repositories/products/products.repository';
vi.mock('next-intl/server', () => import('../../../test/server-intl'));
vi.mock('@/i18n/navigation', () => import('../../../test/navigation-mock'));
vi.mock('./components/catalog-hero/catalog-hero.component', () => ({
  CatalogHero: () => <h1>Catalog introduction</h1>,
}));
// Resolve server-provider locale inheritance at the request boundary, retaining the real client provider.
vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();

  return {
    ...actual,
    NextIntlClientProvider: (props: React.ComponentProps<typeof actual.NextIntlClientProvider>) => {
      const inheritedLocale = ['en', 'es'].includes(serverIntl.locale)
        ? serverIntl.locale
        : 'pt-BR';

      return <actual.NextIntlClientProvider {...props} locale={props.locale ?? inheritedLocale} />;
    },
  };
});

describe('Catalog - Unit Test', () => {
  it.each(['pt-BR', 'en', 'es', 'invalid'])(
    'Should localize real products and honor initial URL search for %s',
    async (locale) => {
      // Given: the repository catalog and a committed search for the available kit.
      serverIntl.locale = locale;
      const resolvedLocale = locale === 'en' || locale === 'es' ? locale : 'pt-BR';

      // When: the server Controller maps products and renders the actual browser through its composition.
      renderLocalized(
        await Catalog({ filters: { ...DEFAULT_CATALOG_FILTERS, q: 'propostas' } }),
        resolvedLocale,
      );

      // Then: the initial search is preserved and the available result has the canonical localized destination.
      expect(screen.getByRole('searchbox')).toHaveValue('propostas');
      expect(screen.getByRole('link', { name: 'Propostas em Dia' })).toHaveAttribute(
        'href',
        `${resolvedLocale === 'pt-BR' ? '' : `/${resolvedLocale}`}/products/propostas-em-dia`,
      );
      expect(screen.queryByRole('article', { name: 'Hoje Cabe' })).not.toBeInTheDocument();
      expect(fetch).not.toHaveBeenCalled();
    },
  );
  it('Should propagate repository failures instead of presenting fabricated catalog data', async () => {
    // Given: an unavailable product repository.
    serverIntl.locale = 'en';
    const error = new Error('Catalog unavailable');
    vi.spyOn(productsRepository, 'getAllProducts').mockRejectedValueOnce(error);

    // When: the Controller attempts to load the catalog.
    const result = Catalog({ filters: DEFAULT_CATALOG_FILTERS });

    // Then: the failure reaches the existing route error boundary.
    await expect(result).rejects.toBe(error);
  });
});
