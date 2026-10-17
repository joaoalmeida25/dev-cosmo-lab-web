'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { hasLocale, useLocale, useTranslations } from 'next-intl';
import { getPathname, usePathname } from '@/i18n/navigation';
import { useRouter } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { LanguageToggleView } from '@/components/shared/language-toggle/language-toggle-view.component';
import type { SupportedLocale } from '@/i18n/locale.types';

const localeCodes: Record<SupportedLocale, string> = {
  'pt-BR': 'PT',
  en: 'EN',
  es: 'ES',
};

export const LanguageToggle = () => {
  const t = useTranslations('common.language');
  const requestedLocale = useLocale();
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;
  const pathname = usePathname();
  const router = useRouter();
  const optionsId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const availableLocales = routing.locales.filter((optionLocale) => optionLocale !== locale);
  const currentLanguage = t(`names.${locale}`);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target))
        setIsOpen(false);
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
    // Resolve the canonical URL directly. The localized router forces a locale
    // prefix on locale changes, which can leave the default locale at /pt-BR.
    router.replace(getPathname({ href, locale: nextLocale }), { scroll: false });
  };

  const toggleOptions = () => setIsOpen((current) => !current);

  return (
    <LanguageToggleView
      containerRef={containerRef}
      currentCode={localeCodes[locale]}
      options={availableLocales.map((optionLocale) => ({
        locale: optionLocale,
        code: localeCodes[optionLocale],
        label: t('select', { language: t(`names.${optionLocale}`) }),
      }))}
      onChangeLocale={changeLocale}
      toggleLabel={`${t('toggle')}. ${t('current', { language: currentLanguage })}`}
      optionsLabel={t('options')}
      optionsId={optionsId}
      isOpen={isOpen}
      onToggle={toggleOptions}
    />
  );
};
