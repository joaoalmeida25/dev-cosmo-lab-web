import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLocalized } from '../../../../../test/render-localized';
import { serverIntl } from '../../../../../test/server-intl';
import { FeaturedProduct } from './featured-product.component';
vi.mock('next-intl/server', () => import('../../../../../test/server-intl'));
vi.mock('@/i18n/navigation', () => import('../../../../../test/navigation-mock'));

describe('FeaturedProduct - Unit Test', () => {
  it.each(['pt-BR', 'en', 'es', 'invalid'])(
    'Should preserve product content and localize its destination for %s',
    async (locale) => {
      // Given: a featured product with approved copy and artwork, under the requested locale.
      serverIntl.locale = locale;
      const product = {
        slug: 'propostas-em-dia',
        name: 'Propostas em Dia',
        description: 'Organize proposals.',
        imageAlt: 'Three kit spreadsheets',
        featured: '/kit.webp',
      };

      // When: the Controller passes the product and translated benefits to its View.
      renderLocalized(await FeaturedProduct({ product }));

      // Then: the product remains a digital kit with the original artwork and a localized details link.
      expect(screen.getByRole('heading', { name: product.name })).toHaveProperty('tagName', 'H2');
      expect(screen.getByText(product.description)).toBeInTheDocument();
      expect(screen.getByRole('img', { name: product.imageAlt })).toHaveAttribute(
        'src',
        product.featured,
      );
      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        `${locale === 'en' || locale === 'es' ? `/${locale}` : ''}/products/${product.slug}`,
      );
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    },
  );
  it('Should keep the product explanation and action when featured artwork is absent', async () => {
    // Given: an otherwise complete featured product without optional artwork.
    serverIntl.locale = 'en';
    const product = {
      slug: 'kit',
      name: 'Digital kit',
      description: 'Ready materials',
      imageAlt: 'Kit',
      featured: null,
    };

    // When: the Controller renders this optional-media state.
    renderLocalized(await FeaturedProduct({ product }));

    // Then: no broken image is created and the meaningful product content remains available.
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/en/products/kit');
  });
});
