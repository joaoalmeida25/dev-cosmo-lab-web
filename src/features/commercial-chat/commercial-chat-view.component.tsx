import Image from 'next/image';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button/button.component';
import { LauncherSymbol } from './components/launcher-symbol/launcher-symbol.component';
import type { ChatScreen, ICommercialChatViewProps } from './commercial-chat.types';
import styles from './commercial-chat-view.module.css';
import { Fragment } from 'react';

const DESCRIPTION_IDS: Record<ChatScreen, string> = {
  welcome: 'chat-description',
  service: 'chat-service-title',
  need: 'chat-need-title',
  details: 'chat-details-hint',
  contact: 'chat-contact-hint',
  review: 'chat-review-hint',
};

export const CommercialChatView = ({
  dialogRef,
  screen,
  isOpen,
  isEditing,
  transition = 'idle',
  discard,
  labels,
  progress,
  content,
  submissionContent,
  submissionStatus = 'idle',
  canSubmit = false,
  onHoneypotChange,
  onOpen,
  onClose,
  onCancel,
  onKeyDown,
  onStart,
  onContinue,
  onBack,
  onCancelDiscard,
  onConfirmDiscard,
}: ICommercialChatViewProps) => (
  <Fragment>
    <Button
      variant="primary"
      size="icon"
      className={styles.launcher}
      aria-label={labels.launcher}
      aria-haspopup="dialog"
      aria-controls="commercial-chat"
      aria-expanded={isOpen}
      onClick={onOpen}
    >
      <LauncherSymbol />
    </Button>
    <dialog
      ref={dialogRef}
      id="commercial-chat"
      className={styles.dialog}
      tabIndex={-1}
      data-transition={transition}
      data-screen={discard ? 'discard' : submissionStatus !== 'idle' ? 'submission' : screen}
      aria-busy={submissionStatus === 'sending'}
      role={discard ? 'alertdialog' : undefined}
      aria-modal="true"
      aria-labelledby="chat-title"
      aria-describedby={
        discard || submissionStatus !== 'idle' ? 'chat-description' : DESCRIPTION_IDS[screen]
      }
      onCancel={onCancel}
      onKeyDown={onKeyDown}
    >
      <div className="contents" inert={transition !== 'idle'}>
        <header className="flex shrink-0 items-center justify-between gap-3 px-6 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <Image
              src="/assets/devcosmo/brand/orbit-symbol-transparent.png"
              alt=""
              width={1254}
              height={1254}
              sizes="36px"
              loading="eager"
              className="size-7 shrink-0 object-contain"
            />
            <span className="text-[10px] font-semibold tracking-wide text-text-primary">
              {labels.brand}
            </span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="size-11 border-transparent"
            aria-label={labels.close}
            disabled={submissionStatus === 'sending'}
            onClick={onClose}
          >
            <X aria-hidden="true" strokeWidth={1.75} />
          </Button>
        </header>
        {discard ? (
          <div className={`${styles.body} flex flex-col [justify-content:safe_center]`}>
            <h2
              id="chat-title"
              data-chat-heading
              tabIndex={-1}
              className="text-2xl leading-tight font-semibold text-text-primary"
            >
              {discard.title}
            </h2>
            <p id="chat-description" className="mt-4 text-sm leading-relaxed text-text-secondary">
              {discard.description}
            </p>
            <div className="mt-7 grid gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={onCancelDiscard}
                data-chat-safe-action
                className="w-full rounded-xl"
              >
                {discard.cancel}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onConfirmDiscard}
                className="w-full rounded-xl"
              >
                {discard.confirm}
              </Button>
            </div>
          </div>
        ) : submissionStatus !== 'idle' ? (
          <div className={styles.body} data-chat-body>
            {submissionContent}
          </div>
        ) : screen === 'welcome' ? (
          <div className={`${styles.body} flex flex-col [justify-content:safe_center]`}>
            <Image
              src="/assets/devcosmo/brand/orbit-symbol-transparent.png"
              alt=""
              width={1254}
              height={1254}
              sizes="88px"
              loading="eager"
              className="mx-auto mb-7 size-22 shrink-0 object-contain"
            />
            <h2
              id="chat-title"
              data-chat-heading
              tabIndex={-1}
              className="text-2xl leading-tight font-semibold text-text-primary"
            >
              {labels.welcomeTitle}
            </h2>
            <p id="chat-description" className="mt-4 text-base leading-relaxed text-text-secondary">
              {labels.welcomeDescription}
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={onStart}
              rightIcon={<ArrowRight aria-hidden="true" />}
              className="mt-7 w-full rounded-xl"
            >
              {labels.start}
            </Button>
          </div>
        ) : (
          <Fragment>
            <div className="shrink-0 px-6 pt-4">
              <h2
                id="chat-title"
                data-chat-summary
                className="text-2xl leading-tight font-semibold text-text-primary"
              >
                {labels.title}
              </h2>
              <p
                data-chat-progress-label
                className="mt-5 text-[11px] font-medium text-text-secondary uppercase"
              >
                {labels.progress}
              </p>
              <div
                role="progressbar"
                aria-label={labels.progressLabel}
                aria-valuemin={1}
                aria-valuemax={5}
                aria-valuenow={progress}
                aria-valuetext={labels.progress}
                className="mt-2 flex gap-1.5"
              >
                {[1, 2, 3, 4, 5].map((position) => (
                  <span
                    key={position}
                    className={`h-1 flex-1 rounded-full ${position <= progress ? 'bg-primary' : 'bg-border'}`}
                  />
                ))}
              </div>
            </div>
            <form noValidate onSubmit={onContinue} className="flex min-h-0 flex-1 flex-col">
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                onChange={(event) => onHoneypotChange?.(event.currentTarget.value)}
              />
              <div className={styles.body} data-chat-body>
                <div className={styles.step} key={screen}>
                  {content}
                </div>
              </div>
              <footer data-chat-footer className="mx-6 shrink-0 border-t border-border py-4">
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3">
                  <Button variant="secondary" size="lg" onClick={onBack} className="rounded-xl">
                    {labels.back}
                  </Button>
                  {screen === 'review' ? (
                    <Button
                      variant="primary"
                      size="lg"
                      type="submit"
                      disabled={!canSubmit}
                      aria-describedby="chat-send-note"
                      className="rounded-xl"
                    >
                      {labels.send}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      type="submit"
                      rightIcon={<ArrowRight aria-hidden="true" />}
                      className="rounded-xl"
                    >
                      {isEditing ? labels.save : labels.next}
                    </Button>
                  )}
                </div>
              </footer>
            </form>
          </Fragment>
        )}
      </div>
    </dialog>
  </Fragment>
);
