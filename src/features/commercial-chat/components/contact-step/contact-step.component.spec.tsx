import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContactStep } from './contact-step.component';

const props = {
  labels: { title: 'Contact', hint: 'We will reply by email' },
  nameLabel: 'Full name',
  emailLabel: 'Email',
  name: '',
  email: '',
  nameMaxLength: 100,
  emailMaxLength: 254,
  onNameChange: vi.fn(),
  onEmailChange: vi.fn(),
};

describe('ContactStep - Unit Test', () => {
  it('Should delegate name and email changes with required native input semantics', async () => {
    // Given: empty controlled contact fields.
    const user = userEvent.setup();
    render(<ContactStep {...props} />);

    // When: entering one character in each field.
    await user.type(screen.getByRole('textbox', { name: 'Full name' }), 'A');
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'a');

    // Then: each callback receives its own value and limits/autofill remain intact.
    expect(props.onNameChange).toHaveBeenCalledWith('A');
    expect(props.onEmailChange).toHaveBeenCalledWith('a');
    expect(screen.getByRole('textbox', { name: 'Full name' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Full name' })).toHaveAttribute('maxlength', '100');
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('type', 'email');
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('maxlength', '254');
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('autocomplete', 'email');
  });

  it('Should associate separate errors before each invalid input and remove them on recovery', () => {
    // Given: errors prepared by the controller for both required contact fields.
    const { rerender } = render(
      <ContactStep {...props} nameError="Enter your name" emailError="Enter a valid email" />,
    );

    const fields = screen.getAllByRole('textbox');
    const invalidStates = fields.map((field) => field.getAttribute('aria-invalid'));
    const preceding = screen
      .getAllByRole('alert')
      .map((error, index) =>
        Boolean(error.compareDocumentPosition(fields[index]) & Node.DOCUMENT_POSITION_FOLLOWING),
      );

    // When: valid contact data replaces the failed attempt.
    rerender(<ContactStep {...props} name="João Almeida" email="joao@example.com" />);

    // Then: each old error preceded its field and the corrected form exposes the general hint.
    expect(invalidStates).toEqual(['true', 'true']);
    expect(preceding).toEqual([true, true]);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription(
      props.labels.hint,
    );
  });
});
