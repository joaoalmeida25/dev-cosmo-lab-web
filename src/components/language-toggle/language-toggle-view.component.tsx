import { FLOATING_CONTROL_BUTTON_CLASSES } from '@/components/floating-controls/floating-controls.constants';
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
        size="icon"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-label={`${translate('toggle')}. ${translate('current', { language: currentLanguage })}`}
        aria-expanded={isOpen}
        aria-controls={optionsId}
        className={`${FLOATING_CONTROL_BUTTON_CLASSES} text-xs font-semibold tracking-wide`}
      >
        {localeCodes[locale]}
      </Button>

      <div
        id={optionsId}
        role="group"
        aria-label={translate('options')}
        aria-hidden={!isOpen}
        className={`absolute top-[calc(100%+0.5rem)] left-0 w-11 origin-top overflow-hidden rounded-control border border-border/60 bg-surface/75 shadow-card ring-1 ring-inset ring-text-primary/5 backdrop-blur-xl transition-[max-height,opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none ${
          isOpen
            ? 'visible max-h-24 translate-y-0 opacity-100 pointer-events-auto'
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
            className={`flex h-10 w-full cursor-pointer items-center justify-center text-xs font-semibold tracking-wide text-text-primary transition-[color,background-color] duration-200 hover:bg-surface-hover/70 focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none ${index > 0 ? 'border-t border-border/50' : ''}`}
          >
            {localeCodes[optionLocale]}
          </button>
        ))}
      </div>
    </div>
  );
};
