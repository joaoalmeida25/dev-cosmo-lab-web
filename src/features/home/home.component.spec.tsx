import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderLocalized } from '../../../test/render-localized';
import { serverIntl } from '../../../test/server-intl';
import { Home } from './home.component';
import Image from 'next/image';
import type { IHomeFeaturedProduct } from './home.types';
import { productsRepository } from '@/features/products/repositories/products/products.repository';
vi.mock('next-intl/server', () => import('../../../test/server-intl'));
vi.mock('@/i18n/navigation', () => import('../../../test/navigation-mock'));
vi.mock('./components/hero/hero.component', () => ({ Hero: () => <section aria-label="hero" /> }));
vi.mock('./components/featured-product/featured-product.component', () => ({
  FeaturedProduct: ({ product }: { product: IHomeFeaturedProduct }) => (
    <section aria-label="featured">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      {product.featured && (
        <Image src={product.featured} alt={product.imageAlt} width={640} height={480} unoptimized />
      )}
    </section>
  ),
}));
vi.mock('./components/solutions-section/solutions-section.component', () => ({
  SolutionsSection: () => <section aria-label="services" />,
}));
vi.mock('./components/brand-laboratory/brand-laboratory.component', () => ({
  BrandLaboratory: () => <section aria-label="laboratory" />,
}));
vi.mock('./components/final-cta/final-cta.component', () => ({
  FinalCTA: () => <section aria-label="final" />,
}));
describe('Home - Unit Test', () => {
  it.each(['pt-BR', 'en', 'es', 'invalid'])(
    'Should pass the localized featured product into the composed Home View for %s',
    async (locale) => {
      // Given: the real featured product and the server request locale.
      serverIntl.locale = locale;
      const product = await productsRepository.getProductBySlug('propostas-em-dia');

      if (!product) {
        throw new Error('Missing test fixture');
      }

      const resolvedLocale = locale === 'en' || locale === 'es' ? locale : 'pt-BR';
      const content = product.content[resolvedLocale];

      // When: the Controller maps the featured content into the real Home composition.
      renderLocalized(await Home());

      // Then: all five section boundaries are composed and the featured copy/artwork match the locale.
      expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument();
      expect(
        screen.getByText(content.featuredDescription ?? content.shortDescription),
      ).toBeInTheDocument();
      expect(screen.getByRole('img', { name: content.imageAlt })).toHaveAttribute(
        'src',
        product.media.featured,
      );
      expect(screen.getAllByRole('region')).toHaveLength(5);
    },
  );
  it('Should fall back to the short description when featured copy is absent', async () => {
    // Given: a real product whose optional featured description is omitted.
    serverIntl.locale = 'en';
    const product = await productsRepository.getProductBySlug('propostas-em-dia');

    if (!product) {
      throw new Error('Missing test fixture');
    }

    const content = { ...product.content.en };
    delete content.featuredDescription;
    vi.spyOn(productsRepository, 'getProductBySlug').mockResolvedValueOnce({
      ...product,
      content: { ...product.content, en: content },
    });

    // When: the Controller composes the featured section.
    renderLocalized(await Home());

    // Then: the short description provides the product explanation.
    expect(screen.getByText(content.shortDescription)).toBeInTheDocument();
  });
  it('Should report a missing featured product instead of fabricating Home content', async () => {
    // Given: the configured featured product is absent from the repository.
    serverIntl.locale = 'pt-BR';
    vi.spyOn(productsRepository, 'getProductBySlug').mockResolvedValueOnce(null);

    // When: the Home Controller resolves its dependencies.
    const result = Home();

    // Then: the explicit configuration error reaches the route boundary.
    await expect(result).rejects.toThrow('Featured product is missing');
  });
});
