import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLocalized } from '../../../../../test/render-localized';
import { serverIntl, getTranslations } from '../../../../../test/server-intl';
import { BrandLaboratory } from './brand-laboratory.component';
vi.mock('next-intl/server', () => import('../../../../../test/server-intl'));
vi.mock('@/i18n/navigation', () => import('../../../../../test/navigation-mock'));

describe('BrandLaboratory - Unit Test', () => {
  it.each(['pt-BR', 'en', 'es'])(
    'Should translate the laboratory introduction and all three pillars for %s',
    async (locale) => {
      // Given: a request using the selected locale and its real message catalog.
      serverIntl.locale = locale;
      const t = await getTranslations('home.laboratory');

      // When: the Controller prepares and renders its View.
      renderLocalized(await BrandLaboratory());

      // Then: the named section contains the localized introduction and each independent pillar.
      expect(screen.getByRole('region', { name: t('title') })).toHaveAttribute('id', 'laboratory');
      expect(screen.getByText(t('description'))).toBeInTheDocument();

      for (const pillar of ['create', 'explore', 'evolve']) {
        expect(screen.getByRole('heading', { name: t(`pillars.${pillar}.title`) })).toHaveProperty(
          'tagName',
          'H3',
        );
        expect(screen.getByText(t(`pillars.${pillar}.description`))).toBeInTheDocument();
      }

      expect(screen.getAllByRole('article')).toHaveLength(3);
    },
  );
});
