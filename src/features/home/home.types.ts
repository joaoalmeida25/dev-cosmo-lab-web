import type { IProductImages } from '@/features/products/products.types';

export interface IHomeFeaturedProduct {
  name: string;
  description: string;
  imageAlt: string;
  images: IProductImages;
}
