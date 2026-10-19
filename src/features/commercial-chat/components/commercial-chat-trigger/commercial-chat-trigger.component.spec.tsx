import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { CommercialChatTrigger } from './commercial-chat-trigger.component';
import pt from '@/messages/pt-BR/home.json';
import en from '@/messages/en/home.json';
import es from '@/messages/es/home.json';

test('Home contact triggers preserve localized labels and Button variants without external destinations', () => {
  for (const messages of [pt, en, es]) {
    const html = renderToStaticMarkup(
      <>
        <CommercialChatTrigger label={messages.contact.services} variant="primary" />
        <CommercialChatTrigger label={messages.contact.final} variant="secondary" />
      </>,
    );
    assert.equal(Array.from(html.matchAll(/aria-controls="commercial-chat"/g)).length, 2);
    assert.equal(Array.from(html.matchAll(/aria-haspopup="dialog"/g)).length, 2);
    assert.ok(html.includes(messages.contact.services));
    assert.ok(html.includes(messages.contact.final));
    assert.match(html, /min-h-12/);
    assert.match(html, /bg-primary/);
    assert.ok(!html.includes('href='));
    assert.ok(!html.includes('wa.me'));
    assert.ok(!html.includes('<dialog'));
  }
});
