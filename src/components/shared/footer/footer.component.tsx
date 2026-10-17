import { getTranslations } from 'next-intl/server';
import { Brand } from '@/components/shared/brand/brand.component';
import { Container } from '@/components/shared/container/container.component';
import { SOCIAL_LINKS } from '@/constants/social-links.constants';

const SocialIcon = ({ id }: { id: 'youtube' | 'instagram' }) => {
  if (id === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5.5" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.5 15.6V8.4l6.3 3.6-6.3 3.6Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-5.5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
};

export const Footer = async () => {
  const t = await getTranslations('common');

  return (
    <footer className="bg-background">
      <Container>
        <div className="grid gap-8 border-t border-border py-10 md:grid-cols-[1fr_auto_auto] md:gap-x-16 md:py-12">
          <div>
            <Brand />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              {t('footer.description')}
            </p>
          </div>
          <nav aria-label={t('navigation.footer')}>
            <p className="text-sm font-semibold text-text-primary">{t('footer.institutional')}</p>
            <ul className="mt-2 grid gap-1">
              <li>
                <a
                  href="#home"
                  className="inline-flex min-h-10 items-center text-sm text-text-secondary hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
                >
                  {t('navigation.home')}
                </a>
              </li>
              <li>
                <a
                  href="#featured-product"
                  className="inline-flex min-h-10 items-center text-sm text-text-secondary hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
                >
                  {t('navigation.products')}
                </a>
              </li>
              <li>
                <a
                  href="#laboratory"
                  className="inline-flex min-h-10 items-center text-sm text-text-secondary hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
                >
                  {t('navigation.about')}
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <p className="text-sm font-semibold text-text-primary">{t('footer.social')}</p>
            <ul className="mt-4 flex gap-2.5">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.id}>
                  {social.href ? (
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.label}
                      className="flex size-11 items-center justify-center rounded-full border border-border text-text-secondary transition-[color,background-color,border-color] duration-200 hover:border-accent hover:bg-surface-hover hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring motion-reduce:transition-none"
                    >
                      <SocialIcon id={social.id} />
                    </a>
                  ) : (
                    <span
                      role="img"
                      aria-label={t('footer.socialUnavailable', { network: social.label })}
                      title={t('footer.socialUnavailable', { network: social.label })}
                      className="flex size-11 items-center justify-center rounded-full border border-border bg-surface/45 text-text-secondary"
                    >
                      <SocialIcon id={social.id} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3 border-t border-border pt-6 text-xs leading-relaxed text-text-muted md:col-span-3 md:grid-cols-[1fr_auto]">
            <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
            <p>{t('footer.signature')}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};
