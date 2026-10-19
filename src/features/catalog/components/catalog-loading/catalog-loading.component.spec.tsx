import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CatalogLoading } from './catalog-loading.component';

describe('CatalogLoading - Unit Test', () => {
  it('Should announce updated loading text politely without making the spinner accessible', () => {
    // Given: pending catalog navigation and a localized progress label.
    const { rerender } = render(<CatalogLoading label="Updating products" />);

    // When: the owner changes the progress label.
    rerender(<CatalogLoading label="Atualizando produtos" />);

    // Then: one live status exposes the updated label and no decorative image is announced.
    expect(screen.getByRole('status')).toHaveTextContent('Atualizando produtos');
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
