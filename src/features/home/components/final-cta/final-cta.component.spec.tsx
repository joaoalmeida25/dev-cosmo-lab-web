import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLocalized } from '../../../../../test/render-localized';
import { serverIntl } from '../../../../../test/server-intl';
import { FinalCTA } from './final-cta.component';
vi.mock('next-intl/server', () => import('../../../../../test/server-intl'));
vi.mock('@/i18n/navigation', () => import('../../../../../test/navigation-mock'));
vi.mock('../project-contact/project-contact.component', () => ({
  ProjectContact: ({ placement }: { placement: string }) => <button>{placement} project</button>,
}));
describe('FinalCTA - Unit Test', () => {
  it.each(['pt-BR', 'en', 'es', 'invalid'])(
    'Should provide a localized catalog destination and final project CTA for %s',
    async (locale) => {
      // Given: a request locale, with the asynchronous child isolated at its composition boundary.
      serverIntl.locale = locale;

      // When: the final section Controller renders its real View.
      renderLocalized(await FinalCTA());

      // Then: the named section offers both catalog navigation and the final project placement.
      expect(screen.getByRole('region')).toHaveAccessibleName();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        `${locale === 'en' || locale === 'es' ? `/${locale}` : ''}/products`,
      );
      expect(screen.getByRole('button', { name: 'final project' })).toBeInTheDocument();
    },
  );
});
