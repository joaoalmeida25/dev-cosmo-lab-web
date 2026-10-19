// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import { SERVICE_IDS } from '@/constants/services.constants';
import { CHAT_SERVICE_IDS } from '../../commercial-chat.constants';
import type { ChatAction, IChatAnswers, IChatState } from '../../commercial-chat.types';
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

describe('CommercialChatFlow - Unit Test', () => {
  it('Should keep welcome outside the ordered steps and open without advancing', () => {
    // Given: a closed request with no entered answers.
    const initial = INITIAL_CHAT_STATE;

    // When: opening completes and the visitor explicitly starts.
    const ignored = commercialChatReducer(initial, { type: 'next' });
    const opened = act(initial, { type: 'open' });
    const started = commercialChatReducer(opened, { type: 'start' });

    // Then: opening shows welcome and only start reaches the first of five steps.
    expect(CHAT_STEPS).toEqual(['service', 'need', 'details', 'contact', 'review']);
    expect(ignored).toBe(initial);
    expect(opened).toMatchObject({ isOpen: true, screen: 'welcome', transition: 'idle' });
    expect(started.screen).toBe('service');
  });

  it('Should require a chat service independently of the Home offerings', () => {
    // Given: a new request positioned at service selection.
    const initial = act(INITIAL_CHAT_STATE, { type: 'open' }, { type: 'start' });

    // When: continuing without selecting and validating each supported chat service.
    const blocked = commercialChatReducer(initial, { type: 'next' });
    const valid = CHAT_SERVICE_IDS.map((service) =>
      validateChatStep('service', { ...validAnswers, service, otherService: 'UX' }),
    );

    // Then: selection is required, all chat services are valid, and commerce remains Home-only.
    expect(blocked).toMatchObject({
      screen: 'service',
      errors: { service: 'serviceRequired' },
      validationAttempt: 1,
    });
    expect(CHAT_SERVICE_IDS).toEqual(['sites', 'applications', 'maintenance', 'others']);
    expect(SERVICE_IDS).toContain('commerce');
    expect(valid).toEqual(CHAT_SERVICE_IDS.map(() => ({})));
  });

  it.each([
    ['', 'needShort'],
    ['   ', 'needShort'],
    ['a'.repeat(19), 'needShort'],
    ['a'.repeat(20), undefined],
    ['a'.repeat(NEED_MAX_LENGTH), undefined],
    ['a'.repeat(NEED_MAX_LENGTH + 1), 'needLong'],
  ])('Should enforce need boundaries for %j with error %s', (value, expectedError) => {
    // Given: otherwise valid answers with the need boundary value under evaluation.
    const answers = {
      ...validAnswers,
      service: 'others' as const,
      otherService: 'UX',
      need: value ?? '',
    };

    // When: validating the need step without modifying its input.
    const errors = validateChatStep('need', answers);

    // Then: only the applicable need validation outcome is recorded.
    expect(errors.need).toBe(expectedError);
  });

  it.each([
    ['', 'otherServiceShort'],
    [' ', 'otherServiceShort'],
    ['A', 'otherServiceShort'],
    ['UX', undefined],
    ['x'.repeat(120), undefined],
    ['x'.repeat(121), 'otherServiceLong'],
  ])('Should enforce otherService boundaries for %j with error %s', (value, expectedError) => {
    // Given: otherwise valid answers with the otherService boundary value under evaluation.
    const answers = {
      ...validAnswers,
      service: 'others' as const,
      otherService: value ?? '',
    };

    // When: validating the service step without modifying its input.
    const errors = validateChatStep('service', answers);

    // Then: only the applicable otherService validation outcome is recorded.
    expect(errors.otherService).toBe(expectedError);
  });

  it.each([
    ['', 'nameInvalid'],
    ['  ', 'nameInvalid'],
    ['A', 'nameInvalid'],
    ['123', 'nameInvalid'],
    ['李明', undefined],
    ['Jo', undefined],
    ['María-José', undefined],
    ['Jean D’Arc', undefined],
    ['A'.repeat(100), undefined],
    ['A'.repeat(101), 'nameLong'],
  ])('Should enforce name boundaries for %j with error %s', (value, expectedError) => {
    // Given: otherwise valid answers with the name boundary value under evaluation.
    const answers = {
      ...validAnswers,
      service: 'others' as const,
      otherService: 'UX',
      name: value ?? '',
    };

    // When: validating the contact step without modifying its input.
    const errors = validateChatStep('contact', answers);

    // Then: only the applicable name validation outcome is recorded.
    expect(errors.name).toBe(expectedError);
  });

  it.each([
    ['', 'emailInvalid'],
    ['user', 'emailInvalid'],
    ['a@', 'emailInvalid'],
    ['@example.com', 'emailInvalid'],
    ['a@@example.com', 'emailInvalid'],
    ['a b@example.com', 'emailInvalid'],
    ['a@example', 'emailInvalid'],
    ['a@example.c', 'emailInvalid'],
    ['a@example..com', 'emailInvalid'],
    ['a@.example.com', 'emailInvalid'],
    ['a..b@example.com', 'emailInvalid'],
    [`${'a'.repeat(250)}@example.com`, 'emailInvalid'],
    ['joao@example.com', undefined],
  ])('Should enforce email boundaries for %j with error %s', (value, expectedError) => {
    // Given: otherwise valid answers with the email boundary value under evaluation.
    const answers = {
      ...validAnswers,
      service: 'others' as const,
      otherService: 'UX',
      email: value ?? '',
    };

    // When: validating the contact step without modifying its input.
    const errors = validateChatStep('contact', answers);

    // Then: only the applicable email validation outcome is recorded.
    expect(errors.email).toBe(expectedError);
  });

  it('Should validate only the selected service and retain Others content across edits', () => {
    // Given: a valid review and an empty optional custom-service answer.
    const original = review();

    // When: editing Others, correcting its required detail, then selecting a standard service.
    const irrelevant = validateChatStep('service', { ...validAnswers, otherService: '' });
    const blocked = act(
      original,
      { type: 'edit', step: 'service' },
      { type: 'service', value: 'others' },
      { type: 'next' },
    );

    const corrected = act(blocked, { type: 'otherService', value: 'Design UX' }, { type: 'next' });
    const standard = act(
      corrected,
      { type: 'edit', step: 'service' },
      { type: 'service', value: 'sites' },
      { type: 'next' },
    );

    // Then: the error belongs to Others and changing service preserves other answers.
    expect(irrelevant).toEqual({});
    expect(blocked).toMatchObject({
      screen: 'service',
      errors: { otherService: 'otherServiceShort' },
    });
    expect(corrected).toMatchObject({ screen: 'review', answers: { otherService: 'Design UX' } });
    expect(standard.answers).toEqual({ ...original.answers, otherService: 'Design UX' });
  });

  it('Should revalidate description after the first invalid attempt and unlock only after correction', () => {
    // Given: an open description step without attempted validation.
    const initial: IChatState = {
      ...INITIAL_CHAT_STATE,
      isOpen: true,
      screen: 'need',
      answers: validAnswers,
    };

    // When: entering invalid, correcting, invalidating again and finally continuing with valid input.
    const untouched = act(initial, { type: 'need', value: 'curto' });
    const invalid = act(untouched, { type: 'next' });
    const stillInvalid = act(invalid, { type: 'need', value: 'ainda curto' });
    const corrected = act(stillInvalid, { type: 'need', value: validAnswers.need });
    const invalidAgain = act(corrected, { type: 'need', value: 'curto novamente' });
    const continued = act(
      invalidAgain,
      { type: 'need', value: validAnswers.need },
      { type: 'next' },
    );

    // Then: validation stays quiet initially, updates after attempts and clears on progression.
    expect(untouched.errors).toEqual({});
    expect(untouched.validatedStep).toBeNull();
    expect(invalid).toMatchObject({
      screen: 'need',
      validatedStep: 'need',
      errors: { need: 'needShort' },
    });
    expect(stillInvalid.errors.need).toBe('needShort');
    expect(corrected.errors).toEqual({});
    expect(corrected.validatedStep).toBe('need');
    expect(invalidAgain.errors.need).toBe('needShort');
    expect(continued).toMatchObject({ screen: 'details', errors: {}, validatedStep: null });
  });

  it('Should recover service and contact validation field by field', () => {
    // Given: independent open service and contact requests with empty required answers.
    const serviceInitial = act(
      INITIAL_CHAT_STATE,
      { type: 'open' },
      { type: 'start' },
      { type: 'next' },
    );

    const contactInitial: IChatState = { ...INITIAL_CHAT_STATE, isOpen: true, screen: 'contact' };

    // When: correcting service details, then name and email after an invalid contact attempt.
    const others = act(serviceInitial, { type: 'service', value: 'others' });
    const short = act(others, { type: 'otherService', value: 'X' });
    const selected = act(short, { type: 'otherService', value: 'UX Design' }, { type: 'next' });
    const invalid = act(contactInitial, { type: 'next' });
    const named = act(invalid, { type: 'name', value: 'Pessoa Teste' });
    const malformed = act(named, { type: 'email', value: 'invalid' });
    const corrected = act(malformed, { type: 'email', value: 'teste@example.com' });
    const reviewed = act(corrected, { type: 'next' });

    // Then: each correction removes only its own error and valid data reaches review.
    expect(serviceInitial.errors.service).toBe('serviceRequired');
    expect(others.errors).toEqual({ otherService: 'otherServiceShort' });
    expect(short.errors.otherService).toBe('otherServiceShort');
    expect(selected).toMatchObject({ screen: 'need', validatedStep: null });
    expect(invalid.errors).toEqual({ name: 'nameInvalid', email: 'emailInvalid' });
    expect(named.errors).toEqual({ email: 'emailInvalid' });
    expect(malformed.errors.email).toBe('emailInvalid');
    expect(corrected).toMatchObject({ errors: {}, validatedStep: 'contact' });
    expect(reviewed).toMatchObject({ screen: 'review', validatedStep: null });
  });

  it('Should clear validation on backward navigation while preserving raw description text', () => {
    // Given: a description containing intentional whitespace and an independent invalid attempt.
    const need = '  Quero preservar\nesta descrição e seus espaços.  ';
    const initial: IChatState = {
      ...INITIAL_CHAT_STATE,
      isOpen: true,
      screen: 'need',
      answers: validAnswers,
    };

    // When: saving the raw description and navigating backward after invalidating another request.
    const saved = act(initial, { type: 'need', value: need }, { type: 'next' });
    const invalid = act(initial, { type: 'need', value: 'curto' }, { type: 'next' });
    const back = act(invalid, { type: 'back' });

    // Then: raw text remains intact and backward navigation clears its validation lock.
    expect(saved.answers.need).toBe(need);
    expect(invalid.validatedStep).toBe('need');
    expect(back).toMatchObject({
      screen: 'service',
      validatedStep: null,
      errors: {},
      answers: { need: 'curto' },
    });
  });

  it('Should skip optional details and preserve answers across repeated navigation', () => {
    // Given: a valid request positioned at optional project details.
    const initial = act(
      INITIAL_CHAT_STATE,
      { type: 'open' },
      { type: 'start' },
      { type: 'service', value: 'applications' },
      { type: 'next' },
      { type: 'need', value: validAnswers.need },
      { type: 'next' },
    );

    // When: skipping details, navigating backward twice, then entering optional selections.
    const skipped = act(initial, { type: 'next' });
    const back = act(skipped, { type: 'back' }, { type: 'back' });
    const selected = act(
      back,
      { type: 'next' },
      { type: 'deadline', value: 'flexible' },
      { type: 'budget', value: 'to-discuss' },
      { type: 'next' },
    );

    // Then: omitted details stay unspecified and navigation preserves existing answers.
    expect(initial.screen).toBe('details');
    expect(skipped).toMatchObject({
      screen: 'contact',
      answers: { deadline: 'unspecified', budget: 'unspecified' },
    });
    expect(back.screen).toBe('need');
    expect(back.answers).toEqual(skipped.answers);
    expect(selected.answers).toMatchObject({
      deadline: 'flexible',
      budget: 'to-discuss',
      need: validAnswers.need,
    });
  });

  it('Should trim contact edges before review without changing project answers', () => {
    // Given: a valid contact step with accidental name and email spaces.
    const initial: IChatState = {
      ...INITIAL_CHAT_STATE,
      isOpen: true,
      screen: 'contact',
      answers: validAnswers,
    };

    // When: continuing to review.
    const result = commercialChatReducer(initial, { type: 'next' });

    // Then: only contact edge whitespace is normalized.
    expect(result.screen).toBe('review');
    expect(result.answers).toEqual({
      ...validAnswers,
      name: 'João Almeida',
      email: 'joao@example.com',
    });
  });

  it.each(['service', 'need', 'details', 'contact'] as const)(
    'Should save the %s review edit directly back to review',
    (step) => {
      // Given: a complete request at its final review.
      const original = review();

      // When: opening and saving the selected editable group.
      const editing = commercialChatReducer(original, { type: 'edit', step });
      const saved = commercialChatReducer(editing, { type: 'next' });

      // Then: editing is explicit, all answers survive and saving clears the validation lock.
      expect(editing).toMatchObject({ screen: step, editing: true });
      expect(saved).toMatchObject({ screen: 'review', editing: false, validatedStep: null });
      expect(saved.answers).toEqual(original.answers);
    },
  );

  it.each(['next', 'back'] as const)(
    'Should block %s while a contact review edit remains invalid',
    (type) => {
      // Given: a review whose contact edit now contains a malformed email.
      const initial = act(
        review(),
        { type: 'edit', step: 'contact' },
        { type: 'email', value: 'invalid' },
      );

      // When: attempting to leave the edited group.
      const result = commercialChatReducer(initial, { type });

      // Then: review remains inaccessible until the contact error is corrected.
      expect(result).toMatchObject({
        screen: 'contact',
        editing: true,
        errors: { email: 'emailInvalid' },
      });
    },
  );

  it('Should recover an invalid description edit and preserve unrelated review answers', () => {
    // Given: a review opened for description editing.
    const original = review();
    const initial = act(original, { type: 'edit', step: 'need' });

    // When: attempting an invalid save and correcting the same edited field.
    const invalid = act(initial, { type: 'need', value: 'curto' }, { type: 'next' });
    const saved = act(
      invalid,
      { type: 'need', value: 'Nova descrição do projeto, com todos os detalhes.' },
      { type: 'back' },
    );

    // Then: the invalid edit is locked and a valid save returns to review without dropping contact data.
    expect(invalid).toMatchObject({ editing: true, validatedStep: 'need' });
    expect(saved).toMatchObject({ screen: 'review', editing: false, validatedStep: null });
    expect(saved.answers.name).toBe(original.answers.name);
    expect(saved.answers.need).toMatch(/Nova descrição/);
  });

  it.each([
    { service: 'others' },
    { otherService: 'UX' },
    { need: ' ' },
    { name: 'A' },
    { email: 'a' },
    { deadline: 'flexible' },
    { budget: 'to-discuss' },
  ] satisfies ReadonlyArray<Partial<IChatAnswers>>)(
    'Should require close confirmation for entered answer %j',
    (answer) => {
      // Given: an open request containing one kind of entered answer, including whitespace.
      const original: IChatState = {
        ...INITIAL_CHAT_STATE,
        isOpen: true,
        answers: { ...INITIAL_CHAT_STATE.answers, ...answer },
      };

      // When: requesting closure, canceling it and independently confirming it.
      const hasAnswers = hasChatAnswers(original.answers);
      const asking = commercialChatReducer(original, { type: 'request-close' });
      const canceled = commercialChatReducer(asking, { type: 'cancel-discard' });
      const closing = commercialChatReducer(asking, { type: 'confirm-discard' });
      const closed = commercialChatReducer(closing, { type: 'finish-close' });

      // Then: cancellation preserves data and confirmed closure clears it only after the exit finishes.
      expect(hasAnswers).toBe(true);
      expect(asking).toMatchObject({
        isOpen: true,
        discardIntent: 'close',
        answers: original.answers,
      });
      expect(canceled).toEqual(original);
      expect(closing.answers).toEqual(original.answers);
      expect(closing.discardIntent).toBe('close');
      expect(closed).toEqual(INITIAL_CHAT_STATE);
    },
  );

  it('Should restart populated requests only after confirmation and keep the dialog open', () => {
    // Given: a complete review and an independently empty open request.
    const original = review();
    const empty = { ...INITIAL_CHAT_STATE, isOpen: true };

    // When: requesting restart, canceling, confirming and restarting the empty request.
    const unsolicited = commercialChatReducer(original, { type: 'confirm-discard' });
    const asking = commercialChatReducer(original, { type: 'request-restart' });
    const canceled = commercialChatReducer(asking, { type: 'cancel-discard' });
    const restarted = commercialChatReducer(asking, { type: 'confirm-discard' });
    const emptyRestart = commercialChatReducer(empty, { type: 'request-restart' });

    // Then: only confirmed populated restart discards data, while empty restart requires no confirmation.
    expect(unsolicited).toBe(original);
    expect(asking).toMatchObject({ discardIntent: 'restart', answers: original.answers });
    expect(canceled).toEqual(original);
    expect(restarted).toEqual({ ...INITIAL_CHAT_STATE, isOpen: true });
    expect(emptyRestart).toEqual(restarted);
  });

  it('Should avoid implicit HTTP submission during ordinary review navigation', () => {
    // Given: a valid review and a fetch spy that rejects every unexpected request.
    const original = review();
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('Unexpected submission'));

    // When: continuing or starting from review without final confirmation.
    const continued = commercialChatReducer(original, { type: 'next' });
    const started = commercialChatReducer(original, { type: 'start' });

    // Then: navigation neither changes the review nor contacts an integration.
    expect(continued).toBe(original);
    expect(started).toBe(original);
    expect(fetch).not.toHaveBeenCalled();
    expect(INITIAL_CHAT_STATE.answers).toEqual({
      service: '',
      otherService: '',
      need: '',
      name: '',
      email: '',
      deadline: 'unspecified',
      budget: 'unspecified',
    });
  });

  it('Should send only a valid final review and route invalid contact back to correction', () => {
    // Given: valid, malformed-email, editing and closed requests.
    const original = review();
    const invalid = { ...original, answers: { ...validAnswers, email: 'invalid' } };
    const editing = act(original, { type: 'edit', step: 'need' });

    // When: submitting each request and dispatching an unsolicited success.
    const sending = commercialChatReducer(original, { type: 'submit' });
    const blocked = commercialChatReducer(invalid, { type: 'submit' });
    const edited = commercialChatReducer(editing, { type: 'submit' });
    const closed = commercialChatReducer(INITIAL_CHAT_STATE, { type: 'submit' });
    const unsolicited = commercialChatReducer(original, { type: 'submission-success' });

    // Then: only valid review enters sending and an invalid review preserves data for correction.
    expect(sending.submission.status).toBe('sending');
    expect(blocked).toMatchObject({
      screen: 'contact',
      submission: { status: 'idle' },
      errors: { email: 'emailInvalid' },
    });
    expect(edited).toBe(editing);
    expect(closed).toBe(INITIAL_CHAT_STATE);
    expect(unsolicited).toBe(original);
  });

  it('Should block duplicate submissions and all edits or closure while sending', () => {
    // Given: a valid review already sending its explicit request.
    const sending = act(review(), { type: 'submit' });
    const actions: ReadonlyArray<ChatAction> = [
      { type: 'submit' },
      { type: 'back' },
      { type: 'edit', step: 'contact' },
      { type: 'request-close' },
      { type: 'request-restart' },
      { type: 'confirm-discard' },
      { type: 'name', value: 'Changed' },
    ];

    // When: dispatching each prohibited action independently.
    const results = actions.map((action) => commercialChatReducer(sending, action));

    // Then: every duplicate action retains the sending state and original answers.
    expect(sending.submission.status).toBe('sending');
    expect(results.every((result) => result === sending)).toBe(true);
    expect(sending.answers).toEqual(review().answers);
  });

  it('Should preserve failed submissions for explicit retry, review editing and canceled discard', () => {
    // Given: a request that failed with an unconfirmed outcome.
    const original = review();
    const failed = act(
      original,
      { type: 'submit' },
      { type: 'submission-error', reason: 'unconfirmed' },
    );

    // When: requesting retry, opening correction, and independently canceling a close.
    const retried = act(failed, { type: 'submit' });
    const editing = act(failed, { type: 'return-review' }, { type: 'edit', step: 'need' });
    const confirming = act(failed, { type: 'request-close' });
    const canceled = act(confirming, { type: 'cancel-discard' });

    // Then: all recovery paths retain entered data and retry requires an explicit action.
    expect(failed.answers).toEqual(original.answers);
    expect(failed.submission).toEqual({ status: 'error', reason: 'unconfirmed' });
    expect(retried.submission.status).toBe('sending');
    expect(editing).toMatchObject({
      screen: 'need',
      submission: { status: 'idle' },
      answers: original.answers,
    });
    expect(confirming.discardIntent).toBe('close');
    expect(canceled).toEqual(failed);
  });

  it('Should clear personal answers after success and close without additional discard', () => {
    // Given: a completed successful submission.
    const success = act(review(), { type: 'submit' }, { type: 'submission-success' });

    // When: attempting resubmission and then closing after the exit transition.
    const duplicate = commercialChatReducer(success, { type: 'submit' });
    const closed = act(success, { type: 'request-close' }, { type: 'finish-close' });

    // Then: personal data is cleared, duplicate submission is ignored and closure restores the initial state.
    expect(success.submission.status).toBe('success');
    expect(success.answers).toEqual(INITIAL_CHAT_STATE.answers);
    expect(duplicate).toBe(success);
    expect(closed).toEqual(INITIAL_CHAT_STATE);
  });

  it('Should block interaction during opening and closing and clear data only when exit finishes', () => {
    // Given: a closed request ready to start its entrance transition.
    const initial = INITIAL_CHAT_STATE;

    // When: dispatching lifecycle completions and attempted interactions during animations.
    const opening = commercialChatReducer(initial, { type: 'open' });
    const earlyStart = commercialChatReducer(opening, { type: 'start' });
    const opened = commercialChatReducer(opening, { type: 'finish-open' });
    const closing = commercialChatReducer(opened, { type: 'request-close' });
    const reopened = commercialChatReducer(closing, { type: 'open' });
    const closingStart = commercialChatReducer(closing, { type: 'start' });
    const closed = commercialChatReducer(closing, { type: 'finish-close' });

    // Then: transitions gate interaction and only a completed exit resets the request.
    expect(opening.transition).toBe('opening');
    expect(earlyStart).toBe(opening);
    expect(closing).toMatchObject({ isOpen: true, transition: 'closing' });
    expect(reopened).toBe(closing);
    expect(closingStart).toBe(closing);
    expect(closed).toEqual(initial);
  });

  it('Should ignore unsupported actions in closed, idle welcome and pending-discard states', () => {
    // Given: closed, idle welcome and pending-discard lifecycle states.
    const open = { ...INITIAL_CHAT_STATE, isOpen: true };
    const discard: IChatState = { ...review(), discardIntent: 'close' };
    const cases: ReadonlyArray<{ state: IChatState; actions: ReadonlyArray<ChatAction> }> = [
      {
        state: INITIAL_CHAT_STATE,
        actions: [
          { type: 'finish-open' },
          { type: 'finish-close' },
          { type: 'start' },
          { type: 'back' },
          { type: 'edit', step: 'need' },
          { type: 'request-close' },
          { type: 'request-restart' },
          { type: 'submission-error', reason: 'rejected' },
          { type: 'return-review' },
        ],
      },
      {
        state: open,
        actions: [
          { type: 'open' },
          { type: 'next' },
          { type: 'back' },
          { type: 'edit', step: 'need' },
        ],
      },
      {
        state: discard,
        actions: [
          { type: 'next' },
          { type: 'back' },
          { type: 'submit' },
          { type: 'edit', step: 'need' },
          { type: 'request-close' },
        ],
      },
    ];

    // When: dispatching actions outside their valid lifecycle.
    const results = cases.flatMap(({ state, actions }) =>
      actions.map((action) => ({ state, next: commercialChatReducer(state, action) })),
    );

    // Then: each unsupported action retains the exact state reference.
    for (const { state, next } of results) {
      expect(next).toBe(state);
    }
  });
});
