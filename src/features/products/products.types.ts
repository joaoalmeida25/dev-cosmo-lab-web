import type { SupportedLocale } from '@/i18n/locale.types';

export type ProductCategory = 'productivity' | 'wellbeing' | 'development';
export type ProductStatus = 'available' | 'planned' | 'in-development';
export type ProductType = 'digital-kit' | 'application' | 'development-library';

export interface IProductContent {
  subtitle: string;
  shortDescription: string;
  description: string;
  highlights: ReadonlyArray<string>;
  materials: ReadonlyArray<string>;
  imageAlt: string;
}

export interface IProductImages {
  dark: string;
  light: string;
}

export interface IProduct {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  type: ProductType;
  status: ProductStatus;
  editorialOrder: number;
  sourceUrl: string;
  images: IProductImages | null;
  gallery: ReadonlyArray<string>;
  commercial: {
    priceCents: number | null;
    currency: 'BRL';
    checkoutUrl: string | null;
    verifiedAt: string | null;
  };
  content: Record<SupportedLocale, IProductContent>;
}

export interface IProductsRepository {
  getAllProducts: () => Promise<ReadonlyArray<IProduct>>;
  getProductBySlug: (slug: string) => Promise<IProduct | null>;
}
