import { Button } from '@/components/ui/button/button.component';
import { Locale, SupportedLocale } from '@/components/language-toggle/language-toggle.types';
import type { useTranslations } from 'next-intl';
import type { Dispatch, RefObject, SetStateAction } from 'react';

interface ILanguageToggleView {
  containerRef: RefObject<HTMLDivElement | null>;
  locale: Locale;
  availableLocales: Array<Locale>;
  localeCodes: Record<SupportedLocale, string>;
  changeLocale: (nextLocale: SupportedLocale) => void;
  translate: ReturnType<typeof useTranslations<'common.language'>>;
  currentLanguage: string;
  optionsId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const LanguageToggleView = ({
  containerRef,
  locale,
  availableLocales,
  changeLocale,
  localeCodes,
  translate,
  currentLanguage,
  optionsId,
  isOpen,
  setIsOpen,
}: ILanguageToggleView) => {
  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-label={`${translate('toggle')}. ${translate('current', { language: currentLanguage })}`}
        aria-expanded={isOpen}
        aria-controls={optionsId}
        className="gap-1 px-2.5 text-[11px] font-semibold tracking-[0.06em]"
      >
        {localeCodes[locale]}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </Button>

      <div
        id={optionsId}
        role="group"
        aria-label={translate('options')}
        aria-hidden={!isOpen}
        className={`absolute top-[calc(100%+0.375rem)] right-0 w-14 origin-top overflow-hidden rounded-xl border border-border/60 bg-surface shadow-card ring-1 ring-inset ring-text-primary/5 backdrop-blur-xl transition-[max-height,opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none ${
          isOpen
            ? 'visible max-h-28 translate-y-0 opacity-100 pointer-events-auto'
            : 'invisible max-h-0 -translate-y-1 opacity-0 pointer-events-none'
        }`}
      >
        {availableLocales.map((optionLocale, index) => (
          <button
            key={optionLocale}
            type="button"
            tabIndex={isOpen ? 0 : -1}
            onClick={() => changeLocale(optionLocale)}
            aria-label={translate('select', { language: translate(`names.${optionLocale}`) })}
            className={`flex h-10 w-full cursor-pointer items-center justify-center text-[11px] font-semibold tracking-[0.06em] text-text-primary transition-[color,background-color] duration-200 hover:bg-surface-hover/70 focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none ${index > 0 ? 'border-t border-border/50' : ''}`}
          >
            {localeCodes[optionLocale]}
          </button>
        ))}
      </div>
    </div>
  );
};
