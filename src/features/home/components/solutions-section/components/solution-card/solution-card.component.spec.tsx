import { render, screen } from '@testing-library/react';
import { CodeXml } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { SolutionCard } from './solution-card.component';

describe('SolutionCard - Unit Test', () => {
  it('Should expose the supplied offering while keeping its icon decorative', () => {
    // Given: an approved offering title and description.
    const title = 'Custom software';
    const description = 'Built for your workflow';

    // When: presenting that offering as a reusable card.
    render(<SolutionCard title={title} description={description} icon={CodeXml} />);

    // Then: content uses article/heading semantics without inventing a destination or icon label.
    expect(screen.getByRole('article')).toContainElement(
      screen.getByRole('heading', { level: 3, name: title }),
    );
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
