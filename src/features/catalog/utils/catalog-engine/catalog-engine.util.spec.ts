// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { productsRepository } from '../../../products/repositories/products/products.repository';
import type { ICatalogFilters, ICatalogProduct } from '../../catalog.types';
import {
  DEFAULT_CATALOG_FILTERS,
  PRICE_RANGES,
  parseCatalogQuery,
  serializeCatalogQuery,
} from '../catalog-query/catalog-query.util';
import {
  countCatalogFacet,
  filterCatalogProducts,
  matchesPriceRange,
  normalizeCatalogText,
  sortCatalogProducts,
} from './catalog-engine.util';

const taxonomy = {
  categories: {
    productivity: 'Gestão e Produtividade',
    wellbeing: 'Alimentação e Bem-estar',
    development: 'Desenvolvimento e Tecnologia',
  },
  types: {
    'digital-kit': 'Kit digital',
    application: 'Aplicativo',
    'development-library': 'Biblioteca de desenvolvimento',
  },
};

const collection = async (): Promise<ReadonlyArray<ICatalogProduct>> =>
  (await productsRepository.getAllProducts()).map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    status: product.status,
    type: product.type,
    editorialOrder: product.editorialOrder,
    content: product.content['pt-BR'],
    cover: product.media.cover,
    priceCents: product.commercial.priceCents,
    currency: product.commercial.currency,
  }));

const query = (patch: Partial<ICatalogFilters>): ICatalogFilters => ({
  ...DEFAULT_CATALOG_FILTERS,
  ...patch,
});

