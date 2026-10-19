import assert from 'node:assert/strict';
import { test, mock } from 'node:test';
import { createCommercialChatSubmission } from './submit-commercial-chat.service';
import type { IChatAnswers } from '../commercial-chat.types';

const config = {
  endpoint: 'https://formspree.io/f/testform',
};
const answers: IChatAnswers = {
  service: 'sites',
  otherService: '',
  need: 'We need an accessible website for our project.',
  name: ' Test Person ',
  email: ' test@example.com ',
  deadline: 'unspecified',
  budget: 'unspecified',
};
const request = {
  answers,
  locale: 'en' as const,
  serviceLabel: 'Sites and Landing Pages',
  deadlineLabel: 'Prefer not to say',
  budgetLabel: 'Prefer not to say',
  honeypot: '',
};

test('submission sends only the intended fields to Formspree, with no credentials or custom content type', async () => {
  const fetch = mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
    assert.equal(url, config.endpoint);
    assert.equal(init.method, 'POST');
    assert.equal(init.credentials, 'omit');
    assert.equal(init.redirect, 'error');
    assert.deepEqual(init.headers, { Accept: 'application/json' });
    assert.ok(init.signal instanceof AbortSignal);
    assert.ok(init.body instanceof FormData);
    assert.deepEqual(Object.fromEntries(init.body.entries()), {
      name: 'Test Person',
      email: 'test@example.com',
      message: answers.need,
      service: request.serviceLabel,
      serviceId: 'sites',
      deadline: request.deadlineLabel,
      budget: request.budgetLabel,
      locale: 'en',
      _gotcha: '',
      _subject: '[DevCosmoLab] - Solicitação de Orçamento',
    });
    return Response.json({ next: 'https://formspree.io/thanks' });
  });
  try {
    assert.deepEqual(await createCommercialChatSubmission()(config, request), {
      status: 'success',
    });
    assert.equal(fetch.mock.callCount(), 1);
  } finally {
    fetch.mock.restore();
  }
});

test('synchronous duplicate attempts share an in-flight guard and never issue a second POST', async () => {
  let resolve: ((response: Response) => void) | undefined;
  const pending = new Promise<Response>((done) => {
    resolve = done;
  });
  const fetch = mock.method(globalThis, 'fetch', () => pending);
  try {
    const submit = createCommercialChatSubmission();
    const first = submit(config, request);
    assert.deepEqual(await submit(config, request), { status: 'busy' });
    assert.equal(fetch.mock.callCount(), 1);
    resolve?.(Response.json({ next: 'https://formspree.io/thanks' }));
    assert.deepEqual(await first, { status: 'success' });
  } finally {
    fetch.mock.restore();
  }
});

test('honeypot and invalid required fields stop delivery without reporting success', async () => {
  const fetch = mock.method(globalThis, 'fetch', async () => {
    throw new Error('Unexpected delivery');
  });
  try {
    const submit = createCommercialChatSubmission();
    assert.deepEqual(await submit(config, { ...request, honeypot: 'spam' }), {
      status: 'error',
      reason: 'spam',
    });
    assert.deepEqual(await submit(config, { ...request, answers: { ...answers, email: 'bad' } }), {
      status: 'error',
      reason: 'invalid',
    });
    assert.equal(fetch.mock.callCount(), 0);
  } finally {
    fetch.mock.restore();
  }
});

test('server rejection, rate limits and ambiguous responses never produce success or automatic retries', async () => {
  const responses = [
    {
      response: Response.json(
        { errors: [{ message: 'Private service details' }] },
        { status: 422 },
      ),
      reason: 'rejected',
    },
    { response: Response.json({}, { status: 429 }), reason: 'rate-limit' },
    { response: Response.json({ ok: false }), reason: 'unconfirmed' },
    {
      response: Response.json({ next: '/thanks', errors: [{ message: 'Rejected' }] }),
      reason: 'unconfirmed',
    },
    { response: Response.json({}), reason: 'unconfirmed' },
    { response: new Response('<html>Captcha</html>', { status: 200 }), reason: 'unconfirmed' },
    { response: new Response(null, { status: 204 }), reason: 'unconfirmed' },
  ];
  for (const { response, reason } of responses) {
    const fetch = mock.method(globalThis, 'fetch', async () => response);
    try {
      assert.deepEqual(await createCommercialChatSubmission()(config, request), {
        status: 'error',
        reason,
      });
      assert.equal(fetch.mock.callCount(), 1);
    } finally {
      fetch.mock.restore();
    }
  }
});

test('network failure or timeout preserves uncertainty and releases the guard for an explicit retry', async () => {
  for (const error of [new TypeError('Offline'), new DOMException('Timeout', 'TimeoutError')]) {
    const fetch = mock.method(globalThis, 'fetch', async () => {
      throw error;
    });
    try {
      const submit = createCommercialChatSubmission();
      assert.deepEqual(await submit(config, request), { status: 'error', reason: 'unconfirmed' });
      assert.equal(fetch.mock.callCount(), 1);
      fetch.mock.restore();
      const retry = mock.method(globalThis, 'fetch', async () =>
        Response.json({ next: 'https://formspree.io/thanks' }),
      );
      try {
        assert.deepEqual(await submit(config, request), { status: 'success' });
      } finally {
        retry.mock.restore();
      }
    } finally {
      fetch.mock.restore();
    }
  }
});

test('custom service is included only for Others, trimmed, and validated before any POST', async () => {
  const bodies: Array<FormData> = [];
  const fetch = mock.method(globalThis, 'fetch', async (_url: string, init: RequestInit) => {
    assert.ok(init.body instanceof FormData);
    bodies.push(init.body);
    return Response.json({ next: '/thanks' });
  });
  try {
    const submit = createCommercialChatSubmission();
    assert.deepEqual(
      await submit(config, {
        ...request,
        answers: { ...answers, service: 'others', otherService: '  Design UX  ' },
      }),
      { status: 'success' },
    );
    assert.equal(bodies[0].get('otherService'), 'Design UX');
    assert.equal(bodies[0].get('serviceId'), 'others');
    await submit(config, {
      ...request,
      answers: { ...answers, otherService: 'Old custom service' },
    });
    assert.equal(bodies[1].has('otherService'), false);
    assert.deepEqual(
      await submit(config, {
        ...request,
        answers: { ...answers, service: 'others', otherService: '' },
      }),
      { status: 'error', reason: 'invalid' },
    );
    assert.equal(fetch.mock.callCount(), 2);
  } finally {
    fetch.mock.restore();
  }
});
