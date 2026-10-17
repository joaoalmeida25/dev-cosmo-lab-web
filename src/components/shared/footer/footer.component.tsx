import { getTranslations } from 'next-intl/server';
import { SOCIAL_LINKS } from './social-links.constants';
import { FooterView } from './footer-view.component';

export const Footer = async () => {
  const t = await getTranslations('common');
  return (
    <FooterView
      description={t('footer.description')}
      footer={t('navigation.footer')}
      institutional={t('footer.institutional')}
      home={t('navigation.home')}
      products={t('navigation.products')}
      about={t('navigation.about')}
      social={t('footer.social')}
      signature={t('footer.signature')}
      copyright={t('footer.copyright', { year: new Date().getFullYear() })}
      socialLinks={SOCIAL_LINKS.map((social) => ({
        ...social,
        unavailableLabel: t('footer.socialUnavailable', { network: social.label }),
      }))}
    />
  );
};
