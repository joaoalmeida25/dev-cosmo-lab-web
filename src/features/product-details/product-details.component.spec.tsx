import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLocalized } from '../../../test/render-localized';
import { serverIntl } from '../../../test/server-intl';
import { ProductDetails } from './product-details.component';
import { productsRepository } from '@/features/products/repositories/products/products.repository';
vi.mock('next-intl/server', () => import('../../../test/server-intl'));
vi.mock('@/i18n/navigation', () => import('../../../test/navigation-mock'));
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));
describe('ProductDetails - Unit Test', () => {
  it.each(['pt-BR', 'en', 'es'])(
    'Should render available product details and retain valid commercial actions for %s',
    async (locale) => {
      // Given: the available kit and a supported server locale.
      serverIntl.locale = locale;
      const resolvedLocale = locale === 'en' || locale === 'es' ? locale : 'pt-BR';

      // When: the Controller loads, maps and renders its actual View and interactive children.
      renderLocalized(await ProductDetails({ slug: 'propostas-em-dia' }), resolvedLocale);

      // Then: the kit has one primary heading, real content sections and no fictional commercial destination.
      expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute(
        'id',
        'product-details-title',
      );
      expect(
        screen.getByRole('heading', { level: 2, name: 'Propostas em Dia' }),
      ).toBeInTheDocument();
      expect(screen.getAllByRole('region').length).toBeGreaterThan(1);
      expect(screen.getAllByRole('link').every((link) => link.getAttribute('href') !== '#')).toBe(
        true,
      );
      expect(screen.getByRole('navigation')).toHaveAccessibleName();
      expect(fetch).not.toHaveBeenCalled();
    },
  );
  it.each(['missing', 'hoje-cabe', 'followup-inbox'])(
    'Should delegate missing or unavailable product %s to the route not-found boundary',
    async (slug) => {
      // Given: a missing product or a product not approved for details publication.
      serverIntl.locale = 'en';

      // When: the Controller evaluates its publication guard.
      const result = ProductDetails({ slug });

      // Then: the framework not-found contract is invoked rather than exposing unavailable details.
      await expect(result).rejects.toThrow('NEXT_NOT_FOUND');
    },
  );
  it('Should reject unsupported locales instead of serving mismatched product content', async () => {
    // Given: an available product requested with an unsupported locale.
    serverIntl.locale = 'invalid';

    // When: the Controller evaluates locale eligibility.
    const result = ProductDetails({ slug: 'propostas-em-dia' });

    // Then: the request is delegated to the not-found boundary.
    await expect(result).rejects.toThrow('NEXT_NOT_FOUND');
  });
  it('Should preserve repository failures for the route error boundary', async () => {
    // Given: a supported locale and a failing product repository.
    serverIntl.locale = 'pt-BR';
    const error = new Error('Product unavailable');
    vi.spyOn(productsRepository, 'getProductBySlug').mockRejectedValueOnce(error);

    // When: the Controller attempts to load the product.
    const result = ProductDetails({ slug: 'propostas-em-dia' });

    // Then: the original error remains observable to the caller.
    await expect(result).rejects.toBe(error);
  });
});
