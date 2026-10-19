import assert from 'node:assert/strict';
import { test, mock } from 'node:test';
import { createTranslator, NextIntlClientProvider } from 'next-intl';
import { createRef } from 'react';
import { CommercialChatView } from './commercial-chat-view.component';
import type { ICommercialChatViewProps } from './commercial-chat.types';
import { ProjectDetailsStep } from './components/project-details-step/project-details-step.component';
import { renderToStaticMarkup } from 'react-dom/server';
import { CHAT_SERVICE_IDS } from './commercial-chat.constants';
import { ReviewStep } from './components/review-step/review-step.component';
import pt from '@/messages/pt-BR/commercial-chat.json';
import en from '@/messages/en/commercial-chat.json';
import es from '@/messages/es/commercial-chat.json';
import ptHome from '@/messages/pt-BR/home.json';
import enHome from '@/messages/en/home.json';
import esHome from '@/messages/es/home.json';
import { CommercialChat } from './commercial-chat.component';
import { SubmissionStatus } from './components/submission-status/submission-status.component';
import type { ChatSubmissionPresentation, ChatValidationError } from './commercial-chat.types';

const locales = [
  { locale: 'pt-BR', messages: pt, home: ptHome },
  { locale: 'en', messages: en, home: enHome },
  { locale: 'es', messages: es, home: esHome },
];
const keys = (value: object, prefix = ''): ReadonlyArray<string> =>
  Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'object' && child !== null
      ? keys(child, `${prefix}${key}.`)
      : `${prefix}${key}`,
  );

test('all locales have equivalent messages and valid ICU labels for progress and validation', () => {
  for (const { locale, messages } of locales) {
    assert.deepEqual(keys(messages), keys(pt));
    const t = createTranslator({ locale, messages });
    assert.ok(t('progress', { current: 1, total: 5 }).includes('1'));
    assert.ok(t('steps.need.title').length > 20);
    const errorCodes: ReadonlyArray<ChatValidationError> = [
      'serviceRequired',
      'otherServiceShort',
      'otherServiceLong',
      'needShort',
      'needLong',
      'nameInvalid',
      'nameLong',
      'emailInvalid',
    ];
    for (const code of errorCodes)
      assert.ok(
        t(`errors.${code}`, { min: 20, max: 1000, nameMax: 100, otherMin: 2, otherMax: 120 })
          .length > 10,
      );
    assert.ok(t('review.edit', { section: t('review.contact') }).length > 5);
  }
});

test('the public controller starts closed with localized welcome/launcher, native dialog semantics and no submission', () => {
  const fetch = mock.method(globalThis, 'fetch', async () => {
    throw new Error('Unexpected HTTP');
  });
  try {
    for (const { locale, messages, home } of locales) {
      const html = renderToStaticMarkup(
        <NextIntlClientProvider
          locale={locale}
          timeZone="UTC"
          messages={{ commercialChat: messages }}
        >
          <CommercialChat
            locale={locale === 'pt-BR' ? 'pt-BR' : locale === 'en' ? 'en' : 'es'}
            services={CHAT_SERVICE_IDS.map((value) => ({
              value,
              label:
                value === 'others' ? messages.services.others : home.solutions.cards[value].title,
            }))}
          />
        </NextIntlClientProvider>,
      );
      assert.match(html, /<dialog /);
      assert.match(html, /aria-modal="true"/);
      assert.match(html, /aria-labelledby="chat-title"/);
      assert.match(html, /aria-describedby="chat-description"/);
      assert.match(html, /aria-expanded="false"/);
      assert.ok(html.includes(`aria-label="${messages.launcher}"`));
      assert.ok(html.includes(messages.welcome.title));
      assert.ok(html.includes(messages.welcome.start));
      assert.ok(!html.includes(' open=""'));
      assert.ok(!html.includes('<form'));
      assert.ok(!html.includes(messages.submission.success.title));
      assert.ok(!html.includes('formspree'));
    }
    assert.equal(fetch.mock.callCount(), 0);
  } finally {
    fetch.mock.restore();
  }
});

