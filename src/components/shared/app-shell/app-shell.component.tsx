import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import type { SupportedLocale } from '@/i18n/locale.types';
import { AppShellView } from './app-shell-view.component';

interface IAppShellProps {
  children: ReactNode;
  locale: SupportedLocale;
}

export const AppShell = async ({ children, locale }: IAppShellProps) => {
  const [messages, t] = await Promise.all([getMessages(), getTranslations('common.accessibility')]);

  return (
    <NextIntlClientProvider locale={locale} messages={{ common: messages.common }}>
      <AppShellView skipToContent={t('skipToContent')}>{children}</AppShellView>
    </NextIntlClientProvider>
  );
};
