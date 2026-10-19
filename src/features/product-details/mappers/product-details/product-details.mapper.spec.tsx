import { renderLocalized } from '../../../../../test/render-localized';
import { screen } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import proposals from '@/features/products/data/propostas-em-dia.json';
import { mapProduct } from '@/features/products/mappers/product/product.mapper';
import type { IProduct } from '@/features/products/products.types';
import type { SupportedLocale } from '@/i18n/locale.types';
import pt from '@/messages/pt-BR/product-details.json';
import en from '@/messages/en/product-details.json';
import es from '@/messages/es/product-details.json';
import ptCatalog from '@/messages/pt-BR/catalog.json';
import enCatalog from '@/messages/en/catalog.json';
import esCatalog from '@/messages/es/catalog.json';
import { ProductDetailsView } from '../../product-details-view.component';
import { mapProductDetails } from './product-details.mapper';

vi.mock('@/i18n/navigation', () => import('../../../../../test/navigation-mock'));

const locales: ReadonlyArray<{
  locale: SupportedLocale;
  details: typeof pt;
  catalog: typeof ptCatalog;
}> = [
  { locale: 'pt-BR', details: pt, catalog: ptCatalog },
  { locale: 'en', details: en, catalog: enCatalog },
  { locale: 'es', details: es, catalog: esCatalog },
];

const product = mapProduct(proposals);
const map = (value: IProduct) =>
  mapProductDetails(
    value,
    'pt-BR',
    createTranslator({ locale: 'pt-BR', messages: pt }),
    createTranslator({ locale: 'pt-BR', messages: ptCatalog }),
  );

describe('ProductDetailsMapper - Unit Test', () => {
  it.each(locales)(
    'Should prepare localized purchase, demonstration, specifications and ordered gallery in $locale',
    ({ locale, details, catalog }) => {
      // Given: validated product data and real localized translators.
      const t = createTranslator({ locale, messages: details });
      const c = createTranslator({ locale, messages: catalog });

      // When: creating the server controller's pure presentation contract.
      const result = mapProductDetails(product, locale, t, c);

      // Then: confirmed actions and content retain their localized public contracts.
      expect(result.summary.action?.href).toBe(product.commercial.checkoutUrl);
      expect(result.summary.action?.label).toBe(details.buy);
      expect(result.summary.demonstration?.href).toBe(product.details?.demonstrationUrl);
      expect(result.gallery.map(({ src }) => src)).toEqual(product.media.gallery);
      expect(result.galleryLabels.positions[0]).toContain('1');
      expect(result.steps).toHaveLength(5);
      expect(result.faq).toHaveLength(5);
      expect(result.summary.specifications).toContainEqual({
        label: details.specifications.compatibility,
        value: details.values.excel,
      });
      expect(result.summary.price).toBe(
        new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(29.9),
      );
    },
  );

  it('Should use confirmed access when checkout is absent and omit empty optional sections', () => {
    // Given: validated data with optional metadata and commercial fields absent.
    const value: IProduct = {
      ...product,
      media: { ...product.media, gallery: [] },
      details: {
        accessUrl: 'https://example.com/access',
        specifications: { languages: [], platform: 'web' },
      },
      commercial: { ...product.commercial, checkoutUrl: null, priceCents: null },
      content: { ...product.content, 'pt-BR': { ...product.content['pt-BR'], details: undefined } },
    };

    // When: preparing display props for an access-only product.
    const result = map(value);
    const withoutDetails = map({ ...value, details: undefined });

    // Then: missing data never fabricates a buy action, price, FAQ or steps.
    expect(result.summary.action).toEqual({
      href: 'https://example.com/access',
      label: pt.access,
      accessibleLabel: pt.accessLabel.replace('{name}', product.name),
    });
    expect(result.summary.demonstration).toBeNull();
    expect(result.summary.price).toBeNull();
    expect(result.steps).toEqual([]);
    expect(result.faq).toEqual([]);
    expect(result.summary.specifications).toHaveLength(2);
    expect(withoutDetails.summary.action).toBeNull();
  });

  it('Should omit purchase and access for unavailable products and preserve gallery alt fallback', () => {
    // Given: an unavailable library without optional localized detail descriptions.
    const value: IProduct = {
      ...product,
      status: 'planned',
      type: 'development-library',
      details: undefined,
      content: { ...product.content, 'pt-BR': { ...product.content['pt-BR'], details: undefined } },
    };

    // When: preparing display props independently of the route's 404 guard.
    const result = map(value);

    // Then: stage guidance is localized, commercial actions are absent and media remain described.
    expect(result.summary.action).toBeNull();
    expect(result.summary.stageNote).toBe(ptCatalog.card.libraryNote);
    expect(result.summary.price).toBeNull();
    expect(result.includedTitle).toBe(pt.plannedIncluded);
    expect(result.stepsTitle).toBe(pt.plannedSteps);
    expect(result.gallery[0].alt).toBe(product.content['pt-BR'].imageAlt);
  });

  it('Should render the mapped contract with semantic sections and safe purchase links', () => {
    // Given: prepared view props from the production mapper.
    const props = map(product);

    // When: rendering that public presentation contract.
    renderLocalized(<ProductDetailsView {...props} />);

    // Then: section content, FAQ and external destinations are available to assistive queries.
    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: props.summary.action?.accessibleLabel }),
    ).toHaveAttribute('rel', 'noreferrer noopener');
    expect(
      screen.getByText(product.content['pt-BR'].details?.faq?.[0].question ?? ''),
    ).toBeInTheDocument();
  });
});
