import assert from 'node:assert/strict';
import { test, mock } from 'node:test';
import { SERVICE_IDS } from '@/constants/services.constants';
import { CHAT_SERVICE_IDS } from '../commercial-chat.constants';
import type {
  ChatAction,
  IChatAnswers,
  IChatState,
  EditableChatStep,
} from '../commercial-chat.types';
import {
  CHAT_STEPS,
  INITIAL_CHAT_STATE,
  NEED_MAX_LENGTH,
  commercialChatReducer,
  hasChatAnswers,
  validateChatStep,
} from './commercial-chat-flow.util';

const validAnswers: IChatAnswers = {
  service: 'sites',
  otherService: '',
  need: 'Precisamos de um site acessível para apresentar nossos serviços.',
  deadline: 'unspecified',
  budget: 'unspecified',
  name: '  João Almeida  ',
  email: '  joao@example.com  ',
};
const review = (): IChatState => ({
  ...INITIAL_CHAT_STATE,
  isOpen: true,
  screen: 'review',
  answers: { ...validAnswers, name: 'João Almeida', email: 'joao@example.com' },
});
const act = (state: IChatState, ...actions: ReadonlyArray<ChatAction>): IChatState =>
  actions.reduce((current, action) => {
    const next = commercialChatReducer(current, action);
    return action.type === 'open' ? commercialChatReducer(next, { type: 'finish-open' }) : next;
  }, state);

test('welcome is outside the five ordered steps and opening does not advance the flow', () => {
  assert.deepEqual(CHAT_STEPS, ['service', 'need', 'details', 'contact', 'review']);
  assert.equal(commercialChatReducer(INITIAL_CHAT_STATE, { type: 'next' }), INITIAL_CHAT_STATE);
  const state = act(INITIAL_CHAT_STATE, { type: 'open' });
  assert.equal(state.screen, 'welcome');
  assert.equal(state.isOpen, true);
  assert.equal(commercialChatReducer(state, { type: 'start' }).screen, 'service');
});

test('chat services are independent from the Home offering and selecting one is mandatory', () => {
  assert.deepEqual(validateChatStep('service', INITIAL_CHAT_STATE.answers), {
    service: 'serviceRequired',
  });
  assert.deepEqual(CHAT_SERVICE_IDS, ['sites', 'applications', 'maintenance', 'others']);
  assert.ok(SERVICE_IDS.includes('commerce'));
  for (const service of CHAT_SERVICE_IDS)
    assert.deepEqual(
      validateChatStep('service', { ...validAnswers, service, otherService: 'UX' }),
      {},
    );
  const state = act(INITIAL_CHAT_STATE, { type: 'open' }, { type: 'start' }, { type: 'next' });
  assert.equal(state.screen, 'service');
  assert.equal(state.errors.service, 'serviceRequired');
  assert.equal(state.validationAttempt, 1);
});

test('need validation checks trimmed minimum and the explicit maximum without changing entered content', () => {
  for (const need of ['', '   ', 'a'.repeat(19)])
    assert.equal(validateChatStep('need', { ...validAnswers, need }).need, 'needShort');
  assert.deepEqual(validateChatStep('need', { ...validAnswers, need: 'a'.repeat(20) }), {});
  assert.deepEqual(
    validateChatStep('need', { ...validAnswers, need: 'a'.repeat(NEED_MAX_LENGTH) }),
    {},
  );
  assert.equal(
    validateChatStep('need', { ...validAnswers, need: 'a'.repeat(NEED_MAX_LENGTH + 1) }).need,
    'needLong',
  );
  const need = '  Quero preservar\nesta descrição e seus espaços.  ';
  const state = act(
    { ...INITIAL_CHAT_STATE, isOpen: true, screen: 'need' },
    { type: 'need', value: need },
    { type: 'next' },
  );
  assert.equal(state.answers.need, need);
});

