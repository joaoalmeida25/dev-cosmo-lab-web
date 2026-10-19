import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLocalized } from '../../../../../../../test/render-localized';
import { serverIntl, getTranslations } from '../../../../../../../test/server-intl';
import { ProfessionalCredibility } from './professional-credibility.component';
vi.mock('next-intl/server', () => import('../../../../../../../test/server-intl'));
vi.mock('@/i18n/navigation', () => import('../../../../../../../test/navigation-mock'));

describe('ProfessionalCredibility - Unit Test', () => {
  it.each(['pt-BR', 'en', 'es'])(
    'Should translate professional evidence and preserve the safe external profile link for %s',
    async (locale) => {
      // Given: the requested locale and real credibility translations.
      serverIntl.locale = locale;
      const t = await getTranslations('home.solutions.credibility');

      // When: the Controller renders its prepared View.
      renderLocalized(await ProfessionalCredibility());

      // Then: experience is explicit and the external action protects the opener.
      expect(screen.getByRole('heading', { name: t('title') })).toHaveProperty('tagName', 'H3');
      expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
        t('experience'),
        t('expertise'),
      ]);
      const action = screen.getByRole('link', { name: t('action') });
      expect(action).toHaveAttribute('href', 'https://joaoalmeidaa.dev/');
      expect(action).toHaveAttribute('target', '_blank');
      expect(action).toHaveAttribute('rel', 'noopener noreferrer');
    },
  );
});
