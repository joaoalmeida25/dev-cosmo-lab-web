import { Zap, Layers, Target } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { CatalogHeroView } from './catalog-hero-view.component';

export const CatalogHero = async () => {
  const t = await getTranslations('catalog.hero');

  return (
    <CatalogHeroView
      eyebrow={t('eyebrow')}
      title={t.rich('title', {
        line: (chunks) => <span className="block">{chunks}</span>,
        highlight: (chunks) => <span className="text-accent">{chunks}</span>,
      })}
      description={t('description')}
      benefits={[
        { id: 'access', icon: Zap },
        { id: 'practical', icon: Layers },
        { id: 'focus', icon: Target },
      ].map(({ id, icon }) => ({
        icon,
        id,
        title: t(`benefits.${id}.title`),
        description: t(`benefits.${id}.description`),
      }))}
    />
  );
};
