import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { SupportedLocale } from '@/i18n/locale.types';
import ptCommon from '@/messages/pt-BR/common.json';
import ptChat from '@/messages/pt-BR/commercial-chat.json';
import ptCatalog from '@/messages/pt-BR/catalog.json';
import enCommon from '@/messages/en/common.json';
import enChat from '@/messages/en/commercial-chat.json';
import enCatalog from '@/messages/en/catalog.json';
import esCommon from '@/messages/es/common.json';
import esChat from '@/messages/es/commercial-chat.json';
import esCatalog from '@/messages/es/catalog.json';

const messages = {
  'pt-BR': { common: ptCommon, commercialChat: ptChat, catalog: ptCatalog },
  en: { common: enCommon, commercialChat: enChat, catalog: enCatalog },
  es: { common: esCommon, commercialChat: esChat, catalog: esCatalog },
};

export const renderLocalized = (component: ReactElement, locale: SupportedLocale = 'pt-BR') =>
  render(component, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <NextIntlClientProvider
        locale={locale}
        timeZone="America/Sao_Paulo"
        messages={messages[locale]}
      >
        {children}
      </NextIntlClientProvider>
    ),
  });
