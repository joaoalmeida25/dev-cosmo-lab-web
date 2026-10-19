import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommercialChatTrigger } from './commercial-chat-trigger.component';
import { COMMERCIAL_CHAT_OPEN_EVENT } from '../../commercial-chat.constants';
import pt from '@/messages/pt-BR/home.json';
import en from '@/messages/en/home.json';
import es from '@/messages/es/home.json';

describe('CommercialChatTrigger - Unit Test', () => {
  it.each([pt, en, es])(
    'Should preserve localized CTA labels and semantic dialog triggers for locale %#',
    (messages) => {
      // Given: the approved localized services and final CTA labels.
      const labels = messages.contact;

      // When: rendering the real triggers with both approved Button variants.
      const { container } = render(
        <>
          <CommercialChatTrigger label={labels.services} variant="primary" />
          <CommercialChatTrigger label={labels.final} variant="secondary" />
        </>,
      );

      // Then: each CTA is a named button controlling the same dialog without external navigation.
      expect(screen.getByRole('button', { name: labels.services })).toHaveAttribute(
        'type',
        'button',
      );
      expect(screen.getByRole('button', { name: labels.final })).toHaveAttribute('type', 'button');

      for (const button of screen.getAllByRole('button')) {
        expect(button).toHaveAttribute('aria-controls', 'commercial-chat');
        expect(button).toHaveAttribute('aria-haspopup', 'dialog');
      }

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(container.querySelector('dialog')).not.toBeInTheDocument();
    },
  );

  it.each(['primary', 'secondary'] as const)(
    'Should emit one bubbling opening event from the %s trigger',
    async (variant) => {
      // Given: a real trigger inside a parent observing its public chat event.
      const user = userEvent.setup();
      const open = vi.fn();
      const { container } = render(
        <CommercialChatTrigger label="Discuss a project" variant={variant} />,
      );

      container.addEventListener(COMMERCIAL_CHAT_OPEN_EVENT, open);
      const button = screen.getByRole('button', { name: 'Discuss a project' });

      // When: the visitor activates the trigger by keyboard.
      button.focus();
      await user.keyboard('{Enter}');

      // Then: the event bubbles with the actual invoker and never sends a request.
      expect(open).toHaveBeenCalledTimes(1);
      expect(open.mock.calls[0][0]).toMatchObject({ target: button, bubbles: true });
      expect(fetch).not.toHaveBeenCalled();
    },
  );
});
