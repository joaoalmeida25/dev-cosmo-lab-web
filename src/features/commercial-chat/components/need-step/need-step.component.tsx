interface INeedStepProps {
  title: string;
  fieldLabel: string;
  placeholder: string;
  counter: string;
  maxLength: number;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const NeedStep = ({
  title,
  fieldLabel,
  placeholder,
  counter,
  maxLength,
  value,
  error,
  onChange,
}: INeedStepProps) => (
  <section aria-labelledby="chat-need-title">
    <h3
      id="chat-need-title"
      data-chat-heading
      tabIndex={-1}
      className="text-lg leading-snug font-semibold text-text-primary"
    >
      {title}
    </h3>
    <label htmlFor="chat-need" className="mt-7 mb-2 block text-sm font-medium text-text-primary">
      {fieldLabel}
    </label>
    <textarea
      id="chat-need"
      name="need"
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      required
      maxLength={maxLength}
      rows={7}
      placeholder={placeholder}
      aria-invalid={error ? true : undefined}
      aria-describedby={`chat-need-counter${error ? ' chat-need-error' : ''}`}
      className="block min-h-48 w-full resize-y rounded-xl border border-border bg-surface px-3.5 py-3 text-base leading-relaxed text-text-primary placeholder:text-text-secondary focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    />
    <p id="chat-need-counter" className="mt-2 text-right text-xs text-text-secondary">
      {counter}
    </p>
    {error ? (
      <p id="chat-need-error" role="alert" className="mt-2 text-sm font-medium text-text-primary">
        {error}
      </p>
    ) : null}
  </section>
);
