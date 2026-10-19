import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CatalogToolbar } from './catalog-toolbar.component';

const props = {
  countLabel: '3 products',
  activeFiltersLabel: 'Active filters',
  activeFilters: [{ key: 'category', label: 'Productivity', removeLabel: 'Remove Productivity' }],
  sortLabel: 'Sort',
  sort: 'editorial',
  options: [
    { value: 'editorial', label: 'Featured', disabled: false },
    { value: 'name-asc', label: 'Name', disabled: false },
  ],
  priceSortNote: 'Prices not confirmed',
  onSort: vi.fn(),
  onRemoveFilter: vi.fn(),
} as const;

describe('CatalogToolbar - Unit Test', () => {
  it('Should announce count, delegate chip removal and connect unavailable-price guidance', async () => {
    // Given: one active category and an unavailable price sort.
    const user = userEvent.setup();
    render(<CatalogToolbar {...props} />);

    // When: removing the active category chip.
    await user.click(screen.getByRole('button', { name: 'Remove Productivity' }));

    // Then: the correct key is removed and status/guidance remain accessible.
    expect(props.onRemoveFilter).toHaveBeenCalledWith('category');
    expect(screen.getByRole('status')).toHaveTextContent('3 products');
    expect(screen.getByRole('combobox', { name: 'Sort' })).toHaveAccessibleDescription(
      'Prices not confirmed',
    );
  });

  it('Should delegate enabled sort choices and omit optional chips and guidance when absent', async () => {
    // Given: a toolbar without active filters or a price restriction.
    const user = userEvent.setup();
    render(<CatalogToolbar {...props} activeFilters={[]} priceSortNote={null} />);
    screen.getByRole('combobox').focus();

    // When: choosing the final enabled sort through the real shared Select.
    await user.keyboard('{ArrowDown}{End}{Enter}');

    // Then: sorting is delegated without inventing a filter chip or description.
    expect(props.onSort).toHaveBeenCalledWith('name-asc');
    expect(screen.queryByRole('button', { name: 'Remove Productivity' })).not.toBeInTheDocument();
    expect(screen.queryByText('Prices not confirmed')).not.toBeInTheDocument();
  });
});
