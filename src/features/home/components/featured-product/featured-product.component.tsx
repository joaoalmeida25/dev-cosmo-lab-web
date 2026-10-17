import { ClipboardList, ListChecks, Files } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { FeaturedProductView } from './featured-product-view.component';
import type { IHomeFeaturedProduct } from '@/features/home/home.types';

interface IFeaturedProductProps {
  product: IHomeFeaturedProduct;
}

export const FeaturedProduct = async ({ product }: IFeaturedProductProps) => {
  const t = await getTranslations('home.featured');
  const benefits = [
    {
      id: 'organization',
      icon: ClipboardList,
      title: t('benefits.organization.title'),
      description: t('benefits.organization.description'),
    },
    {
      id: 'followUp',
      icon: ListChecks,
      title: t('benefits.followUp.title'),
      description: t('benefits.followUp.description'),
    },
    {
      id: 'materials',
      icon: Files,
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
