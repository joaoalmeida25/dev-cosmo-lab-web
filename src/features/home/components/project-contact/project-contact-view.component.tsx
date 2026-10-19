import { CommercialChatTrigger } from '@/features/commercial-chat/components/commercial-chat-trigger/commercial-chat-trigger.component';

interface IProjectContactViewProps {
  primary: boolean;
  label: string;
}

export const ProjectContactView = ({ primary, label }: IProjectContactViewProps) => (
  <div className="flex max-w-sm flex-col gap-2">
    <CommercialChatTrigger label={label} variant={primary ? 'primary' : 'secondary'} />
  </div>
);
