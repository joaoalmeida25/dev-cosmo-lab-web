import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomeScene } from './home-scene.component';

describe('HomeScene - Unit Test', () => {
  it.each(['hero', 'solutions', 'laboratory'] as const)(
    'Should preserve the %s region anchor and hide the decorative boundary from accessibility',
    (scene) => {
      // Given: a named Home section with its approved scene composition.
      const { container } = render(
        <HomeScene scene={scene} id={scene} aria-label={scene}>
          <p>Section content</p>
        </HomeScene>,
      );

      // When: locating the named region.
      const region = screen.getByRole('region', { name: scene });

      // Then: anchor navigation, content and decorative SVG semantics survive.
      expect(region).toHaveAttribute('id', scene);
      expect(region).toHaveTextContent('Section content');
      expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
      expect(container.querySelector('svg')).toHaveAttribute('focusable', 'false');
    },
  );
});
