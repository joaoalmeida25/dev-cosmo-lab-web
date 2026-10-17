export interface IHeaderLabels {
  mainNavigation: string;
  home: string;
  products: string;
  about: string;
  openMenu: string;
  closeMenu: string;
}

export interface IHeaderNavigationItem {
  key: 'home' | 'products' | 'about';
  href: string;
  current: boolean;
}
