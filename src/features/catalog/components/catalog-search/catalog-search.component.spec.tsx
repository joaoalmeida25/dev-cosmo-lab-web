import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CatalogSearch } from './catalog-search.component';

const props = {
  inputRef: createRef<HTMLInputElement>(),
  value: '',
  label: 'Search products',
  placeholder: 'Product name',
  clearLabel: 'Clear search',
  onChange: vi.fn(),
  onClear: vi.fn(),
};

describe('CatalogSearch - Unit Test', () => {
  it('Should delegate user input and expose bounded search semantics through its ref', async () => {
    // Given: an empty controlled search field.
    const user = userEvent.setup();
    render(<CatalogSearch {...props} />);

    // When: entering a query character.
    await user.type(screen.getByRole('searchbox', { name: props.label }), 'a');

    // Then: the owner receives the query and can focus the bounded results-linked field.
    expect(props.onChange).toHaveBeenCalledWith('a');
    expect(props.inputRef.current).toBe(screen.getByRole('searchbox'));
    expect(screen.getByRole('searchbox')).toHaveAttribute('maxlength', '240');
    expect(screen.getByRole('searchbox')).toHaveAttribute('aria-controls', 'catalog-results');
    expect(screen.queryByRole('button', { name: props.clearLabel })).not.toBeInTheDocument();
  });

  it('Should offer a clear action only for a nonempty query', async () => {
    // Given: a query supplied by URL state.
    const user = userEvent.setup();
    const { rerender } = render(<CatalogSearch {...props} value="kit" />);

    // When: requesting clear and receiving the cleared controlled state.
    await user.click(screen.getByRole('button', { name: props.clearLabel }));
    rerender(<CatalogSearch {...props} />);

    // Then: clear is delegated once and its unavailable action disappears.
    expect(props.onClear).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
