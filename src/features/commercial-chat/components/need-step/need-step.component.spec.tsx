import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NeedStep } from './need-step.component';

const props = {
  title: 'Project goals',
  fieldLabel: 'Description',
  placeholder: 'Describe the project',
  counter: '5 / 1000',
  maxLength: 1000,
  value: 'Short',
  onChange: vi.fn(),
};

describe('NeedStep - Unit Test', () => {
  it('Should expose the required description and report changes without submitting', async () => {
    // Given: a controlled short description without a validation attempt.
    const user = userEvent.setup();
    render(<NeedStep {...props} />);

    // When: appending a character to the field.
    await user.type(screen.getByRole('textbox', { name: 'Description' }), '!');

    // Then: the value is delegated and required/counter semantics remain explicit.
    expect(props.onChange).toHaveBeenCalledWith('Short!');
    expect(screen.getByRole('textbox')).toBeRequired();
    expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '1000');
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('5 / 1000');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('Should place validation feedback before the textarea and clear it after correction', () => {
    // Given: a previously rejected description.
    const { rerender } = render(<NeedStep {...props} error="At least 20 characters" />);
    const input = screen.getByRole('textbox');
    const error = screen.getByRole('alert');
    const invalid = input.getAttribute('aria-invalid');
    const feedbackPrecedesInput = Boolean(
      error.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING,
    );

    // When: the controller supplies a corrected value and clears its error.
    rerender(<NeedStep {...props} value="A sufficiently detailed project description" />);

    // Then: prior feedback was accessible and current input is no longer invalid.
    expect(invalid).toBe('true');
    expect(feedbackPrecedesInput).toBe(true);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-invalid');
  });
});
