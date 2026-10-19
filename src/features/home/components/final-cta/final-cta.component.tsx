import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { FinalCTAView } from './final-cta-view.component';

export const FinalCTA = async () => {
  const requestedLocale = await getLocale();
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  const t = await getTranslations('home.finalCta');

  return (
    <FinalCTAView
      catalogHref={getPathname({ href: '/products', locale })}
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      action={t('action')}
    />
  );
};
