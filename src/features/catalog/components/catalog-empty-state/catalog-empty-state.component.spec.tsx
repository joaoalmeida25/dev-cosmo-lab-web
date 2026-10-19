import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CatalogEmptyState } from './catalog-empty-state.component';

describe('CatalogEmptyState - Unit Test', () => {
  it('Should explain an empty result and delegate an explicit filter reset', async () => {
    // Given: no matching products and an available reset action.
    const user = userEvent.setup();
    const reset = vi.fn();
    render(
      <CatalogEmptyState
        title="No matching products"
        description="Try different filters"
        action="Clear filters"
        onClear={reset}
      />,
    );

    // When: activating recovery instead of following a fictional product link.
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));

    // Then: the reset is requested once and the empty-state guidance remains readable.
    expect(reset).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('heading', { name: 'No matching products' })).toBeInTheDocument();
    expect(screen.getByText('Try different filters')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
