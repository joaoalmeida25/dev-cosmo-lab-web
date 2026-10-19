import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Section } from './section.component';

describe('Section - Unit Test', () => {
  it.each([undefined, 'custom'])(
    'Should preserve section landmarks, anchors and children with class %s',
    (className) => {
      // Given: a named region and an anchor consumed by site navigation.
      render(
        <Section id="services" aria-labelledby="services-title" className={className}>
          <h2 id="services-title">Services</h2>
          <p>Custom software</p>
        </Section>,
      );

      // When: resolving the region through its semantic title.
      const region = screen.getByRole('region', { name: 'Services' });

      // Then: native attributes and children remain intact.
      expect(region).toHaveAttribute('id', 'services');
      expect(region).toHaveTextContent('Custom software');
    },
  );
});
