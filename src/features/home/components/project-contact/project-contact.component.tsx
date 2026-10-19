import { getTranslations } from 'next-intl/server';
import { ProjectContactView } from './project-contact-view.component';

interface IProjectContactProps {
  placement: 'services' | 'final';
}

export const ProjectContact = async ({ placement }: IProjectContactProps) => {
  const t = await getTranslations('home.contact');

  return <ProjectContactView primary={placement === 'services'} label={t(placement)} />;
};