test('contact validation accepts Unicode names and practical emails while rejecting empty and malformed input', () => {
  assert.deepEqual(validateChatStep('contact', validAnswers), {});
  for (const name of ['', '  ', 'A', '123'])
    assert.equal(validateChatStep('contact', { ...validAnswers, name }).name, 'nameInvalid');
  for (const name of ['李明', 'Jo', 'María-José', 'Jean D’Arc'])
    assert.equal(validateChatStep('contact', { ...validAnswers, name }).name, undefined);
  assert.equal(
    validateChatStep('contact', { ...validAnswers, name: 'A'.repeat(101) }).name,
    'nameLong',
  );
  for (const email of [
    '',
    'user',
    'a@',
    '@example.com',
    'a@@example.com',
    'a b@example.com',
    'a@example',
    'a@example.c',
    'a@example..com',
    'a@.example.com',
    'a..b@example.com',
  ])
    assert.equal(validateChatStep('contact', { ...validAnswers, email }).email, 'emailInvalid');
  assert.equal(
    validateChatStep('contact', { ...validAnswers, email: `${'a'.repeat(250)}@example.com` }).email,
    'emailInvalid',
  );
});

test('optional deadline and budget can be skipped and answers survive backward and forward navigation', () => {
  let state = act(
    INITIAL_CHAT_STATE,
    { type: 'open' },
    { type: 'start' },
    { type: 'service', value: 'applications' },
    { type: 'next' },
    { type: 'need', value: validAnswers.need },
    { type: 'next' },
  );
  assert.equal(state.screen, 'details');
  state = act(state, { type: 'next' });
  assert.equal(state.screen, 'contact');
  assert.equal(state.answers.deadline, 'unspecified');
  assert.equal(state.answers.budget, 'unspecified');
  const snapshot = state.answers;
  state = act(state, { type: 'back' }, { type: 'back' });
  assert.equal(state.screen, 'need');
  assert.deepEqual(state.answers, snapshot);
  state = act(
    state,
    { type: 'next' },
    { type: 'deadline', value: 'flexible' },
    { type: 'budget', value: 'to-discuss' },
    { type: 'next' },
  );
  assert.equal(state.answers.deadline, 'flexible');
  assert.equal(state.answers.budget, 'to-discuss');
});

test('contact trims accidental edge spaces before review without changing other answers', () => {
  const state = commercialChatReducer(
    { ...INITIAL_CHAT_STATE, isOpen: true, screen: 'contact', answers: validAnswers },
    { type: 'next' },
  );
  assert.equal(state.screen, 'review');
  assert.equal(state.answers.name, 'João Almeida');
  assert.equal(state.answers.email, 'joao@example.com');
  assert.equal(state.answers.need, validAnswers.need);
});

test('every editable review group returns directly to review and preserves all unrelated answers', () => {
  const steps: ReadonlyArray<EditableChatStep> = ['service', 'need', 'details', 'contact'];
  for (const step of steps) {
    const original = review();
    const editing = commercialChatReducer(original, { type: 'edit', step });
    assert.equal(editing.screen, step);
    assert.equal(editing.editing, true);
    const saved = commercialChatReducer(editing, { type: 'next' });
    assert.equal(saved.screen, 'review');
    assert.equal(saved.editing, false);
    assert.deepEqual(saved.answers, original.answers);
  }
  const changed = act(
    review(),
    { type: 'edit', step: 'need' },
    { type: 'need', value: 'Nova descrição do projeto, com todos os detalhes.' },
    { type: 'next' },
  );
  assert.equal(changed.screen, 'review');
  assert.equal(changed.answers.name, review().answers.name);
  assert.match(changed.answers.need, /Nova descrição/);
});

test('invalid review edits cannot bypass validation through either navigation action', () => {
  const state = act(
    review(),
    { type: 'edit', step: 'contact' },
    { type: 'email', value: 'invalid' },
  );
  for (const type of ['next', 'back'] as const) {
    const invalid = commercialChatReducer(state, { type });
    assert.equal(invalid.screen, 'contact');
    assert.equal(invalid.errors.email, 'emailInvalid');
  }
});

