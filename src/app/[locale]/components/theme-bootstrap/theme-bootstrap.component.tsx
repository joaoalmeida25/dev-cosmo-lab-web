'use client';

import Script from 'next/script';
import { useLayoutEffect } from 'react';
import { useTheme } from '@/hooks/use-theme/use-theme.hook';

interface IThemeBootstrapProps {
  script: string;
  locale: string;
}

export const ThemeBootstrap = ({ script, locale }: IThemeBootstrapProps) => {
  const { theme, isHydrated } = useTheme();

  useLayoutEffect(() => {
    if (!isHydrated) return;

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.documentElement.dataset.themeReady = 'true';
  }, [theme, isHydrated, locale]);

  return isHydrated ? null : (
    <Script
      id="theme-bootstrap"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
};
