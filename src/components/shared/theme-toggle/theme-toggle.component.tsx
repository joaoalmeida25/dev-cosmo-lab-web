'use client';

import { useTheme } from '@/hooks/use-theme/use-theme.hook';
import { ThemeToggleView } from './theme-toggle-view.component';
import { useTranslations } from 'next-intl';

export const ThemeToggle = () => {
  const t = useTranslations('common.theme');
  const { theme, toggleTheme, isHydrated } = useTheme();
  const label = !isHydrated ? t('loading') : theme === 'dark' ? t('enableLight') : t('enableDark');

  return (
    <ThemeToggleView
      label={label}
      disabled={!isHydrated}
      showSun={theme === 'dark'}
      onToggle={toggleTheme}
    />
  );
};
