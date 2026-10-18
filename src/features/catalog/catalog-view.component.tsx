import type { RefObject } from 'react';
import { Container } from '@/components/shared/container/container.component';
import type { IProductCardPresentation } from '../products/components/product-card/product-card.types';
import type {
  CatalogFilterKey,
  ICatalogFilters,
  ICatalogLabels,
  IFilterGroup,
  ISortOption,
} from './catalog.types';
import { CatalogSearch } from './components/catalog-search/catalog-search.component';
import { CatalogToolbar } from './components/catalog-toolbar/catalog-toolbar.component';
import { CatalogFilters } from './components/catalog-filters/catalog-filters.component';
import { CatalogEmptyState } from './components/catalog-empty-state/catalog-empty-state.component';
import { CatalogLoading } from './components/catalog-loading/catalog-loading.component';
import { ProductGrid } from './components/product-grid/product-grid.component';

interface ICatalogViewProps {
  products: ReadonlyArray<IProductCardPresentation>;
  filters: ICatalogFilters;
  groups: ReadonlyArray<IFilterGroup>;
  activeFilters: ReadonlyArray<{ key: CatalogFilterKey; label: string; removeLabel: string }>;
  labels: ICatalogLabels;
  updating: boolean;
  resultsRef: RefObject<HTMLDivElement | null>;
  resultsMinHeight: number | undefined;
  filtersOpen: boolean;
  searchInputRef: RefObject<HTMLInputElement | null>;
  hasCriteria: boolean;
  sortOptions: ReadonlyArray<ISortOption>;
  priceSortNote: string | null;
  onQuery: (value: string) => void;
  onClearSearch: () => void;
  onSelect: (key: CatalogFilterKey, value: string) => void;
  onRemoveFilter: (key: CatalogFilterKey) => void;
  onClear: () => void;
  onSort: (value: string) => void;
  onToggleFilters: () => void;
}

export const CatalogView = ({
  products,
  filters,
  groups,
  activeFilters,
  labels,
  updating,
  resultsRef,
  resultsMinHeight,
  filtersOpen,
  searchInputRef,
  hasCriteria,
  sortOptions,
  priceSortNote,
  onQuery,
  onClearSearch,
  onSelect,
  onRemoveFilter,
  onClear,
  onSort,
  onToggleFilters,
}: ICatalogViewProps) => (
  <section aria-label={labels.search} className="bg-background pt-6 pb-6 md:pt-8 md:pb-8">
    <Container>
      <div className="grid gap-3">
        <CatalogSearch
          value={filters.q}
          label={labels.search}
          placeholder={labels.searchPlaceholder}
          clearLabel={labels.clearSearch}
          onChange={onQuery}
          onClear={onClearSearch}
          inputRef={searchInputRef}
        />
        <CatalogToolbar
          countLabel={labels.results}
          activeFiltersLabel={labels.activeFilters}
          activeFilters={activeFilters}
          onRemoveFilter={onRemoveFilter}
          sortLabel={labels.sort}
          sort={filters.sort}
          options={sortOptions}
          priceSortNote={priceSortNote}
          onSort={onSort}
        />
      </div>
      <div className="mt-5 grid items-start gap-6 md:mt-6 lg:items-stretch lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
        <CatalogFilters
          title={labels.filters}
          clearAllLabel={labels.clearAll}
          groups={groups}
          hasCriteria={hasCriteria}
          onSelect={onSelect}
          onClear={onClear}
          isOpen={filtersOpen}
          onToggle={onToggleFilters}
        />
        <div className="relative min-w-0">
          <div
            id="catalog-results"
            className="h-full"
            ref={resultsRef}
            aria-busy={updating}
            style={{ minHeight: resultsMinHeight }}
          >
            {products.length ? (
              <ProductGrid products={products} />
            ) : (
              <CatalogEmptyState
                title={labels.emptyTitle}
                description={labels.emptyDescription}
                action={labels.clearAll}
                onClear={onClear}
              />
            )}
          </div>
          {updating ? (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center rounded-card bg-background/45 pt-5 backdrop-blur-[1px]">
              <CatalogLoading label={labels.updating} />
            </div>
          ) : null}
        </div>
      </div>
    </Container>
  </section>
);
