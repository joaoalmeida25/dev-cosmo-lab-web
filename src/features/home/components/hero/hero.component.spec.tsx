import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLocalized } from '../../../../../test/render-localized';
import { serverIntl } from '../../../../../test/server-intl';
import { Hero } from './hero.component';
vi.mock('next-intl/server', () => import('../../../../../test/server-intl'));
vi.mock('@/i18n/navigation', () => import('../../../../../test/navigation-mock'));

describe('Hero - Unit Test', () => {
  it.each(['pt-BR', 'en', 'es', 'invalid'])(
    'Should localize the headline and preserve both destinations for %s',
    async (locale) => {
      // Given: the server request supplies a supported locale or an invalid locale requiring fallback.
      serverIntl.locale = locale;
      const expectedLocale = locale === 'invalid' ? 'pt-BR' : locale;

      // When: the Controller prepares its synchronous View.
      renderLocalized(await Hero());

      // Then: the hero has an accessible headline, a localized catalog link and the services anchor.
      expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName();
      expect(screen.getByRole('region')).toHaveAttribute('id', 'home');
      expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
        expectedLocale === 'pt-BR' ? '/products' : `/${expectedLocale}/products`,
        '#services',
      ]);
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    },
  );
});
