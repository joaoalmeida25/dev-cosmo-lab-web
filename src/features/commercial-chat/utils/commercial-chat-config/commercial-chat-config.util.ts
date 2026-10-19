import type { IChatSubmissionConfig } from '../../commercial-chat.types';

export const getChatSubmissionConfig = (
  endpoint: string | undefined,
): IChatSubmissionConfig | null => {
  if (!endpoint) {
    return null;
  }

  try {
    const form = new URL(endpoint);

    if (
      form.origin !== 'https://formspree.io' ||
      !/^\/f\/[a-zA-Z0-9]+$/.test(form.pathname) ||
      form.search ||
      form.hash ||
      form.username ||
      form.password
    ) {
      return null;
    }

    return { endpoint: form.href };
  } catch {
    return null;
  }
};
