import { getTranslations } from 'next-intl/server';
import { HomeView } from './home-view.component';
import { FEATURED_PRODUCT } from '@/features/products/products.constants';
import type { IProduct } from '@/features/products/products.types';

export const Home = async () => {
  const t = await getTranslations('products.proposalsKit');
  const product: IProduct = {
    ...FEATURED_PRODUCT,
    subtitle: t('subtitle'),
    description: t('description'),
    materials: [
      t('materials.spreadsheet'),
      t('materials.messages'),
      t('materials.templates'),
      t('materials.guide'),
    ],
    imageAlt: t('imageAlt'),
  };

  return <HomeView product={product} />;
};
