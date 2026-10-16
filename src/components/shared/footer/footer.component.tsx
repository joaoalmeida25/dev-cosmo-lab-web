import { getTranslations } from 'next-intl/server';
import { Brand } from '@/components/shared/brand/brand.component';
import { Container } from '@/components/shared/container/container.component';
import { Link } from '@/i18n/navigation';

export const Footer = async () => {
  const t = await getTranslations('common');

  return (
    <footer>
      <Container>
        <div className="grid gap-6 border-t border-border py-8 md:grid-cols-[1fr_auto] md:gap-x-16 md:py-10">
          <div>
            <Brand />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              {t('footer.description')}
            </p>
          </div>
          <nav aria-label={t('navigation.footer')}>
            <p className="text-sm font-semibold text-text-primary">{t('footer.institutional')}</p>
            <Link
              href="/"
              className="mt-2 inline-flex min-h-11 items-center text-sm text-text-secondary hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
            >
              {t('navigation.home')}
            </Link>
          </nav>
          <p className="text-xs leading-relaxed text-text-muted md:col-span-2 md:text-right">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </Container>
    </footer>
  );
};
