import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { productsRepository } from '@/features/products/repositories/products.repository';
import { getLocalizedAlternates } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';

interface IProductDetailsMetadataProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const generateProductDetailsMetadata = async ({
  params,
}: IProductDetailsMetadataProps): Promise<Metadata> => {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const product = await productsRepository.getProductBySlug(slug);
  if (!product || product.status !== 'available') notFound();
  const content = product.content[locale];
  const title = content.details?.seo?.title ?? `${product.name} | Dev Cosmo Lab`;
  const description = content.details?.seo?.description ?? content.shortDescription;
  const alternates = getLocalizedAlternates(`/produtos/${product.slug}`, locale);
  const image = product.media.cover ?? product.media.featured ?? product.media.gallery[0];
  return {
    title,
    description,
    alternates,
    openGraph: image
      ? {
          title,
          description,
          url: getPathname({ href: `/produtos/${product.slug}`, locale }),
          locale,
          type: 'website',
          images: [
            {
              url: image,
              alt:
                product.media.cover || product.media.featured
                  ? content.imageAlt
                  : content.details?.galleryAlts[0],
            },
          ],
        }
      : undefined,
  };
};
