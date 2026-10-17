import type { Metadata } from 'next';
import { ThemeBootstrap } from './components/theme-bootstrap/theme-bootstrap.component';
import { Geist, Geist_Mono } from 'next/font/google';
import { locale as getLocale } from 'next/root-params';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/constants/theme.constants';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/constants/site.constants';
import { Header } from '@/components/shared/header/header.component';
import { Footer } from '@/components/shared/footer/footer.component';
import { getTranslations } from 'next-intl/server';
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

  const messages = await getMessages();
  const t = await getTranslations('common.accessibility');

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
        <NextIntlClientProvider locale={locale} messages={{ common: messages.common }}>
          <a
            href="#main-content"
            className="sr-only z-50 rounded-control bg-surface px-5 py-3 text-text-primary focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:outline-2 focus:outline-focus-ring"
          >
            {t('skipToContent')}
          </a>
          <Header />
          <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
