import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ServiceStep } from './service-step.component';
import type { ChatServiceId, IChatOption } from '../../commercial-chat.types';

const options: ReadonlyArray<IChatOption<ChatServiceId>> = [
  { value: 'sites', label: 'Sites' },
  { value: 'others', label: 'Others' },
];

describe('ServiceStep - Unit Test', () => {
  it('Should request a typed service selection without adding invalid feedback to radio choices', async () => {
    // Given: the mandatory service group with no selected option.
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ServiceStep
        title="Service"
        options={options}
        value=""
        otherService={null}
        onChange={onChange}
      />,
    );

    // When: selecting a service by its accessible label.
    await user.click(screen.getByRole('radio', { name: 'Sites' }));

    // Then: the controller receives the ID and options remain free of field-error semantics.
    expect(onChange).toHaveBeenCalledWith('sites');
    expect(screen.getByRole('group', { name: 'Service' })).toBeInTheDocument();

    for (const option of screen.getAllByRole('radio')) {
      expect(option).toBeRequired();
      expect(option).not.toHaveAttribute('aria-invalid');
      expect(option.parentElement).not.toHaveClass('border-rose-500');
    }

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('Should display and recover the custom service error while delegating its value', async () => {
    // Given: Others selected with a rejected custom service.
    const user = userEvent.setup();
    const change = vi.fn();
    const other = {
      label: 'Custom service',
      value: '',
      maxLength: 120,
      error: 'Provide at least two characters',
      onChange: change,
    };

    const { rerender } = render(
      <ServiceStep
        title="Service"
        options={options}
        value="others"
        otherService={other}
        onChange={vi.fn()}
      />,
    );

    const input = screen.getByRole('textbox', { name: other.label });
    const invalid = input.getAttribute('aria-invalid');
    const errorDescription = input.getAttribute('aria-describedby');

    // When: entering a character and then receiving a corrected controlled value.
    await user.type(input, 'X');
    rerender(
      <ServiceStep
        title="Service"
        options={options}
        value="others"
        otherService={{ ...other, value: 'UX', error: undefined }}
        onChange={vi.fn()}
      />,
    );

    // Then: error state is scoped to the custom input and disappears after correction.
    expect(invalid).toBe('true');
    expect(errorDescription).toBe('chat-other-service-error');
    expect(change).toHaveBeenCalledWith('X');
    expect(input).toHaveValue('UX');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Others' })).toBeChecked();
  });
});
