import { getTranslations } from 'next-intl/server';
import { buildWhatsAppUrl } from '../../utils/project-contact.util';
import { ProjectContactView } from './project-contact-view.component';

interface IProjectContactProps {
  placement: 'services' | 'final';
}

export const ProjectContact = async ({ placement }: IProjectContactProps) => {
  const t = await getTranslations('home.contact');
  return (
    <ProjectContactView
      href={buildWhatsAppUrl(process.env.DEVCOSMO_WHATSAPP_NUMBER, t('message'))}
      label={t(placement)}
      pending={t('pending')}
    />
  );
};
