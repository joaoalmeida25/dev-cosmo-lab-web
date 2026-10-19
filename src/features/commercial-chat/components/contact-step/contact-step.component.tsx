import type { IChatFieldLabels } from '../../commercial-chat.types';

interface IContactStepProps {
  labels: IChatFieldLabels;
  nameLabel: string;
  emailLabel: string;
  name: string;
  email: string;
  nameMaxLength: number;
  emailMaxLength: number;
  nameError?: string;
  emailError?: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export const ContactStep = ({
  labels,
  nameLabel,
  emailLabel,
  name,
  email,
  nameMaxLength,
  emailMaxLength,
  nameError,
  emailError,
  onNameChange,
  onEmailChange,
}: IContactStepProps) => (
  <section aria-labelledby="chat-contact-title">
    <h3
      id="chat-contact-title"
      data-chat-heading
      tabIndex={-1}
      className="text-lg leading-snug font-semibold text-text-primary"
    >
      {labels.title}
    </h3>
    <p id="chat-contact-hint" className="mt-3 text-sm leading-relaxed text-text-secondary">
      {labels.hint}
    </p>
    <div className="mt-7 grid gap-6">
      <div>
        <label htmlFor="chat-name" className="mb-2 block text-sm font-medium text-text-primary">
          {nameLabel}
        </label>
        <input
          id="chat-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={nameMaxLength}
          value={name}
          onChange={(event) => onNameChange(event.currentTarget.value)}
          aria-invalid={nameError ? true : undefined}
          aria-describedby={nameError ? 'chat-name-error' : 'chat-contact-hint'}
          className="min-h-12 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-base text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        {nameError ? (
          <p
            id="chat-name-error"
            role="alert"
            className="mt-2 text-sm font-medium text-text-primary"
          >
            {nameError}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="chat-email" className="mb-2 block text-sm font-medium text-text-primary">
          {emailLabel}
        </label>
        <input
          id="chat-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          maxLength={emailMaxLength}
          value={email}
          onChange={(event) => onEmailChange(event.currentTarget.value)}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? 'chat-email-error' : 'chat-contact-hint'}
          className="min-h-12 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-base text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        {emailError ? (
          <p
            id="chat-email-error"
            role="alert"
            className="mt-2 text-sm font-medium text-text-primary"
          >
            {emailError}
          </p>
        ) : null}
      </div>
    </div>
  </section>
);
