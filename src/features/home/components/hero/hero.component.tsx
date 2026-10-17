import { getTranslations } from 'next-intl/server';
import { HeroView } from './hero-view.component';

export const Hero = async () => {
  const t = await getTranslations('home.hero');
  const benefits = [
    { id: 'solutions', label: t('benefits.solutions') },
    { id: 'productivity', label: t('benefits.productivity') },
    { id: 'evolution', label: t('benefits.evolution') },
  ];
  return (
    <HeroView
      eyebrow={t('eyebrow')}
      description={t('description')}
      primaryAction={t('primaryAction')}
      secondaryAction={t('secondaryAction')}
      headline={t.rich('headline', {
        line: (chunks) => <span className="block">{chunks}</span>,
        highlight: (chunks) => <span className="text-accent">{chunks}</span>,
      })}
      benefits={benefits}
    />
  );
};
