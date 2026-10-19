import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './select.component';

const options = [
  { value: 'first', label: 'First' },
  { value: 'blocked', label: 'Unavailable', disabled: true },
  { value: 'last', label: 'Last' },
];

describe('Select - Unit Test', () => {
  it('Should expose the selected label and choose enabled options with the keyboard', async () => {
    // Given: a real Radix select with one disabled option.
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select
        id="choice"
        label="Sort"
        value="first"
        options={options}
        onValueChange={onValueChange}
      />,
    );

    // When: opening by keyboard and moving to the last enabled option.
    screen.getByRole('combobox', { name: 'Sort' }).focus();
    await user.keyboard('{ArrowDown}{End}{Enter}');

    // Then: the controller emits only an enabled typed value.
    expect(onValueChange).toHaveBeenCalledWith('last');
    expect(onValueChange).not.toHaveBeenCalledWith('blocked');
  });

  it('Should support disabled controls and retain a value when its option is unavailable', () => {
    // Given: an unavailable selection and a disabled trigger.
    render(
      <Select
        id="disabled-choice"
        label="Sort"
        value="missing"
        options={options}
        disabled
        describedBy="guidance"
        onValueChange={vi.fn()}
      />,
    );

    // When: finding the semantic trigger.
    const trigger = screen.getByRole('combobox', { name: 'Sort' });

    // Then: interaction is disabled while the current value and guidance remain exposed.
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveTextContent('missing');
    expect(trigger).toHaveAttribute('aria-describedby', 'guidance');
  });
});
