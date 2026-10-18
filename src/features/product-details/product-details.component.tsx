import { getLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { productsRepository } from '@/features/products/repositories/products.repository';
import type { IProductGalleryItem } from '@/features/products/components/product-gallery/product-gallery.types';
import type { IProductSpecifications } from '@/features/products/products.types';
import { ProductDetailsView } from './product-details-view.component';

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
  if (!product || product.status !== 'available' || !hasLocale(routing.locales, requestedLocale))
    notFound();
  const content = product.content[requestedLocale];
  const gallery: ReadonlyArray<IProductGalleryItem> = product.media.gallery.map((src, index) => ({
    src,
    alt: content.details?.galleryAlts[index] ?? content.imageAlt,
  }));
  const specs = product.details?.specifications;
  const specificationKeys: ReadonlyArray<keyof IProductSpecifications> = [
    'format',
    'platform',
    'delivery',
    'languages',
    'compatibility',
    'license',
  ];
  const specifications = [
    { label: t('specifications.category'), value: catalog(`categories.${product.category}`) },
    ...specificationKeys.flatMap((key) => {
      const value = specs?.[key];
      if (value === undefined || (Array.isArray(value) && !value.length)) return [];
      const values = typeof value === 'string' ? [value] : value;
      return [
        {
          label: t(`specifications.${key}`),
          value: values.map((entry) => t(`values.${entry}`)).join(', '),
        },
      ];
    }),
  ];
  const checkout = product.status === 'available' ? product.commercial.checkoutUrl : null;
  const access = product.status === 'available' ? product.details?.accessUrl : undefined;
  const actionUrl = checkout ?? access;
  const stageNote = product.type === 'development-library' ? catalog('card.libraryNote') : null;
  return (
    <ProductDetailsView
      hero={{
        title: t('hero.title'),
        description: t('hero.description'),
        breadcrumb: t('breadcrumb'),
        products: t('products'),
      }}
      summary={{
        name: product.name,
        type: catalog(`productTypes.${product.type}`),
        subtitle: content.subtitle,
        description: content.description,
        status: catalog(`statuses.${product.status}`),
        stageNote,
        price:
          product.status === 'available' && product.commercial.priceCents !== null
            ? new Intl.NumberFormat(requestedLocale, {
                style: 'currency',
                currency: product.commercial.currency,
              }).format(product.commercial.priceCents / 100)
            : null,
        action: actionUrl
          ? {
              href: actionUrl,
              label: t(checkout ? 'buy' : 'access'),
              accessibleLabel: t(checkout ? 'buyLabel' : 'accessLabel', { name: product.name }),
            }
          : null,
        specifications,
      }}
      gallery={gallery}
      galleryLabels={{
        region: t('gallery.region'),
        previous: t('gallery.previous'),
        next: t('gallery.next'),
        select: t('gallery.select'),
        positions: gallery.map((_, index) =>
          t('gallery.position', { current: index + 1, total: gallery.length }),
        ),
        unavailable: t('gallery.unavailable'),
      }}
      includedTitle={t(product.status === 'available' ? 'included' : 'plannedIncluded')}
      includedIntroduction={content.details?.includedIntroduction}
      materials={content.materials}
      stepsTitle={t(product.status === 'available' ? 'steps' : 'plannedSteps')}
      steps={content.details?.steps ?? []}
      faqTitle={t('faq')}
      faq={content.details?.faq ?? []}
    />
  );
};
