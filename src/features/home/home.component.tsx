import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/shared/container/container.component';

export const Home = async () => {
  const t = await getTranslations('home');

  return (
    <Container className="flex flex-1 flex-col justify-center py-20 md:py-28">
      <p className="text-sm text-text-muted">{t('status')}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
        Dev Cosmo Lab
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
        {t('description')}
      </p>
    </Container>
  );
};
