import { getLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { productsRepository } from '@/features/products/repositories/products/products.repository';
import { ProductDetailsView } from './product-details-view.component';

import { mapProductDetails } from './mappers/product-details/product-details.mapper';

interface IProductDetailsProps {
  slug: string;
}

export const ProductDetails = async ({ slug }: IProductDetailsProps) => {
  const [product, requestedLocale, t, catalog] = await Promise.all([
    productsRepository.getProductBySlug(slug),
    getLocale(),
    getTranslations('productDetails'),
    getTranslations('catalog'),
  ]);

  if (!product || product.status !== 'available' || !hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const viewProps = mapProductDetails(product, requestedLocale, t, catalog);

  return <ProductDetailsView {...viewProps} />;
};
