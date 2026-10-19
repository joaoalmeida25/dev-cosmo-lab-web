import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProjectDetailsStep } from './project-details-step.component';

const props = {
  labels: { title: 'Timeline and budget', hint: 'Optional context' },
  deadline: 'unspecified',
  budget: 'unspecified',
  deadlineLabel: 'Deadline',
  budgetLabel: 'Budget',
  budgetHint: 'Indicative, non-binding ranges',
  deadlineOptions: [
    { value: 'unspecified', label: 'Not provided' },
    { value: 'flexible', label: 'Flexible' },
  ],
  budgetOptions: [
    { value: 'unspecified', label: 'Not provided' },
    { value: 'to-discuss', label: 'Discuss together' },
  ],
  onDeadlineChange: vi.fn(),
  onBudgetChange: vi.fn(),
} as const;

describe('ProjectDetailsStep - Unit Test', () => {
  it('Should delegate optional deadline and budget selections without requiring either field', async () => {
    // Given: both optional values initially unspecified.
    const user = userEvent.setup();
    render(<ProjectDetailsStep {...props} />);

    // When: selecting a deadline and a budget independently.
    await user.selectOptions(screen.getByRole('combobox', { name: 'Deadline' }), 'flexible');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Budget' }), 'to-discuss');

    // Then: callbacks receive exact values and the guidance remains non-binding.
    expect(props.onDeadlineChange).toHaveBeenCalledWith('flexible');
    expect(props.onBudgetChange).toHaveBeenCalledWith('to-discuss');
    expect(screen.getByRole('combobox', { name: 'Deadline' })).not.toBeRequired();
    expect(screen.getByRole('combobox', { name: 'Budget' })).not.toBeRequired();
    expect(screen.getByRole('combobox', { name: 'Budget' })).toHaveAccessibleDescription(
      props.budgetHint,
    );
  });
});
