'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { LanguageToggleView } from '@/components/language-toggle/language-toggle-view.component';
import { Locale, SupportedLocale } from '@/components/language-toggle/language-toggle.types';

const localeCodes: Record<SupportedLocale, string> = {
  'pt-BR': 'PT',
  en: 'EN',
  es: 'ES',
};

export const LanguageToggle = () => {
  const t = useTranslations('common.language');
  const locale = useLocale() as SupportedLocale;
  const pathname = usePathname();
  const router = useRouter();
  const optionsId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const availableLocales: Array<Locale> = routing.locales.filter(
    (optionLocale) => optionLocale !== locale,
  );
  const currentLanguage = t(`names.${locale}`);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        containerRef.current?.querySelector('button')?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const changeLocale = (nextLocale: SupportedLocale) => {
    setIsOpen(false);

    const href = `${pathname}${window.location.search}${window.location.hash}`;
    router.replace(href, { locale: nextLocale, scroll: false });
  };

  return (
    <LanguageToggleView
      containerRef={containerRef}
      locale={locale}
      availableLocales={availableLocales}
      changeLocale={changeLocale}
      currentLanguage={currentLanguage}
      optionsId={optionsId}
      localeCodes={localeCodes}
      translate={t}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
};
