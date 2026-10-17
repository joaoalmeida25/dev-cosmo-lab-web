import { PRODUCT_CATEGORIES, PRODUCT_STATUSES, PRODUCT_TYPES } from '../products.constants';
import type { IProduct, IProductContent } from '../products.types';

const object = (value: unknown): Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw new Error('Invalid product object');
  return value as Record<string, unknown>;
};
const string = (value: unknown): string => {
  if (typeof value !== 'string') throw new Error('Invalid product text');
  return value;
};
const strings = (value: unknown): ReadonlyArray<string> => {
  if (!Array.isArray(value)) throw new Error('Invalid product list');
  return value.map(string);
};
const member = <T extends string>(value: unknown, values: ReadonlyArray<T>): T => {
  const matched = values.find((candidate) => candidate === value);
  if (!matched) throw new Error('Invalid product taxonomy');
  return matched;
};
const httpsUrl = (value: unknown): string => {
  const url = new URL(string(value));
  if (url.protocol !== 'https:') throw new Error('Invalid product URL');
  return url.href;
};
const asset = (value: unknown): string => {
  const path = string(value);
  if (!path.startsWith('/assets/devcosmo/') || path.includes('..'))
    throw new Error('Invalid product asset');
  return path;
};
const content = (value: unknown): IProductContent => {
  const raw = object(value);
  return {
    subtitle: string(raw.subtitle),
    shortDescription: string(raw.shortDescription),
    description: string(raw.description),
    highlights: strings(raw.highlights),
    materials: strings(raw.materials),
    imageAlt: string(raw.imageAlt),
  };
};

export const mapProduct = (value: unknown): IProduct => {
  const raw = object(value);
  const localized = object(raw.content);
  const commercial = object(raw.commercial);
  const images = raw.images === null ? null : object(raw.images);
  const slug = string(raw.slug);
  const id = string(raw.id);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !id) throw new Error('Invalid product identity');
  if (typeof raw.editorialOrder !== 'number' || !Number.isSafeInteger(raw.editorialOrder))
    throw new Error('Invalid product order');
  const priceCents = commercial.priceCents;
  if (
    priceCents !== null &&
    (typeof priceCents !== 'number' || !Number.isSafeInteger(priceCents) || priceCents < 0)
  )
    throw new Error('Invalid product price');
  if (commercial.currency !== 'BRL') throw new Error('Unsupported product currency');
  const verifiedAt = commercial.verifiedAt === null ? null : string(commercial.verifiedAt);
  if (verifiedAt !== null && !/^\d{4}-\d{2}-\d{2}$/.test(verifiedAt))
    throw new Error('Invalid commercial verification date');
  if ((priceCents !== null || commercial.checkoutUrl !== null) && !verifiedAt)
    throw new Error('Unverified commercial information');
  const status = member(raw.status, PRODUCT_STATUSES);
  if (status !== 'available' && commercial.checkoutUrl !== null)
    throw new Error('Unavailable product cannot have a checkout');
  return {
    id,
    slug,
    name: string(raw.name),
    category: member(raw.category, PRODUCT_CATEGORIES),
    type: member(raw.type, PRODUCT_TYPES),
    status,
    editorialOrder: raw.editorialOrder,
    sourceUrl: httpsUrl(raw.sourceUrl),
    images: images ? { dark: asset(images.dark), light: asset(images.light) } : null,
    gallery: strings(raw.gallery).map(asset),
    commercial: {
      priceCents,
      currency: 'BRL',
      verifiedAt,
      checkoutUrl: commercial.checkoutUrl === null ? null : httpsUrl(commercial.checkoutUrl),
    },
    content: {
      'pt-BR': content(localized['pt-BR']),
      en: content(localized.en),
      es: content(localized.es),
    },
  };
};
