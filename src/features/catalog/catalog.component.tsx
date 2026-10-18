import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { productsRepository } from '@/features/products/repositories/products.repository';
import { CatalogHero } from './components/catalog-hero/catalog-hero.component';
import type { ICatalogFilters } from './catalog.types';
import { CatalogBrowser } from './catalog-browser.component';
import { Fragment } from 'react';

interface ICatalogProps {
  filters: ICatalogFilters;
}

export const Catalog = async ({ filters }: ICatalogProps) => {
  const [requestedLocale, messages, products] = await Promise.all([
    getLocale(),
    getMessages(),
    productsRepository.getAllProducts(),
  ]);
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;
  const localizedProducts = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    type: product.type,
    status: product.status,
    editorialOrder: product.editorialOrder,
    content: product.content[locale],
    cover: product.media.cover,
    priceCents: product.commercial.priceCents,
    currency: product.commercial.currency,
  }));

  return (
    <Fragment>
      <CatalogHero />
      <NextIntlClientProvider messages={{ catalog: messages.catalog }}>
        <CatalogBrowser filters={filters} products={localizedProducts} locale={locale} />
      </NextIntlClientProvider>
    </Fragment>
  );
};
