'use client';

import {
  useEffect,
  useReducer,
  useRef,
  type MouseEvent,
  type FormEvent,
  type SyntheticEvent,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { useTranslations } from 'next-intl';
import { COMMERCIAL_CHAT_OPEN_EVENT } from './commercial-chat.constants';
import { CommercialChatView } from './commercial-chat-view.component';
import { ServiceStep } from './components/service-step/service-step.component';
import { NeedStep } from './components/need-step/need-step.component';
import { ProjectDetailsStep } from './components/project-details-step/project-details-step.component';
import { ContactStep } from './components/contact-step/contact-step.component';
import { ReviewStep } from './components/review-step/review-step.component';
import { SubmissionStatus } from './components/submission-status/submission-status.component';
import { createCommercialChatSubmission } from './services/submit-commercial-chat.service';
import {
  CHAT_STEPS,
  EMAIL_MAX_LENGTH,
  INITIAL_CHAT_STATE,
  NAME_MAX_LENGTH,
  NEED_MAX_LENGTH,
  NEED_MIN_LENGTH,
  OTHER_SERVICE_MIN_LENGTH,
  OTHER_SERVICE_MAX_LENGTH,
  commercialChatReducer,
} from './utils/commercial-chat-flow.util';
import type {
  ICommercialChatProps,
  IChatOption,
  IChatReviewGroup,
  ChatValidationError,
  EditableChatStep,
  Deadline,
  Budget,
} from './commercial-chat.types';

const DEADLINES: ReadonlyArray<Deadline> = [
  'unspecified',
  'flexible',
  'within-month',
  'one-to-three-months',
  'over-three-months',
];
const BUDGETS: ReadonlyArray<Budget> = [
  'unspecified',
  'under-5000',
  '5000-15000',
  'over-15000',
  'to-discuss',
];

export const CommercialChat = ({
  services,
  locale,
  submissionConfig = null,
}: ICommercialChatProps) => {
  const t = useTranslations('commercialChat');
  const [state, dispatch] = useReducer(commercialChatReducer, INITIAL_CHAT_STATE);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const launcherRef = useRef<HTMLElement>(null);
  const honeypotRef = useRef('');
  const submitRequestRef = useRef<ReturnType<typeof createCommercialChatSubmission> | null>(null);
  if (submitRequestRef.current === null) {
    submitRequestRef.current = createCommercialChatSubmission();
  }
  const { answers, errors, screen, discardIntent } = state;
  const progress = CHAT_STEPS.findIndex((step) => step === screen) + 1;
  const deadlineOptions: ReadonlyArray<IChatOption<Deadline>> = DEADLINES.map((value) => ({
    value,
    label: value === 'unspecified' ? t('notProvided') : t(`deadlineOptions.${value}`),
  }));
  const budgetOptions: ReadonlyArray<IChatOption<Budget>> = BUDGETS.map((value) => ({
    value,
    label: value === 'unspecified' ? t('notProvided') : t(`budgetOptions.${value}`),
  }));
  const fieldLabels = (step: 'details' | 'contact' | 'review') => ({
    title: t(`steps.${step}.title`),
    hint: t(`steps.${step}.hint`),
  });
  const errorLabel = (error: ChatValidationError | undefined) =>
    error
      ? t(`errors.${error}`, {
          min: NEED_MIN_LENGTH,
          max: NEED_MAX_LENGTH,
          nameMax: NAME_MAX_LENGTH,
          otherMin: OTHER_SERVICE_MIN_LENGTH,
          otherMax: OTHER_SERVICE_MAX_LENGTH,
        })
      : undefined;
  const edit = (step: EditableChatStep) => dispatch({ type: 'edit', step });

  useEffect(() => {
    const openFromTrigger = (event: Event) => {
      if (dialogRef.current?.open || !(event.target instanceof HTMLElement)) return;
      launcherRef.current = event.target;
      dispatch({ type: 'open' });
    };
    document.addEventListener(COMMERCIAL_CHAT_OPEN_EVENT, openFromTrigger);
    return () => document.removeEventListener(COMMERCIAL_CHAT_OPEN_EVENT, openFromTrigger);
  }, []);

  useEffect(() => {
    if (!state.isOpen) honeypotRef.current = '';
    if (!state.isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const viewport = window.visualViewport;
    let focusFrame = 0;
    const updateViewport = () => {
      dialog.dataset.compact = String((viewport?.height ?? window.innerHeight) < 520);
      dialog.style.setProperty(
        '--chat-viewport-height',
        `${viewport?.height ?? window.innerHeight}px`,
      );
      dialog.style.setProperty('--chat-viewport-top', `${viewport?.offsetTop ?? 0}px`);
      cancelAnimationFrame(focusFrame);
      focusFrame = requestAnimationFrame(() => {
        const active = document.activeElement;
        if (
          active instanceof HTMLElement &&
          dialog.contains(active) &&
          active.matches('input, textarea, select')
        ) {
          active.scrollIntoView({ block: 'nearest' });
        }
      });
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    viewport?.addEventListener('resize', updateViewport);
    viewport?.addEventListener('scroll', updateViewport);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener('resize', updateViewport);
      viewport?.removeEventListener('resize', updateViewport);
      viewport?.removeEventListener('scroll', updateViewport);
      document.body.style.overflow = previousOverflow;
      dialog.style.removeProperty('--chat-viewport-height');
      dialog.style.removeProperty('--chat-viewport-top');
      delete dialog.dataset.compact;
      if (dialog.open) dialog.close();
      launcherRef.current?.focus({ preventScroll: true });
    };
  }, [state.isOpen]);

  useEffect(() => {
    if (!state.isOpen || state.transition === 'idle') return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.focus({ preventScroll: true });
    const transition = state.transition;
    let cancelled = false;

    Promise.allSettled(dialog.getAnimations().map((animation) => animation.finished)).then(() => {
      if (!cancelled) dispatch({ type: transition === 'closing' ? 'finish-close' : 'finish-open' });
    });
    return () => {
      cancelled = true;
    };
  }, [state.isOpen, state.transition]);

  useEffect(() => {
    if (!state.isOpen || state.transition !== 'idle') return;
    const dialog = dialogRef.current;
    const target =
      dialog?.querySelector<HTMLElement>(
        '[data-chat-safe-action], [aria-invalid="true"], [data-chat-invalid="true"]',
      ) ?? dialog?.querySelector<HTMLElement>('[data-chat-heading]');
    target?.focus();
    const body = dialog?.querySelector<HTMLElement>('[data-chat-body]');
    if (body && !dialog?.querySelector('[aria-invalid="true"]')) body.scrollTop = 0;
  }, [
    state.isOpen,
    state.transition,
    screen,
    discardIntent,
    state.validationAttempt,
    state.submission.status,
  ]);

  const open = (event: MouseEvent<HTMLButtonElement>) => {
    if (state.isOpen) return;
    launcherRef.current = event.currentTarget;
    dispatch({ type: 'open' });
  };
  const requestClose = () => dispatch({ type: discardIntent ? 'cancel-discard' : 'request-close' });
  const cancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    if (state.transition === 'idle') requestClose();
  };
  const containFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return;
    if (state.transition !== 'idle') {
      event.preventDefault();
      return;
    }
    const controls = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
      ),
    ).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first || !last) {
      event.preventDefault();
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  const submit = async () => {
    if (
      !submissionConfig ||
      !submitRequestRef.current ||
      state.submission.status === 'sending' ||
      state.submission.status === 'success'
    )
      return;
    const nextState = commercialChatReducer(state, { type: 'submit' });
    dispatch({ type: 'submit' });
    if (nextState.submission.status !== 'sending') return;
    const result = await submitRequestRef.current(submissionConfig, {
      answers,
      locale,
      serviceLabel: services.find((service) => service.value === answers.service)?.label ?? '',
      deadlineLabel:
        deadlineOptions.find((option) => option.value === answers.deadline)?.label ?? '',
      budgetLabel: budgetOptions.find((option) => option.value === answers.budget)?.label ?? '',
      honeypot: honeypotRef.current,
    });
    if (result.status === 'success') dispatch({ type: 'submission-success' });
    else if (result.status === 'error')
      dispatch({ type: 'submission-error', reason: result.reason });
  };
  const continueFlow = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (screen === 'review') void submit();
    else dispatch({ type: 'next' });
  };
  const back = () => (screen === 'service' ? requestClose() : dispatch({ type: 'back' }));

  let content: ReactNode = null;
  switch (screen) {
    case 'service':
      content = (
        <ServiceStep
          title={t('steps.service.title')}
          otherService={
            answers.service === 'others'
              ? {
                  label: t('steps.service.otherLabel'),
                  value: answers.otherService,
                  maxLength: OTHER_SERVICE_MAX_LENGTH,
                  error: errorLabel(errors.otherService),
                  onChange: (value) => dispatch({ type: 'otherService', value }),
                }
              : null
          }
          options={services}
          value={answers.service}
          error={errorLabel(errors.service)}
          onChange={(value) => dispatch({ type: 'service', value })}
        />
      );
      break;
    case 'need':
      content = (
        <NeedStep
          title={t('steps.need.title')}
          fieldLabel={t('steps.need.label')}
          placeholder={t('steps.need.placeholder')}
          counter={t('steps.need.counter', { current: answers.need.length, max: NEED_MAX_LENGTH })}
          maxLength={NEED_MAX_LENGTH}
          value={answers.need}
          error={errorLabel(errors.need)}
          onChange={(value) => dispatch({ type: 'need', value })}
        />
      );
      break;
    case 'details':
      content = (
        <ProjectDetailsStep
          labels={fieldLabels('details')}
          deadline={answers.deadline}
          budget={answers.budget}
          deadlineLabel={t('steps.details.deadline')}
          budgetLabel={t('steps.details.budget')}
          budgetHint={t('steps.details.budgetHint')}
          deadlineOptions={deadlineOptions}
          budgetOptions={budgetOptions}
          onDeadlineChange={(value) => {
            const option = deadlineOptions.find((entry) => entry.value === value);
            if (option) dispatch({ type: 'deadline', value: option.value });
          }}
          onBudgetChange={(value) => {
            const option = budgetOptions.find((entry) => entry.value === value);
            if (option) dispatch({ type: 'budget', value: option.value });
          }}
        />
      );
      break;
    case 'contact':
      content = (
        <ContactStep
          labels={fieldLabels('contact')}
          nameLabel={t('steps.contact.name')}
          emailLabel={t('steps.contact.email')}
          name={answers.name}
          email={answers.email}
          nameMaxLength={NAME_MAX_LENGTH}
          emailMaxLength={EMAIL_MAX_LENGTH}
          nameError={errorLabel(errors.name)}
          emailError={errorLabel(errors.email)}
          onNameChange={(value) => dispatch({ type: 'name', value })}
          onEmailChange={(value) => dispatch({ type: 'email', value })}
        />
      );
      break;
    case 'review': {
      const groups: ReadonlyArray<IChatReviewGroup> = [
        {
          id: 'service',
          title: t('review.service'),
          editLabel: t('review.edit', { section: t('review.service') }),
          entries: [
            {
              label: t('review.service'),
              value: services.find((service) => service.value === answers.service)?.label ?? '',
            },
            ...(answers.service === 'others'
              ? [{ label: t('steps.service.otherLabel'), value: answers.otherService.trim() }]
              : []),
          ],
          onEdit: () => edit('service'),
        },
        {
          id: 'need',
          title: t('review.need'),
          editLabel: t('review.edit', { section: t('review.need') }),
          entries: [{ label: t('review.need'), value: answers.need }],
          onEdit: () => edit('need'),
        },
        {
          id: 'details',
          title: t('review.details'),
          editLabel: t('review.edit', { section: t('review.details') }),
          entries: [
            {
              label: t('review.deadline'),
              value:
                deadlineOptions.find((option) => option.value === answers.deadline)?.label ?? '',
            },
            {
              label: t('review.budget'),
              value: budgetOptions.find((option) => option.value === answers.budget)?.label ?? '',
            },
          ],
          onEdit: () => edit('details'),
        },
        {
          id: 'contact',
          title: t('review.contact'),
          editLabel: t('review.edit', { section: t('review.contact') }),
          entries: [
            { label: t('review.name'), value: answers.name },
            { label: t('review.email'), value: answers.email },
          ],
          onEdit: () => edit('contact'),
        },
      ];
      content = (
        <ReviewStep
          labels={fieldLabels('review')}
          groups={groups}
          editLabel={t('review.editAction')}
          privacy={t('privacy.notice')}
          restartLabel={t('actions.restart')}
          onRestart={() => dispatch({ type: 'request-restart' })}
        />
      );
      break;
    }
  }

  return (
    <CommercialChatView
      dialogRef={dialogRef}
      screen={screen}
      isOpen={state.isOpen}
      isEditing={state.editing}
      transition={state.transition}
      progress={progress}
      content={content}
      submissionStatus={state.submission.status}
      canSubmit={Boolean(submissionConfig)}
      disableContinue={state.validatedStep === screen && Object.keys(errors).length > 0}
      onHoneypotChange={(value) => {
        honeypotRef.current = value;
      }}
      submissionContent={
        state.submission.status === 'idle' ? null : (
          <SubmissionStatus
            state={
              state.submission.status === 'error'
                ? {
                    status: 'error',
                    onRetry: () => {
                      void submit();
                    },
                    onReview: () => dispatch({ type: 'return-review' }),
                  }
                : state.submission.status === 'success'
                  ? { status: 'success', onClose: requestClose }
                  : { status: 'sending' }
            }
            title={t(`submission.${state.submission.status}.title`)}
            description={
              state.submission.status === 'error'
                ? t(`submission.errors.${state.submission.reason}`)
                : t(`submission.${state.submission.status}.description`)
            }
            actionLabel={t(`submission.${state.submission.status}.action`)}
            reviewLabel={t('actions.review')}
          />
        )
      }
      discard={
        discardIntent
          ? {
              title: t('discard.title'),
              description: t('discard.description'),
              cancel: t('discard.cancel'),
              confirm: t(discardIntent === 'close' ? 'discard.close' : 'discard.restart'),
            }
          : null
      }
      labels={{
        brand: t('brand'),
        launcher: t('launcher'),
        title: t('title'),
        close: discardIntent ? t('discard.cancel') : t('actions.close'),
        welcomeTitle: t('welcome.title'),
        welcomeDescription: t('welcome.description'),
        start: t('welcome.start'),
        progress: t('progress', { current: progress, total: CHAT_STEPS.length }),
        progressLabel: t('progressLabel'),
        back: state.editing
          ? t('actions.review')
          : screen === 'service'
            ? t('actions.close')
            : t('actions.back'),
        next: t('actions.next'),
        save: t('actions.save'),
        send: t('actions.send'),
      }}
      onOpen={open}
      onClose={requestClose}
      onCancel={cancel}
      onKeyDown={containFocus}
      onStart={() => dispatch({ type: 'start' })}
      onContinue={continueFlow}
      onBack={back}
      onCancelDiscard={() => dispatch({ type: 'cancel-discard' })}
      onConfirmDiscard={() => {
        honeypotRef.current = '';
        dispatch({ type: 'confirm-discard' });
      }}
    />
  );
};
