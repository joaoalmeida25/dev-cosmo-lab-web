import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderLocalized } from '../../../../../test/render-localized';
import { mapCatalogCard } from '../../mappers/catalog-card/catalog-card.mapper';
import { createTranslator } from 'next-intl';
import catalog from '@/messages/pt-BR/catalog.json';
import { productsRepository } from '@/features/products/repositories/products/products.repository';
import { ProductGrid } from './product-grid.component';

vi.mock('@/i18n/navigation', () => import('../../../../../test/navigation-mock'));

describe('ProductGrid - Unit Test', () => {
  it('Should retain product order and distinguish public links from unavailable articles', async () => {
    // Given: the validated static catalog mapped to its public card contract.
    const products = await productsRepository.getAllProducts();
    const t = createTranslator({ locale: 'pt-BR', messages: catalog });
    const cards = products.map((product) =>
      mapCatalogCard(
        {
          ...product,
          content: product.content['pt-BR'],
          cover: product.media.cover,
          priceCents: product.commercial.priceCents,
          currency: 'BRL',
        },
        'pt-BR',
        t,
        catalog.categories,
        catalog.productTypes,
      ),
    );

    // When: rendering the independently owned grid.
    renderLocalized(<ProductGrid products={cards} />);

    // Then: source order and availability determine the real navigation contract.
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(cards.map(({ name }) => name));
    expect(screen.getByRole('link', { name: 'Propostas em Dia' })).toHaveAttribute(
      'href',
      '/products/propostas-em-dia',
    );
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('Should produce no fictitious product when the grid receives an empty collection', () => {
    // Given: no products supplied to the grid.
    const products: ReadonlyArray<never> = [];

    // When: rendering its empty input contract.
    renderLocalized(<ProductGrid products={products} />);

    // Then: empty-state decisions stay with the catalog owner.
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
