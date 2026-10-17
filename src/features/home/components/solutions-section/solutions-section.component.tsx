import { getTranslations } from 'next-intl/server';
import type { ISolutionCard } from './solutions-section.types';
import { SolutionsSectionView } from './solutions-section-view.component';

export const SolutionsSection = async () => {
  const t = await getTranslations('home.solutions');
  const solutionCards: Array<ISolutionCard> = [
    {
      id: 'product',
      icon: 'grid',
      title: t('cards.product.title'),
      description: t('cards.product.description'),
      isAvailable: true,
    },
    {
      id: 'newProducts',
      icon: 'compass',
      title: t('cards.newProducts.title'),
      description: t('cards.newProducts.description'),
      isAvailable: false,
    },
    {
      id: 'moreSolutions',
      icon: 'spark',
      title: t('cards.moreSolutions.title'),
      description: t('cards.moreSolutions.description'),
      isAvailable: false,
    },
  ];
  return (
    <SolutionsSectionView
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      unavailable={t('unavailable')}
      productAction={t('productAction')}
      solutionCards={solutionCards}
    />
  );
};
