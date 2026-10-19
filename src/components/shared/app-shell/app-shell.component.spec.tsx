import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLocalized } from '../../../../test/render-localized';
import { serverIntl, getTranslations } from '../../../../test/server-intl';
import { AppShell } from './app-shell.component';
import userEvent from '@testing-library/user-event';
vi.mock('next-intl/server', () => import('../../../../test/server-intl'));
vi.mock('@/i18n/navigation', () => import('../../../../test/navigation-mock'));
vi.mock('../footer/footer.component', () => ({ Footer: () => <footer>Footer boundary</footer> }));
// Resolve server-provider locale inheritance at the request boundary, retaining the real client provider.
vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();

  return {
    ...actual,
    NextIntlClientProvider: (props: React.ComponentProps<typeof actual.NextIntlClientProvider>) => {
      const inheritedLocale = ['en', 'es'].includes(serverIntl.locale)
        ? serverIntl.locale
        : 'pt-BR';

      return <actual.NextIntlClientProvider {...props} locale={props.locale ?? inheritedLocale} />;
    },
  };
});

describe('AppShell - Unit Test', () => {
  it.each(['pt-BR', 'en', 'es'] as const)(
    'Should compose localized navigation, main content and the actual commercial chat for %s',
    async (locale) => {
      // Given: localized server messages, page content and the real client-side shell children.
      serverIntl.locale = locale;
      const user = userEvent.setup();
      const common = await getTranslations('common.accessibility');
      const chat = await getTranslations('commercialChat');
      const services = await getTranslations('home.solutions.cards');

      // When: the shell renders its View and the visitor starts a commercial request.
      renderLocalized(await AppShell({ locale, children: <h1>Page content</h1> }), locale);
      await user.click(screen.getByRole('button', { name: chat('launcher') }));
      await user.click(screen.getByRole('button', { name: chat('welcome.start') }));

      // Then: skip navigation targets the main landmark and the chat receives translated service labels.
      expect(screen.getByRole('link', { name: common('skipToContent') })).toHaveAttribute(
        'href',
        '#main-content',
      );
      expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
      expect(screen.getByRole('main')).toContainElement(
        screen.getByRole('heading', { name: 'Page content' }),
      );
      expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
      expect(screen.getAllByRole('banner').length).toBeGreaterThan(0);
      expect(screen.getAllByRole('contentinfo').length).toBeGreaterThan(0);

      for (const id of ['sites', 'applications', 'maintenance']) {
        expect(screen.getByRole('radio', { name: services(`${id}.title`) })).toBeInTheDocument();
      }

      expect(screen.getByRole('radio', { name: chat('services.others') })).toBeInTheDocument();
      expect(fetch).not.toHaveBeenCalled();
    },
  );
});
