import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LauncherSymbol } from './launcher-symbol.component';

describe('LauncherSymbol - Unit Test', () => {
  it('Should remain decorative inside an explicitly named launcher', () => {
    // Given: the symbol inside a launcher whose accessible name is provided by its owner.
    const { container } = render(
      <button aria-label="Request quote">
        <LauncherSymbol />
      </button>,
    );

    // When: inspecting the launcher and its decorative SVG contract.
    const launcher = screen.getByRole('button', { name: 'Request quote' });
    const symbol = container.querySelector('svg');

    // Then: the SVG adds neither a duplicate accessible image nor a focus stop.
    expect(launcher).toHaveAccessibleName('Request quote');
    expect(symbol).toHaveAttribute('aria-hidden', 'true');
    expect(symbol).toHaveAttribute('focusable', 'false');
    expect(symbol).not.toHaveAttribute('tabindex');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
