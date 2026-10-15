import { routing } from '@/i18n/routing';

export type SupportedLocale = (typeof routing.locales)[number];

export type Locale = 'pt-BR' | 'en' | 'es';
