import { getLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { HomeView } from './home-view.component';
import { FEATURED_PRODUCT_SLUG } from '@/features/products/products.constants';
import { productsRepository } from '@/features/products/repositories/products.repository';

export const Home = async () => {
  const [requestedLocale, product] = await Promise.all([
    getLocale(),
    productsRepository.getProductBySlug(FEATURED_PRODUCT_SLUG),
  ]);
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;
  if (!product) throw new Error('Featured product is missing');
  const content = product.content[locale];
  return (
    <HomeView
      product={{
        slug: product.slug,
        name: product.name,
        description: content.featuredDescription ?? content.shortDescription,
        imageAlt: content.imageAlt,
        featured: product.media.featured,
      }}
    />
  );
};
