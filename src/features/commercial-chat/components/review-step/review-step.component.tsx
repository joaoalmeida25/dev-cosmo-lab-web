import { Button } from '@/components/ui/button/button.component';
import type { IChatFieldLabels, IChatReviewGroup } from '../../commercial-chat.types';

interface IReviewStepProps {
  labels: IChatFieldLabels;
  groups: ReadonlyArray<IChatReviewGroup>;
  editLabel: string;
  privacy: string;
  restartLabel: string;
  onRestart: () => void;
}

export const ReviewStep = ({
  labels,
  groups,
  editLabel,
  privacy,
  restartLabel,
  onRestart,
}: IReviewStepProps) => (
  <section aria-labelledby="chat-review-title">
    <h3
      id="chat-review-title"
      data-chat-heading
      tabIndex={-1}
      className="text-lg leading-snug font-semibold text-text-primary"
    >
      {labels.title}
    </h3>
    <p id="chat-review-hint" className="mt-3 text-sm leading-relaxed text-text-secondary">
      {labels.hint}
    </p>
    <div className="mt-4 divide-y divide-border">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`chat-review-${group.id}`} className="py-3">
          <div className="flex items-center justify-between gap-3">
            <h4 id={`chat-review-${group.id}`} className="text-sm font-semibold text-text-primary">
              {group.title}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={group.onEdit}
              aria-label={group.editLabel}
              className="min-h-11 border-transparent"
            >
              {editLabel}
            </Button>
          </div>
          <dl className="mt-1 space-y-3">
            {group.entries.map((entry) => (
              <div key={entry.label} className="min-w-0">
                <dt className="text-xs leading-relaxed text-text-secondary">{entry.label}</dt>
                <dd className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-text-primary wrap-anywhere">
                  {entry.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
    <p id="chat-send-note" className="mt-5 text-xs leading-relaxed text-text-secondary">
      {privacy}
    </p>
    <Button onClick={onRestart} variant="secondary" className="mt-4 w-full rounded-xl">
      {restartLabel}
    </Button>
  </section>
);
