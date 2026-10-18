import assert from 'node:assert/strict';
import { test } from 'node:test';
import { productsRepository } from '../../products/repositories/products.repository';
import type { ICatalogFilters, ICatalogProduct } from '../catalog.types';
import {
  DEFAULT_CATALOG_FILTERS,
  PRICE_RANGES,
  parseCatalogQuery,
  serializeCatalogQuery,
} from './catalog-query.util';
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

test('search covers names, subtitle, descriptions, category and type without accents or case', async () => {
  const products = await collection();
  for (const [q, count] of [
    ['PROPOSTAS', 1],
    ['orcamentos', 1],
    ['negociacoes', 1],
    ['GESTAO', 2],
    ['biblioteca de desenvolvimento', 0],
    ['', 3],
    ['   ', 3],
    ['inexistente', 0],
  ] satisfies ReadonlyArray<[string, number]>) {
    assert.equal(filterCatalogProducts(products, query({ q }), taxonomy).length, count, q);
  }
  assert.equal(normalizeCatalogText(' ÁÇÃO '), 'acao');
});
test('each category, status, type and price facet reflects the real collection', async () => {
  const products = await collection();
  for (const [patch, count] of [
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
  ] satisfies ReadonlyArray<[Partial<ICatalogFilters>, number]>)
    assert.equal(
      filterCatalogProducts(products, query(patch), taxonomy).length,
      count,
      JSON.stringify(patch),
    );
});
test('search and all four filters combine, reset and do not mutate source data', async () => {
  const products = await collection();
  const snapshot = structuredClone(products);
  for (const patch of [
    { category: 'productivity', status: 'in-development' },
    { category: 'productivity', status: 'in-development', type: 'application' },
    {
      q: 'pendencias',
      category: 'productivity',
      status: 'in-development',
      type: 'application',
      price: 'undefined',
    },
  ] satisfies ReadonlyArray<Partial<ICatalogFilters>>) {
    assert.deepEqual(
      filterCatalogProducts(products, query(patch), taxonomy).map(({ id }) => id),
      ['followup-inbox'],
    );
  }
  assert.equal(
    filterCatalogProducts(products, query({ category: 'wellbeing', status: 'available' }), taxonomy)
      .length,
    0,
  );
  assert.equal(filterCatalogProducts(products, DEFAULT_CATALOG_FILTERS, taxonomy).length, 3);
  assert.equal(
    countCatalogFacet(
      products,
      query({ status: 'in-development' }),
      'category',
      'productivity',
      taxonomy,
    ),
    1,
  );
  sortCatalogProducts(products, query({ sort: 'name-desc' }), 'pt-BR');
  assert.deepEqual(products, snapshot);
});
test('integer price boundaries are exclusive and null never matches free', () => {
  for (const [price, expected] of [
    [null, 'undefined'],
    [0, 'free'],
    [1, 'up-to-50'],
    [2990, 'up-to-50'],
    [5000, 'up-to-50'],
    [5001, '50-to-200'],
    [20000, '50-to-200'],
    [20001, 'over-200'],
  ] satisfies ReadonlyArray<[number | null, string]>) {
    assert.deepEqual(
      PRICE_RANGES.filter((range) => range !== 'all' && matchesPriceRange(price, range)),
      [expected],
    );
  }
});
test('default and legacy editorial URLs put ready products first in every locale', async () => {
  const products = await collection();
  const snapshot = structuredClone(products);
  const expected = ['propostas-em-dia', 'followup-inbox', 'hoje-cabe'];
  for (const locale of ['pt-BR', 'en', 'es']) {
    for (const params of ['', 'sort=editorial']) {
      const filters = parseCatalogQuery(new URLSearchParams(params));
      assert.equal(filters.sort, DEFAULT_CATALOG_FILTERS.sort);
      assert.deepEqual(
        sortCatalogProducts([...products].reverse(), filters, locale).map(({ id }) => id),
        expected,
      );
    }
  }
  assert.deepEqual(products, snapshot);
});
test('ready-first prioritizes status, then editorial order, then ID', async () => {
  const [base] = await collection();
  assert.ok(base);
  const fixtures: Array<ICatalogProduct> = [
    { ...base, id: 'planned', status: 'planned', editorialOrder: 0 },
    { ...base, id: 'development-b', status: 'in-development', editorialOrder: 2 },
    { ...base, id: 'available', status: 'available', editorialOrder: 99 },
    { ...base, id: 'development-a', status: 'in-development', editorialOrder: 2 },
    { ...base, id: 'development-first', status: 'in-development', editorialOrder: 1 },
  ];
  const snapshot = structuredClone(fixtures);
  const expected = ['available', 'development-first', 'development-a', 'development-b', 'planned'];
  for (const input of [fixtures, [...fixtures].reverse()]) {
    assert.deepEqual(
      sortCatalogProducts(input, DEFAULT_CATALOG_FILTERS, 'pt-BR').map(({ id }) => id),
      expected,
    );
  }
  assert.deepEqual(fixtures, snapshot);
});
test('all sorts are deterministic; unknown prices stay last in both price directions', async () => {
  const products = await collection();
  assert.deepEqual(
    sortCatalogProducts(products, query({ sort: 'name-asc' }), 'pt-BR').map(({ name }) => name),
    ['FollowUp Inbox', 'Hoje Cabe', 'Propostas em Dia'],
  );
  assert.deepEqual(
    sortCatalogProducts(products, query({ sort: 'name-desc' }), 'pt-BR').map(({ name }) => name),
    ['Propostas em Dia', 'Hoje Cabe', 'FollowUp Inbox'],
  );
  const [base] = products;
  assert.ok(base);
  const prices = [20001, null, 0, 5000, 5001, null];
  const fixtures = prices.map((priceCents, index) => ({
    ...base,
    id: `fixture-${index}`,
    editorialOrder: index,
    priceCents,
  }));
  assert.deepEqual(
    sortCatalogProducts(fixtures, query({ sort: 'price-asc' }), 'pt-BR').map(
      ({ priceCents }) => priceCents,
    ),
    [0, 5000, 5001, 20001, null, null],
  );
  assert.deepEqual(
    sortCatalogProducts(fixtures, query({ sort: 'price-desc' }), 'pt-BR').map(
      ({ priceCents }) => priceCents,
    ),
    [20001, 5001, 5000, 0, null, null],
  );
  assert.deepEqual(
    sortCatalogProducts([...fixtures].reverse(), query({ sort: 'price-asc' }), 'pt-BR').map(
      ({ id }) => id,
    ),
    ['fixture-2', 'fixture-3', 'fixture-4', 'fixture-0', 'fixture-1', 'fixture-5'],
  );
  const ties = fixtures.map((p) => ({
    ...p,
    priceCents: 5000,
    editorialOrder: 1,
    name: 'Same name',
  }));
  assert.deepEqual(
    sortCatalogProducts([...ties].reverse(), query({ sort: 'name-asc' }), 'pt-BR').map(
      ({ id }) => id,
    ),
    ties.map(({ id }) => id),
  );
});
test('URL state round-trips, omits defaults, bounds search and ignores invalid values', () => {
  const filters = query({
    q: 'gestão & café',
    category: 'productivity',
    status: 'in-development',
    type: 'application',
    price: 'undefined',
    sort: 'name-desc',
  });
  assert.deepEqual(parseCatalogQuery(new URLSearchParams(serializeCatalogQuery(filters))), filters);
  assert.equal(serializeCatalogQuery(DEFAULT_CATALOG_FILTERS), '');
  assert.deepEqual(
    parseCatalogQuery(
      new URLSearchParams(
        'category=unknown&status=invalid&type=bad&price=zero&sort=evil&ignored=1',
      ),
    ),
    DEFAULT_CATALOG_FILTERS,
  );
  assert.equal(parseCatalogQuery(new URLSearchParams({ q: 'a'.repeat(300) })).q.length, 240);
  assert.equal(
    parseCatalogQuery(new URLSearchParams('category=productivity&category=wellbeing')).category,
    'productivity',
  );
});