test('submission presentation states are localized and announce outcomes only when explicitly provided', () => {
  const states: ReadonlyArray<ChatSubmissionPresentation> = [
    { status: 'sending' },
    { status: 'success', onClose: () => undefined },
    { status: 'error', onRetry: () => undefined },
  ];
  for (const { messages } of locales) {
    for (const state of states) {
      const labels = messages.submission[state.status];
      const html = renderToStaticMarkup(
        <SubmissionStatus
          state={state}
          title={labels.title}
          description={labels.description}
          actionLabel={labels.action}
        />,
      );
      assert.ok(html.includes(labels.title));
      assert.match(html, state.status === 'error' ? /role="alert"/ : /role="status"/);
      assert.equal(html.includes('disabled=""'), state.status === 'sending');
      assert.ok(!html.includes('<form'));
    }
  }
});

test('review enables sending with a configured endpoint and displays the data-use notice', () => {
  for (const { messages } of locales) {
    const reviewContent = (
      <ReviewStep
        labels={messages.steps.review}
        groups={[]}
        editLabel={messages.review.editAction}
        restartLabel={messages.actions.restart}
        onRestart={() => undefined}
        privacy={messages.privacy.notice}
      />
    );
    const props: ICommercialChatViewProps = {
      dialogRef: createRef<HTMLDialogElement>(),
      screen: 'review',
      isOpen: true,
      isEditing: false,
      discard: null,
      progress: 5,
      content: reviewContent,
      labels: {
        brand: messages.brand,
        launcher: messages.launcher,
        title: messages.title,
        close: messages.actions.close,
        welcomeTitle: messages.welcome.title,
        welcomeDescription: messages.welcome.description,
        start: messages.welcome.start,
        progress: '5 / 5',
        progressLabel: messages.progressLabel,
        back: messages.actions.back,
        next: messages.actions.next,
        save: messages.actions.save,
        send: messages.actions.send,
      },
      onOpen: () => undefined,
      onClose: () => undefined,
      onCancel: (event) => event.preventDefault(),
      onStart: () => undefined,
      onContinue: (event) => event.preventDefault(),
      onBack: () => undefined,
      onCancelDiscard: () => undefined,
      onConfirmDiscard: () => undefined,
    };
    const review = renderToStaticMarkup(<CommercialChatView {...props} />);
    assert.match(review, /type="submit" disabled="" aria-describedby="chat-send-note"/);
    assert.ok(review.includes(messages.privacy.notice.replaceAll("'", '&#x27;')));
    assert.ok(review.indexOf('id="chat-send-note"') < review.indexOf(messages.actions.restart));
    assert.ok(!review.slice(review.indexOf('<footer')).includes(messages.privacy.notice));
    assert.match(review, /aria-valuenow="5"/);
    assert.ok(!review.includes('action="'));
    assert.ok(!review.includes('method="'));
    const ready = renderToStaticMarkup(<CommercialChatView {...props} canSubmit />);
    assert.match(ready, /type="submit" aria-describedby="chat-send-note"/);
    assert.ok(ready.includes(messages.privacy.notice.replaceAll("'", '&#x27;')));
    assert.ok(!ready.includes('example.com/privacy'));
    assert.match(ready, /name="_gotcha"/);

    const discard = renderToStaticMarkup(
      <CommercialChatView
        {...props}
        discard={{
          title: messages.discard.title,
          description: messages.discard.description,
          cancel: messages.discard.cancel,
          confirm: messages.discard.close,
        }}
      />,
    );
    assert.match(discard, /role="alertdialog"/);
    assert.match(discard, /data-chat-safe-action="true"/);
    assert.ok(discard.includes(messages.discard.cancel));
    assert.ok(discard.includes(messages.discard.close));
    assert.ok(!discard.includes('<form'));
  }
});

test('deadline and budget render native optional selections with non-binding guidance', () => {
  for (const { messages } of locales) {
    const html = renderToStaticMarkup(
      <ProjectDetailsStep
        labels={messages.steps.details}
        deadline="unspecified"
        budget="unspecified"
        deadlineLabel={messages.steps.details.deadline}
        budgetLabel={messages.steps.details.budget}
        budgetHint={messages.steps.details.budgetHint}
        deadlineOptions={[{ value: 'unspecified', label: messages.notProvided }]}
        budgetOptions={[{ value: 'unspecified', label: messages.notProvided }]}
        onDeadlineChange={() => undefined}
        onBudgetChange={() => undefined}
      />,
    );
    assert.equal(Array.from(html.matchAll(/<select /g)).length, 2);
    assert.equal(Array.from(html.matchAll(/value="unspecified" selected=""/g)).length, 2);
    assert.ok(html.includes(messages.steps.details.budgetHint));
    assert.ok(!html.includes('required=""'));
  }
});
