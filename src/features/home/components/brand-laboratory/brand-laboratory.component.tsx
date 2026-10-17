import { getTranslations } from 'next-intl/server';
import type { HomeIconName } from '../home-icon/home-icon.component';
import { BrandLaboratoryView } from './brand-laboratory-view.component';

export const BrandLaboratory = async () => {
  const t = await getTranslations('home.laboratory');
  const pillars: Array<{ id: string; title: string; description: string; icon: HomeIconName }> = [
    {
      id: 'create',
      icon: 'code',
      title: t('pillars.create.title'),
      description: t('pillars.create.description'),
    },
    {
      id: 'explore',
      icon: 'compass',
      title: t('pillars.explore.title'),
      description: t('pillars.explore.description'),
    },
    {
      id: 'evolve',
      icon: 'growth',
      title: t('pillars.evolve.title'),
      description: t('pillars.evolve.description'),
    },
  ];
  return (
    <BrandLaboratoryView
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      pillars={pillars}
    />
  );
};
