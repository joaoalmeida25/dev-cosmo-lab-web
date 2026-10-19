import type { MouseEventHandler } from 'react';
import { Button } from '@/components/ui/button/button.component';
import type { ButtonVariant } from '@/components/ui/button/button.types';

interface ICommercialChatTriggerViewProps {
  label: string;
  variant: ButtonVariant;
  onOpen: MouseEventHandler<HTMLButtonElement>;
}

export const CommercialChatTriggerView = ({
  label,
  variant,
  onOpen,
}: ICommercialChatTriggerViewProps) => (
  <Button
    size="lg"
    variant={variant}
    onClick={onOpen}
    aria-haspopup="dialog"
    aria-controls="commercial-chat"
  >
    {label}
  </Button>
);
