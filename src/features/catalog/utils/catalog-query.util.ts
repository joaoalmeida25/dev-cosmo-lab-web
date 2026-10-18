import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  PRODUCT_TYPES,
} from '../../products/products.constants';
import type { CatalogSort, ICatalogFilters, PriceRange } from '../catalog.types';

export const CATALOG_SORTS: ReadonlyArray<CatalogSort> = [
  'editorial',
  'name-asc',
  'name-desc',
  'price-asc',
  'price-desc',
];
export const PRICE_RANGES: ReadonlyArray<PriceRange> = [
  'all',
  'free',
  'up-to-50',
  '50-to-200',
  'over-200',
  'undefined',
];
export const DEFAULT_CATALOG_FILTERS: ICatalogFilters = {
  q: '',
  category: 'all',
  status: 'all',
  type: 'all',
  price: 'all',
  sort: 'editorial',
};

const select = <T extends string>(
  value: string | null,
  options: ReadonlyArray<T>,
  fallback: T,
): T => options.find((option) => option === value) ?? fallback;

export const parseCatalogQuery = (params: URLSearchParams): ICatalogFilters => ({
  q: (params.get('q') ?? '').slice(0, 240),
  category: select(params.get('category'), ['all', ...PRODUCT_CATEGORIES], 'all'),
  status: select(params.get('status'), ['all', ...PRODUCT_STATUSES], 'all'),
  type: select(params.get('type'), ['all', ...PRODUCT_TYPES], 'all'),
  price: select(params.get('price'), PRICE_RANGES, 'all'),
  sort: select(params.get('sort'), CATALOG_SORTS, 'editorial'),
});

export const serializeCatalogQuery = (filters: ICatalogFilters): string => {
  const params = new URLSearchParams();

  if (filters.q) params.set('q', filters.q);

  if (filters.category !== 'all') params.set('category', filters.category);

  if (filters.status !== 'all') params.set('status', filters.status);

  if (filters.type !== 'all') params.set('type', filters.type);

  if (filters.price !== 'all') params.set('price', filters.price);

  if (filters.sort !== 'editorial') params.set('sort', filters.sort);

  return params.toString();
};
