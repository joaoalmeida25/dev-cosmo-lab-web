import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildWhatsAppUrl } from './project-contact.util';

test('contact stays unavailable for absent or malformed international numbers', () => {
  for (const phone of [
    undefined,
    '',
    ' ',
    '+5511999999999',
    '05511999999999',
    '123',
    '1234567890123456',
    '5511 999999999',
    'https://example.com',
  ]) {
    assert.equal(buildWhatsAppUrl(phone, 'Olá!'), null);
  }
});

test('configured international number produces only a wa.me link with encoded message', () => {
  const message = 'Olá! Projeto & tecnologia?';
  const url = new URL(buildWhatsAppUrl('5511999999999', message) ?? '');
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/5511999999999');
  assert.equal(url.searchParams.get('text'), message);
});
