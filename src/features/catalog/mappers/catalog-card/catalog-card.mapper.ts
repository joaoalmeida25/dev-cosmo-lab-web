import type { MessageKeys, NestedKeyOf } from 'next-intl';
import type catalogMessages from '@/messages/en/catalog.json';
import type { SupportedLocale } from '@/i18n/locale.types';
import type { IProductCardPresentation } from '@/features/products/components/product-card/product-card.types';
import type { ICatalogProduct } from '../../catalog.types';

type Translate = (
  key: MessageKeys<typeof catalogMessages, NestedKeyOf<typeof catalogMessages>>,
) => string;

const HIGHLIGHT_KEYS = {
  available: 'card.highlights',
  planned: 'card.plannedHighlights',
  'in-development': 'card.developmentHighlights',
} as const;

const formatPrice = (
  product: ICatalogProduct,
  locale: SupportedLocale,
  t: Translate,
): string | null => {
  if (product.priceCents === null) {
    return null;
  }

  if (product.priceCents === 0) {
    return t('card.free');
  }

  return new Intl.NumberFormat(locale, { style: 'currency', currency: product.currency }).format(
    product.priceCents / 100,
  );
};

const getStageNote = (product: ICatalogProduct, t: Translate): string | null => {
  if (product.type === 'development-library') {
    return t('card.libraryNote');
  }

  switch (product.status) {
    case 'planned':
      return t('card.plannedNote');
    case 'in-development':
      return t('card.developmentNote');
    case 'available':
      return null;
  }
};

export const mapCatalogCard = (
  product: ICatalogProduct,
  locale: SupportedLocale,
  t: Translate,
  categories: Readonly<Record<string, string>>,
  types: Readonly<Record<string, string>>,
): IProductCardPresentation => ({
  id: product.id,
  detailHref: product.status === 'available' ? `/products/${product.slug}` : null,
  name: product.name,
  subtitle: product.content.subtitle,
  description: product.content.shortDescription,
  highlights: product.content.highlights,
  highlightsLabel: t(HIGHLIGHT_KEYS[product.status]),
  category: categories[product.category],
  type: types[product.type],
  status: t(`statuses.${product.status}`),
  stageNote: getStageNote(product, t),
  cover: product.cover,
  imageAlt: product.content.imageAlt,
  priceLabel: formatPrice(product, locale, t),
});
