import { locale as getLocale } from 'next/root-params';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';

export default getRequestConfig(async () => {
  const locale = await getLocale();

  if (!hasLocale(routing.locales, locale)) notFound();

  const [common, home, metadata, products] = await Promise.all([
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/home.json`),
    import(`../messages/${locale}/metadata.json`),
    import(`../messages/${locale}/products.json`),
  ]);

  return {
    locale,
    messages: {
      common: common.default,
      home: home.default,
      metadata: metadata.default,
      products: products.default,
    },
  };
});
