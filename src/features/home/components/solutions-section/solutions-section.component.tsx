import { PanelsTopLeft, AppWindow, ShoppingBag, Wrench } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { ISolutionCard } from './solutions-section.types';
import { SolutionsSectionView } from './solutions-section-view.component';

export const SolutionsSection = async () => {
  const t = await getTranslations('home.solutions');
  const solutionCards: Array<ISolutionCard> = [
    {
      id: 'sites',
      icon: PanelsTopLeft,
      title: t('cards.sites.title'),
      description: t('cards.sites.description'),
    },
    {
      id: 'applications',
      icon: AppWindow,
      title: t('cards.applications.title'),
      description: t('cards.applications.description'),
    },
    {
      id: 'commerce',
      icon: ShoppingBag,
      title: t('cards.commerce.title'),
      description: t('cards.commerce.description'),
    },
    {
      id: 'maintenance',
      icon: Wrench,
      title: t('cards.maintenance.title'),
      description: t('cards.maintenance.description'),
    },
  ];
  return (
    <SolutionsSectionView
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      solutionCards={solutionCards}
      journeyTitle={t('journeyTitle')}
      steps={[
        t('steps.conversation'),
        t('steps.needs'),
        t('steps.proposal'),
        t('steps.development'),
      ]}
    />
  );
};
