import type {
  IChatAnswers,
  IChatState,
  ChatStep,
  ChatScreen,
  ChatErrors,
  ChatAction,
} from '../commercial-chat.types';

export const OTHER_SERVICE_MIN_LENGTH = 2;
export const OTHER_SERVICE_MAX_LENGTH = 120;

export const NEED_MIN_LENGTH = 20;
export const NEED_MAX_LENGTH = 1000;
export const NAME_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH = 254;
export const CHAT_STEPS: ReadonlyArray<ChatStep> = [
  'service',
  'need',
  'details',
  'contact',
  'review',
];

export const INITIAL_CHAT_STATE: IChatState = {
  isOpen: false,
  transition: 'idle',
  screen: 'welcome',
  answers: {
    service: '',
    otherService: '',
    need: '',
    deadline: 'unspecified',
    budget: 'unspecified',
    name: '',
    email: '',
  },
  errors: {},
  editing: false,
  discardIntent: null,
  validationAttempt: 0,
  validatedStep: null,
  submission: { status: 'idle' },
};

export const hasChatAnswers = (answers: IChatAnswers): boolean =>
  answers.service !== '' ||
  answers.otherService.length > 0 ||
  answers.need.length > 0 ||
  answers.name.length > 0 ||
  answers.email.length > 0 ||
  answers.deadline !== 'unspecified' ||
  answers.budget !== 'unspecified';

export const validateChatStep = (screen: ChatScreen, answers: IChatAnswers): ChatErrors => {
  const errors: ChatErrors = {};

  if (screen === 'service') {
    if (!answers.service) errors.service = 'serviceRequired';
    if (answers.service === 'others') {
      if (answers.otherService.trim().length < OTHER_SERVICE_MIN_LENGTH)
        errors.otherService = 'otherServiceShort';
      else if (answers.otherService.length > OTHER_SERVICE_MAX_LENGTH)
        errors.otherService = 'otherServiceLong';
    }
  }
  if (screen === 'need') {
    if (answers.need.trim().length < NEED_MIN_LENGTH) errors.need = 'needShort';
    else if (answers.need.length > NEED_MAX_LENGTH) errors.need = 'needLong';
  }
  if (screen === 'contact') {
    const name = answers.name.trim();
    const email = answers.email.trim();
    if ((name.match(/\p{L}/gu)?.length ?? 0) < 2) errors.name = 'nameInvalid';
    else if (name.length > NAME_MAX_LENGTH) errors.name = 'nameLong';
    if (
      email.length > EMAIL_MAX_LENGTH ||
      email.includes('..') ||
      !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[^\s@.]{2,}$/.test(email)
    )
      errors.email = 'emailInvalid';
  }

  return errors;
};

export const commercialChatReducer = (state: IChatState, action: ChatAction): IChatState => {
  if (action.type === 'finish-open')
    return state.transition === 'opening' ? { ...state, transition: 'idle' } : state;
  if (action.type === 'finish-close')
    return state.transition === 'closing' ? INITIAL_CHAT_STATE : state;
  if (state.transition !== 'idle') return state;
  if (
    state.submission.status === 'sending' &&
    action.type !== 'submission-success' &&
    action.type !== 'submission-error'
  )
    return state;
  if (state.submission.status === 'success' && action.type !== 'request-close') return state;
  switch (action.type) {
    case 'submit': {
      if (
        !state.isOpen ||
        state.screen !== 'review' ||
        state.discardIntent ||
        state.editing ||
        (state.submission.status !== 'idle' && state.submission.status !== 'error')
      )
        return state;
      for (const step of CHAT_STEPS) {
        const errors = validateChatStep(step, state.answers);
        if (Object.keys(errors).length)
          return {
            ...state,
            screen: step,
            errors,
            validatedStep: step,
            submission: { status: 'idle' },
            validationAttempt: state.validationAttempt + 1,
          };
      }
      return { ...state, submission: { status: 'sending' } };
    }
    case 'submission-success':
      return state.submission.status === 'sending'
        ? { ...state, answers: INITIAL_CHAT_STATE.answers, submission: { status: 'success' } }
        : state;
    case 'submission-error':
      return state.submission.status === 'sending'
        ? { ...state, submission: { status: 'error', reason: action.reason } }
        : state;
    case 'return-review':
      return state.submission.status === 'error'
        ? { ...state, submission: { status: 'idle' } }
        : state;
    case 'open':
      return state.isOpen ? state : { ...INITIAL_CHAT_STATE, isOpen: true, transition: 'opening' };
    case 'start':
      return state.isOpen && state.screen === 'welcome' ? { ...state, screen: 'service' } : state;
    case 'service':
    case 'otherService':
    case 'need':
    case 'name':
    case 'email': {
      const answers = { ...state.answers, [action.type]: action.value };
      const errors =
        state.validatedStep === state.screen
          ? validateChatStep(state.screen, answers)
          : state.errors;
      return { ...state, answers, errors };
    }
    case 'deadline':
    case 'budget':
      return { ...state, answers: { ...state.answers, [action.type]: action.value } };
    case 'next': {
      if (
        !state.isOpen ||
        state.discardIntent ||
        state.screen === 'welcome' ||
        state.screen === 'review'
      )
        return state;
      const errors = validateChatStep(state.screen, state.answers);
      if (Object.keys(errors).length)
        return {
          ...state,
          errors,
          validatedStep: state.screen,
          validationAttempt: state.validationAttempt + 1,
        };
      const answers =
        state.screen === 'contact'
          ? { ...state.answers, name: state.answers.name.trim(), email: state.answers.email.trim() }
          : state.answers;
      return {
        ...state,
        answers,
        screen: state.editing
          ? 'review'
          : (CHAT_STEPS[CHAT_STEPS.indexOf(state.screen) + 1] ?? 'review'),
        editing: false,
        errors: {},
        validatedStep: null,
      };
    }
    case 'back': {
      if (!state.isOpen || state.discardIntent) return state;
      if (state.editing) return commercialChatReducer(state, { type: 'next' });
      const index = CHAT_STEPS.findIndex((step) => step === state.screen);
      return index > 0
        ? { ...state, screen: CHAT_STEPS[index - 1], errors: {}, validatedStep: null }
        : state;
    }
    case 'edit':
      return state.isOpen && state.screen === 'review' && !state.discardIntent
        ? { ...state, screen: action.step, editing: true, errors: {}, validatedStep: null }
        : state;
    case 'request-close':
    case 'request-restart': {
      if (!state.isOpen || state.discardIntent) return state;
      if (state.submission.status === 'success') return { ...state, transition: 'closing' };
      const intent = action.type === 'request-close' ? 'close' : 'restart';
      return hasChatAnswers(state.answers)
        ? { ...state, discardIntent: intent }
        : intent === 'restart'
          ? { ...INITIAL_CHAT_STATE, isOpen: true }
          : { ...state, transition: 'closing' };
    }
    case 'cancel-discard':
      return { ...state, discardIntent: null };
    case 'confirm-discard':
      return state.discardIntent
        ? state.discardIntent === 'restart'
          ? { ...INITIAL_CHAT_STATE, isOpen: true }
          : { ...state, transition: 'closing' }
        : state;
  }
};
