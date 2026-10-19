// @vitest-environment node

import { describe, expect, it } from 'vitest';
import {
  DEFAULT_CATALOG_FILTERS,
  parseCatalogQuery,
  serializeCatalogQuery,
} from './catalog-query.util';

describe('CatalogQuery - Unit Test', () => {
  it('Should round-trip every filter while omitting defaults and unrelated parameters', () => {
    // Given: localized search and every supported nondefault filter.
    const filters = {
      ...DEFAULT_CATALOG_FILTERS,
      q: 'gestão & café',
      category: 'productivity',
      status: 'available',
      type: 'digital-kit',
      price: 'up-to-50',
      sort: 'price-desc',
    } as const;

    // When: serializing and parsing the URL state.
    const serialized = serializeCatalogQuery(filters);
    const result = parseCatalogQuery(new URLSearchParams(serialized));
    const defaults = serializeCatalogQuery(DEFAULT_CATALOG_FILTERS);
    const unrelated = parseCatalogQuery(new URLSearchParams('ignored=1'));

    // Then: all fields survive and empty/default state stays canonical.
    expect(result).toEqual(filters);
    expect(defaults).toBe('');
    expect(unrelated).toEqual(DEFAULT_CATALOG_FILTERS);
  });

  it('Should bound search and ignore invalid, duplicate and unsafe option values', () => {
    // Given: user-controlled query parameters outside the supported contract.
    const params = new URLSearchParams({
      q: 'a'.repeat(300),
      category: '../bad',
      type: 'saas',
      status: 'published',
      price: '-1',
      sort: 'javascript:alert(1)',
    });

    params.append('category', 'productivity');

    // When: parsing the boundary.
    const result = parseCatalogQuery(params);

    // Then: search is bounded and the first invalid option falls back safely.
    expect(result).toEqual({ ...DEFAULT_CATALOG_FILTERS, q: 'a'.repeat(240) });
  });
});
