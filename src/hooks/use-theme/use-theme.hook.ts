'use client';

import { useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage/use-local-storage.hook';
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/constants/theme.constants';
import type { Theme } from '@/types/theme.type';

const resolveTheme = (value: Theme): Theme =>
  value === 'dark' || value === 'light' ? value : DEFAULT_THEME;

export const useTheme = () => {
  const { value, setValue, isHydrated } = useLocalStorage<Theme>(THEME_STORAGE_KEY, DEFAULT_THEME);
  const theme = resolveTheme(value);

  const setTheme = useCallback((nextTheme: Theme) => setValue(resolveTheme(nextTheme)), [setValue]);

  const toggleTheme = useCallback(() => {
    setValue((currentTheme) => (resolveTheme(currentTheme) === 'dark' ? 'light' : 'dark'));
  }, [setValue]);

  useEffect(() => {
    if (!isHydrated) return;

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme, isHydrated]);

  return { theme, setTheme, toggleTheme, isHydrated };
};
