import { getTranslations } from 'next-intl/server';
import { Hero } from './components/hero/hero.component';
import { FeaturedProduct } from './components/featured-product/featured-product.component';
import { SolutionsSection } from './components/solutions-section/solutions-section.component';
import { BrandLaboratory } from './components/brand-laboratory/brand-laboratory.component';
import { FinalCTA } from './components/final-cta/final-cta.component';
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

  return (
    <>
      <Hero />
      <FeaturedProduct product={product} />
      <SolutionsSection />
      <BrandLaboratory />
      <FinalCTA />
    </>
  );
};
