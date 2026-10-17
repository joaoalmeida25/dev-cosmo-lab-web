import { getTranslations } from 'next-intl/server';
import { HeaderInteraction } from './header-interaction.component';

export const Header = async () => {
  const t = await getTranslations('common');

  return (
    <HeaderInteraction
      labels={{
        mainNavigation: t('navigation.main'),
        home: t('navigation.home'),
        products: t('navigation.products'),
        about: t('navigation.about'),
        openMenu: t('navigation.openMenu'),
        closeMenu: t('navigation.closeMenu'),
      }}
    />
  );
};
