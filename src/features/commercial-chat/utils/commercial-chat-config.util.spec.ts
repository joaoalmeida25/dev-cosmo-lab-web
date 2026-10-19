import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getChatSubmissionConfig } from './commercial-chat-config.util';

const endpoint = 'https://formspree.io/f/testform';

test('sending requires a valid HTTPS Formspree endpoint without a privacy policy URL', () => {
  assert.equal(getChatSubmissionConfig(undefined), null);
  assert.equal(getChatSubmissionConfig(''), null);
  for (const invalid of [
    'http://formspree.io/f/testform',
    'https://other.example/f/testform',
    'https://formspree.io.evil.example/f/testform',
    'https://formspree.io/person@example.com',
    'https://formspree.io/f/',
    `${endpoint}?redirect=elsewhere`,
    `${endpoint}#fragment`,
    'https://user:password@formspree.io/f/testform',
  ])
    assert.equal(getChatSubmissionConfig(invalid), null);
  assert.deepEqual(getChatSubmissionConfig(endpoint), { endpoint });
});
