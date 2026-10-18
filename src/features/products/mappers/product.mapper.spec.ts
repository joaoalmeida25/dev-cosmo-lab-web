import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import proposals from '../data/propostas-em-dia.json';
import { productsRepository } from '../repositories/products.repository';
import { mapProduct } from './product.mapper';

const locales = ['pt-BR', 'en', 'es'] as const;

test('demonstration preserves its HTTPS destination, specifications, access and commercial data', () => {
  const product = mapProduct({
    ...proposals,
    details: { ...proposals.details, accessUrl: 'https://example.com/access' },
  });

  assert.equal(product.details?.demonstrationUrl, 'https://youtu.be/Hwl--3B_W5g');
  assert.equal(product.details?.accessUrl, 'https://example.com/access');
  assert.deepEqual(product.details?.specifications, mapProduct(proposals).details?.specifications);
  assert.deepEqual(product.commercial, proposals.commercial);
});

test('products without a demonstration keep the field optional', async () => {
  const product = mapProduct({
    ...proposals,
    details: { ...proposals.details, demonstrationUrl: undefined },
  });

  assert.equal(product.details?.demonstrationUrl, undefined);
  assert.equal(mapProduct({ ...proposals, details: undefined }).details, undefined);
  for (const slug of ['hoje-cabe', 'followup-inbox'])
    assert.equal(
      (await productsRepository.getProductBySlug(slug))?.details?.demonstrationUrl,
      undefined,
    );
});

test('demonstration rejects malformed, non-HTTPS and non-string URLs at the product boundary', () => {
  for (const demonstrationUrl of [
    '',
    'not-a-url',
    '/video',
    'http://youtu.be/Hwl--3B_W5g',
    'javascript:alert(1)',
    'data:text/html,video',
    null,
    42,
    {},
  ])
    assert.throws(() =>
      mapProduct({ ...proposals, details: { ...proposals.details, demonstrationUrl } }),
    );
});

test('repository serves three unique products by slug, with localized content and unchanged commercial status', async () => {
  const products = await productsRepository.getAllProducts();
  assert.equal(products.length, 3);
  assert.equal(new Set(products.map(({ slug }) => slug)).size, 3);
  for (const product of products) {
    assert.deepEqual(await productsRepository.getProductBySlug(product.slug), product);
    for (const locale of locales) {
      const content = product.content[locale];
      assert.ok(content.shortDescription);
      assert.ok(content.description.length > content.shortDescription.length);
      assert.equal(content.highlights.length, 3);
      assert.ok(content.details?.seo?.title.includes(product.name));
      assert.equal(content.details?.seo?.description, content.shortDescription);
    }

    if (product.status !== 'available') {
      assert.equal(product.commercial.priceCents, null);
      assert.equal(product.commercial.checkoutUrl, null);
      assert.equal(product.details?.accessUrl, undefined);
    }
  }
  assert.equal(await productsRepository.getProductBySlug('missing'), null);
  const kit = await productsRepository.getProductBySlug('propostas-em-dia');
  assert.equal(kit?.commercial.priceCents, 2990);
  assert.equal(kit?.commercial.checkoutUrl, 'https://pay.kiwify.com.br/zA4x9hJ');
  assert.equal((await productsRepository.getProductBySlug('hoje-cabe'))?.status, 'planned');
  assert.equal(
    (await productsRepository.getProductBySlug('followup-inbox'))?.status,
    'in-development',
  );
  assert.equal(kit?.status, 'available');
  assert.equal(await productsRepository.getProductBySlug('neural-system-ui'), null);
});

test('media separates cover, featured and ordered gallery without theme-specific or legacy fields', async () => {
  const kit = mapProduct(proposals);
  const base = '/assets/devcosmo/products/propostas-em-dia/';
  assert.equal(kit.media.cover, `${base}capa.webp`);
  assert.equal(kit.media.featured, `${base}destaque.webp`);
  assert.deepEqual(
    kit.media.gallery,
    ['01.webp', '02.webp', '03.webp'].map((name) => base + name),
  );
  assert.equal('images' in kit, false);
  assert.equal('gallery' in kit, false);
  assert.equal('dark' in kit.media, false);
  assert.equal('light' in kit.media, false);
  for (const product of await productsRepository.getAllProducts()) {
    const paths = [product.media.cover, product.media.featured, ...product.media.gallery];
    for (const path of paths) {
      if (!path) continue;

      const bytes = readFileSync(`public${path}`);
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    }
    for (const locale of locales)
      assert.equal(
        product.content[locale].details?.galleryAlts.length,
        product.media.gallery.length,
      );

    if (product.slug !== kit.slug)
      assert.deepEqual(product.media, { cover: null, featured: null, gallery: [] });
  }
});

test('mapper rejects malformed, old, themed, external and unsafe media references', () => {
  const invalidPaths = [
    '/private/file.webp',
    'https://example.com/cover.webp',
    '/assets/devcosmo/products/propostas-em-dia/../cover.webp',
    '/assets/devcosmo/products/propostas-em-dia/%2e%2e/cover.webp',
    '/assets/devcosmo/products/propostas-em-dia/dark/capa.webp',
    '/assets/devcosmo/products/propostas-em-dia/capa.webp?theme=light',
    '/assets/devcosmo/home/dark/hero.webp',
    '',
    42,
  ];
  for (const invalid of invalidPaths)
    for (const field of ['cover', 'featured', 'gallery'])
      assert.throws(() =>
        mapProduct({
          ...proposals,
          media: { ...proposals.media, [field]: field === 'gallery' ? [invalid] : invalid },
        }),
      );
  for (const patch of [
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
  ])
    assert.throws(() => mapProduct({ ...proposals, ...patch }));
});

