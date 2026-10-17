import { getTranslations } from 'next-intl/server';
import { FinalCTAView } from './final-cta-view.component';

export const FinalCTA = async () => {
  const t = await getTranslations('home.finalCta');
  return (
    <FinalCTAView
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      action={t('action')}
    />
  );
};
