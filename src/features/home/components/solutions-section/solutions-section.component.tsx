import { PanelsTopLeft, AppWindow, ShoppingBag, Wrench, type LucideIcon } from 'lucide-react';
import { SERVICE_IDS, type ServiceId } from '@/constants/services.constants';
import { getTranslations } from 'next-intl/server';
import type { ISolutionCard } from './solutions-section.types';
import { SolutionsSectionView } from './solutions-section-view.component';

const serviceIcons: Record<ServiceId, LucideIcon> = {
  sites: PanelsTopLeft,
  applications: AppWindow,
  commerce: ShoppingBag,
  maintenance: Wrench,
};

export const SolutionsSection = async () => {
  const t = await getTranslations('home.solutions');
  const solutionCards: Array<ISolutionCard> = SERVICE_IDS.map((id) => ({
    id,
    icon: serviceIcons[id],
    title: t(`cards.${id}.title`),
    description: t(`cards.${id}.description`),
  }));

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
