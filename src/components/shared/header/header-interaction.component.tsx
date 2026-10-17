'use client';

import { useEffect, useRef, useState } from 'react';
import { HeaderView } from './header-view.component';
import type { IHeaderLabels } from './header.types';

interface IHeaderInteractionProps {
  labels: IHeaderLabels;
}

export const HeaderInteraction = ({ labels }: IHeaderInteractionProps) => {
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

  const toggleMenu = () => setIsMenuOpen((current) => !current);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <HeaderView
      labels={labels}
      isScrolled={isScrolled}
      isMenuOpen={isMenuOpen}
      menuButtonRef={menuButtonRef}
      firstMobileLinkRef={firstMobileLinkRef}
      onToggleMenu={toggleMenu}
      onCloseMenu={closeMenu}
    />
  );
};
