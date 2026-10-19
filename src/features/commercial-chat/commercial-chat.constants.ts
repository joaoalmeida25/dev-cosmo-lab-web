import type { ChatServiceId } from './commercial-chat.types';

export const CHAT_SERVICE_IDS: ReadonlyArray<ChatServiceId> = [
  'sites',
  'applications',
  'maintenance',
  'others',
];

export const COMMERCIAL_CHAT_OPEN_EVENT = 'devcosmo:open-commercial-chat';
