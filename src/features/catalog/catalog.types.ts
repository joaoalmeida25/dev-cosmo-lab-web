import type { SupportedLocale } from '@/i18n/locale.types';
import type {
  IProductContent,
  ProductCategory,
  ProductStatus,
  ProductType,
} from '../products/products.types';

export type PriceRange = 'all' | 'free' | 'up-to-50' | '50-to-200' | 'over-200' | 'undefined';
export type CatalogSort = 'editorial' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';
export type CatalogFilterKey = 'category' | 'status' | 'type' | 'price';
export interface ICatalogFilters {
  q: string;
  category: ProductCategory | 'all';
  status: ProductStatus | 'all';
  type: ProductType | 'all';
  price: PriceRange;
  sort: CatalogSort;
}
export interface ICatalogProduct {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  status: ProductStatus;
  type: ProductType;
  editorialOrder: number;
  content: IProductContent;
  cover: string | null;
  priceCents: number | null;
  currency: 'BRL';
}
export interface ICatalogLabels {
  updating: string;
  results: string;
  search: string;
  searchPlaceholder: string;
  clearSearch: string;
  sort: string;
  filters: string;
  clearAll: string;
  activeFilters: string;
  emptyTitle: string;
  emptyDescription: string;
}
export interface IFilterOption {
  value: string;
  label: string;
  count: number;
}
export interface IFilterGroup {
  key: CatalogFilterKey;
  label: string;
  selected: string;
  options: ReadonlyArray<IFilterOption>;
}
export interface ISortOption {
  value: CatalogSort;
  label: string;
  disabled: boolean;
}
export interface ICatalogBrowserProps {
  filters: ICatalogFilters;
  products: ReadonlyArray<ICatalogProduct>;
  locale: SupportedLocale;
}
