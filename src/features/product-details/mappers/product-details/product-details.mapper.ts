import type { MessageKeys, NestedKeyOf } from 'next-intl';
import type detailMessages from '@/messages/en/product-details.json';
import type catalogMessages from '@/messages/en/catalog.json';
import type { SupportedLocale } from '@/i18n/locale.types';
import type { IProduct, IProductSpecifications } from '@/features/products/products.types';
import type { IProductGalleryItem } from '@/features/products/components/product-gallery/product-gallery.types';
import type { IProductDetailsViewProps } from '../../product-details.types';

type Translate<T> = (
  key: MessageKeys<T, NestedKeyOf<T>>,
  values?: Record<string, string | number>,
) => string;

export const mapProductDetails = (
  product: IProduct,
  requestedLocale: SupportedLocale,
  t: Translate<typeof detailMessages>,
  catalog: Translate<typeof catalogMessages>,
): IProductDetailsViewProps => {
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

      if (value === undefined || (typeof value !== 'string' && value.length === 0)) {
        return [];
      }

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
  const demonstrationUrl = product.details?.demonstrationUrl;
  const stageNote = product.type === 'development-library' ? catalog('card.libraryNote') : null;

  return {
    hero: {
      title: t('hero.title'),
      description: t('hero.description'),
      breadcrumb: t('breadcrumb'),
      products: t('products'),
    },
    summary: {
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
      demonstration: demonstrationUrl
        ? {
            href: demonstrationUrl,
            label: t('demonstration'),
            accessibleLabel: t('demonstrationLabel', { name: product.name }),
          }
        : null,
      specifications,
    },
    gallery: gallery,
    galleryLabels: {
      region: t('gallery.region'),
      previous: t('gallery.previous'),
      next: t('gallery.next'),
      select: t('gallery.select'),
      positions: gallery.map((_, index) =>
        t('gallery.position', { current: index + 1, total: gallery.length }),
      ),
      unavailable: t('gallery.unavailable'),
    },
    includedTitle: t(product.status === 'available' ? 'included' : 'plannedIncluded'),
    includedIntroduction: content.details?.includedIntroduction,
    materials: content.materials,
    stepsTitle: t(product.status === 'available' ? 'steps' : 'plannedSteps'),
    stepsIntroduction: t('stepsIntroduction'),
    steps: content.details?.steps ?? [],
    faqTitle: t('faq'),
    faqIntroduction: t('faqIntroduction'),
    faq: content.details?.faq ?? [],
  };
};
