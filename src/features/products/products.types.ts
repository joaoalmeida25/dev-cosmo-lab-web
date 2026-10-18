import type { SupportedLocale } from '@/i18n/locale.types';

export type ProductCategory = 'productivity' | 'wellbeing' | 'development';
export type ProductStatus = 'available' | 'planned' | 'in-development';
export type ProductType = 'digital-kit' | 'application' | 'development-library';

export interface IProductStep {
  title: string;
  description?: string;
}

export interface IProductFaqItem {
  question: string;
  answer: string;
}

export interface IProductDetailContent {
  includedIntroduction?: string;
  steps?: ReadonlyArray<IProductStep>;
  faq?: ReadonlyArray<IProductFaqItem>;
  galleryAlts: ReadonlyArray<string>;
  seo?: { title: string; description: string };
}

export interface IProductSpecifications {
  format?: 'digital-files';
  platform?: 'web' | 'desktop' | 'mobile';
  delivery?: 'download';
  languages?: ReadonlyArray<SupportedLocale>;
  compatibility?: ReadonlyArray<'excel' | 'google-sheets' | 'webgl'>;
  license?: 'personal' | 'commercial' | 'polyform-noncommercial';
}

export interface IProductMedia {
  cover: string | null;
  featured: string | null;
  gallery: ReadonlyArray<string>;
}

export interface IProductContent {
  subtitle: string;
  shortDescription: string;
  description: string;
  featuredDescription?: string;
  highlights: ReadonlyArray<string>;
  materials: ReadonlyArray<string>;
  imageAlt: string;
  details?: IProductDetailContent;
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
  media: IProductMedia;
  details?: {
    specifications?: IProductSpecifications;
    accessUrl?: string;
  };
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
