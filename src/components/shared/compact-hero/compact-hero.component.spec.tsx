import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CompactHero } from './compact-hero.component';

describe('CompactHero - Unit Test', () => {
  it('Should label its hero region from the supplied heading and keep artwork decorative', () => {
    // Given: a composed hero with its caller's title.
    const { container } = render(
      <CompactHero labelledBy="title">
        <h1 id="title">Products</h1>
      </CompactHero>,
    );

    // When: resolving the semantic hero region.
    const region = screen.getByRole('region', { name: 'Products' });

    // Then: its content remains accessible without announcing decorative art.
    expect(region).toContainElement(screen.getByRole('heading', { level: 1 }));
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
