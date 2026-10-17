'use client';

import { useEffect, useRef, useState } from 'react';
import { Brand } from '@/components/shared/brand/brand.component';
import { Container } from '@/components/shared/container/container.component';
import { LanguageToggle } from '@/components/language-toggle/language-toggle.component';
import { ThemeToggle } from '@/components/theme-toggle/theme-toggle.component';

interface IHeaderViewProps {
  labels: {
    mainNavigation: string;
    home: string;
    products: string;
    about: string;
    openMenu: string;
    closeMenu: string;
  };
}

const navigationItems = [
  { key: 'home', href: '#home' },
  { key: 'products', href: '#featured-product' },
  { key: 'about', href: '#laboratory' },
] as const;

export const HeaderView = ({ labels }: IHeaderViewProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const updateHeader = () => {
      setIsScrolled((current) => {
        if (!current && window.scrollY >= 96) return true;
        if (current && window.scrollY <= 64) return false;
        return current;
      });
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    firstMobileLinkRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isMenuOpen]);

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
                  <a
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-sm font-medium text-text-primary transition-colors duration-200 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring motion-reduce:transition-none"
                  >
                    {labels[item.key]}
                  </a>
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
              onClick={() => setIsMenuOpen((current) => !current)}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-transparent text-text-primary transition-colors duration-200 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring motion-reduce:transition-none md:hidden"
            >
              <span className="relative block h-4 w-5" aria-hidden="true">
                <span
                  className={`absolute top-0 left-0 h-px w-5 bg-current transition-transform duration-200 motion-reduce:transition-none ${isMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`}
                />
                <span
                  className={`absolute top-[7px] left-0 h-px w-5 bg-current transition-opacity duration-200 motion-reduce:transition-none ${isMenuOpen ? 'opacity-0' : ''}`}
                />
                <span
                  className={`absolute top-[14px] left-0 h-px w-5 bg-current transition-transform duration-200 motion-reduce:transition-none ${isMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
                />
              </span>
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
                <a
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  href={item.href}
                  tabIndex={isMenuOpen ? 0 : -1}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-4 text-sm font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring"
                >
                  {labels[item.key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
};
