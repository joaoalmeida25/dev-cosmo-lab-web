import { Hero } from './components/hero/hero.component';
import { FeaturedProduct } from './components/featured-product/featured-product.component';
import { SolutionsSection } from './components/solutions-section/solutions-section.component';
import { BrandLaboratory } from './components/brand-laboratory/brand-laboratory.component';
import { FinalCTA } from './components/final-cta/final-cta.component';
import type { IHomeFeaturedProduct } from '@/features/home/home.types';

interface IHomeViewProps {
  product: IHomeFeaturedProduct;
}

export const HomeView = ({ product }: IHomeViewProps) => {
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
