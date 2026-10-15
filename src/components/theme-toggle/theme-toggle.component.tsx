'use client';

import { useTheme } from '@/hooks/use-theme/use-theme.hook';
import { Button } from '@/components/ui/button/button.component';
import { FLOATING_CONTROL_BUTTON_CLASSES } from '@/components/floating-controls/floating-controls.constants';
import { useTranslations } from 'next-intl';

export const ThemeToggle = () => {
  const t = useTranslations('common.theme');
  const { theme, toggleTheme, isHydrated } = useTheme();
  const label = !isHydrated ? t('loading') : theme === 'dark' ? t('enableLight') : t('enableDark');

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={toggleTheme}
      disabled={!isHydrated}
      aria-label={label}
      className={FLOATING_CONTROL_BUTTON_CLASSES}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {theme === 'dark' ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
          </>
        ) : (
          <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
        )}
      </svg>
    </Button>
  );
};
