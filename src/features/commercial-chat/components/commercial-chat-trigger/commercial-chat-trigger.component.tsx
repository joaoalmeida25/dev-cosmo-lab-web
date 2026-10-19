'use client';

import type { MouseEvent } from 'react';
import type { ButtonVariant } from '@/components/ui/button/button.types';
import { COMMERCIAL_CHAT_OPEN_EVENT } from '../../commercial-chat.constants';
import { CommercialChatTriggerView } from './commercial-chat-trigger-view.component';

interface ICommercialChatTriggerProps {
  label: string;
  variant: ButtonVariant;
}

export const CommercialChatTrigger = ({ label, variant }: ICommercialChatTriggerProps) => {
  const open = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.dispatchEvent(new Event(COMMERCIAL_CHAT_OPEN_EVENT, { bubbles: true }));
  };
  return <CommercialChatTriggerView label={label} variant={variant} onOpen={open} />;
};