test('mapper accepts optional media and detail sections without inventing empty content or commercial actions', () => {
  const minimal = mapProduct({
    ...proposals,
    media: { cover: null, featured: null, gallery: [] },
    details: undefined,
    content: Object.fromEntries(
      Object.entries(proposals.content).map(([locale, content]) => [
        locale,
        { ...content, details: undefined },
      ]),
    ),
  });
  assert.deepEqual(minimal.media, { cover: null, featured: null, gallery: [] });
  assert.equal(minimal.details, undefined);
  assert.equal(minimal.content.en.details, undefined);
  const empty = mapProduct({
    ...proposals,
    media: { ...proposals.media, gallery: [] },
    content: Object.fromEntries(
      Object.entries(proposals.content).map(([locale, content]) => [
        locale,
        { ...content, materials: [], details: { galleryAlts: [], steps: [], faq: [] } },
      ]),
    ),
  });
  assert.deepEqual(empty.content.en.materials, []);
  assert.deepEqual(empty.content.en.details?.steps, []);
  assert.deepEqual(empty.content.en.details?.faq, []);
  const access = mapProduct({ ...proposals, details: { accessUrl: 'https://example.com/access' } });
  assert.equal(access.details?.accessUrl, 'https://example.com/access');
});

test('all three products contain localized included scope, documented steps and at most five corresponding FAQs', async () => {
  for (const product of await productsRepository.getAllProducts()) {
    for (const locale of locales) {
      const content = product.content[locale];
      const details = content.details;
      assert.ok(content.materials.length > 0);
      assert.ok(details?.includedIntroduction);
      assert.equal(details.steps?.length, product.status === 'available' ? 5 : 3);
      assert.equal(details.faq?.length, 5);
      for (const step of details.steps ?? []) assert.ok(step.title && step.description);
      for (const item of details.faq ?? []) assert.ok(item.question && item.answer);
    }
    assert.notEqual(
      product.content.en.details?.faq?.[0]?.question,
      product.content['pt-BR'].details?.faq?.[0]?.question,
    );
    assert.notEqual(
      product.content.es.details?.steps?.[0]?.title,
      product.content.en.details?.steps?.[0]?.title,
    );
  }
  const kit = mapProduct(proposals);
  assert.equal(kit.content['pt-BR'].materials.length, 5);
  assert.match(kit.content['pt-BR'].details?.faq?.[3]?.answer ?? '', /Não\./);
  assert.equal(
    kit.content['pt-BR'].featuredDescription,
    'Um kit digital para organizar suas propostas, acompanhar negociações e facilitar sua rotina comercial.',
  );
});

test('specifications reuse category and include only confirmed product attributes', async () => {
  const kit = mapProduct(proposals);
  assert.deepEqual(kit.details?.specifications, {
    format: 'digital-files',
    delivery: 'download',
    languages: ['pt-BR'],
    compatibility: ['excel'],
    platform: undefined,
    license: undefined,
  });
  assert.equal(kit.details?.specifications && 'category' in kit.details.specifications, false);
  const library = mapProduct({
    ...proposals,
    details: {
      specifications: {
        platform: 'web',
        license: 'polyform-noncommercial',
        compatibility: ['webgl'],
      },
    },
  });
  assert.equal(library.details?.specifications?.platform, 'web');
  assert.equal(library.details?.specifications?.license, 'polyform-noncommercial');
  assert.deepEqual(library.details?.specifications?.compatibility, ['webgl']);
  for (const slug of ['hoje-cabe', 'followup-inbox'])
    assert.equal(
      (await productsRepository.getProductBySlug(slug))?.details?.specifications,
      undefined,
    );
});

test('mapper rejects invalid taxonomy, price, URL and unverified or unavailable purchase/access claims', () => {
  for (const patch of [
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
  ])
    assert.throws(() => mapProduct({ ...proposals, ...patch }));
  assert.throws(() => mapProduct(null));
  assert.throws(() => mapProduct([]));
});

test('detail boundaries reject malformed specifications, descriptions, steps and FAQ', () => {
  for (const details of [
    { accessUrl: 'javascript:alert(1)' },
    { specifications: { format: 'saas' } },
    { specifications: { languages: ['de'] } },
    { specifications: { compatibility: ['unverified'] } },
    { specifications: { license: 'unrestricted' } },
    { specifications: { platform: 5 } },
    { specifications: { delivery: 'instant' } },
  ])
    assert.throws(() => mapProduct({ ...proposals, details }));
  for (const patch of [
    { galleryAlts: [] },
    { galleryAlts: ['', 'b', 'c'] },
    { seo: { title: '', description: 'Text' } },
    { steps: [{ title: '' }] },
    { faq: [{ question: 'Question?', answer: '' }] },
    { faq: Array.from({ length: 6 }, () => ({ question: 'Question?', answer: 'Answer' })) },
  ])
    assert.throws(() =>
      mapProduct({
        ...proposals,
        content: {
          ...proposals.content,
          en: { ...proposals.content.en, details: { ...proposals.content.en.details, ...patch } },
        },
      }),
    );
  assert.throws(() =>
    mapProduct({
      ...proposals,
      content: { ...proposals.content, en: { ...proposals.content.en, imageAlt: '' } },
    }),
  );
});
