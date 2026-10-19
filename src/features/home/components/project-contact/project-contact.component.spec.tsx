import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderLocalized } from '../../../../../test/render-localized';
import { serverIntl, getTranslations } from '../../../../../test/server-intl';
import { ProjectContact } from './project-contact.component';
import { CommercialChat } from '@/features/commercial-chat/commercial-chat.component';
import userEvent from '@testing-library/user-event';
import { COMMERCIAL_CHAT_OPEN_EVENT } from '@/features/commercial-chat/commercial-chat.constants';
vi.mock('next-intl/server', () => import('../../../../../test/server-intl'));
vi.mock('@/i18n/navigation', () => import('../../../../../test/navigation-mock'));

describe('ProjectContact - Unit Test', () => {
  it.each([
    ['pt-BR', 'services'],
    ['en', 'services'],
    ['es', 'services'],
    ['pt-BR', 'final'],
    ['en', 'final'],
    ['es', 'final'],
  ] as const)(
    'Should publish a chat opening request from the %s %s CTA',
    async (locale, placement) => {
      // Given: the actual localized CTA and a listener for its public chat event.
      serverIntl.locale = locale;
      const user = userEvent.setup();
      const open = vi.fn();
      renderLocalized(await ProjectContact({ placement }));
      const button = screen.getByRole('button');
      const t = await getTranslations('home.contact');
      button.parentElement?.addEventListener(COMMERCIAL_CHAT_OPEN_EVENT, open);

      // When: the visitor activates this commercial CTA.
      await user.click(button);

      // Then: one bubbling request reaches its parent, with a translated label and no form submission.
      expect(button).toHaveAccessibleName(t(placement));
      expect(button).toHaveAttribute('type', 'button');
      expect(open).toHaveBeenCalledTimes(1);
      expect(fetch).not.toHaveBeenCalled();
    },
  );
  it.each(['services', 'final'] as const)(
    'Should open the real chat from the %s CTA and restore its invoker after closing',
    async (placement) => {
      // Given: the actual Portuguese Home CTA and commercial chat sharing their public opening event.
      serverIntl.locale = 'pt-BR';
      const user = userEvent.setup();
      const t = await getTranslations('commercialChat');
      const contact = await getTranslations('home.contact');
      renderLocalized(
        <>
          {await ProjectContact({ placement })}
          <CommercialChat locale="pt-BR" services={[{ value: 'sites', label: 'Sites' }]} />
        </>,
      );
      const trigger = screen.getByRole('button', { name: contact(placement) });

      // When: the visitor opens this CTA, waits for entrance and closes the empty request.
      await user.click(trigger);
      const dialog = await screen.findByRole('dialog');
      await waitFor(() => expect(dialog).toHaveAttribute('data-transition', 'idle'));
      const initialFocus = document.activeElement;
      const title = screen.getByRole('heading', { name: t('welcome.title') });
      const titleTabIndex = title.getAttribute('tabindex');
      const selection = window.getSelection()?.toString();
      await user.click(screen.getByRole('button', { name: t('actions.close') }));
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

      // Then: only the dialog received technical focus, with no title selection, before returning to this CTA.
      expect(initialFocus).toBe(dialog);
      expect(titleTabIndex).toBeNull();
      expect(selection).toBe('');
      expect(trigger).toHaveFocus();
      expect(fetch).not.toHaveBeenCalled();
    },
  );
});
