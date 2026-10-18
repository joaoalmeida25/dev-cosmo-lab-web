import { PRODUCT_CATEGORIES, PRODUCT_STATUSES, PRODUCT_TYPES } from '../products.constants';
import type {
  IProduct,
  IProductContent,
  IProductDetailContent,
  IProductSpecifications,
  IProductMedia,
} from '../products.types';

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

const member = <const T extends string>(value: unknown, values: ReadonlyArray<T>): T => {
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

  if (!/^\/assets\/devcosmo\/products\/(?:[a-z0-9]+-)*[a-z0-9]+\/[a-z0-9-]+\.webp$/.test(path))
    throw new Error('Invalid product asset');

  return path;
};

const optionalText = (value: unknown): string | undefined =>
  value === undefined ? undefined : nonempty(value);

const nonempty = (value: unknown): string => {
  const text = string(value);

  if (!text.trim()) throw new Error('Empty product detail');

  return text;
};

const list = <T>(value: unknown, map: (item: unknown) => T): ReadonlyArray<T> => {
  if (!Array.isArray(value)) throw new Error('Invalid product detail list');

  return value.map(map);
};

const detailContent = (value: unknown): IProductDetailContent | undefined => {
  if (value === undefined) return undefined;

  const raw = object(value);
  const faq =
    raw.faq === undefined
      ? undefined
      : list(raw.faq, (item) => {
          const entry = object(item);

          return { question: nonempty(entry.question), answer: nonempty(entry.answer) };
        });

  if (faq && faq.length > 5) throw new Error('Too many product questions');

  const seo = raw.seo === undefined ? undefined : object(raw.seo);

  return {
    includedIntroduction: optionalText(raw.includedIntroduction),
    galleryAlts: list(raw.galleryAlts, nonempty),
    steps:
      raw.steps === undefined
        ? undefined
        : list(raw.steps, (item) => {
            const step = object(item);

            return { title: nonempty(step.title), description: optionalText(step.description) };
          }),
    faq,
    seo: seo ? { title: nonempty(seo.title), description: nonempty(seo.description) } : undefined,
  };
};

const specifications = (value: unknown): IProductSpecifications | undefined => {
  if (value === undefined) return undefined;

  const raw = object(value);

  return {
    format: raw.format === undefined ? undefined : member(raw.format, ['digital-files']),
    platform:
      raw.platform === undefined ? undefined : member(raw.platform, ['web', 'desktop', 'mobile']),
    delivery: raw.delivery === undefined ? undefined : member(raw.delivery, ['download']),
    languages:
      raw.languages === undefined
        ? undefined
        : list(raw.languages, (item) => member(item, ['pt-BR', 'en', 'es'])),
    compatibility:
      raw.compatibility === undefined
        ? undefined
        : list(raw.compatibility, (item) => member(item, ['excel', 'google-sheets', 'webgl'])),
    license:
      raw.license === undefined
        ? undefined
        : member(raw.license, ['personal', 'commercial', 'polyform-noncommercial']),
  };
};

const media = (value: unknown): IProductMedia => {
  const raw = object(value);

  if ('dark' in raw || 'light' in raw)
    throw new Error('Theme-specific product media is unsupported');

  const gallery = list(raw.gallery, asset);

  if (new Set(gallery).size !== gallery.length) throw new Error('Duplicate product media');

  return {
    cover: raw.cover === null ? null : asset(raw.cover),
    featured: raw.featured === null ? null : asset(raw.featured),
    gallery,
  };
};

const content = (value: unknown): IProductContent => {
  const raw = object(value);

  return {
    subtitle: string(raw.subtitle),
    shortDescription: string(raw.shortDescription),
    description: string(raw.description),
    featuredDescription: optionalText(raw.featuredDescription),
    highlights: strings(raw.highlights),
    materials: strings(raw.materials),
    imageAlt: string(raw.imageAlt),
    details: detailContent(raw.details),
  };
};

export const mapProduct = (value: unknown): IProduct => {
  const raw = object(value);
  const localized = object(raw.content);
  const commercial = object(raw.commercial);

  if ('images' in raw || 'gallery' in raw) throw new Error('Legacy product media is unsupported');

  const productMedia = media(raw.media);
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

  const details = raw.details === undefined ? undefined : object(raw.details);
  const accessUrl = details?.accessUrl === undefined ? undefined : httpsUrl(details.accessUrl);

  if (status !== 'available' && accessUrl)
    throw new Error('Unavailable product cannot have access');

  const translations = {
    'pt-BR': content(localized['pt-BR']),
    en: content(localized.en),
    es: content(localized.es),
  };
  for (const translation of Object.values(translations)) {
    if ((productMedia.cover || productMedia.featured) && !translation.imageAlt.trim())
      throw new Error('Missing localized product image description');

    if (
      (translation.details &&
        translation.details.galleryAlts.length !== productMedia.gallery.length) ||
      (!translation.details && productMedia.gallery.length > 0)
    )
      throw new Error('Missing localized gallery descriptions');
  }

  return {
    id,
    slug,
    name: string(raw.name),
    category: member(raw.category, PRODUCT_CATEGORIES),
    type: member(raw.type, PRODUCT_TYPES),
    status,
    editorialOrder: raw.editorialOrder,
    sourceUrl: httpsUrl(raw.sourceUrl),
    media: productMedia,
    details: details
      ? { specifications: specifications(details.specifications), accessUrl }
      : undefined,
    commercial: {
      priceCents,
      currency: 'BRL',
      verifiedAt,
      checkoutUrl: commercial.checkoutUrl === null ? null : httpsUrl(commercial.checkoutUrl),
    },
    content: translations,
  };
};
