import { getTranslations } from 'next-intl/server';
import { ProfessionalCredibilityView } from './professional-credibility-view.component';

export const ProfessionalCredibility = async () => {
  const t = await getTranslations('home.solutions.credibility');

  return (
    <ProfessionalCredibilityView
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      experience={t('experience')}
      expertise={t('expertise')}
      action={t('action')}
    />
  );
};
