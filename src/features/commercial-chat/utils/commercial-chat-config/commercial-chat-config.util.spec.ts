// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getChatSubmissionConfig } from './commercial-chat-config.util';
const endpoint = 'https://formspree.io/f/testform';

describe('CommercialChatConfig - Unit Test', () => {
  it.each([
    undefined,
    '',
    'not a URL',
    'http://formspree.io/f/testform',
    'https://other.example/f/testform',
    'https://formspree.io.evil.example/f/testform',
    'https://formspree.io/person@example.com',
    'https://formspree.io/f/',
    `${endpoint}?redirect=elsewhere`,
    `${endpoint}#fragment`,
    'https://user:password@formspree.io/f/testform',
  ])('Should disable delivery for untrusted endpoint %s', (candidate) => {
    // Given: an absent, malformed or unauthorized delivery endpoint.
    const input = candidate;

    // When: resolving submission configuration at the environment boundary.
    const result = getChatSubmissionConfig(input);

    // Then: delivery remains unavailable without throwing or accepting unsafe destinations.
    expect(result).toBeNull();
  });
  it('Should enable delivery only for the confirmed HTTPS Formspree endpoint', () => {
    // Given: a form URL on the approved Formspree host without credentials or redirects.
    const input = endpoint;

    // When: resolving the delivery configuration.
    const result = getChatSubmissionConfig(input);

    // Then: the validated endpoint is the complete integration configuration.
    expect(result).toEqual({ endpoint });
  });
});
