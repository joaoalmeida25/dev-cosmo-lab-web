import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    {
      source: '/((?!api|_next|_vercel|.*\\..*).*)',
      missing: [{ type: 'header', key: 'x-next-intl-locale' }],
    },
  ],
};
