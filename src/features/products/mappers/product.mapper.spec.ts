import assert from 'node:assert/strict';
import { test } from 'node:test';
import proposals from '../data/propostas-em-dia.json';
import { productsRepository } from '../repositories/products.repository';
import { mapProduct } from './product.mapper';

test('repository serves four unique products and the same detail contract by slug', async () => {
  const products = await productsRepository.getAllProducts();
  assert.equal(products.length, 4);
  assert.equal(new Set(products.map(({ slug }) => slug)).size, 4);
  for (const product of products) {
    assert.deepEqual(await productsRepository.getProductBySlug(product.slug), product);
    for (const locale of ['pt-BR', 'en', 'es'] as const) {
      assert.ok(product.content[locale].shortDescription);
      assert.equal(product.content[locale].highlights.length, 3);
    }
  }
  assert.equal(await productsRepository.getProductBySlug('missing'), null);
  const kit = await productsRepository.getProductBySlug('propostas-em-dia');
  assert.equal(kit?.commercial.priceCents, 2990);
  assert.equal(kit?.commercial.checkoutUrl, 'https://pay.kiwify.com.br/zA4x9hJ');
  for (const product of products.filter(({ status }) => status !== 'available')) {
    assert.equal(product.commercial.priceCents, null);
    assert.equal(product.commercial.checkoutUrl, null);
  }
});
test('mapper rejects invalid external data and unverified commercial claims', () => {
  for (const patch of [
    { category: 'invented' },
    { type: 'saas' },
    { status: 'published' },
    { slug: '../bad' },
    { editorialOrder: 1.5 },
    { images: { dark: 'https://example.com/a', light: '/assets/devcosmo/a' } },
    { gallery: ['/private/file'] },
    { sourceUrl: 'javascript:alert(1)' },
    { content: { en: {} } },
    { commercial: { ...proposals.commercial, priceCents: -1 } },
    { commercial: { ...proposals.commercial, priceCents: 29.9 } },
    { commercial: { ...proposals.commercial, priceCents: '2990' } },
    { commercial: { ...proposals.commercial, currency: 'USD' } },
    { commercial: { ...proposals.commercial, verifiedAt: null } },
    { commercial: { ...proposals.commercial, checkoutUrl: 'http://unsafe.example' } },
    { status: 'planned' },
  ])
    assert.throws(() => mapProduct({ ...proposals, ...patch }), JSON.stringify(patch));
  assert.throws(() => mapProduct(null));
  assert.throws(() => mapProduct([]));
});
