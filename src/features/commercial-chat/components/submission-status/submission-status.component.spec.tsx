import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SubmissionStatus } from './submission-status.component';

describe('SubmissionStatus - Unit Test', () => {
  it('Should announce pending delivery politely and keep its action disabled', async () => {
    // Given: a request still awaiting its integration response.
    const user = userEvent.setup();
    render(
      <SubmissionStatus
        state={{ status: 'sending' }}
        title="Sending"
        description="Await confirmation"
        actionLabel="Sending request"
      />,
    );

    // When: attempting to activate the pending action.
    await user.click(screen.getByRole('button', { name: 'Sending request' }));

    // Then: only pending status is announced and no active retry is offered.
    expect(screen.getByRole('status')).toHaveTextContent('Await confirmation');
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('Should announce confirmed success and delegate its close action', async () => {
    // Given: a confirmed successful outcome with an explicit close callback.
    const user = userEvent.setup();
    const close = vi.fn();
    render(
      <SubmissionStatus
        state={{ status: 'success', onClose: close }}
        title="Received"
        description="Delivery confirmed"
        actionLabel="Close"
      />,
    );

    // When: closing the successful outcome.
    await user.click(screen.getByRole('button', { name: 'Close' }));

    // Then: success and its action are exposed without a retry or an alert.
    expect(close).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Received');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each([true, false])(
    'Should offer retry and conditionally offer review after failure when review=%s',
    async (hasReview) => {
      // Given: an error outcome, optionally with a return-to-review action.
      const user = userEvent.setup();
      const retry = vi.fn();
      const review = vi.fn();
      render(
        <SubmissionStatus
          state={{ status: 'error', onRetry: retry, onReview: hasReview ? review : undefined }}
          title="Could not confirm"
          description="Answers preserved"
          actionLabel="Retry"
          reviewLabel="Review"
        />,
      );

      // When: invoking each offered recovery action.
      await user.click(screen.getByRole('button', { name: 'Retry' }));

      if (hasReview) {
        await user.click(screen.getByRole('button', { name: 'Review' }));
      }

      // Then: the error is assertive and only configured actions are called.
      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
      expect(retry).toHaveBeenCalledTimes(1);
      expect(review).toHaveBeenCalledTimes(hasReview ? 1 : 0);
      expect(screen.queryByRole('button', { name: 'Review' }) !== null).toBe(hasReview);
    },
  );
});
