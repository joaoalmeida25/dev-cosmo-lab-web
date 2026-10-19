import type {
  RefObject,
  ReactNode,
  MouseEventHandler,
  FormEventHandler,
  ReactEventHandler,
  KeyboardEventHandler,
} from 'react';
import type { ServiceId } from '@/constants/services.constants';
import type { SupportedLocale } from '@/i18n/locale.types';

export type ChatServiceId = Exclude<ServiceId, 'commerce'> | 'others';
export type ChatTransition = 'idle' | 'opening' | 'closing';

export type ChatStep = 'service' | 'need' | 'details' | 'contact' | 'review';
export type EditableChatStep = Exclude<ChatStep, 'review'>;
export type ChatScreen = 'welcome' | ChatStep;
export type Deadline =
  'unspecified' | 'flexible' | 'within-month' | 'one-to-three-months' | 'over-three-months';
export type Budget = 'unspecified' | 'under-5000' | '5000-15000' | 'over-15000' | 'to-discuss';

export interface IChatAnswers {
  service: ChatServiceId | '';
  otherService: string;
  need: string;
  deadline: Deadline;
  budget: Budget;
  name: string;
  email: string;
}

export type ChatValidationError =
  | 'serviceRequired'
  | 'otherServiceShort'
  | 'otherServiceLong'
  | 'needShort'
  | 'needLong'
  | 'nameInvalid'
  | 'nameLong'
  | 'emailInvalid';
export type ChatErrors = Partial<
  Record<'service' | 'otherService' | 'need' | 'name' | 'email', ChatValidationError>
>;

export type ChatSubmissionError = 'rejected' | 'rate-limit' | 'unconfirmed' | 'spam' | 'invalid';
export type ChatSubmissionState =
  { status: 'idle' | 'sending' | 'success' } | { status: 'error'; reason: ChatSubmissionError };

export interface IChatSubmissionConfig {
  endpoint: string;
}

export interface IChatState {
  isOpen: boolean;
  transition: ChatTransition;
  screen: ChatScreen;
  answers: IChatAnswers;
  errors: ChatErrors;
  editing: boolean;
  discardIntent: 'close' | 'restart' | null;
  validationAttempt: number;
  validatedStep: ChatStep | null;
  submission: ChatSubmissionState;
}

export type ChatAction =
  | {
      type:
        | 'open'
        | 'start'
        | 'next'
        | 'back'
        | 'request-close'
        | 'request-restart'
        | 'cancel-discard'
        | 'confirm-discard'
        | 'finish-open'
        | 'finish-close';
    }
  | { type: 'submit' | 'submission-success' | 'return-review' }
  | { type: 'submission-error'; reason: ChatSubmissionError }
  | { type: 'service'; value: ChatServiceId }
  | { type: 'otherService' | 'need' | 'name' | 'email'; value: string }
  | { type: 'deadline'; value: Deadline }
  | { type: 'budget'; value: Budget }
  | { type: 'edit'; step: EditableChatStep };

export interface IChatOption<T extends string = string> {
  value: T;
  label: string;
}

export interface ICommercialChatProps {
  services: ReadonlyArray<IChatOption<ChatServiceId>>;
  locale: SupportedLocale;
  submissionConfig?: IChatSubmissionConfig | null;
}

export interface IChatFieldLabels {
  title: string;
  hint: string;
}

export interface IChatReviewGroup {
  id: EditableChatStep;
  title: string;
  editLabel: string;
  entries: ReadonlyArray<{ label: string; value: string }>;
  onEdit: () => void;
}

export interface ICommercialChatViewProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  screen: ChatScreen;
  isOpen: boolean;
  isEditing: boolean;
  transition?: ChatTransition;
  discard: { title: string; description: string; confirm: string; cancel: string } | null;
  labels: {
    brand: string;
    launcher: string;
    title: string;
    close: string;
    welcomeTitle: string;
    welcomeDescription: string;
    start: string;
    progress: string;
    progressLabel: string;
    back: string;
    next: string;
    save: string;
    send: string;
  };
  progress: number;
  content: ReactNode;
  submissionContent?: ReactNode;
  submissionStatus?: ChatSubmissionState['status'];
  canSubmit?: boolean;
  disableContinue?: boolean;
  onHoneypotChange?: (value: string) => void;
  onOpen: MouseEventHandler<HTMLButtonElement>;
  onClose: () => void;
  onCancel: ReactEventHandler<HTMLDialogElement>;
  onKeyDown?: KeyboardEventHandler<HTMLDialogElement>;
  onStart: () => void;
  onContinue: FormEventHandler<HTMLFormElement>;
  onBack: () => void;
  onCancelDiscard: () => void;
  onConfirmDiscard: () => void;
}

export type ChatSubmissionPresentation =
  | { status: 'sending' }
  | { status: 'success'; onClose: () => void }
  | { status: 'error'; onRetry: () => void; onReview?: () => void };
