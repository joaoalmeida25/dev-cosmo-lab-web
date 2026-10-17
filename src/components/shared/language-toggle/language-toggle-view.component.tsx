import { Button } from '@/components/ui/button/button.component';
import type { SupportedLocale } from '@/i18n/locale.types';
import type { RefObject } from 'react';

interface ILanguageToggleViewProps {
  containerRef: RefObject<HTMLDivElement | null>;
  currentCode: string;
  options: ReadonlyArray<{ locale: SupportedLocale; code: string; label: string }>;
  onChangeLocale: (locale: SupportedLocale) => void;
  toggleLabel: string;
  optionsLabel: string;
  optionsId: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const LanguageToggleView = ({
  containerRef,
  currentCode,
  options,
  onChangeLocale,
  toggleLabel,
  optionsLabel,
  optionsId,
  isOpen,
  onToggle,
}: ILanguageToggleViewProps) => {
  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="secondary"
        size="sm"
        onClick={onToggle}
        aria-label={toggleLabel}
        aria-expanded={isOpen}
        aria-controls={optionsId}
        className="gap-1 px-2.5 text-[11px] font-semibold tracking-[0.06em]"
      >
        {currentCode}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </Button>

      <div
        id={optionsId}
        role="group"
        aria-label={optionsLabel}
        aria-hidden={!isOpen}
        className={`absolute top-[calc(100%+0.375rem)] right-0 w-14 origin-top overflow-hidden rounded-xl border border-border/60 bg-surface shadow-card ring-1 ring-inset ring-text-primary/5 backdrop-blur-xl transition-[max-height,opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none ${
          isOpen
            ? 'visible max-h-28 translate-y-0 opacity-100 pointer-events-auto'
            : 'invisible max-h-0 -translate-y-1 opacity-0 pointer-events-none'
        }`}
      >
        {options.map((option, index) => (
          <button
            key={option.locale}
            type="button"
            tabIndex={isOpen ? 0 : -1}
            onClick={() => onChangeLocale(option.locale)}
            aria-label={option.label}
            className={`flex h-10 w-full cursor-pointer items-center justify-center text-[11px] font-semibold tracking-[0.06em] text-text-primary transition-[color,background-color] duration-200 hover:bg-surface-hover/70 focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none ${index > 0 ? 'border-t border-border/50' : ''}`}
          >
            {option.code}
          </button>
        ))}
      </div>
    </div>
  );
};