test('closing waits for the exit transition; every entered field requires discard confirmation', () => {
  const empty = act(
    INITIAL_CHAT_STATE,
    { type: 'open' },
    { type: 'start' },
    { type: 'request-close' },
  );
  assert.equal(empty.transition, 'closing');
  assert.deepEqual(commercialChatReducer(empty, { type: 'finish-close' }), INITIAL_CHAT_STATE);
  const examples: ReadonlyArray<Partial<IChatAnswers>> = [
    { service: 'others' },
    { otherService: 'UX' },
    { need: ' ' },
    { name: 'A' },
    { email: 'a' },
    { deadline: 'flexible' },
    { budget: 'to-discuss' },
  ];
  for (const answer of examples) {
    const original = {
      ...INITIAL_CHAT_STATE,
      isOpen: true,
      answers: { ...INITIAL_CHAT_STATE.answers, ...answer },
    };
    assert.equal(hasChatAnswers(original.answers), true);
    const asking = commercialChatReducer(original, { type: 'request-close' });
    assert.equal(asking.isOpen, true);
    assert.equal(asking.discardIntent, 'close');
    assert.deepEqual(asking.answers, original.answers);
    assert.deepEqual(commercialChatReducer(asking, { type: 'cancel-discard' }), original);
    assert.deepEqual(
      act(asking, { type: 'confirm-discard' }, { type: 'finish-close' }),
      INITIAL_CHAT_STATE,
    );
  }
});

test('restart cannot reset answers before explicit confirmation and stays open after confirmation', () => {
  const original = review();
  assert.equal(commercialChatReducer(original, { type: 'confirm-discard' }), original);
  const asking = commercialChatReducer(original, { type: 'request-restart' });
  assert.equal(asking.discardIntent, 'restart');
  assert.deepEqual(asking.answers, original.answers);
  assert.deepEqual(commercialChatReducer(asking, { type: 'cancel-discard' }), original);
  const restarted = commercialChatReducer(asking, { type: 'confirm-discard' });
  assert.equal(restarted.isOpen, true);
  assert.equal(restarted.screen, 'welcome');
  assert.deepEqual(restarted.answers, INITIAL_CHAT_STATE.answers);
});

test('ordinary review navigation never starts submission implicitly or performs HTTP', () => {
  const fetch = mock.method(globalThis, 'fetch', async () => {
    throw new Error('Unexpected submission');
  });
  try {
    const original = review();
    assert.equal(commercialChatReducer(original, { type: 'next' }), original);
    assert.equal(commercialChatReducer(original, { type: 'start' }), original);
    assert.equal(fetch.mock.callCount(), 0);
    assert.deepEqual(INITIAL_CHAT_STATE.answers, {
      service: '',
      otherService: '',
      need: '',
      name: '',
      email: '',
      deadline: 'unspecified',
      budget: 'unspecified',
    });
  } finally {
    fetch.mock.restore();
  }
});

test('only a valid final review can start sending; unsolicited outcomes are ignored', () => {
  assert.equal(
    commercialChatReducer(review(), { type: 'submission-success' }).submission.status,
    'idle',
  );
  assert.equal(commercialChatReducer(INITIAL_CHAT_STATE, { type: 'submit' }), INITIAL_CHAT_STATE);
  const invalid = commercialChatReducer(
    { ...review(), answers: { ...validAnswers, email: 'invalid' } },
    { type: 'submit' },
  );
  assert.equal(invalid.screen, 'contact');
  assert.equal(invalid.submission.status, 'idle');
  assert.equal(invalid.errors.email, 'emailInvalid');
  const editing = commercialChatReducer(review(), { type: 'edit', step: 'need' });
  assert.equal(commercialChatReducer(editing, { type: 'submit' }), editing);
});

test('sending prevents duplicate transitions, edits, closing and discard until an outcome', () => {
  const sending = commercialChatReducer(review(), { type: 'submit' });
  assert.equal(sending.submission.status, 'sending');
  const actions: ReadonlyArray<ChatAction> = [
    { type: 'submit' },
    { type: 'back' },
    { type: 'edit', step: 'contact' },
    { type: 'request-close' },
    { type: 'request-restart' },
    { type: 'confirm-discard' },
    { type: 'name', value: 'Changed' },
  ];
  for (const action of actions) assert.equal(commercialChatReducer(sending, action), sending);
  assert.deepEqual(sending.answers, review().answers);
});

