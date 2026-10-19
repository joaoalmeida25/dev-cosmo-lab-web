import type { IChatOption, ChatServiceId } from '../../commercial-chat.types';

interface IServiceStepProps {
  title: string;
  options: ReadonlyArray<IChatOption<ChatServiceId>>;
  value: ChatServiceId | '';
  error?: string;
  otherService: {
    label: string;
    value: string;
    maxLength: number;
    error?: string;
    onChange: (value: string) => void;
  } | null;
  onChange: (value: ChatServiceId) => void;
}

export const ServiceStep = ({
  title,
  options,
  value,
  error,
  otherService,
  onChange,
}: IServiceStepProps) => (
  <fieldset aria-describedby={error ? 'chat-service-error' : undefined}>
    <legend
      id="chat-service-title"
      className={`mb-5 text-lg leading-snug font-semibold ${error ? 'text-rose-400 light:text-rose-700' : 'text-text-primary'}`}
      data-chat-heading
      tabIndex={-1}
    >
      {title}
    </legend>
    {error ? (
      <p
        id="chat-service-error"
        role="alert"
        className="mb-3 text-xs leading-relaxed font-medium text-rose-400 light:text-rose-700"
      >
        {error}
      </p>
    ) : null}
    <div className="grid gap-3">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm leading-snug text-text-primary transition-colors hover:border-accent motion-reduce:transition-none ${error ? 'border-rose-500 bg-surface' : value === option.value ? 'border-accent bg-primary-soft' : 'border-border bg-surface'}`}
        >
          <input
            type="radio"
            name="chat-service"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            required
            data-chat-invalid={error ? true : undefined}
            aria-describedby={error ? 'chat-service-error' : undefined}
            className="size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
    {otherService ? (
      <div className="mt-5">
        <label
          htmlFor="chat-other-service"
          className={`mb-2 block text-sm font-medium ${otherService.error ? 'text-rose-400 light:text-rose-700' : 'text-text-primary'}`}
        >
          {otherService.label}
        </label>
        {otherService.error ? (
          <p
            id="chat-other-service-error"
            role="alert"
            className="mb-2 text-xs leading-relaxed font-medium text-rose-400 light:text-rose-700"
          >
            {otherService.error}
          </p>
        ) : null}
        <input
          id="chat-other-service"
          name="otherService"
          type="text"
          required
          maxLength={otherService.maxLength}
          value={otherService.value}
          onChange={(event) => otherService.onChange(event.currentTarget.value)}
          aria-invalid={otherService.error ? true : undefined}
          aria-describedby={otherService.error ? 'chat-other-service-error' : undefined}
          className={`min-h-12 w-full scroll-mt-20 rounded-xl border bg-surface px-3.5 py-3 text-base text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${otherService.error ? 'border-rose-500 focus-visible:border-rose-500 focus-visible:outline-rose-500' : 'border-border'}`}
        />
      </div>
    ) : null}
  </fieldset>
);
