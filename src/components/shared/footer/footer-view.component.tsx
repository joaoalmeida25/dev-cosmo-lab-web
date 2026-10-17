import { Brand } from '@/components/shared/brand/brand.component';
import { Container } from '@/components/shared/container/container.component';
import { SocialIcon } from './components/social-icon/social-icon.component';

interface IFooterViewProps {
  description: string;
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
  social,
  signature,
  copyright,
  socialLinks,
}: IFooterViewProps) => {
  return (
    <footer className="bg-background">
      <Container>
        <div className="grid gap-6 border-t border-border py-8 min-[24rem]:grid-cols-[minmax(0,1fr)_auto] md:gap-x-16 md:py-10">
          <div>
            <Brand />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              {description}
            </p>
          </div>

          <div className="justify-self-end">
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
          <div className="grid gap-3 border-t border-border pt-5 text-xs leading-relaxed text-text-muted col-span-full md:grid-cols-[1fr_auto]">
            <p>{copyright}</p>
            <p>{signature}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};
