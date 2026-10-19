import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderLocalized } from '../../../test/render-localized';
import type { SupportedLocale } from '@/i18n/locale.types';
import { CommercialChatTrigger } from './components/commercial-chat-trigger/commercial-chat-trigger.component';
import type {
  IChatOption,
  ChatServiceId,
  ChatSubmissionPresentation,
  ChatValidationError,
} from './commercial-chat.types';
import { describe, it, vi, expect } from 'vitest';
import { createTranslator, NextIntlClientProvider } from 'next-intl';
import { ProjectDetailsStep } from './components/project-details-step/project-details-step.component';
import { NeedStep } from './components/need-step/need-step.component';
import { ServiceStep } from './components/service-step/service-step.component';
import { ContactStep } from './components/contact-step/contact-step.component';
import { renderToStaticMarkup } from 'react-dom/server';
import { CHAT_SERVICE_IDS } from './commercial-chat.constants';
import pt from '@/messages/pt-BR/commercial-chat.json';
import en from '@/messages/en/commercial-chat.json';
import es from '@/messages/es/commercial-chat.json';
import ptHome from '@/messages/pt-BR/home.json';
import enHome from '@/messages/en/home.json';
import esHome from '@/messages/es/home.json';
import { CommercialChat } from './commercial-chat.component';
import { SubmissionStatus } from './components/submission-status/submission-status.component';

const locales: ReadonlyArray<{
  locale: SupportedLocale;
  messages: typeof pt;
  home: typeof ptHome;
}> = [
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

const services: ReadonlyArray<IChatOption<ChatServiceId>> = [
  { value: 'sites', label: 'Sites' },
  { value: 'applications', label: 'Aplicações' },
  { value: 'maintenance', label: 'Manutenção' },
  { value: 'others', label: 'Outros' },
];

const projectDescription = 'Precisamos de um site acessível para nosso laboratório.';
const testConfig = { endpoint: 'https://formspree.io/f/testform' };
const startChat = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: pt.launcher }));
  const start = await screen.findByRole('button', { name: pt.welcome.start });
  await waitFor(() =>
    expect(screen.getByRole('dialog')).toHaveAttribute('data-transition', 'idle'),
  );
  await user.click(start);
};

const fillReview = async (user: ReturnType<typeof userEvent.setup>) => {
  await startChat(user);
  await user.click(screen.getByRole('radio', { name: 'Sites' }));
  await user.click(screen.getByRole('button', { name: pt.actions.next }));
  await user.type(screen.getByRole('textbox', { name: pt.steps.need.label }), projectDescription);
  await user.click(screen.getByRole('button', { name: pt.actions.next }));
  await user.click(screen.getByRole('button', { name: pt.actions.next }));
  await user.type(screen.getByRole('textbox', { name: pt.steps.contact.name }), 'João Almeida');
  await user.type(
    screen.getByRole('textbox', { name: pt.steps.contact.email }),
    'joao@example.com',
  );
  await user.click(screen.getByRole('button', { name: pt.actions.next }));
};

