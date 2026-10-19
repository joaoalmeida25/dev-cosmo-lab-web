import { Check, CircleAlert, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button/button.component';
import type { ChatSubmissionPresentation } from '../../commercial-chat.types';

interface ISubmissionStatusProps {
  state: ChatSubmissionPresentation;
  title: string;
  description: string;
  actionLabel: string;
  reviewLabel?: string;
}

export const SubmissionStatus = ({
  state,
  title,
  description,
  actionLabel,
  reviewLabel,
}: ISubmissionStatusProps) => (
  <section
    role={state.status === 'error' ? 'alert' : 'status'}
    aria-live={state.status === 'error' ? 'assertive' : 'polite'}
    className="flex flex-col items-center gap-4 py-2 text-center"
  >
    <span
      className={`flex size-16 items-center justify-center rounded-full ${state.status === 'success' ? 'bg-emerald-500/15 text-emerald-400 light:text-emerald-700' : state.status === 'error' ? 'bg-rose-500/15 text-rose-400 light:text-rose-700' : 'bg-primary-soft text-accent'}`}
    >
      {state.status === 'sending' ? (
        <LoaderCircle
          aria-hidden="true"
          className="size-10 animate-spin motion-reduce:animate-none"
        />
      ) : state.status === 'success' ? (
        <Check aria-hidden="true" className="size-8" />
      ) : (
        <CircleAlert aria-hidden="true" className="size-8" />
      )}
    </span>
    <h2
      id="chat-title"
      data-chat-heading
      tabIndex={-1}
      className="rounded-sm text-xl font-semibold text-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
    >
      {title}
    </h2>
    <p id="chat-description" className="text-sm leading-relaxed text-text-secondary">
      {description}
    </p>
    {state.status === 'sending' ? (
      <Button size="lg" disabled className="w-full rounded-xl">
        {actionLabel}
      </Button>
    ) : (
      <Button
        variant={state.status === 'error' ? 'primary' : 'secondary'}
        size="lg"
        onClick={state.status === 'error' ? state.onRetry : state.onClose}
        className="w-full rounded-xl"
      >
        {actionLabel}
      </Button>
    )}
    {state.status === 'error' && state.onReview && reviewLabel ? (
      <Button size="lg" variant="secondary" onClick={state.onReview} className="w-full rounded-xl">
        {reviewLabel}
      </Button>
    ) : null}
  </section>
);
