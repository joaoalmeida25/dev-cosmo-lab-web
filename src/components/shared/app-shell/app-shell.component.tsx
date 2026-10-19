import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import type { SupportedLocale } from '@/i18n/locale.types';
import { AppShellView } from './app-shell-view.component';
import { CommercialChat } from '@/features/commercial-chat/commercial-chat.component';
import { CHAT_SERVICE_IDS } from '@/features/commercial-chat/commercial-chat.constants';
import { getChatSubmissionConfig } from '@/features/commercial-chat/utils/commercial-chat-config/commercial-chat-config.util';

interface IAppShellProps {
  children: ReactNode;
  locale: SupportedLocale;
}

export const AppShell = async ({ children, locale }: IAppShellProps) => {
  const [messages, t, serviceTranslations, chatServices] = await Promise.all([
    getMessages(),
    getTranslations('common.accessibility'),
    getTranslations('home.solutions.cards'),
    getTranslations('commercialChat.services'),
  ]);

  return (
    <NextIntlClientProvider locale={locale} messages={{ common: messages.common }}>
      <AppShellView skipToContent={t('skipToContent')}>{children}</AppShellView>
      <NextIntlClientProvider messages={{ commercialChat: messages.commercialChat }}>
        <CommercialChat
          locale={locale}
          submissionConfig={getChatSubmissionConfig(process.env.DEVCOSMO_FORMSPREE_ENDPOINT)}
          services={CHAT_SERVICE_IDS.map((value) => ({
            value,
            label:
              value === 'others' ? chatServices('others') : serviceTranslations(`${value}.title`),
          }))}
        />
      </NextIntlClientProvider>
    </NextIntlClientProvider>
  );
};
