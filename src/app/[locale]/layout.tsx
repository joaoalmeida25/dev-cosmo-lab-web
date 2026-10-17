import type { Metadata } from 'next';
import { ThemeBootstrap } from './components/theme-bootstrap/theme-bootstrap.component';
import { Geist, Geist_Mono } from 'next/font/google';
import { locale as getLocale } from 'next/root-params';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/constants/theme.constants';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/constants/site.constants';
import { AppShell } from '@/components/shared/app-shell/app-shell.component';
import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: '/favicon.ico',
  },
};

const themeScript = `(() => {
  let theme = ${JSON.stringify(DEFAULT_THEME)};

  try {
    const savedTheme = JSON.parse(window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}) ?? 'null');
    if (savedTheme === 'dark' || savedTheme === 'light') theme = savedTheme;
  } catch {}

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.documentElement.dataset.themeReady = 'true';
})();`;

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

const RootLayout = async ({ children }: LayoutProps<'/[locale]'>) => {
  const locale = await getLocale();

  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html
      lang={locale}
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeBootstrap script={themeScript} locale={locale} />
        <noscript>
          <style>{`:root:not([data-theme-ready]) body { visibility: visible; } .themed-artwork { background-image: var(--artwork-dark); }`}</style>
        </noscript>
        <AppShell locale={locale}>{children}</AppShell>
      </body>
    </html>
  );
};

export default RootLayout;
