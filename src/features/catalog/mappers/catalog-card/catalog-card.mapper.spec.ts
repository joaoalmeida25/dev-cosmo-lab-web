// @vitest-environment node

import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import proposals from '@/features/products/data/propostas-em-dia.json';
import { mapProduct } from '@/features/products/mappers/product/product.mapper';
import pt from '@/messages/pt-BR/catalog.json';
import type { ICatalogProduct } from '../../catalog.types';
import { mapCatalogCard } from './catalog-card.mapper';

const raw = mapProduct(proposals);
const product: ICatalogProduct = {
  ...raw,
  content: raw.content['pt-BR'],
  cover: raw.media.cover,
  priceCents: raw.commercial.priceCents,
  currency: 'BRL',
};

const t = createTranslator({ locale: 'pt-BR', messages: pt });
const map = (patch: Partial<ICatalogProduct>) =>
  mapCatalogCard({ ...product, ...patch }, 'pt-BR', t, pt.categories, pt.productTypes);

describe('CatalogCard - Unit Test', () => {
  it('Should expose a detail destination and confirmed price for an available product', () => {
    // Given: validated data with confirmed commercial information.
    const value = product;

    // When: mapping it for the public catalog.
    const result = mapCatalogCard(value, 'pt-BR', t, pt.categories, pt.productTypes);

    // Then: the link, taxonomy, price and highlight wording match the confirmed product.
    expect(result.detailHref).toBe('/products/propostas-em-dia');
    expect(result.category).toBe(pt.categories.productivity);
    expect(result.priceLabel).toBe(
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(29.9),
    );
    expect(result.highlightsLabel).toBe(pt.card.highlights);
    expect(result.stageNote).toBeNull();
  });

  it.each([
    { status: 'planned', note: pt.card.plannedNote, highlights: pt.card.plannedHighlights },
    {
      status: 'in-development',
      note: pt.card.developmentNote,
      highlights: pt.card.developmentHighlights,
    },
  ] as const)(
    'Should withhold unavailable $status destinations and explain the corresponding stage',
    ({ status, note, highlights }) => {
      // Given: a catalog product in a non-public delivery stage.
      const value = { status, priceCents: null };

      // When: mapping its visible presentation.
      const result = map(value);

      // Then: no detail destination is fabricated and the stage is explained.
      expect(result.detailHref).toBeNull();
      expect(result.priceLabel).toBeNull();
      expect(result.stageNote).toBe(note);
      expect(result.highlightsLabel).toBe(highlights);
    },
  );

  it('Should identify free products and prioritize library guidance', () => {
    // Given: a free development library whose stage also has general guidance.
    const patch = { priceCents: 0, type: 'development-library', status: 'planned' } as const;

    // When: mapping its card.
    const result = map(patch);

    // Then: zero is free rather than unknown and library guidance wins.
    expect(result.priceLabel).toBe(pt.card.free);
    expect(result.stageNote).toBe(pt.card.libraryNote);
  });
});
