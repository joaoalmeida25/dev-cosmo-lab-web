import type { ProductCategory, ProductStatus, ProductType } from './products.types';

export const PRODUCT_CATEGORIES: ReadonlyArray<ProductCategory> = [
  'productivity',
  'wellbeing',
  'development',
];
export const PRODUCT_STATUSES: ReadonlyArray<ProductStatus> = [
  'available',
  'planned',
  'in-development',
];
export const PRODUCT_TYPES: ReadonlyArray<ProductType> = [
  'digital-kit',
  'application',
  'development-library',
];
export const FEATURED_PRODUCT_SLUG = 'propostas-em-dia';
