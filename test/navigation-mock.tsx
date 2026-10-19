import type { ComponentProps } from 'react';
import { useLocale } from 'next-intl';
import { createNavigation } from 'next-intl/navigation';
import { vi } from 'vitest';
import { routing } from '@/i18n/routing';

export const navigation = { pathname: '/', push: vi.fn(), replace: vi.fn() };
export const usePathname = () => navigation.pathname;
export const useRouter = () => navigation;
export const getPathname = createNavigation(routing).getPathname;
export const Link = ({ href, ...props }: ComponentProps<'a'>) => {
  const locale = useLocale();

  return <a {...props} href={href ? getPathname({ href, locale }) : href} />;
};
