import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReviewStep } from './review-step.component';
import type { IChatReviewGroup } from '../../commercial-chat.types';

describe('ReviewStep - Unit Test', () => {
  it('Should preserve entered content and delegate explicit editing and restart requests', async () => {
    // Given: a prepared contact review with private-use notice.
    const user = userEvent.setup();
    const edit = vi.fn();
    const restart = vi.fn();
    const groups: ReadonlyArray<IChatReviewGroup> = [
      {
        id: 'contact',
        title: 'Contact',
        editLabel: 'Edit contact',
        entries: [
          { label: 'Name', value: 'João Almeida' },
          { label: 'Email', value: 'joao@example.com' },
        ],
        onEdit: edit,
      },
    ];

    render(
      <ReviewStep
        labels={{ title: 'Review', hint: 'Check your answers' }}
        groups={groups}
        editLabel="Edit"
        privacy="Used only to reply"
        restartLabel="Restart"
        onRestart={restart}
      />,
    );

    // When: requesting an edit and then a restart.
    await user.click(screen.getByRole('button', { name: 'Edit contact' }));
    await user.click(screen.getByRole('button', { name: 'Restart' }));

    // Then: callbacks stay explicit and the review does not expose a submit control of its own.
    expect(edit).toHaveBeenCalledTimes(1);
    expect(restart).toHaveBeenCalledTimes(1);
    expect(
      within(screen.getByRole('region', { name: 'Contact' })).getByText('joao@example.com'),
    ).toBeInTheDocument();
    expect(
      screen
        .getByText('Used only to reply')
        .compareDocumentPosition(screen.getByRole('button', { name: 'Restart' })) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.queryByRole('button', { name: /send/i })).not.toBeInTheDocument();
  });
});
