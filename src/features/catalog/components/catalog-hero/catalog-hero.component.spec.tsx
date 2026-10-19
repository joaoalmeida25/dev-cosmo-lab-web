import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLocalized } from '../../../../../test/render-localized';
import { serverIntl, getTranslations } from '../../../../../test/server-intl';
import { CatalogHero } from './catalog-hero.component';
vi.mock('next-intl/server', () => import('../../../../../test/server-intl'));
vi.mock('@/i18n/navigation', () => import('../../../../../test/navigation-mock'));

describe('CatalogHero - Unit Test', () => {
  it.each(['pt-BR', 'en', 'es'])(
    'Should localize the catalog introduction and its three benefits for %s',
    async (locale) => {
      // Given: a real locale catalog and its expected introductory copy.
      serverIntl.locale = locale;
      const t = await getTranslations('catalog.hero');

      // When: the Controller renders the rich heading and translated benefits through its View.
      renderLocalized(await CatalogHero());

      // Then: the section is named by its h1, all benefit descriptions remain available and artwork is decorative.
      expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute('id', 'catalog-title');
      expect(screen.getByText(t('description'))).toBeInTheDocument();

      for (const id of ['access', 'practical', 'focus']) {
        expect(screen.getByText(t(`benefits.${id}.title`))).toBeInTheDocument();
        expect(screen.getByText(t(`benefits.${id}.description`))).toBeInTheDocument();
      }

      expect(screen.getAllByRole('listitem')).toHaveLength(3);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    },
  );
});
