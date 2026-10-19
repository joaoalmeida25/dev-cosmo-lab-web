import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderLocalized } from '../../../test/render-localized';
import { navigation } from '../../../test/navigation-mock';
import proposals from '@/features/products/data/propostas-em-dia.json';
import today from '@/features/products/data/hoje-cabe.json';
import followup from '@/features/products/data/followup-inbox.json';
import { mapProduct } from '@/features/products/mappers/product/product.mapper';
import pt from '@/messages/pt-BR/catalog.json';
import type { ICatalogProduct } from './catalog.types';
import { DEFAULT_CATALOG_FILTERS } from './utils/catalog-query/catalog-query.util';
import { CatalogBrowser } from './catalog-browser.component';

vi.mock('@/i18n/navigation', () => import('../../../test/navigation-mock'));

const products: ReadonlyArray<ICatalogProduct> = [proposals, today, followup]
  .map(mapProduct)
  .map((product) => ({
    ...product,
    content: product.content['pt-BR'],
    cover: product.media.cover,
    priceCents: product.commercial.priceCents,
    currency: product.commercial.currency,
  }));

describe('CatalogBrowser - Unit Test', () => {
  it('Should list real products, preserve hashes in search navigation and expose a busy state', async () => {
    // Given: the catalog and a current URL fragment.
    window.history.replaceState(null, '', '/products#catalog');
    navigation.pathname = '/products';
    const user = userEvent.setup();
    const { container } = renderLocalized(
      <CatalogBrowser products={products} locale="pt-BR" filters={DEFAULT_CATALOG_FILTERS} />,
    );

    const kitHref = screen.getByRole('link', { name: 'Propostas em Dia' }).getAttribute('href');
    const planned = screen.getByRole('article', { name: 'Hoje Cabe' }).textContent;

    // When: entering a search criterion.
    await user.type(screen.getByRole('searchbox', { name: pt.interface.search }), 'k');

    // Then: real products retain their contracts and navigation preserves the fragment with loading feedback.
    expect(kitHref).toBe('/products/propostas-em-dia');
    expect(planned).toContain('Hoje Cabe');
    expect(navigation.replace).toHaveBeenLastCalledWith('/products?q=k#catalog', { scroll: false });
    expect(container.querySelector('#catalog-results')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText(pt.interface.updating)).toBeInTheDocument();
  });

  it('Should render URL-derived filters, remove a chip, clear search and reset all filters', async () => {
    // Given: a catalog receiving an already committed query state.
    navigation.pathname = '/products';
    window.history.replaceState(null, '', '/products');
    const user = userEvent.setup();
    renderLocalized(
      <CatalogBrowser
        products={products}
        locale="pt-BR"
        filters={{ ...DEFAULT_CATALOG_FILTERS, q: 'propostas', category: 'productivity' }}
      />,
    );

    // When: clearing a query, removing its category chip, and resetting all criteria.
    await user.click(screen.getByRole('button', { name: pt.interface.clearSearch }));
    const search = screen.getByRole('searchbox');
    const clearedFocus = document.activeElement;
    const clearDestination = navigation.push.mock.lastCall;
    await user.click(screen.getByRole('button', { name: /Remover.*Gestão/i }));
    const removedDestination = navigation.push.mock.lastCall;
    await user.click(screen.getByRole('button', { name: pt.interface.clearAll }));

    // Then: each independent removal preserves other criteria and reset restores the canonical URL.
    expect(clearedFocus).toBe(search);
    expect(clearDestination).toEqual(['/products?category=productivity', { scroll: false }]);
    expect(removedDestination).toEqual(['/products?q=propostas', { scroll: false }]);
    expect(navigation.push).toHaveBeenLastCalledWith('/products', { scroll: false });
  });

  it('Should open mobile filters, navigate selected facets and change sort through the shared Select', async () => {
    // Given: a ready catalog with no criteria.
    navigation.pathname = '/products';
    const user = userEvent.setup();
    renderLocalized(
      <CatalogBrowser products={products} locale="pt-BR" filters={DEFAULT_CATALOG_FILTERS} />,
    );

    // When: selecting a filter and requesting a different sort.
    await user.click(screen.getByRole('button', { name: pt.interface.filters }));
    const filters = screen.getByRole('complementary', { name: pt.interface.filters });
    await user.click(within(filters).getByRole('radio', { name: /Disponível/ }));
    const facetDestination = navigation.push.mock.lastCall;
    screen.getByRole('combobox', { name: pt.interface.sort }).focus();
    await user.keyboard('{ArrowDown}{End}{Enter}');

    // Then: facet and sort navigation serialize their typed values independently.
    expect(facetDestination).toEqual(['/products?status=available', { scroll: false }]);
    expect(navigation.push).toHaveBeenLastCalledWith('/products?sort=price-desc', {
      scroll: false,
    });
  });

  it('Should render no-results guidance and disable price sorting when no price exists', async () => {
    // Given: a collection without confirmed prices and a stale price-sort URL.
    const withoutPrices = products.map((product) => ({ ...product, priceCents: null }));
    const user = userEvent.setup();
    renderLocalized(
      <CatalogBrowser
        products={withoutPrices}
        locale="pt-BR"
        filters={{ ...DEFAULT_CATALOG_FILTERS, q: 'missing', sort: 'price-asc' }}
      />,
    );

    // When: reviewing the fallback sorting and clearing no-result criteria.
    const emptyTitle = screen.getByRole('heading', { name: pt.interface.emptyTitle }).textContent;
    const guidance = screen.getByText(pt.interface.priceSortUnavailable).textContent;
    const fallbackSort = screen.getByRole('combobox').textContent;
    const resets = screen.getAllByRole('button', { name: pt.interface.clearAll });
    await user.click(resets[resets.length - 1]);

    // Then: unavailable price sorting falls back with guidance and empty results retain a working reset.
    expect(emptyTitle).toBe(pt.interface.emptyTitle);
    expect(guidance).toBe(pt.interface.priceSortUnavailable);
    expect(fallbackSort).toContain(pt.sorts.editorial);
    expect(navigation.push).toHaveBeenLastCalledWith('/products', { scroll: false });
  });

  it('Should restore the navigation fragment after the router settles', async () => {
    // Given: a navigation preserving a fragment that a router may temporarily drop.
    navigation.pathname = '/products';
    window.history.replaceState(null, '', '/products#results');
    const { rerender } = renderLocalized(
      <CatalogBrowser products={products} locale="pt-BR" filters={DEFAULT_CATALOG_FILTERS} />,
    );

    // When: a query event triggers navigation and the committed URL drops its fragment.
    navigation.replace.mockImplementationOnce(() =>
      window.history.replaceState(null, '', '/products?q=kit'),
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'kit' } });
    rerender(
      <CatalogBrowser
        products={products}
        locale="pt-BR"
        filters={{ ...DEFAULT_CATALOG_FILTERS, q: 'kit' }}
      />,
    );

    // Then: the fragment is restored without another route push.
    await waitFor(() => expect(window.location.hash).toBe('#results'));
  });
});
