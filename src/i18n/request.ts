import { locale as getLocale } from 'next/root-params';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';

export default getRequestConfig(async () => {
  const locale = await getLocale();

  if (!hasLocale(routing.locales, locale)) notFound();

  const [common, home, metadata, catalog, productDetails, commercialChat] = await Promise.all([
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/home.json`),
    import(`../messages/${locale}/metadata.json`),
    import(`../messages/${locale}/catalog.json`),
    import(`../messages/${locale}/product-details.json`),
    import(`../messages/${locale}/commercial-chat.json`),
  ]);

  return {
    locale,
    messages: {
      common: common.default,
      home: home.default,
      metadata: metadata.default,
      catalog: catalog.default,
      productDetails: productDetails.default,
      commercialChat: commercialChat.default,
    },
  };
});
