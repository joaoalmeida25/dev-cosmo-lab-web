import type { SupportedLocale } from '@/i18n/locale.types';
import type {
  IChatAnswers,
  IChatSubmissionConfig,
  ChatSubmissionError,
  ChatStep,
} from '../commercial-chat.types';
import { validateChatStep } from '../utils/commercial-chat-flow.util';

interface IChatSubmissionRequest {
  answers: IChatAnswers;
  locale: SupportedLocale;
  serviceLabel: string;
  deadlineLabel: string;
  budgetLabel: string;
  honeypot: string;
}

type ChatSubmissionResult =
  { status: 'success' | 'busy' } | { status: 'error'; reason: ChatSubmissionError };

export const createCommercialChatSubmission = () => {
  let inFlight = false;
  return async (
    config: IChatSubmissionConfig,
    request: IChatSubmissionRequest,
  ): Promise<ChatSubmissionResult> => {
    if (inFlight) return { status: 'busy' };

    if (request.honeypot) return { status: 'error', reason: 'spam' };

    const requiredSteps: ReadonlyArray<ChatStep> = ['service', 'need', 'contact'];

    if (requiredSteps.some((step) => Object.keys(validateChatStep(step, request.answers)).length))
      return { status: 'error', reason: 'invalid' };

    inFlight = true;

    try {
      const body = new FormData();

      body.set('name', request.answers.name.trim());
      body.set('email', request.answers.email.trim());
      body.set('message', request.answers.need);
      body.set('service', request.serviceLabel);
      body.set('serviceId', request.answers.service);

      if (request.answers.service === 'others')
        body.set('otherService', request.answers.otherService.trim());
      body.set('deadline', request.deadlineLabel);
      body.set('budget', request.budgetLabel);
      body.set('locale', request.locale);
      body.set('_gotcha', request.honeypot);
      body.set('_subject', 'Dev Cosmo Lab — Commercial request');

      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
        credentials: 'omit',
        redirect: 'error',
        signal: AbortSignal.timeout(20000),
      });

      if (response.status === 429) return { status: 'error', reason: 'rate-limit' };

      if (!response.ok) return { status: 'error', reason: 'rejected' };

      const result: unknown = await response.json();

      if (
        !result ||
        typeof result !== 'object' ||
        !('next' in result) ||
        typeof result.next !== 'string' ||
        'errors' in result
      )
        return { status: 'error', reason: 'unconfirmed' };
      return { status: 'success' };
    } catch {
      return { status: 'error', reason: 'unconfirmed' };
    } finally {
      inFlight = false;
    }
  };
};
