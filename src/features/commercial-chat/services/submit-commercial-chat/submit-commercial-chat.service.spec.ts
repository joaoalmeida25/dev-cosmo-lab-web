// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import { createCommercialChatSubmission } from './submit-commercial-chat.service';
import type { IChatAnswers } from '../../commercial-chat.types';

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

describe('SubmitCommercialChat - Unit Test', () => {
  it('Should send only intended fields without credentials or a custom content type', async () => {
    // Given: valid request data and a simulated confirmed delivery response.
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({ next: 'https://formspree.io/thanks' }));

    const submit = createCommercialChatSubmission();

    // When: explicitly confirming one submission through the delivery service.
    const result = await submit(config, request);
    const [url, init] = fetch.mock.calls[0];
    const body = init?.body;

    // Then: exactly one safe request contains only the approved normalized fields.
    expect(result).toEqual({ status: 'success' });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(url).toBe(config.endpoint);
    expect(init).toMatchObject({
      method: 'POST',
      credentials: 'omit',
      redirect: 'error',
      headers: { Accept: 'application/json' },
    });
    expect(init?.signal).toBeInstanceOf(AbortSignal);
    expect(body).toBeInstanceOf(FormData);

    if (!(body instanceof FormData)) {
      throw new Error('Expected FormData');
    }

    expect(Object.fromEntries(body.entries())).toEqual({
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
  });

  it('Should share an in-flight guard across synchronous duplicate attempts', async () => {
    // Given: a delivery dependency whose response remains pending until explicitly resolved.
    const pending = Promise.withResolvers<Response>();
    const fetch = vi.spyOn(globalThis, 'fetch').mockReturnValue(pending.promise);
    const submit = createCommercialChatSubmission();

    // When: two consecutive confirmations occur before the first response settles.
    const first = submit(config, request);
    const duplicate = await submit(config, request);
    const pendingCalls = fetch.mock.calls.length;
    pending.resolve(Response.json({ next: '/thanks' }));
    const completed = await first;

    // Then: the second attempt is busy and the first succeeds with a single POST.
    expect(duplicate).toEqual({ status: 'busy' });
    expect(pendingCalls).toBe(1);
    expect(completed).toEqual({ status: 'success' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it.each([
    { patch: { honeypot: 'spam' }, reason: 'spam' },
    { patch: { answers: { ...answers, email: 'bad' } }, reason: 'invalid' },
    {
      patch: { answers: { ...answers, service: 'others' as const, otherService: '' } },
      reason: 'invalid',
    },
  ])(
    'Should block invalid delivery with reason $reason before any POST',
    async ({ patch, reason }) => {
      // Given: an otherwise valid request containing a honeypot or invalid required answer.
      const fetch = vi
        .spyOn(globalThis, 'fetch')
        .mockRejectedValue(new Error('Unexpected delivery'));

      const submit = createCommercialChatSubmission();

      // When: submitting the invalid request.
      const result = await submit(config, { ...request, ...patch });

      // Then: the boundary reports the specific failure and never contacts Formspree.
      expect(result).toEqual({ status: 'error', reason });
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it.each([
    {
      response: () =>
        Response.json({ errors: [{ message: 'Private service details' }] }, { status: 422 }),
      reason: 'rejected',
    },
    { response: () => Response.json({}, { status: 429 }), reason: 'rate-limit' },
    { response: () => Response.json({ ok: false }), reason: 'unconfirmed' },
    {
      response: () => Response.json({ next: '/thanks', errors: [{ message: 'Rejected' }] }),
      reason: 'unconfirmed',
    },
    { response: () => Response.json({}), reason: 'unconfirmed' },
    {
      response: () => new Response('<html>Captcha</html>', { status: 200 }),
      reason: 'unconfirmed',
    },
    { response: () => new Response(null, { status: 204 }), reason: 'unconfirmed' },
  ])(
    'Should report $reason without automatic retry for response %#',
    async ({ response, reason }) => {
      // Given: a simulated rejection, rate limit or ambiguous response body.
      const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response());
      const submit = createCommercialChatSubmission();

      // When: the explicit submission receives that response.
      const result = await submit(config, request);

      // Then: the service avoids false success, private error leakage and automatic retries.
      expect(result).toEqual({ status: 'error', reason });
      expect(fetch).toHaveBeenCalledTimes(1);
    },
  );

  it.each([new TypeError('Offline'), new DOMException('Timeout', 'TimeoutError')])(
    'Should release the guard for explicit recovery after %s',
    async (error) => {
      // Given: one failed network operation followed by a confirmed mocked response.
      const fetch = vi
        .spyOn(globalThis, 'fetch')
        .mockRejectedValueOnce(error)
        .mockResolvedValue(Response.json({ next: '/thanks' }));

      const submit = createCommercialChatSubmission();

      // When: submitting, observing failure and explicitly retrying.
      const failure = await submit(config, request);
      const callsAfterFailure = fetch.mock.calls.length;
      const retry = await submit(config, request);

      // Then: uncertainty is preserved and the released guard permits one manual retry.
      expect(failure).toEqual({ status: 'error', reason: 'unconfirmed' });
      expect(callsAfterFailure).toBe(1);
      expect(retry).toEqual({ status: 'success' });
      expect(fetch).toHaveBeenCalledTimes(2);
    },
  );

  it('Should include trimmed custom service only when Others is selected', async () => {
    // Given: requests for Others and a standard service with stale custom text.
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () => Response.json({ next: '/thanks' }));

    const submit = createCommercialChatSubmission();

    // When: submitting the two independently confirmed requests.
    const custom = await submit(config, {
      ...request,
      answers: { ...answers, service: 'others', otherService: '  Design UX  ' },
    });

    const standard = await submit(config, {
      ...request,
      answers: { ...answers, otherService: 'Old custom service' },
    });

    const customBody = fetch.mock.calls[0][1]?.body;
    const standardBody = fetch.mock.calls[1][1]?.body;

    // Then: only Others sends custom text, normalized at the integration boundary.
    expect(custom).toEqual({ status: 'success' });
    expect(standard).toEqual({ status: 'success' });

    if (!(customBody instanceof FormData) || !(standardBody instanceof FormData)) {
      throw new Error('Expected FormData');
    }

    expect(customBody.get('otherService')).toBe('Design UX');
    expect(customBody.get('serviceId')).toBe('others');
    expect(standardBody.has('otherService')).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
