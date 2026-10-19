import { ChevronDown } from 'lucide-react';
import type { IChatFieldLabels, IChatOption, Deadline, Budget } from '../../commercial-chat.types';

interface IProjectDetailsStepProps {
  labels: IChatFieldLabels;
  deadline: Deadline;
  budget: Budget;
  deadlineLabel: string;
  budgetLabel: string;
  budgetHint: string;
  deadlineOptions: ReadonlyArray<IChatOption<Deadline>>;
  budgetOptions: ReadonlyArray<IChatOption<Budget>>;
  onDeadlineChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
}

export const ProjectDetailsStep = ({
  labels,
  deadline,
  budget,
  deadlineLabel,
  budgetLabel,
  budgetHint,
  deadlineOptions,
  budgetOptions,
  onDeadlineChange,
  onBudgetChange,
}: IProjectDetailsStepProps) => (
  <section aria-labelledby="chat-details-title">
    <h3
      id="chat-details-title"
      data-chat-heading
      tabIndex={-1}
      className="text-lg leading-snug font-semibold text-text-primary"
    >
      {labels.title}
    </h3>
    <p id="chat-details-hint" className="mt-3 text-sm leading-relaxed text-text-secondary">
      {labels.hint}
    </p>
    <div className="mt-7 grid gap-6">
      <div>
        <label htmlFor="chat-deadline" className="mb-2 block text-sm font-medium text-text-primary">
          {deadlineLabel}
        </label>
        <div className="relative">
          <select
            id="chat-deadline"
            name="deadline"
            value={deadline}
            onChange={(event) => onDeadlineChange(event.currentTarget.value)}
            aria-describedby="chat-details-hint"
            className="min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-border bg-surface py-3 pr-10 pl-3.5 text-base text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            {deadlineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-4 right-3.5 size-4 text-text-secondary"
          />
        </div>
      </div>
      <div>
        <label htmlFor="chat-budget" className="mb-2 block text-sm font-medium text-text-primary">
          {budgetLabel}
        </label>
        <div className="relative">
          <select
            id="chat-budget"
            name="budget"
            value={budget}
            onChange={(event) => onBudgetChange(event.currentTarget.value)}
            aria-describedby="chat-budget-hint"
            className="min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-border bg-surface py-3 pr-10 pl-3.5 text-base text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-4 right-3.5 size-4 text-text-secondary"
          />
        </div>
        <p id="chat-budget-hint" className="mt-3 text-xs leading-relaxed text-text-secondary">
          {budgetHint}
        </p>
      </div>
    </div>
  </section>
);
