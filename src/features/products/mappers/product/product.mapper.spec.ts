// @vitest-environment node

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import proposals from '../../data/propostas-em-dia.json';
import { productsRepository } from '../../repositories/products/products.repository';
import { mapProduct } from './product.mapper';

const locales = ['pt-BR', 'en', 'es'] as const;

describe('ProductMapper - Unit Test', () => {
  it('Should preserve confirmed demonstration, access, specifications and commercial fields', () => {
    // Given: the approved kit DTO with a confirmed optional access destination.
    const dto = {
      ...proposals,
      details: { ...proposals.details, accessUrl: 'https://example.com/access' },
    };

    // When: mapping the enriched and original DTOs at the product boundary.
    const product = mapProduct(dto);
    const original = mapProduct(proposals);

    // Then: approved destinations, specifications and purchase claims remain unchanged.
    expect(product.details?.demonstrationUrl).toBe('https://youtu.be/Hwl--3B_W5g');
    expect(product.details?.accessUrl).toBe('https://example.com/access');
    expect(product.details?.specifications).toEqual(original.details?.specifications);
    expect(product.commercial).toEqual(proposals.commercial);
  });
  it('Should keep demonstration and product details optional when absent', async () => {
    // Given: DTOs omitting demonstration or all details and the two unpublished products.
    const dto = { ...proposals, details: { ...proposals.details, demonstrationUrl: undefined } };

    // When: mapping optional states and loading products without a demonstration.
    const product = mapProduct(dto);
    const minimal = mapProduct({ ...proposals, details: undefined });
    const unpublished = await Promise.all(
      ['hoje-cabe', 'followup-inbox'].map((slug) => productsRepository.getProductBySlug(slug)),
    );

    // Then: no absent detail or video destination is invented.
    expect(product.details?.demonstrationUrl).toBeUndefined();
    expect(minimal.details).toBeUndefined();
    expect(unpublished.map((item) => item?.details?.demonstrationUrl)).toEqual([
      undefined,
      undefined,
    ]);
  });
  it('Should retain three unique products, locales, commercial statuses and canonical slug lookup', async () => {
    // Given: the real static product repository and its supported locale contract.
    const products = await productsRepository.getAllProducts();

    // When: looking up all published records and unsupported identities.
    const found = await Promise.all(
      products.map(({ slug }) => productsRepository.getProductBySlug(slug)),
    );

    const absent = await Promise.all(
      ['missing', 'neural-system-ui'].map((slug) => productsRepository.getProductBySlug(slug)),
    );

    const kit = products.find(({ slug }) => slug === 'propostas-em-dia');

    // Then: identities are unique, locale copy is complete and unpublished products have no purchase claims.
    expect(products).toHaveLength(3);
    expect(new Set(products.map(({ slug }) => slug)).size).toBe(3);
    expect(found).toEqual(products);
    expect(absent).toEqual([null, null]);
    expect(kit).toMatchObject({
      status: 'available',
      commercial: { priceCents: 2990, checkoutUrl: 'https://pay.kiwify.com.br/zA4x9hJ' },
    });
    expect(products.find(({ slug }) => slug === 'hoje-cabe')?.status).toBe('planned');
    expect(products.find(({ slug }) => slug === 'followup-inbox')?.status).toBe('in-development');

    for (const product of products) {
      for (const locale of locales) {
        const content = product.content[locale];
        expect(content.shortDescription).toBeTruthy();
        expect(content.description.length).toBeGreaterThan(content.shortDescription.length);
        expect(content.highlights).toHaveLength(3);
        expect(content.details?.seo?.title).toContain(product.name);
        expect(content.details?.seo?.description).toBe(content.shortDescription);
      }

      if (product.status !== 'available') {
        expect(product.commercial).toMatchObject({ priceCents: null, checkoutUrl: null });
        expect(product.details?.accessUrl).toBeUndefined();
      }
    }
  });
  it('Should separate media roles and preserve real WebP assets and localized gallery descriptions', async () => {
    // Given: the approved product collection and its runtime image files.
    const products = await productsRepository.getAllProducts();
    const base = '/assets/devcosmo/products/propostas-em-dia/';

    // When: mapping the kit and inspecting headers of all referenced media.
    const kit = mapProduct(proposals);
    const headers = products.flatMap((product) =>
      [product.media.cover, product.media.featured, ...product.media.gallery]
        .filter((path): path is string => path !== null)
        .map((path) => {
          const bytes = readFileSync(`public${path}`);

          return [bytes.toString('ascii', 0, 4), bytes.toString('ascii', 8, 12)];
        }),
    );

    // Then: artwork roles, order and file integrity stay intact without legacy/themed fields.
    expect(kit.media).toEqual({
      cover: `${base}capa.webp`,
      featured: `${base}destaque.webp`,
      gallery: ['01.webp', '02.webp', '03.webp'].map((name) => base + name),
    });
    expect(kit).not.toHaveProperty('images');
    expect(kit).not.toHaveProperty('gallery');
    expect(headers.length).toBeGreaterThan(0);

    for (const header of headers) {
      expect(header).toEqual(['RIFF', 'WEBP']);
    }

    for (const product of products) {
      for (const locale of locales) {
        expect(product.content[locale].details?.galleryAlts).toHaveLength(
          product.media.gallery.length,
        );
      }

      if (product.slug !== kit.slug) {
        expect(product.media).toEqual({ cover: null, featured: null, gallery: [] });
      }
    }
  });
  it('Should accept absent or empty optional sections without fabricating content', () => {
    // Given: valid DTO variants with optional media, content details or lists omitted.
    const minimalDto = {
      ...proposals,
      media: { cover: null, featured: null, gallery: [] },
      details: undefined,
      content: Object.fromEntries(
        Object.entries(proposals.content).map(([locale, content]) => [
          locale,
          { ...content, details: undefined },
        ]),
      ),
    };

    const emptyDto = {
      ...proposals,
      media: { ...proposals.media, gallery: [] },
      content: Object.fromEntries(
        Object.entries(proposals.content).map(([locale, content]) => [
          locale,
          { ...content, materials: [], details: { galleryAlts: [], steps: [], faq: [] } },
        ]),
      ),
    };

    // When: mapping missing, empty and access-only detail contracts.
    const minimal = mapProduct(minimalDto);
    const empty = mapProduct(emptyDto);
    const access = mapProduct({
      ...proposals,
      details: { accessUrl: 'https://example.com/access' },
    });

    // Then: optional sections retain absence or emptiness and access is preserved only when supplied.
    expect(minimal.media).toEqual({ cover: null, featured: null, gallery: [] });
    expect(minimal.details).toBeUndefined();
    expect(minimal.content.en.details).toBeUndefined();
    expect(empty.content.en.materials).toEqual([]);
    expect(empty.content.en.details).toMatchObject({ steps: [], faq: [] });
    expect(access.details?.accessUrl).toBe('https://example.com/access');
  });
  it('Should retain localized scope, steps and five FAQs for every product', async () => {
    // Given: the real repository and all three supported locales.
    const products = await productsRepository.getAllProducts();

    // When: mapping the kit and collecting each product locale contract.
    const kit = mapProduct(proposals);
    const localized = products.flatMap((product) =>
      locales.map((locale) => ({ content: product.content[locale], status: product.status })),
    );

    // Then: approved content remains complete, localized and explicit about the digital kit scope.
    for (const { content, status } of localized) {
      expect(content.materials.length).toBeGreaterThan(0);
      expect(content.details?.includedIntroduction).toBeTruthy();
      expect(content.details?.steps).toHaveLength(status === 'available' ? 5 : 3);
      expect(content.details?.faq).toHaveLength(5);

      for (const step of content.details?.steps ?? []) {
        expect(step.title && step.description).toBeTruthy();
      }

      for (const item of content.details?.faq ?? []) {
        expect(item.question && item.answer).toBeTruthy();
      }
    }

    for (const product of products) {
      expect(product.content.en.details?.faq?.[0]?.question).not.toBe(
        product.content['pt-BR'].details?.faq?.[0]?.question,
      );
      expect(product.content.es.details?.steps?.[0]?.title).not.toBe(
        product.content.en.details?.steps?.[0]?.title,
      );
    }

    expect(kit.content['pt-BR'].materials).toHaveLength(5);
    expect(kit.content['pt-BR'].details?.faq?.[3]?.answer).toMatch(/Não\./);
    expect(kit.content['pt-BR'].featuredDescription).toBe(
      'Um kit digital para organizar suas propostas, acompanhar negociações e facilitar sua rotina comercial.',
    );
  });
  it('Should retain only confirmed specifications without duplicating category', async () => {
    // Given: the kit specifications and a valid platform/license-specific variant.
    const libraryDto = {
      ...proposals,
      details: {
        specifications: {
          platform: 'web',
          license: 'polyform-noncommercial',
          compatibility: ['webgl'],
        },
      },
    };

    // When: mapping both variants and retrieving products with no verified specifications.
    const kit = mapProduct(proposals);
    const library = mapProduct(libraryDto);
    const others = await Promise.all(
      ['hoje-cabe', 'followup-inbox'].map((slug) => productsRepository.getProductBySlug(slug)),
    );

    // Then: no speculative category, compatibility or specification is introduced.
    expect(kit.details?.specifications).toEqual({
      format: 'digital-files',
      delivery: 'download',
      languages: ['pt-BR'],
      compatibility: ['excel'],
      platform: undefined,
      license: undefined,
    });
    expect(kit.details?.specifications).not.toHaveProperty('category');
    expect(library.details?.specifications).toMatchObject({
      platform: 'web',
      license: 'polyform-noncommercial',
      compatibility: ['webgl'],
    });
    expect(others.map((product) => product?.details?.specifications)).toEqual([
      undefined,
      undefined,
    ]);
  });
  it.each([
    '',
    'not-a-url',
    '/video',
    'http://youtu.be/Hwl--3B_W5g',
    'javascript:alert(1)',
    'data:text/html,video',
    null,
    42,
    {},
  ])('Should reject unsafe demonstration destinations %#', (value) => {
    // Given: an empty, malformed, non-HTTPS or non-string demonstration destination.
    const input = value;

    // When: attempting to map this untrusted boundary value.
    const map = () =>
      mapProduct({ ...proposals, details: { ...proposals.details, demonstrationUrl: input } });

    // Then: the invalid URL never enters the typed domain.
    expect(map).toThrow();
  });
  it.each([
    '/private/file.webp',
    'https://example.com/cover.webp',
    '/assets/devcosmo/products/propostas-em-dia/../cover.webp',
    '/assets/devcosmo/products/propostas-em-dia/%2e%2e/cover.webp',
    '/assets/devcosmo/products/propostas-em-dia/dark/capa.webp',
    '/assets/devcosmo/products/propostas-em-dia/capa.webp?theme=light',
    '/assets/devcosmo/home/dark/hero.webp',
    '',
    42,
  ])('Should reject unsafe media reference %# in every media role', (value) => {
    // Given: an invalid asset reference for each of cover, featured and gallery.
    const invalid = value;

    // When: preparing independent boundary operations for each role.
    const operations = ['cover', 'featured', 'gallery'].map(
      (field) => () =>
        mapProduct({
          ...proposals,
          media: { ...proposals.media, [field]: field === 'gallery' ? [invalid] : invalid },
        }),
    );

    // Then: no media role accepts external, themed, traversal or malformed references.
    for (const operation of operations) {
      expect(operation).toThrow();
    }
  });
  it.each([
    { media: null },
    { media: {} },
    { media: { ...proposals.media, dark: proposals.media.cover } },
    { media: { ...proposals.media, light: proposals.media.cover } },
    { images: null },
    { gallery: [] },
    {
      media: {
        ...proposals.media,
        gallery: [
          proposals.media.gallery[0],
          proposals.media.gallery[0],
          proposals.media.gallery[2],
        ],
      },
    },
  ])('Should reject legacy, duplicate or malformed media contracts %#', (value) => {
    // Given: an invalid media object or legacy top-level media field.
    const input = value;

    // When: attempting to map this untrusted boundary value.
    const map = () => mapProduct({ ...proposals, ...input });

    // Then: obsolete and ambiguous media formats are rejected.
    expect(map).toThrow();
  });
  it.each([
    { category: 'invented' },
    { type: 'saas' },
    { status: 'published' },
    { slug: '../bad' },
    { editorialOrder: 1.5 },
    { sourceUrl: 'javascript:alert(1)' },
    { content: { en: {} } },
    { commercial: { ...proposals.commercial, priceCents: -1 } },
    { commercial: { ...proposals.commercial, priceCents: 29.9 } },
    { commercial: { ...proposals.commercial, priceCents: '2990' } },
    { commercial: { ...proposals.commercial, currency: 'USD' } },
    { commercial: { ...proposals.commercial, verifiedAt: null } },
    { commercial: { ...proposals.commercial, checkoutUrl: 'http://unsafe.example' } },
    { status: 'planned' },
    {
      status: 'planned',
      commercial: { priceCents: null, currency: 'BRL', checkoutUrl: null, verifiedAt: null },
      details: { accessUrl: 'https://example.com/access' },
    },
  ])('Should reject unverified taxonomy, pricing or commercial claims %#', (value) => {
    // Given: a DTO patch with an invalid identity, taxonomy, locale, price or publication claim.
    const input = value;

    // When: attempting to map this untrusted boundary value.
    const map = () => mapProduct({ ...proposals, ...input });

    // Then: invalid product and unavailable purchase/access claims cannot enter the domain.
    expect(map).toThrow();
  });
  it.each([null, []])('Should reject non-object product input %#', (value) => {
    // Given: untrusted null or array input instead of a product object.
    const input = value;

    // When: attempting to map this untrusted boundary value.
    const map = () => mapProduct(input);

    // Then: non-object input is rejected at the system boundary.
    expect(map).toThrow();
  });
  it.each([
    { accessUrl: 'javascript:alert(1)' },
    { specifications: { format: 'saas' } },
    { specifications: { languages: ['de'] } },
    { specifications: { compatibility: ['unverified'] } },
    { specifications: { license: 'unrestricted' } },
    { specifications: { platform: 5 } },
    { specifications: { delivery: 'instant' } },
  ])('Should reject invalid specification or access values %#', (value) => {
    // Given: an unverified specification or unsafe access destination.
    const input = value;

    // When: attempting to map this untrusted boundary value.
    const map = () => mapProduct({ ...proposals, details: input });

    // Then: only confirmed specification enums and safe access URLs are accepted.
    expect(map).toThrow();
  });
  it.each([
    { galleryAlts: [] },
    { galleryAlts: ['', 'b', 'c'] },
    { seo: { title: '', description: 'Text' } },
    { steps: [{ title: '' }] },
    { faq: [{ question: 'Question?', answer: '' }] },
    { faq: Array.from({ length: 6 }, () => ({ question: 'Question?', answer: 'Answer' })) },
  ])('Should reject malformed localized descriptions, steps or FAQ %#', (value) => {
    // Given: localized detail input violating gallery, SEO, step or FAQ contracts.
    const input = value;

    // When: attempting to map this untrusted boundary value.
    const map = () =>
      mapProduct({
        ...proposals,
        content: {
          ...proposals.content,
          en: { ...proposals.content.en, details: { ...proposals.content.en.details, ...input } },
        },
      });

    // Then: incomplete and excessive localized content is rejected.
    expect(map).toThrow();
  });
  it.each([
    { ...proposals, id: '' },
    { ...proposals, editorialOrder: '1' },
    { ...proposals, commercial: { ...proposals.commercial, verifiedAt: '19/10/2026' } },
    {
      ...proposals,
      content: { ...proposals.content, en: { ...proposals.content.en, highlights: {} } },
    },
    {
      ...proposals,
      content: { ...proposals.content, en: { ...proposals.content.en, details: undefined } },
    },
  ])('Should reject missing identities, malformed lists and verification dates %#', (value) => {
    // Given: an externally supplied DTO with invalid required content or commercial data.
    const input = value;

    // When: attempting to map this untrusted boundary value.
    const map = () => mapProduct(input);

    // Then: no invalid DTO reaches the typed domain.
    expect(map).toThrow();
  });
  it('Should reject empty meaningful image descriptions', () => {
    // Given: an otherwise valid DTO with no English image description.
    const dto = {
      ...proposals,
      content: { ...proposals.content, en: { ...proposals.content.en, imageAlt: '' } },
    };

    // When: preparing the boundary mapping operation.
    const map = () => mapProduct(dto);

    // Then: meaningful media cannot lose its accessible description.
    expect(map).toThrow();
  });
  it('Should preserve absent optional detail fields and step descriptions', () => {
    // Given: valid gallery descriptions and a step whose optional explanation is omitted.
    const content = Object.fromEntries(
      Object.entries(proposals.content).map(([locale, translation]) => [
        locale,
        {
          ...translation,
          details: {
            galleryAlts: translation.details.galleryAlts,
            steps: [{ title: 'First step' }],
          },
        },
      ]),
    );

    // When: mapping this minimal detail contract with empty confirmed specifications.
    const product = mapProduct({ ...proposals, content, details: { specifications: {} } });

    // Then: optional FAQ, SEO, explanations and specification values remain absent.
    expect(product.content.en.details?.faq).toBeUndefined();
    expect(product.content.en.details?.seo).toBeUndefined();
    expect(product.content.en.details?.steps?.[0]?.description).toBeUndefined();
    expect(product.details?.specifications?.format).toBeUndefined();
  });
  it('Should accept omitted optional step lists with meaningful gallery descriptions', () => {
    // Given: localized details supplying gallery descriptions but no step list.
    const content = Object.fromEntries(
      Object.entries(proposals.content).map(([locale, translation]) => [
        locale,
        { ...translation, details: { galleryAlts: translation.details.galleryAlts } },
      ]),
    );

    // When: mapping the optional detail boundary.
    const product = mapProduct({ ...proposals, content });

    // Then: no step list is fabricated for the locale.
    expect(product.content.en.details?.steps).toBeUndefined();
  });
});
