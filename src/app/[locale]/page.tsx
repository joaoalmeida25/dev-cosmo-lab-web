import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Home } from '@/features/home/home.component';
import { getLocalizedAlternates } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

export const generateMetadata = async ({ params }: PageProps<'/[locale]'>): Promise<Metadata> => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'metadata.home' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: getLocalizedAlternates('/', locale),
  };
};

const HomePage = () => {
  return <Home />;
};

export default HomePage;