test('failure preserves answers and permits either an explicit retry or review and editing', () => {
  const original = review();
  const failed = act(
    original,
    { type: 'submit' },
    { type: 'submission-error', reason: 'unconfirmed' },
  );
  assert.deepEqual(failed.answers, original.answers);
  assert.deepEqual(failed.submission, { status: 'error', reason: 'unconfirmed' });
  assert.equal(commercialChatReducer(failed, { type: 'submit' }).submission.status, 'sending');
  const editing = act(failed, { type: 'return-review' }, { type: 'edit', step: 'need' });
  assert.equal(editing.screen, 'need');
  assert.equal(editing.submission.status, 'idle');
  assert.deepEqual(editing.answers, original.answers);
  const confirming = commercialChatReducer(failed, { type: 'request-close' });
  assert.equal(confirming.discardIntent, 'close');
  assert.deepEqual(commercialChatReducer(confirming, { type: 'cancel-discard' }), failed);
});

test('confirmed success clears personal answers, prevents resubmission and closes without discard', () => {
  const success = act(review(), { type: 'submit' }, { type: 'submission-success' });
  assert.equal(success.submission.status, 'success');
  assert.deepEqual(success.answers, INITIAL_CHAT_STATE.answers);
  assert.equal(commercialChatReducer(success, { type: 'submit' }), success);
  assert.deepEqual(
    act(success, { type: 'request-close' }, { type: 'finish-close' }),
    INITIAL_CHAT_STATE,
  );
});

test('other service validates only when selected and its content survives editing', () => {
  for (const otherService of ['', ' ', 'A'])
    assert.equal(
      validateChatStep('service', { ...validAnswers, service: 'others', otherService })
        .otherService,
      'otherServiceShort',
    );
  assert.equal(
    validateChatStep('service', {
      ...validAnswers,
      service: 'others',
      otherService: 'x'.repeat(121),
    }).otherService,
    'otherServiceLong',
  );
  assert.deepEqual(validateChatStep('service', { ...validAnswers, otherService: '' }), {});
  let state = act(
    review(),
    { type: 'edit', step: 'service' },
    { type: 'service', value: 'others' },
    { type: 'next' },
  );
  assert.equal(state.screen, 'service');
  assert.equal(state.errors.otherService, 'otherServiceShort');
  state = act(state, { type: 'otherService', value: 'Design UX' }, { type: 'next' });
  assert.equal(state.screen, 'review');
  assert.equal(state.answers.otherService, 'Design UX');
  state = act(
    state,
    { type: 'edit', step: 'service' },
    { type: 'service', value: 'sites' },
    { type: 'next' },
  );
  assert.equal(state.answers.otherService, 'Design UX');
  assert.equal(state.answers.service, 'sites');
  assert.equal(state.answers.need, review().answers.need);
});

test('opening and closing block interaction and preserve the visible content until completion', () => {
  const opening = commercialChatReducer(INITIAL_CHAT_STATE, { type: 'open' });
  assert.equal(opening.transition, 'opening');
  assert.equal(commercialChatReducer(opening, { type: 'start' }), opening);
  const opened = commercialChatReducer(opening, { type: 'finish-open' });
  const closing = commercialChatReducer(opened, { type: 'request-close' });
  assert.equal(closing.isOpen, true);
  assert.equal(closing.transition, 'closing');
  assert.equal(commercialChatReducer(closing, { type: 'open' }), closing);
  assert.equal(commercialChatReducer(closing, { type: 'start' }), closing);
  assert.deepEqual(commercialChatReducer(closing, { type: 'finish-close' }), INITIAL_CHAT_STATE);
  const confirming = commercialChatReducer(review(), { type: 'request-close' });
  const exiting = commercialChatReducer(confirming, { type: 'confirm-discard' });
  assert.equal(exiting.discardIntent, 'close');
  assert.deepEqual(exiting.answers, review().answers);
});