describe('CommercialChat - Unit Test', () => {
  it.each(locales)(
    'Should provide complete message keys and valid ICU labels for $locale',
    ({ locale, messages }) => {
      // Given: the selected message catalog and all validation error codes.
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

      const t = createTranslator({ locale, messages });

      // When: resolving progress, validation and edit labels with real ICU interpolation.
      const progress = t('progress', { current: 1, total: 5 });
      const needTitle = t('steps.need.title');
      const errors = errorCodes.map((code) =>
        t(`errors.${code}`, { min: 20, max: 1000, nameMax: 100, otherMin: 2, otherMax: 120 }),
      );

      const edit = t('review.edit', { section: t('review.contact') });
      const messageKeys = keys(messages);

      // Then: all locales contain matching contracts and meaningful resolved text without missing ICU values.
      expect(messageKeys).toEqual(keys(pt));
      expect(progress).toContain('1');
      expect(needTitle.length).toBeGreaterThan(20);
      expect(errors.every((error) => error.length > 10 && !error.includes('{'))).toBe(true);
      expect(edit.length).toBeGreaterThan(5);
    },
  );

  it.each(locales)(
    'Should prerender closed with semantic localized welcome and no delivery in $locale',
    ({ locale, messages, home }) => {
      // Given: real translations, supported services and a fetch dependency blocked by the shared setup.
      const options = CHAT_SERVICE_IDS.map((value) => ({
        value,
        label: value === 'others' ? messages.services.others : home.solutions.cards[value].title,
      }));

      // When: producing the Controller's initial server markup without user interaction.
      const html = renderToStaticMarkup(
        <NextIntlClientProvider
          locale={locale}
          timeZone="UTC"
          messages={{ commercialChat: messages }}
        >
          <CommercialChat locale={locale} services={options} />
        </NextIntlClientProvider>,
      );

      // Then: dialog relationships exist while the modal remains closed with no form, success or HTTP.
      expect(html).toMatch(/<dialog /);
      expect(html).toContain('aria-modal="true"');
      expect(html).toContain('aria-labelledby="chat-title"');
      expect(html).toContain('aria-describedby="chat-description"');
      expect(html).toContain('aria-expanded="false"');
      expect(html).toContain(`aria-label="${messages.launcher}"`);
      expect(html).toContain(messages.welcome.title);
      expect(html).toContain(messages.welcome.start);
      expect(html).not.toContain(' open=""');
      expect(html).not.toContain('<form');
      expect(html).not.toContain(messages.submission.success.title);
      expect(html).not.toContain('formspree');
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it.each(locales)(
    'Should display localized invalid feedback before fields without marking service radios invalid in $locale',
    ({ messages }) => {
      // Given: localized errors and explicitly invalid need, contact and Others presentation states.
      const noop = () => undefined;

      // When: rendering each inherited field presentation contract for this locale.
      const need = renderToStaticMarkup(
        <NeedStep
          title={messages.steps.need.title}
          fieldLabel={messages.steps.need.label}
          placeholder={messages.steps.need.placeholder}
          counter="5 / 1000"
          maxLength={1000}
          value="curto"
          error={messages.errors.needShort.replace('{min}', '20')}
          onChange={noop}
        />,
      );

      const contact = renderToStaticMarkup(
        <ContactStep
          labels={messages.steps.contact}
          nameLabel={messages.steps.contact.name}
          emailLabel={messages.steps.contact.email}
          name=""
          email="invalid"
          nameMaxLength={100}
          emailMaxLength={254}
          nameError={messages.errors.nameInvalid}
          emailError={messages.errors.emailInvalid}
          onNameChange={noop}
          onEmailChange={noop}
        />,
      );

      const service = renderToStaticMarkup(
        <ServiceStep
          title={messages.steps.service.title}
          options={[{ value: 'sites', label: 'Sites' }]}
          value=""
          otherService={null}
          onChange={noop}
        />,
      );

      const other = renderToStaticMarkup(
        <ServiceStep
          title={messages.steps.service.title}
          options={[{ value: 'others', label: messages.services.others }]}
          value="others"
          otherService={{
            label: messages.steps.service.otherLabel,
            value: '',
            maxLength: 120,
            error: messages.errors.otherServiceShort.replace('{otherMin}', '2'),
            onChange: noop,
          }}
          onChange={noop}
        />,
      );

      // Then: errors follow labels and precede invalid fields, while service options retain neutral presentation.
      expect(need.indexOf('id="chat-need-error"')).toBeLessThan(need.indexOf('id="chat-need"'));
      expect(need.indexOf('</label>')).toBeLessThan(need.indexOf('id="chat-need-error"'));
      expect(need).toContain('aria-invalid="true"');
      expect(need).toContain('border-rose-500');
      expect(need).toContain('text-rose-400');

      for (const field of ['name', 'email']) {
        expect(contact.indexOf(`id="chat-${field}-error"`)).toBeLessThan(
          contact.indexOf(`id="chat-${field}"`),
        );
        expect(contact).toMatch(new RegExp(`id="chat-${field}"[^>]*aria-invalid="true"`));
      }

      expect(service).not.toMatch(/chat-service-error|border-rose-500|data-chat-invalid/);
      expect(other).toContain('id="chat-other-service-error"');
      expect(other).toMatch(/id="chat-other-service"[^>]*aria-invalid="true"/);
      expect(other).toContain('border-rose-500');
      expect(other).not.toContain('chat-service-error');
    },
  );

  it.each(locales)(
    'Should announce only supplied localized submission outcomes in $locale',
    ({ messages }) => {
      // Given: sending, success and error presentation states with explicit action callbacks.
      const states: ReadonlyArray<ChatSubmissionPresentation> = [
        { status: 'sending' },
        { status: 'success', onClose: () => undefined },
        { status: 'error', onRetry: () => undefined },
      ];

      // When: prerendering each supplied outcome with its localized labels.
      const results = states.map((state) => {
        const labels = messages.submission[state.status];

        return {
          state,
          labels,
          html: renderToStaticMarkup(
            <SubmissionStatus
              state={state}
              title={labels.title}
              description={labels.description}
              actionLabel={labels.action}
            />,
          ),
        };
      });

      // Then: only errors interrupt, sending disables its action and no implicit form appears.
      for (const { state, labels, html } of results) {
        expect(html).toContain(labels.title);
        expect(html).toMatch(state.status === 'error' ? /role="alert"/ : /role="status"/);
        expect(html.includes('disabled=""')).toBe(state.status === 'sending');
        expect(html).not.toContain('<form');
      }
    },
  );

  it.each(locales)(
    'Should prerender optional native deadline and budget selections in $locale',
    ({ messages }) => {
      // Given: omitted deadline and budget answers with localized non-binding guidance.
      const options = [{ value: 'unspecified' as const, label: messages.notProvided }];

      // When: prerendering the optional project-details contract.
      const html = renderToStaticMarkup(
        <ProjectDetailsStep
          labels={messages.steps.details}
          deadline="unspecified"
          budget="unspecified"
          deadlineLabel={messages.steps.details.deadline}
          budgetLabel={messages.steps.details.budget}
          budgetHint={messages.steps.details.budgetHint}
          deadlineOptions={options}
          budgetOptions={options}
          onDeadlineChange={() => undefined}
          onBudgetChange={() => undefined}
        />,
      );

      // Then: both selectors remain native, unspecified and optional with meaningful guidance.
      expect(Array.from(html.matchAll(/<select /g))).toHaveLength(2);
      expect(Array.from(html.matchAll(/value="unspecified" selected=""/g))).toHaveLength(2);
      expect(html).toContain(messages.steps.details.budgetHint);
      expect(html).not.toContain('required=""');
    },
  );
});

// Controller interaction coverage complements the inherited server-markup contracts.
describe('CommercialChat - Unit Test', () => {
  it.each(locales)(
    'Should open from the launcher with neutral dialog focus in $locale',
    async ({ locale, messages }) => {
      // Given: a localized controller and no configured endpoint.
      const user = userEvent.setup();
      renderLocalized(<CommercialChat locale="pt-BR" services={services} />, locale);
      const launcher = screen.getByRole('button', { name: messages.launcher });

      // When: opening the chat and waiting for its transition.
      await user.click(launcher);
      const dialog = await screen.findByRole('dialog');
      await waitFor(() => expect(dialog).toHaveAttribute('data-transition', 'idle'));

      // Then: only the dialog receives technical focus, without selecting a title or control.
      expect(dialog).toHaveAccessibleName(messages.welcome.title);
      expect(dialog).toHaveFocus();
      expect(dialog).toHaveAttribute('tabindex', '-1');
      expect(screen.getByRole('button', { name: messages.welcome.start })).not.toHaveFocus();
      expect(screen.getByRole('heading', { name: messages.welcome.title })).not.toHaveAttribute(
        'tabindex',
      );
      expect(window.getSelection()?.toString()).toBe('');
      expect(document.body.style.overflow).toBe('hidden');
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it('Should open from a commercial CTA and restore focus after Escape', async () => {
    // Given: a CTA sharing the public chat event and a localized controller.
    const user = userEvent.setup();
    renderLocalized(
      <>
        <CommercialChatTrigger label="Commercial CTA" variant="primary" />
        <CommercialChat locale="pt-BR" services={services} />
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'Commercial CTA' });

    // When: opening from that CTA and cancelling the native dialog.
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(dialog).toHaveAttribute('data-transition', 'idle'));
    const initialFocus = document.activeElement;
    const selection = window.getSelection()?.toString();
    fireEvent(dialog, new Event('cancel', { cancelable: true }));

    // Then: the modal closes, unlocks scrolling and returns focus to its invoker.
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(initialFocus).toBe(dialog);
    expect(selection).toBe('');
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });

  it('Should enter and wrap modal controls with Tab and Shift+Tab from neutral dialog focus', async () => {
    // Given: a welcome dialog with technical focus and visible controls (jsdom has no layout).
    const user = userEvent.setup();
    vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue({
      length: 1,
      item: () => null,
      [Symbol.iterator]: () => Array<DOMRect>().values(),
    });
    renderLocalized(<CommercialChat locale="pt-BR" services={services} />);
    await user.click(screen.getByRole('button', { name: pt.launcher }));
    const start = await screen.findByRole('button', { name: pt.welcome.start });
    const dialog = screen.getByRole('dialog');
    await waitFor(() => expect(dialog).toHaveAttribute('data-transition', 'idle'));
    const initialFocus = document.activeElement;

    // When: tabbing from the dialog, wrapping backwards, then forwards and backwards from the dialog.
    await user.tab();
    const close = screen.getByRole('button', { name: pt.actions.close });
    const forwardFocus = document.activeElement;
    await user.tab({ shift: true });
    const reverseFocus = document.activeElement;
    await user.tab();
    const wrappedFocus = document.activeElement;
    dialog.focus();
    await user.tab({ shift: true });

    // Then: focus enters the first or last control and wraps without reaching the launcher.
    expect(initialFocus).toBe(dialog);
    expect(forwardFocus).toBe(close);
    expect(reverseFocus).toBe(start);
    expect(wrappedFocus).toBe(close);
    expect(start).toHaveFocus();
  });

  it('Should validate Others and the description, recover errors and preserve answers through review editing', async () => {
    // Given: the real controller at its service step.
    const user = userEvent.setup();
    renderLocalized(<CommercialChat locale="pt-BR" services={services} />);
    await startChat(user);
    const next = () => screen.getByRole('button', { name: pt.actions.next });
    const initialDisabled = next().hasAttribute('disabled');
    const initialError = screen.queryByRole('alert');

    // When: selecting Others, correcting its validation, and attempting a short description.
    await user.click(screen.getByRole('radio', { name: 'Outros' }));
    await user.click(next());
    const other = screen.getByRole('textbox', { name: pt.steps.service.otherLabel });
    const otherInvalid = other.getAttribute('aria-invalid');
    const otherFocused = document.activeElement;
    const otherBlocked = next().hasAttribute('disabled');
    await user.type(other, 'UX');
    const otherCorrected = !next().hasAttribute('disabled');
    await user.click(next());
    const need = screen.getByRole('textbox', { name: pt.steps.need.label });
    const needInitialFocus = document.activeElement;
    await user.type(need, 'curto');
    await user.click(next());
    const error = screen.getByRole('alert');
    const errorPrecedesInput = Boolean(
      error.compareDocumentPosition(need) & Node.DOCUMENT_POSITION_FOLLOWING,
    );

    const invalidNeedFocused = document.activeElement;
    const invalidNeedBlocked = next().hasAttribute('disabled');
    await user.clear(need);
    await user.type(need, projectDescription);
    await user.click(next());
    await user.selectOptions(
      screen.getByRole('combobox', { name: pt.steps.details.deadline }),
      'flexible',
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: pt.steps.details.budget }),
      'to-discuss',
    );
    await user.click(next());
    await user.click(next());
    const contactErrorCount = screen.getAllByRole('alert').length;
    await user.type(screen.getByRole('textbox', { name: pt.steps.contact.name }), 'João Almeida');
    await user.type(
      screen.getByRole('textbox', { name: pt.steps.contact.email }),
      'joao@example.com',
    );
    await user.click(next());
    await user.click(screen.getByRole('button', { name: 'Editar Necessidade' }));
    const editingNeed = screen.getByRole('textbox', { name: pt.steps.need.label });
    const retainedDescription =
      editingNeed instanceof HTMLTextAreaElement ? editingNeed.value : null;

    await user.click(screen.getByRole('button', { name: pt.actions.save }));

    // Then: validation gates recover correctly and review retains every answer and cannot send without configuration or confirmation.
    expect(initialDisabled).toBe(true);
    expect(initialError).toBeNull();
    expect(otherInvalid).toBe('true');
    expect(otherFocused).toBe(other);
    expect(otherBlocked).toBe(true);
    expect(otherCorrected).toBe(true);
    expect(needInitialFocus).not.toBe(need);
    expect(errorPrecedesInput).toBe(true);
    expect(invalidNeedFocused).toBe(need);
    expect(invalidNeedBlocked).toBe(true);
    expect(contactErrorCount).toBe(2);
    expect(retainedDescription).toBe(projectDescription);
    expect(screen.getByText('UX')).toBeInTheDocument();
    expect(screen.getByText('Prazo flexível')).toBeInTheDocument();
    expect(screen.getByText('A definir em conjunto')).toBeInTheDocument();
    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: pt.actions.send })).toBeDisabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('Should require discard confirmation, preserve cancelled answers and reset only after confirmation', async () => {
    // Given: an in-progress request with a selected service.
    const user = userEvent.setup();
    renderLocalized(<CommercialChat locale="pt-BR" services={services} />);
    await startChat(user);
    await user.click(screen.getByRole('radio', { name: 'Sites' }));

    // When: requesting close, cancelling discard, then explicitly confirming it.
    await user.click(screen.getAllByRole('button', { name: pt.actions.close })[0]);
    const confirmationTitle = screen.getByRole('alertdialog').getAttribute('aria-labelledby');
    const cancel = screen.getAllByRole('button', { name: pt.discard.cancel })[1];
    const cancelFocused = document.activeElement;
    await user.click(screen.getAllByRole('button', { name: pt.discard.cancel })[1]);
    const retainedSelection = screen.getByRole('radio', { name: 'Sites' });
    const selectionAfterCancel =
      retainedSelection instanceof HTMLInputElement && retainedSelection.checked;

    await user.click(screen.getAllByRole('button', { name: pt.actions.close })[0]);
    await user.click(screen.getByRole('button', { name: pt.discard.close }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await startChat(user);

    // Then: cancellation preserves the selection, confirmed closure clears it and delivery never occurs.
    expect(confirmationTitle).toBeTruthy();
    expect(cancelFocused).toBe(cancel);
    expect(selectionAfterCancel).toBe(true);
    expect(screen.getByRole('radio', { name: 'Sites' })).not.toBeChecked();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('Should submit only from review, block duplicate delivery and clear answers on confirmed success', async () => {
    // Given: an endpoint whose HTTP response is controlled by the test.
    const user = userEvent.setup();
    let resolveResponse: (response: Response) => void = () => undefined;
    const pending = new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    });

    const post = vi.mocked(fetch).mockReturnValue(pending);
    renderLocalized(
      <CommercialChat locale="pt-BR" services={services} submissionConfig={testConfig} />,
    );
    await fillReview(user);
    const callsBeforeConfirmation = post.mock.calls.length;

    // When: confirming delivery while its request is still pending.
    await user.dblClick(screen.getByRole('button', { name: pt.actions.send }));
    const sendingTitle = screen.getByRole('status').textContent;
    const pendingCalls = post.mock.calls.length;
    const closeDisabled = screen
      .getByRole('button', { name: pt.actions.close })
      .hasAttribute('disabled');

    await act(async () => {
      resolveResponse(Response.json({ next: '/thanks' }));
    });

    const successTitle = (await screen.findByRole('status')).textContent;
    await user.click(
      within(screen.getByRole('status')).getByRole('button', {
        name: pt.submission.success.action,
      }),
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const restoredFocus = document.activeElement;
    const launcher = screen.getByRole('button', { name: pt.launcher });
    await startChat(user);

    // Then: one confirmed submission clears data and closure restores the original launcher.
    expect(callsBeforeConfirmation).toBe(0);
    expect(sendingTitle).toContain(pt.submission.sending.title);
    expect(pendingCalls).toBe(1);
    expect(closeDisabled).toBe(true);
    expect(successTitle).toContain(pt.submission.success.title);
    expect(restoredFocus).toBe(launcher);
    expect(screen.getByRole('radio', { name: 'Sites' })).not.toBeChecked();
  });

  it('Should preserve data after rejection, return to review and succeed on an explicit retry', async () => {
    // Given: a rejected first request followed by a confirmed mocked response.
    const user = userEvent.setup();
    const post = vi
      .mocked(fetch)
      .mockResolvedValueOnce(Response.json({}, { status: 422 }))
      .mockResolvedValueOnce(Response.json({ next: '/thanks' }));

    renderLocalized(
      <CommercialChat locale="pt-BR" services={services} submissionConfig={testConfig} />,
    );
    await fillReview(user);

    // When: sending, returning from the error to review, and explicitly retrying.
    await user.click(screen.getByRole('button', { name: pt.actions.send }));
    const failure = (await screen.findByRole('alert')).textContent;
    await user.click(screen.getByRole('button', { name: pt.actions.review }));
    const retainedEmail = screen.getByText('joao@example.com').textContent;
    await user.click(screen.getByRole('button', { name: pt.actions.send }));

    // Then: the initial rejection remains explicit, data survives and only the manual retry succeeds.
    expect(failure).toContain(pt.submission.errors.rejected);
    expect(retainedEmail).toBe('joao@example.com');
    expect(await screen.findByRole('status')).toHaveTextContent(pt.submission.success.title);
    expect(post).toHaveBeenCalledTimes(2);
  });

  it('Should restore neutral welcome dialog focus after a confirmed restart without sending', async () => {
    // Given: a completed review whose endpoint is configured.
    const user = userEvent.setup();
    renderLocalized(
      <CommercialChat locale="pt-BR" services={services} submissionConfig={testConfig} />,
    );
    await fillReview(user);

    // When: confirming the restart action.
    await user.click(screen.getByRole('button', { name: pt.actions.restart }));
    await user.click(screen.getByRole('button', { name: pt.discard.restart }));

    // Then: welcome returns with technical focus on the dialog and no selection or delivery.
    expect(screen.getByRole('dialog')).toHaveAccessibleName(pt.welcome.title);
    expect(screen.getByRole('dialog')).toHaveFocus();
    expect(screen.getByRole('button', { name: pt.welcome.start })).not.toHaveFocus();
    expect(window.getSelection()?.toString()).toBe('');
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe('CommercialChat - Unit Test', () => {
  it('Should save every editable review group without changing valid answers', async () => {
    // Given: a completed review with optional deadline and budget omitted.
    const user = userEvent.setup();
    renderLocalized(
      <CommercialChat locale="pt-BR" services={services} submissionConfig={testConfig} />,
    );
    await fillReview(user);

    // When: opening and returning from each editable group without changing valid data.
    for (const section of [
      pt.review.service,
      pt.review.need,
      pt.review.details,
      pt.review.contact,
    ]) {
      await user.click(screen.getByRole('button', { name: `Editar ${section}` }));
      await user.click(screen.getByRole('button', { name: pt.actions.save }));
    }

    // Then: all original values remain in the final review and no submission occurs.
    expect(screen.getByText(projectDescription)).toBeInTheDocument();
    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
    expect(screen.getAllByText(pt.notProvided)).toHaveLength(2);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('Should retry a rate-limited request only through its explicit retry button', async () => {
    // Given: one rate limit response and a successful second response.
    const user = userEvent.setup();
    const post = vi
      .mocked(fetch)
      .mockResolvedValueOnce(Response.json({}, { status: 429 }))
      .mockResolvedValueOnce(Response.json({ next: '/thanks' }));

    renderLocalized(
      <CommercialChat locale="pt-BR" services={services} submissionConfig={testConfig} />,
    );
    await fillReview(user);
    await user.click(screen.getByRole('button', { name: pt.actions.send }));
    const rateLimit = (await screen.findByRole('alert')).textContent;
    const callsBeforeRetry = post.mock.calls.length;

    // When: the user explicitly requests another attempt.
    await user.click(screen.getByRole('button', { name: pt.submission.error.action }));

    // Then: rate limiting never triggers automatic retry and the explicit second attempt succeeds.
    expect(rateLimit).toContain(pt.submission.errors['rate-limit']);
    expect(callsBeforeRetry).toBe(1);
    expect(await screen.findByRole('status')).toHaveTextContent(pt.submission.success.title);
    expect(post).toHaveBeenCalledTimes(2);
  });

  it('Should reject a filled honeypot without HTTP and clear it after confirmed discard', async () => {
    // Given: a valid review whose hidden anti-spam field has been filled.
    const user = userEvent.setup();
    const { container } = renderLocalized(
      <CommercialChat locale="pt-BR" services={services} submissionConfig={testConfig} />,
    );

    await fillReview(user);
    const trap = container.querySelector('input[name="_gotcha"]');

    if (!(trap instanceof HTMLInputElement)) {
      throw new Error('Missing anti-spam boundary');
    }

    fireEvent.change(trap, { target: { value: 'bot' } });

    // When: confirming submission and then discarding the retained request.
    await user.click(screen.getByRole('button', { name: pt.actions.send }));
    const spamError = (await screen.findByRole('alert')).textContent;
    const blockedCalls = vi.mocked(fetch).mock.calls.length;
    await user.click(screen.getByRole('button', { name: pt.actions.close }));
    await user.click(screen.getByRole('button', { name: pt.discard.close }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await fillReview(user);
    vi.mocked(fetch).mockResolvedValueOnce(Response.json({ next: '/thanks' }));
    await user.click(screen.getByRole('button', { name: pt.actions.send }));

    // Then: the trapped request never reaches HTTP and confirmed discard clears the trap for a new request.
    expect(spamError).toContain(pt.submission.errors.spam);
    expect(blockedCalls).toBe(0);
    expect(await screen.findByRole('status')).toHaveTextContent(pt.submission.success.title);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('CommercialChat - Unit Test', () => {
  it.each([
    { config: null, configured: false },
    { config: testConfig, configured: true },
  ])(
    'Should expose review privacy and enable sending only when configured=$configured',
    async ({ config, configured }) => {
      // Given: the controller with an explicitly available or unavailable integration.
      const user = userEvent.setup();
      const { container } = renderLocalized(
        <CommercialChat locale="pt-BR" services={services} submissionConfig={config} />,
      );

      await fillReview(user);

      // When: inspecting the real final review before confirming delivery.
      const send = screen.getByRole('button', { name: pt.actions.send });
      const notice = screen.getByText(pt.privacy.notice);
      const restart = screen.getByRole('button', { name: pt.actions.restart });

      // Then: privacy precedes restart, progress is complete and no native/implicit POST exists.
      expect(send).toHaveAttribute('type', 'submit');
      expect(send).toHaveAttribute('aria-describedby', 'chat-send-note');

      if (configured) {
        expect(send).toBeEnabled();
      } else {
        expect(send).toBeDisabled();
      }

      expect(
        notice.compareDocumentPosition(restart) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '5');
      expect(container.querySelector('form')).not.toHaveAttribute('action');
      expect(container.querySelector('form')).not.toHaveAttribute('method');
      expect(container.querySelector('input[name="_gotcha"]')).toHaveAttribute('tabindex', '-1');
      expect(fetch).not.toHaveBeenCalled();
    },
  );
});
