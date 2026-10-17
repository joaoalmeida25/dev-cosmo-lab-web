import { Brand } from '@/components/shared/brand/brand.component';
import { Container } from '@/components/shared/container/container.component';
import { SocialIcon } from './components/social-icon/social-icon.component';

interface IFooterViewProps {
  description: string;
  footer: string;
  institutional: string;
  home: string;
  products: string;
  about: string;
  social: string;
  signature: string;
  copyright: string;
  socialLinks: ReadonlyArray<{
    id: 'youtube' | 'instagram';
    label: string;
    href?: string;
    unavailableLabel: string;
  }>;
}

export const FooterView = ({
  description,
  footer,
  institutional,
  home,
  products,
  about,
  social,
  signature,
  copyright,
  socialLinks,
}: IFooterViewProps) => {
  return (
    <footer className="bg-background">
      <Container>
        <div className="grid gap-8 border-t border-border py-10 md:grid-cols-[1fr_auto_auto] md:gap-x-16 md:py-12">
          <div>
            <Brand />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              {description}
            </p>
          </div>
          <nav aria-label={footer}>
            <p className="text-sm font-semibold text-text-primary">{institutional}</p>
            <ul className="mt-2 grid gap-1">
              <li>
                <a
                  href="#home"
                  className="inline-flex min-h-10 items-center text-sm text-text-secondary hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
                >
                  {home}
                </a>
              </li>
              <li>
                <a
                  href="#featured-product"
                  className="inline-flex min-h-10 items-center text-sm text-text-secondary hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
                >
                  {products}
                </a>
              </li>
              <li>
                <a
                  href="#laboratory"
                  className="inline-flex min-h-10 items-center text-sm text-text-secondary hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
                >
                  {about}
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <p className="text-sm font-semibold text-text-primary">{social}</p>
            <ul className="mt-4 flex gap-2.5">
              {socialLinks.map((social) => (
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
                      aria-label={social.unavailableLabel}
                      title={social.unavailableLabel}
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
            <p>{copyright}</p>
            <p>{signature}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};
