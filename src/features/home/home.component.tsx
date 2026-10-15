import { getTranslations } from 'next-intl/server';
import { FloatingControls } from '@/components/floating-controls/floating-controls.component';

export const Home = async () => {
  const t = await getTranslations('home');

  return (
    <>
      <FloatingControls />
      <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-6 py-28 sm:px-10">
        <p className="text-sm text-text-muted">{t('status')}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
          Dev Cosmo Lab
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
          {t('description')}
        </p>
      </main>
    </>
  );
};
