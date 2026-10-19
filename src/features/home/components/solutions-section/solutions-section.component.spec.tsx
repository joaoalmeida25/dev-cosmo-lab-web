import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLocalized } from '../../../../../test/render-localized';
import { serverIntl, getTranslations } from '../../../../../test/server-intl';
import { SolutionsSection } from './solutions-section.component';
vi.mock('next-intl/server', () => import('../../../../../test/server-intl'));
vi.mock('@/i18n/navigation', () => import('../../../../../test/navigation-mock'));
vi.mock('../project-contact/project-contact.component', () => ({
  ProjectContact: ({ placement }: { placement: string }) => <button>{placement} project</button>,
}));
vi.mock('./components/professional-credibility/professional-credibility.component', () => ({
  ProfessionalCredibility: () => <aside aria-label="professional profile" />,
}));
describe('SolutionsSection - Unit Test', () => {
  it.each(['pt-BR', 'en', 'es'])(
    'Should present four localized services and the ordered proposal journey for %s',
    async (locale) => {
      // Given: the selected locale, with separately tested async children isolated at their boundary.
      serverIntl.locale = locale;
      const t = await getTranslations('home.solutions');

      // When: the Controller maps all service IDs and journey steps into the real View.
      renderLocalized(await SolutionsSection());

      // Then: services retain their copy, the journey retains order and the project CTA uses services placement.
      expect(screen.getByRole('region', { name: t('title') })).toHaveAttribute('id', 'services');
      expect(screen.getAllByRole('article')).toHaveLength(4);

      for (const id of ['sites', 'applications', 'commerce', 'maintenance']) {
        expect(screen.getByRole('heading', { name: t(`cards.${id}.title`) })).toBeInTheDocument();
        expect(screen.getByText(t(`cards.${id}.description`))).toBeInTheDocument();
      }

      expect(
        screen.getAllByRole('listitem').map((item) => item.textContent?.replace(/^0\d/, '')),
      ).toEqual(
        ['conversation', 'needs', 'proposal', 'development'].map((step) => t(`steps.${step}`)),
      );
      expect(screen.getByRole('button', { name: 'services project' })).toBeInTheDocument();
    },
  );
});
