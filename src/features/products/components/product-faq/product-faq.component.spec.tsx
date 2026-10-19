import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ProductFaq } from './product-faq.component';

describe('ProductFaq - Unit Test', () => {
  it('Should expand and collapse native FAQ disclosures without changing their answers', async () => {
    // Given: one question and its confirmed answer.
    const user = userEvent.setup();
    render(
      <ProductFaq
        items={[{ question: 'Is this a digital kit?', answer: 'Yes, downloadable files.' }]}
      />,
    );
    const question = screen.getByText('Is this a digital kit?');

    // When: activating the native disclosure twice through its summary.
    await user.click(question);
    const expanded = question.closest('details')?.hasAttribute('open');
    await user.click(question);

    // Then: the first activation opened the disclosure and the second closed it without losing content.
    expect(expanded).toBe(true);
    expect(question.closest('details')).not.toHaveAttribute('open');
    expect(screen.getByText('Yes, downloadable files.')).toBeInTheDocument();
  });

  it('Should create no invented question for an empty FAQ', () => {
    // Given: no confirmed FAQ entries.
    const { container } = render(<ProductFaq items={[]} />);

    // When: inspecting available disclosure controls.
    const disclosures = container.querySelectorAll('details');

    // Then: no fabricated question or answer is shown.
    expect(disclosures).toHaveLength(0);
  });
});
