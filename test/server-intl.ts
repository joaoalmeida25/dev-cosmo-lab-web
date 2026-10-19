import { createTranslator, type AbstractIntlMessages } from 'next-intl';
import { vi } from 'vitest';
import type { SupportedLocale } from '@/i18n/locale.types';
import ptCommon from '@/messages/pt-BR/common.json';
import ptHome from '@/messages/pt-BR/home.json';
import ptCatalog from '@/messages/pt-BR/catalog.json';
import ptDetails from '@/messages/pt-BR/product-details.json';
import ptChat from '@/messages/pt-BR/commercial-chat.json';
import enCommon from '@/messages/en/common.json';
import enHome from '@/messages/en/home.json';
import enCatalog from '@/messages/en/catalog.json';
import enDetails from '@/messages/en/product-details.json';
import enChat from '@/messages/en/commercial-chat.json';
import esCommon from '@/messages/es/common.json';
import esHome from '@/messages/es/home.json';
import esCatalog from '@/messages/es/catalog.json';
import esDetails from '@/messages/es/product-details.json';
import esChat from '@/messages/es/commercial-chat.json';

const messages: Record<SupportedLocale, AbstractIntlMessages> = {
  'pt-BR': {
    common: ptCommon,
    home: ptHome,
    catalog: ptCatalog,
    productDetails: ptDetails,
    commercialChat: ptChat,
  },
  en: {
    common: enCommon,
    home: enHome,
    catalog: enCatalog,
    productDetails: enDetails,
    commercialChat: enChat,
  },
  es: {
    common: esCommon,
    home: esHome,
    catalog: esCatalog,
    productDetails: esDetails,
    commercialChat: esChat,
  },
};

// Only the server request boundary is replaced; translations and synchronous Views stay real.
export const serverIntl = { locale: 'pt-BR' };
const resolveLocale = (): SupportedLocale =>
  (['pt-BR', 'en', 'es'] as const).find((locale) => locale === serverIntl.locale) ?? 'pt-BR';

export const getLocale = vi.fn(async () => serverIntl.locale);
export const getMessages = vi.fn(async () => messages[resolveLocale()]);
export const getTranslations = vi.fn(async (namespace?: string) =>
  createTranslator({ locale: resolveLocale(), messages: messages[resolveLocale()], namespace }),
);
