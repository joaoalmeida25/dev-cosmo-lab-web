import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProductDetailSection } from './product-detail-section.component';

describe('ProductDetailSection - Unit Test', () => {
  it.each(['split', 'stacked'] as const)(
    'Should preserve the named region, introduction and children in the %s layout',
    (layout) => {
      // Given: a detail section with caller-owned content and introduction.
      const title = 'Included materials';

      // When: composing the section in the requested layout.
      render(
        <ProductDetailSection
          id="included"
          title={title}
          introduction="Confirmed scope"
          layout={layout}
        >
          <ul>
            <li>Spreadsheet</li>
          </ul>
        </ProductDetailSection>,
      );

      // Then: both layouts share the same accessible content and anchor relationship.
      const section = screen.getByRole('region', { name: title });
      expect(within(section).getByRole('heading', { name: title })).toHaveAttribute(
        'id',
        'included',
      );
      expect(within(section).getByText('Confirmed scope')).toBeInTheDocument();
      expect(within(section).getByRole('listitem')).toHaveTextContent('Spreadsheet');
    },
  );

  it('Should omit absent introduction without losing content in the default layout', () => {
    // Given: a section whose optional introduction was not confirmed.
    const { container } = render(
      <ProductDetailSection id="faq" title="FAQ">
        <p>Question content</p>
      </ProductDetailSection>,
    );

    // When: resolving its public region and text content.
    const region = screen.getByRole('region', { name: 'FAQ' });

    // Then: only the caller's paragraph exists and the section does not fabricate introductory text.
    expect(region).toHaveTextContent('Question content');
    expect(container.querySelectorAll('p')).toHaveLength(1);
  });
});
