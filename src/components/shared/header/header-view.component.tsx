import { Menu, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { RefObject } from 'react';
import type { IHeaderLabels, IHeaderNavigationItem } from './header.types';
import { Brand } from '@/components/shared/brand/brand.component';
import { Container } from '@/components/shared/container/container.component';
import { LanguageToggle } from '@/components/shared/language-toggle/language-toggle.component';
import { ThemeToggle } from '@/components/shared/theme-toggle/theme-toggle.component';

interface IHeaderViewProps {
  labels: IHeaderLabels;
  navigationItems: ReadonlyArray<IHeaderNavigationItem>;
  isScrolled: boolean;
  isMenuOpen: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  firstMobileLinkRef: RefObject<HTMLAnchorElement | null>;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}

export const HeaderView = ({
  labels,
  navigationItems,
  isScrolled,
  isMenuOpen,
  menuButtonRef,
  firstMobileLinkRef,
  onToggleMenu,
  onCloseMenu,
}: IHeaderViewProps) => {
  return (
    <header
      data-scrolled={isScrolled}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent transition-[background-color,border-color,box-shadow] duration-200 data-[scrolled=true]:border-border/60 data-[scrolled=true]:bg-header-surface data-[scrolled=true]:shadow-header data-[scrolled=true]:backdrop-blur-[10px] motion-reduce:transition-none"
    >
      <Container>
        <div className="grid min-h-16 grid-cols-[1fr_auto] items-center gap-2 md:min-h-[68px] md:grid-cols-[1fr_auto_1fr] md:gap-5">
          <Brand />
          <nav aria-label={labels.mainNavigation} className="hidden md:block">
            <ul className="flex items-center gap-6">
              {navigationItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className="aria-[current=page]:text-accent aria-[current=page]:underline aria-[current=page]:underline-offset-8 inline-flex min-h-11 items-center text-sm font-medium text-text-primary transition-colors duration-200 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring motion-reduce:transition-none"
                  >
                    {labels[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center justify-self-end gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? labels.closeMenu : labels.openMenu}
              onClick={onToggleMenu}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-transparent text-text-primary transition-colors duration-200 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring motion-reduce:transition-none md:hidden"
            >
              {isMenuOpen ? (
                <X aria-hidden="true" strokeWidth={1.75} className="size-5" />
              ) : (
                <Menu aria-hidden="true" strokeWidth={1.75} className="size-5" />
              )}
            </button>
          </div>
        </div>
        <nav
          id="mobile-navigation"
          aria-label={labels.mainNavigation}
          aria-hidden={!isMenuOpen}
          className={`absolute inset-x-5 top-[calc(100%+0.5rem)] overflow-hidden rounded-card border border-border bg-header-surface shadow-editorial backdrop-blur-[10px] transition-[opacity,transform,visibility] duration-200 motion-reduce:transition-none sm:inset-x-8 md:hidden ${isMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'}`}
        >
          <ul className="p-2">
            {navigationItems.map((item, index) => (
              <li key={item.key}>
                <Link
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  tabIndex={isMenuOpen ? 0 : -1}
                  onClick={onCloseMenu}
                  className="flex min-h-12 items-center rounded-xl px-4 text-sm font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring"
                >
                  {labels[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
};
