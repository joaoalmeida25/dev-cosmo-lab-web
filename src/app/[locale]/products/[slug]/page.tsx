import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { ProductDetails } from '@/features/product-details/product-details.component';
import { productsRepository } from '@/features/products/repositories/products/products.repository';
import { getLocalizedAlternates, OPEN_GRAPH_IMAGE } from '@/i18n/metadata/metadata.util';
import { routing } from '@/i18n/routing';

export const generateMetadata = async ({
  params,
}: PageProps<'/[locale]/products/[slug]'>): Promise<Metadata> => {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const product = await productsRepository.getProductBySlug(slug);

  if (!product || product.status !== 'available') {
    notFound();
  }

  const content = product.content[locale];
  const title = content.details?.seo?.title ?? product.name;
  const description = content.details?.seo?.description ?? content.shortDescription;
  const alternates = getLocalizedAlternates(`/products/${product.slug}`, locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: 'website',
      images: [OPEN_GRAPH_IMAGE],
    },
  };
};

const ProductDetailsPage = async ({ params }: PageProps<'/[locale]/products/[slug]'>) => {
  const { slug } = await params;

  return <ProductDetails slug={slug} />;
};

export default ProductDetailsPage;
