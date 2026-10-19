import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CatalogFilters } from './catalog-filters.component';
import type { IFilterGroup } from '../../catalog.types';

const groups: ReadonlyArray<IFilterGroup> = [
  {
    key: 'status',
    label: 'Availability',
    selected: 'all',
    options: [
      { value: 'all', label: 'All', count: 3 },
      { value: 'available', label: 'Available', count: 1 },
    ],
  },
];

const props = {
  isOpen: true,
  onToggle: vi.fn(),
  title: 'Filters',
  clearAllLabel: 'Clear all',
  groups,
  hasCriteria: false,
  onSelect: vi.fn(),
  onClear: vi.fn(),
};

describe('CatalogFilters - Unit Test', () => {
  it('Should delegate facet selection without mutating the controlled selected option', async () => {
    // Given: a filter group with all availability statuses selected.
    const user = userEvent.setup();
    render(<CatalogFilters {...props} />);

    // When: choosing the available-only facet.
    await user.click(screen.getByRole('radio', { name: /Available/ }));

    // Then: the typed facet key and value reach the owner while controlled selection stays intact.
    expect(props.onSelect).toHaveBeenCalledWith('status', 'available');
    expect(screen.getByRole('radio', { name: /All/ })).toBeChecked();
    expect(
      within(screen.getByRole('group', { name: 'Availability' })).getByText('1'),
    ).toBeInTheDocument();
  });

  it('Should expose mobile expansion state and disable reset without criteria', async () => {
    // Given: closed filters with no resettable criterion.
    const user = userEvent.setup();
    const { rerender } = render(<CatalogFilters {...props} isOpen={false} />);
    const initialExpanded = screen
      .getByRole('button', { name: 'Filters' })
      .getAttribute('aria-expanded');

    const initialDisabled = screen
      .getByRole('button', { name: 'Clear all' })
      .hasAttribute('disabled');

    // When: requesting expansion and then clearing an active criterion.
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    rerender(<CatalogFilters {...props} hasCriteria />);
    await user.click(screen.getByRole('button', { name: 'Clear all' }));

    // Then: expansion/reset are explicit callbacks and the controlled accessibility state updates.
    expect(initialExpanded).toBe('false');
    expect(initialDisabled).toBe(true);
    expect(props.onToggle).toHaveBeenCalledTimes(1);
    expect(props.onClear).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Filters' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Filters' })).toHaveAttribute(
      'aria-controls',
      'catalog-filter-groups',
    );
  });
});
