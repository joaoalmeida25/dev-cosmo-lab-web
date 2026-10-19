import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderLocalized } from '../../../../test/render-localized';
import pt from '@/messages/pt-BR/common.json';
import en from '@/messages/en/common.json';
import es from '@/messages/es/common.json';
import { ThemeToggle } from './theme-toggle.component';
import { THEME_STORAGE_KEY } from '@/constants/theme.constants';

describe('ThemeToggle - Unit Test', () => {
  it.each([
    { locale: 'pt-BR', labels: pt },
    { locale: 'en', labels: en },
    { locale: 'es', labels: es },
  ] as const)(
    'Should toggle and persist the theme with localized accessible labels in $locale',
    async ({ locale, labels }) => {
      // Given: a hydrated dark theme and real localized messages.
      const user = userEvent.setup();
      renderLocalized(<ThemeToggle />, locale);

      // When: requesting the light theme through its accessible control.
      await user.click(screen.getByRole('button', { name: labels.theme.enableLight }));

      // Then: persistence, document theme and the next action all become light-aware.
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('"light"');
      expect(screen.getByRole('button', { name: labels.theme.enableDark })).toBeEnabled();
    },
  );
});
