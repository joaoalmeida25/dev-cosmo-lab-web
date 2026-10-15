import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { locale as getLocale } from 'next/root-params';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/constants/theme.constants';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/constants/site.constants';
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
};

const themeScript = `(() => {
  let theme = ${JSON.stringify(DEFAULT_THEME)};

  try {
    const savedTheme = JSON.parse(window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}) ?? 'null');
    if (savedTheme === 'dark' || savedTheme === 'light') theme = savedTheme;
  } catch {}

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();`;

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

const RootLayout = async ({ children }: LayoutProps<'/[locale]'>) => {
  const locale = await getLocale();

  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={{ common: messages.common }}>
          {children}
        </NextIntlClientProvider>
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </body>
    </html>
  );
};

export default RootLayout;
