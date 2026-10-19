import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container } from './container.component';

describe('Container - Unit Test', () => {
  it('Should retain content without adding an unnecessary landmark', () => {
    // Given: layout-only grouping around content.
    const { container } = render(
      <Container>
        <p>Page content</p>
      </Container>,
    );

    // When: reading its public content.
    const content = screen.getByText('Page content');

    // Then: content remains present without changing its document semantics.
    expect(content).toBeInTheDocument();
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });
});
