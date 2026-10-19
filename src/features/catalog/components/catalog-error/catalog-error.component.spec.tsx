import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderLocalized } from '../../../../../test/render-localized';
import pt from '@/messages/pt-BR/common.json';
import { CatalogError } from './catalog-error.component';

describe('CatalogError - Unit Test', () => {
  it('Should display localized failure guidance and invoke the explicit retry action', async () => {
    // Given: an error boundary callback and real translations.
    const user = userEvent.setup();
    const retry = vi.fn();
    renderLocalized(<CatalogError onRetry={retry} />);

    // When: requesting a retry after reading the failure state.
    await user.click(screen.getByRole('button', { name: pt.catalogError.retry }));

    // Then: failure guidance remains semantic and retry is explicit and called exactly once.
    expect(
      screen.getByRole('heading', { level: 1, name: pt.catalogError.title }),
    ).toBeInTheDocument();
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
