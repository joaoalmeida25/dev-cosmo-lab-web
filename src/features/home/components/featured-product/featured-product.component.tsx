import { getTranslations } from 'next-intl/server';
import { FeaturedProductView } from './featured-product-view.component';
import type { IProduct } from '@/features/products/products.types';

interface IFeaturedProductProps {
  product: IProduct;
}

export const FeaturedProduct = async ({ product }: IFeaturedProductProps) => {
  const t = await getTranslations('home.featured');
  const benefits = [
    {
      id: 'organization',
      title: t('benefits.organization.title'),
      description: t('benefits.organization.description'),
    },
    {
      id: 'followUp',
      title: t('benefits.followUp.title'),
      description: t('benefits.followUp.description'),
    },
    {
      id: 'materials',
      title: t('benefits.materials.title'),
      description: t('benefits.materials.description'),
    },
  ];
  return (
    <FeaturedProductView
      eyebrow={t('eyebrow')}
      illustration={t('illustration')}
      product={product}
      benefits={benefits}
    />
  );
};
