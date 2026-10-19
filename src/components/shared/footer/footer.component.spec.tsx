import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLocalized } from '../../../../test/render-localized';
import { serverIntl } from '../../../../test/server-intl';
import { Footer } from './footer.component';
import { getTranslations } from 'next-intl/server';
vi.mock('next-intl/server', () => import('../../../../test/server-intl'));
vi.mock('@/i18n/navigation', () => import('../../../../test/navigation-mock'));

describe('Footer - Unit Test', () => {
  it.each(['pt-BR', 'en', 'es'] as const)(
    'Should translate footer content and distinguish available social destinations for %s',
    async (locale) => {
      // Given: the requested locale and the current copyright year.
      serverIntl.locale = locale;
      const t = await getTranslations('common');
      const year = new Date().getFullYear();

      // When: the Controller prepares the footer and real social presentation.
      renderLocalized(await Footer(), locale);

      // Then: available networks are safe external links while unavailable networks have no dead destination.
      expect(screen.getByRole('contentinfo')).toHaveTextContent(t('footer.description'));
      expect(screen.getByText(t('footer.copyright', { year }))).toBeInTheDocument();
      expect(screen.getByText(t('footer.signature'))).toBeInTheDocument();
      expect(
        screen.getByRole('img', { name: t('footer.socialUnavailable', { network: 'YouTube' }) }),
      ).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'YouTube' })).not.toBeInTheDocument();
      const instagram = screen.getByRole('link', { name: 'Instagram' });
      expect(instagram).toHaveAttribute('href', 'https://www.instagram.com/devcosmolab/');
      expect(instagram).toHaveAttribute('target', '_blank');
      expect(instagram).toHaveAttribute('rel', 'noreferrer noopener');
    },
  );
});
