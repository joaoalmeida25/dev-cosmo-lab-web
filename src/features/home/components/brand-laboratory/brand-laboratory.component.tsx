import { getTranslations } from 'next-intl/server';
import { CodeXml, Compass, ChartNoAxesColumnIncreasing, type LucideIcon } from 'lucide-react';
import { BrandLaboratoryView } from './brand-laboratory-view.component';

export const BrandLaboratory = async () => {
  const t = await getTranslations('home.laboratory');
  const pillars: Array<{ id: string; title: string; description: string; icon: LucideIcon }> = [
    {
      id: 'create',
      icon: CodeXml,
      title: t('pillars.create.title'),
      description: t('pillars.create.description'),
    },
    {
      id: 'explore',
      icon: Compass,
      title: t('pillars.explore.title'),
      description: t('pillars.explore.description'),
    },
    {
      id: 'evolve',
      icon: ChartNoAxesColumnIncreasing,
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
