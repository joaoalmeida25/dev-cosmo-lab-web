import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SocialIcon } from './social-icon.component';

describe('SocialIcon - Unit Test', () => {
  it.each(['youtube', 'instagram'] as const)(
    'Should keep the %s symbol decorative within its named social link',
    (id) => {
      // Given: the network symbol inside a link whose owner provides an accessible name.
      const { container } = render(
        <a href="https://example.com" aria-label={id}>
          <SocialIcon id={id} />
        </a>,
      );

      // When: inspecting the network's accessible link contract.
      const link = screen.getByRole('link', { name: id });
      const icon = container.querySelector('svg');

      // Then: either artwork branch preserves the link name without a duplicate image announcement.
      expect(link).toHaveAccessibleName(id);
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    },
  );
});
