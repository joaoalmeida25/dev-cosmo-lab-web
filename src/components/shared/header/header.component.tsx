import { getTranslations } from 'next-intl/server';
import { HeaderView } from './header-view.component';

export const Header = async () => {
  const t = await getTranslations('common');

  return (
    <HeaderView
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
