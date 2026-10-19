import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button.component';

describe('Button - Unit Test', () => {
  it('Should default to a non-submit button, dispatch clicks and honor disabled', async () => {
    // Given: an enabled default button and a disabled primary button.
    const user = userEvent.setup();
    const click = vi.fn();
    render(
      <>
        <Button onClick={click}>Continue</Button>
        <Button variant="primary" disabled onClick={click}>
          Unavailable
        </Button>
      </>,
    );

    // When: activating both controls.
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Unavailable' }));

    // Then: only the enabled action fires and no implicit form submission is requested.
    expect(click).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveAttribute('type', 'button');
  });

  it.each(['primary', 'secondary', 'outline', 'ghost'] as const)(
    'Should preserve accessible labels and icons for variant %s',
    (variant) => {
      // Given: a submit button with decorative icons.
      render(
        <Button
          variant={variant}
          size="lg"
          type="submit"
          leftIcon={<span>Left icon</span>}
          rightIcon={<span>Right icon</span>}
        >
          Send
        </Button>,
      );

      // When: resolving its semantic button name.
      const button = screen.getByRole('button', { name: 'Send' });

      // Then: icons are decorative and explicit submit semantics survive.
      expect(button).toHaveAttribute('type', 'submit');
      expect(screen.getByText('Left icon').parentElement).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByText('Right icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    },
  );

  it.each([undefined, 'nofollow noopener'])(
    'Should secure external new-tab links while preserving existing rel %s',
    (rel) => {
      // Given: an external destination with optional existing link relations.
      render(
        <Button href="https://example.com" target="_blank" rel={rel}>
          Checkout
        </Button>,
      );

      // When: reading the public link contract.
      const link = screen.getByRole('link', { name: 'Checkout' });
      const relations = link.getAttribute('rel')?.split(' ');

      // Then: safe relations are present exactly once and custom relations remain.
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(relations).toContain('noopener');
      expect(relations).toContain('noreferrer');
      expect(new Set(relations).size).toBe(relations?.length);

      if (rel) {
        expect(relations).toContain('nofollow');
      }
    },
  );

  it('Should preserve same-tab links and expose an accessible icon-only action', () => {
    // Given: a same-tab destination and an icon control.
    render(
      <>
        <Button href="/products" rel="author" size="sm">
          Products
        </Button>
        <Button size="icon" aria-label="Close">
          <span>Decorative</span>
        </Button>
      </>,
    );

    // When: locating both by their semantic names.
    const link = screen.getByRole('link', { name: 'Products' });
    const close = screen.getByRole('button', { name: 'Close' });

    // Then: link relations and icon naming remain explicit.
    expect(link).toHaveAttribute('rel', 'author');
    expect(link).not.toHaveAttribute('target');
    expect(close).toBeEnabled();
  });
});
