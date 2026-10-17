import { parseCatalogQuery } from '@/features/catalog/utils/catalog-query.util';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Catalog } from '@/features/catalog/catalog.component';
import { getLocalizedAlternates } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

export const generateMetadata = async ({
  params,
}: PageProps<'/[locale]/produtos'>): Promise<Metadata> => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'metadata.catalog' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: getLocalizedAlternates('/produtos', locale),
  };
};
const CatalogPage = async ({ searchParams }: PageProps<'/[locale]/produtos'>) => {
  const query = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') params.set(key, value);
    else if (value?.[0] !== undefined) params.set(key, value[0]);
  }
  return <Catalog filters={parseCatalogQuery(params)} />;
};
export default CatalogPage;
