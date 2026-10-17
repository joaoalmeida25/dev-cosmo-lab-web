import type { ProductStatus } from '../../products/products.types';
import { PRICE_RANGES } from './catalog-query.util';
import type {
  CatalogFilterKey,
  ICatalogFilters,
  ICatalogProduct,
  PriceRange,
} from '../catalog.types';

export const normalizeCatalogText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

// Integer cent boundaries are exhaustive and mutually exclusive; null is never free.
export const matchesPriceRange = (price: number | null, range: PriceRange): boolean => {
  switch (range) {
    case 'all':
      return true;
    case 'undefined':
      return price === null;
    case 'free':
      return price === 0;
    case 'up-to-50':
      return price !== null && price > 0 && price <= 5000;
    case '50-to-200':
      return price !== null && price > 5000 && price <= 20000;
    case 'over-200':
      return price !== null && price > 20000;
  }
};

export const filterCatalogProducts = (
  products: ReadonlyArray<ICatalogProduct>,
  filters: ICatalogFilters,
  taxonomy: {
    categories: Readonly<Record<string, string>>;
    types: Readonly<Record<string, string>>;
  },
): Array<ICatalogProduct> => {
  const query = normalizeCatalogText(filters.q);
  return products.filter((product) => {
    const searchable = [
      product.name,
      product.content.subtitle,
      product.content.shortDescription,
      product.content.description,
      taxonomy.categories[product.category],
      taxonomy.types[product.type],
    ].join(' ');
    return (
      (!query || normalizeCatalogText(searchable).includes(query)) &&
      (filters.category === 'all' || product.category === filters.category) &&
      (filters.status === 'all' || product.status === filters.status) &&
      (filters.type === 'all' || product.type === filters.type) &&
      matchesPriceRange(product.priceCents, filters.price)
    );
  });
};

const STATUS_PRIORITY: Readonly<Record<ProductStatus, number>> = {
  available: 0,
  'in-development': 1,
  planned: 2,
};

export const sortCatalogProducts = (
  products: ReadonlyArray<ICatalogProduct>,
  filters: ICatalogFilters,
  locale: string,
): Array<ICatalogProduct> => {
  const collator = new Intl.Collator(locale, { sensitivity: 'base', numeric: true });
  return [...products].sort((a, b) => {
    const tie = a.editorialOrder - b.editorialOrder || a.id.localeCompare(b.id);
    switch (filters.sort) {
      case 'name-asc':
        return collator.compare(a.name, b.name) || tie;
      case 'name-desc':
        return collator.compare(b.name, a.name) || tie;
      case 'price-asc':
      case 'price-desc': {
        if (a.priceCents === null) return b.priceCents === null ? tie : 1;
        if (b.priceCents === null) return -1;
        return (
          (filters.sort === 'price-asc'
            ? a.priceCents - b.priceCents
            : b.priceCents - a.priceCents) || tie
        );
      }
      case 'editorial':
        return STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status] || tie;
    }
  });
};

export const countCatalogFacet = (
  products: ReadonlyArray<ICatalogProduct>,
  filters: ICatalogFilters,
  key: CatalogFilterKey,
  value: string,
  taxonomy: {
    categories: Readonly<Record<string, string>>;
    types: Readonly<Record<string, string>>;
  },
): number => {
  const candidates = filterCatalogProducts(products, { ...filters, [key]: 'all' }, taxonomy);
  if (key === 'price') {
    const range = PRICE_RANGES.find((candidate) => candidate === value);
    return range
      ? candidates.filter((product) => matchesPriceRange(product.priceCents, range)).length
      : 0;
  }
  return candidates.filter((product) => value === 'all' || product[key] === value).length;
};
