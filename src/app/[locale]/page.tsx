import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Home } from '@/features/home/home.component';
import { getLocalizedAlternates, OPEN_GRAPH_IMAGE } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

export const generateMetadata = async ({ params }: PageProps<'/[locale]'>): Promise<Metadata> => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'metadata.home' });
  const title = t('title');
  const description = t('description');
  const alternates = getLocalizedAlternates('/', locale);

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

const HomePage = () => {
  return <Home />;
};

export default HomePage;