describe('CatalogEngine - Unit Test', () => {
  it.each([
    ['PROPOSTAS', 1],
    ['orcamentos', 1],
    ['negociacoes', 1],
    ['GESTAO', 2],
    ['biblioteca de desenvolvimento', 0],
    ['', 3],
    ['   ', 3],
    ['inexistente', 0],
  ] as const)(
    'Should find %s across localized catalog fields with %i results',
    async (q, count) => {
      // Given: the approved product collection and a case/accent-insensitive search criterion.
      const products = await collection();

      // When: filtering the collection by the supplied search text.
      const result = filterCatalogProducts(products, query({ q }), taxonomy);
      const normalized = normalizeCatalogText(' ÁÇÃO ');

      // Then: search matches the relevant name, subtitle, description or taxonomy without accents.
      expect(result).toHaveLength(count);
      expect(normalized).toBe('acao');
    },
  );

  it.each([
    [{ category: 'productivity' }, 2],
    [{ category: 'wellbeing' }, 1],
    [{ category: 'development' }, 0],
    [{ status: 'available' }, 1],
    [{ status: 'planned' }, 1],
    [{ status: 'in-development' }, 1],
    [{ type: 'digital-kit' }, 1],
    [{ type: 'application' }, 2],
    [{ type: 'development-library' }, 0],
    [{ price: 'undefined' }, 2],
    [{ price: 'up-to-50' }, 1],
    [{ price: 'free' }, 0],
    [{ price: '50-to-200' }, 0],
    [{ price: 'over-200' }, 0],
  ] satisfies ReadonlyArray<[Partial<ICatalogFilters>, number]>)(
    'Should apply facet %j with %i matching products',
    async (patch, count) => {
      // Given: real products and one independently selected catalog facet.
      const products = await collection();
      const filters = query(patch);

      // When: applying that facet without other criteria.
      const result = filterCatalogProducts(products, filters, taxonomy);

      // Then: only products matching the selected category, status, type or price remain.
      expect(result).toHaveLength(count);
    },
  );

  it.each([
    { category: 'productivity', status: 'in-development' },
    { category: 'productivity', status: 'in-development', type: 'application' },
    {
      q: 'pendencias',
      category: 'productivity',
      status: 'in-development',
      type: 'application',
      price: 'undefined',
    },
  ] satisfies ReadonlyArray<Partial<ICatalogFilters>>)(
    'Should combine criteria %j without mutating the collection',
    async (patch) => {
      // Given: real products and increasingly specific criteria matching the same application.
      const products = await collection();
      const snapshot = structuredClone(products);

      // When: filtering, resetting, counting a facet and sorting the same source.
      const filtered = filterCatalogProducts(products, query(patch), taxonomy);
      const incompatible = filterCatalogProducts(
        products,
        query({ category: 'wellbeing', status: 'available' }),
        taxonomy,
      );

      const reset = filterCatalogProducts(products, DEFAULT_CATALOG_FILTERS, taxonomy);
      const count = countCatalogFacet(
        products,
        query({ status: 'in-development' }),
        'category',
        'productivity',
        taxonomy,
      );

      sortCatalogProducts(products, query({ sort: 'name-desc' }), 'pt-BR');

      // Then: combined criteria intersect, reset restores every product and source ordering stays intact.
      expect(filtered.map(({ id }) => id)).toEqual(['followup-inbox']);
      expect(incompatible).toHaveLength(0);
      expect(reset).toHaveLength(3);
      expect(count).toBe(1);
      expect(products).toEqual(snapshot);
    },
  );

  it.each([
    [null, 'undefined'],
    [0, 'free'],
    [1, 'up-to-50'],
    [2990, 'up-to-50'],
    [5000, 'up-to-50'],
    [5001, '50-to-200'],
    [20000, '50-to-200'],
    [20001, 'over-200'],
  ] as const)('Should assign price %s to the exclusive %s range', (price, expected) => {
    // Given: a price at a meaningful integer boundary, including missing and free values.
    const ranges = PRICE_RANGES.filter((range) => range !== 'all');

    // When: evaluating all specific price ranges against that value.
    const matches = ranges.filter((range) => matchesPriceRange(price, range));

    // Then: exactly one range matches without treating missing pricing as free.
    expect(matches).toEqual([expected]);
  });

  it.each(['pt-BR', 'en', 'es'])(
    'Should prioritize ready products for default and legacy URLs in %s',
    async (locale) => {
      // Given: the approved collection in reverse order and both canonical/legacy default URLs.
      const products = await collection();
      const snapshot = structuredClone(products);
      const urls = ['', 'sort=editorial'];

      // When: parsing the URLs and applying their default sort.
      const results = urls.map((params) => {
        const filters = parseCatalogQuery(new URLSearchParams(params));

        return {
          sort: filters.sort,
          ids: sortCatalogProducts([...products].reverse(), filters, locale).map(({ id }) => id),
        };
      });

      // Then: availability wins and every locale retains the canonical editorial ordering.
      expect(results).toEqual(
        urls.map(() => ({
          sort: DEFAULT_CATALOG_FILTERS.sort,
          ids: ['propostas-em-dia', 'followup-inbox', 'hoje-cabe'],
        })),
      );
      expect(products).toEqual(snapshot);
    },
  );

  it('Should resolve editorial ties by status, editorial position and stable identity', async () => {
    // Given: fixtures with deliberately conflicting status and editorial order.
    const [base] = await collection();
    const products: Array<ICatalogProduct> = [
      { ...base, id: 'planned', status: 'planned', editorialOrder: 0 },
      { ...base, id: 'development-b', status: 'in-development', editorialOrder: 2 },
      { ...base, id: 'available', status: 'available', editorialOrder: 99 },
      { ...base, id: 'development-a', status: 'in-development', editorialOrder: 2 },
      { ...base, id: 'development-first', status: 'in-development', editorialOrder: 1 },
    ];

    const snapshot = structuredClone(products);

    // When: sorting both the original and reversed collection.
    const results = [products, [...products].reverse()].map((input) =>
      sortCatalogProducts(input, DEFAULT_CATALOG_FILTERS, 'pt-BR').map(({ id }) => id),
    );

    // Then: availability outranks editorial position, identity breaks ties and input stays unchanged.
    expect(results).toEqual(
      Array.from({ length: 2 }, () => [
        'available',
        'development-first',
        'development-a',
        'development-b',
        'planned',
      ]),
    );
    expect(products).toEqual(snapshot);
  });

  it.each([
    ['name-asc', ['FollowUp Inbox', 'Hoje Cabe', 'Propostas em Dia']],
    ['name-desc', ['Propostas em Dia', 'Hoje Cabe', 'FollowUp Inbox']],
  ] as const)('Should sort product names using %s', async (sort, expected) => {
    // Given: the real collection and an explicit name sort direction.
    const products = await collection();

    // When: applying locale-aware name ordering.
    const names = sortCatalogProducts(products, query({ sort }), 'pt-BR').map(({ name }) => name);

    // Then: the chosen direction orders names deterministically.
    expect(names).toEqual(expected);
  });

  it.each([
    [
      'price-asc',
      [0, 5000, 5001, 20001, null, null],
      ['fixture-2', 'fixture-3', 'fixture-4', 'fixture-0', 'fixture-1', 'fixture-5'],
    ],
    [
      'price-desc',
      [20001, 5001, 5000, 0, null, null],
      ['fixture-0', 'fixture-4', 'fixture-3', 'fixture-2', 'fixture-1', 'fixture-5'],
    ],
  ] as const)(
    'Should put missing prices last with stable identity in %s',
    async (sort, expectedPrices, expectedIds) => {
      // Given: a reversed collection with free, paid and two missing prices.
      const [base] = await collection();
      const products = [20001, null, 0, 5000, 5001, null].map((priceCents, index) => ({
        ...base,
        id: `fixture-${index}`,
        editorialOrder: index,
        priceCents,
      }));

      // When: sorting prices in the requested direction.
      const result = sortCatalogProducts([...products].reverse(), query({ sort }), 'pt-BR');

      // Then: known prices follow direction and missing prices remain stably ordered at the end.
      expect(result.map(({ priceCents }) => priceCents)).toEqual(expectedPrices);
      expect(result.map(({ id }) => id)).toEqual(expectedIds);
    },
  );

  it.each(['name-asc', 'name-desc', 'price-asc', 'price-desc'] as const)(
    'Should resolve equal names and prices by stable identity for %s',
    async (sort) => {
      // Given: identical names, prices and editorial positions in reverse identity order.
      const [base] = await collection();
      const products = [
        { ...base, id: 'b', name: 'Same', priceCents: 100, editorialOrder: 1 },
        { ...base, id: 'a', name: 'Same', priceCents: 100, editorialOrder: 1 },
      ];

      // When: applying the requested sort direction.
      const ids = sortCatalogProducts(products, query({ sort }), 'en').map(({ id }) => id);

      // Then: ties retain the same deterministic identity order in all directions.
      expect(ids).toEqual(['a', 'b']);
    },
  );

  it('Should round-trip filters, omit defaults and safely bound untrusted URL state', () => {
    // Given: nondefault filters, invalid options, duplicate facets and an excessive query.
    const filters = query({
      q: 'gestão & café',
      category: 'productivity',
      status: 'in-development',
      type: 'application',
      price: 'undefined',
      sort: 'name-desc',
    });

    const invalid = new URLSearchParams(
      'category=unknown&status=invalid&type=bad&price=zero&sort=evil&ignored=1',
    );

    // When: serializing and parsing the distinct URL boundary inputs.
    const roundtrip = parseCatalogQuery(new URLSearchParams(serializeCatalogQuery(filters)));
    const defaults = serializeCatalogQuery(DEFAULT_CATALOG_FILTERS);
    const rejected = parseCatalogQuery(invalid);
    const bounded = parseCatalogQuery(new URLSearchParams({ q: 'a'.repeat(300) }));
    const duplicate = parseCatalogQuery(
      new URLSearchParams('category=productivity&category=wellbeing'),
    );

    // Then: valid filters survive, defaults disappear, invalid values fall back and the first duplicate wins.
    expect(roundtrip).toEqual(filters);
    expect(defaults).toBe('');
    expect(rejected).toEqual(DEFAULT_CATALOG_FILTERS);
    expect(bounded.q).toHaveLength(240);
    expect(duplicate.category).toBe('productivity');
  });

  it('Should count candidate price facets independently and reject unsupported facet values', async () => {
    // Given: the real collection currently filtered to free products.
    const products = await collection();
    const filters = query({ price: 'free' });

    // When: counting alternative price candidates and the all-category candidate.
    const paid = countCatalogFacet(products, filters, 'price', 'up-to-50', taxonomy);
    const missing = countCatalogFacet(products, filters, 'price', 'undefined', taxonomy);
    const unknown = countCatalogFacet(products, filters, 'price', 'invalid', taxonomy);
    const all = countCatalogFacet(products, query({}), 'category', 'all', taxonomy);

    // Then: only the counted facet is ignored, with unsupported values matching no products.
    expect(paid).toBe(1);
    expect(missing).toBe(2);
    expect(unknown).toBe(0);
    expect(all).toBe(3);
  });
});
