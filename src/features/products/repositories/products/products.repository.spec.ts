// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import { productsRepository } from './products.repository';
import * as mapper from '../../mappers/product/product.mapper';

describe('ProductsRepository - Unit Test', () => {
  it('Should return the validated collection, resolve each slug and reject unknown identities', async () => {
    // Given: the repository's real static product source.
    const all = await productsRepository.getAllProducts();

    // When: looking up every known slug and an absent one.
    const found = await Promise.all(
      all.map(({ slug }) => productsRepository.getProductBySlug(slug)),
    );

    const absent = await productsRepository.getProductBySlug('not-found');

    // Then: the collection contains three unique products and no fictitious fallback.
    expect(all).toHaveLength(3);
    expect(found).toEqual(all);
    expect(absent).toBeNull();
  });

  it.each(['id', 'slug'] as const)(
    'Should fail closed when mapped products duplicate their %s',
    async (field) => {
      // Given: a boundary mapper returning duplicated identities.
      const original = mapper.mapProduct;
      vi.spyOn(mapper, 'mapProduct').mockImplementation((raw) => ({
        ...original(raw),
        [field]: 'duplicate',
      }));

      // When: the repository checks integrity before serving its collection.
      const read = productsRepository.getAllProducts();

      // Then: duplicate entries never reach catalog consumers.
      await expect(read).rejects.toThrow('Duplicate product identity');
    },
  );
});
