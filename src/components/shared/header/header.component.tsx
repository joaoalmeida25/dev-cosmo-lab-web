import { getTranslations } from 'next-intl/server';
import { Brand } from '@/components/shared/brand/brand.component';
import { Container } from '@/components/shared/container/container.component';
import { LanguageToggle } from '@/components/language-toggle/language-toggle.component';
import { ThemeToggle } from '@/components/theme-toggle/theme-toggle.component';
import { Link } from '@/i18n/navigation';

export const Header = async () => {
  const t = await getTranslations('common');

  return (
    <header>
      <Container>
        <div className="flex min-h-[76px] items-center justify-between gap-3 border-b border-border md:grid md:min-h-[88px] md:grid-cols-[1fr_auto_1fr] md:gap-6">
          <Brand />
          <nav aria-label={t('navigation.main')} className="hidden md:block">
            <Link
              href="/"
              aria-current="page"
              className="inline-flex min-h-11 items-center border-b-2 border-accent px-1 text-sm font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
            >
              {t('navigation.home')}
            </Link>
          </nav>
          <div className="flex shrink-0 items-center gap-2 md:justify-self-end md:gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
};
