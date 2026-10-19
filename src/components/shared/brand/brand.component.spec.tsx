import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderLocalized } from '../../../../test/render-localized';
import { Brand } from './brand.component';

vi.mock('@/i18n/navigation', () => import('../../../../test/navigation-mock'));

describe('Brand - Unit Test', () => {
  it.each(['pt-BR', 'en', 'es'] as const)(
    'Should link the brand to the localized home in %s',
    (locale) => {
      // Given: the shared brand in a supported locale.
      renderLocalized(<Brand />, locale);

      // When: locating its accessible home destination.
      const link = screen.getByRole('link', { name: 'DEV COSMO LAB' });

      // Then: the symbol is decorative and the destination follows locale routing.
      expect(link).toHaveAttribute('href', locale === 'pt-BR' ? '/' : `/${locale}`);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    },
  );
});
