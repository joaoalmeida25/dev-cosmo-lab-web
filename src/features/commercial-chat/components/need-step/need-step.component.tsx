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
    <label
      htmlFor="chat-need"
      className={`mt-7 mb-2 block text-sm font-medium ${error ? 'text-rose-400 light:text-rose-700' : 'text-text-primary'}`}
    >
      {fieldLabel}
    </label>
    {error ? (
      <p
        id="chat-need-error"
        role="alert"
        className="mb-2 text-xs leading-relaxed font-medium text-rose-400 light:text-rose-700"
      >
        {error}
      </p>
    ) : null}
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
      className={`block min-h-48 w-full resize-y scroll-mt-20 rounded-xl border bg-surface px-3.5 py-3 text-base leading-relaxed text-text-primary placeholder:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${error ? 'border-rose-500 focus-visible:border-rose-500 focus-visible:outline-rose-500' : 'border-border focus-visible:border-accent'}`}
    />
    <p id="chat-need-counter" className="mt-2 text-right text-xs text-text-secondary">
      {counter}
    </p>
  </section>
);
