'use client';

import { ThemeBootstrapView } from './theme-bootstrap-view.component';
import { useLayoutEffect } from 'react';
import { useTheme } from '@/hooks/use-theme/use-theme.hook';

interface IThemeBootstrapProps {
  script: string;
  locale: string;
}

export const ThemeBootstrap = ({ script, locale }: IThemeBootstrapProps) => {
  const { theme, isHydrated } = useTheme();

  useLayoutEffect(() => {
    if (!isHydrated) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.documentElement.dataset.themeReady = 'true';
  }, [theme, isHydrated, locale]);

  return <ThemeBootstrapView script={script} isHydrated={isHydrated} />;
};
