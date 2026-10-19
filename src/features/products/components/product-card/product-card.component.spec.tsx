import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderLocalized } from '../../../../../test/render-localized';
import { ProductCard } from './product-card.component';
import type { IProductCardPresentation } from './product-card.types';

vi.mock('@/i18n/navigation', () => import('../../../../../test/navigation-mock'));

const product: IProductCardPresentation = {
  id: 'kit',
  detailHref: '/products/propostas-em-dia',
  name: 'Propostas em Dia',
  subtitle: 'Digital kit',
  description: 'Organize commercial proposals',
  highlights: ['Spreadsheet'],
  highlightsLabel: 'Included',
  category: 'Productivity',
  type: 'Digital files',
  status: 'Available',
  stageNote: null,
  cover: '/assets/devcosmo/products/propostas-em-dia/capa.webp',
  imageAlt: 'Kit cover',
  priceLabel: 'R$ 29,90',
};

describe('ProductCard - Unit Test', () => {
  it('Should render an available product as a named localized link with meaningful media and price', () => {
    // Given: a presentation contract with a public detail destination.
    renderLocalized(<ProductCard product={product} />, 'en');

    // When: resolving the product by its heading and accessible card name.
    const card = screen.getByRole('link', { name: product.name });

    // Then: details are navigable and the product's confirmed information is exposed.
    expect(card).toHaveAttribute('href', '/en/products/propostas-em-dia');
    expect(screen.getByRole('img', { name: product.imageAlt })).toBeInTheDocument();
    expect(screen.getByText('Spreadsheet')).toBeInTheDocument();
    expect(screen.getByText('R$ 29,90')).toBeInTheDocument();
  });

  it('Should present unavailable products as articles without fictional links, cover or price', () => {
    // Given: a staged product with optional display content absent.
    const staged = {
      ...product,
      detailHref: null,
      cover: null,
      priceLabel: null,
      subtitle: '',
      stageNote: 'In development',
    };

    renderLocalized(<ProductCard product={staged} />);

    // When: reading the article's public contract.
    const card = screen.getByRole('article', { name: product.name });

    // Then: status guidance is visible without a dead purchase/detail destination.
    expect(card).toHaveTextContent('In development');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByText('R$ 29,90')).not.toBeInTheDocument();
  });
});
