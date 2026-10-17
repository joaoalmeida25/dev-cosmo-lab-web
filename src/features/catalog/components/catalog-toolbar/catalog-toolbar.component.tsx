import { X } from 'lucide-react';
import { Select } from '@/components/ui/select/select.component';
import type { CatalogFilterKey, ISortOption } from '../../catalog.types';

interface ICatalogToolbarProps {
  countLabel: string;
  activeFiltersLabel: string;
  activeFilters: ReadonlyArray<{ key: CatalogFilterKey; label: string; removeLabel: string }>;
  sortLabel: string;
  sort: string;
  options: ReadonlyArray<ISortOption>;
  priceSortNote: string | null;
  onSort: (value: string) => void;
  onRemoveFilter: (key: CatalogFilterKey) => void;
}

export const CatalogToolbar = ({
  countLabel,
  activeFiltersLabel,
  activeFilters,
  sortLabel,
  sort,
  options,
  priceSortNote,
  onSort,
  onRemoveFilter,
}: ICatalogToolbarProps) => (
  <div>
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-x-4">
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-xs leading-relaxed font-medium text-text-primary lg:whitespace-nowrap"
      >
        {countLabel}
      </p>
      <div
        role="group"
        aria-label={activeFiltersLabel}
        className={`col-span-full row-start-2 min-w-0 overflow-x-auto lg:col-span-1 lg:col-start-2 lg:row-start-1 ${activeFilters.length ? '' : 'hidden lg:block'}`}
      >
        <div className="flex w-max max-w-none items-center gap-2 p-1">
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => onRemoveFilter(filter.key)}
              aria-label={filter.removeLabel}
              className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-control border border-accent/30 bg-primary-soft px-3 text-xs whitespace-nowrap text-text-primary hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-ring"
            >
              {filter.label}
              <X aria-hidden="true" strokeWidth={1.75} className="size-3.5" />
            </button>
          ))}
        </div>
      </div>
      <div className="col-start-2 row-start-1 flex min-w-0 items-center justify-end gap-2 lg:col-start-3">
        <label
          htmlFor="catalog-sort"
          className="sr-only shrink-0 text-xs text-text-secondary sm:not-sr-only"
        >
          {sortLabel}
        </label>
        <Select
          id="catalog-sort"
          label={sortLabel}
          value={sort}
          options={options}
          onValueChange={onSort}
          describedBy={priceSortNote ? 'price-sort-note' : undefined}
        />
      </div>
    </div>
    {priceSortNote ? (
      <p id="price-sort-note" className="mt-2 text-xs text-text-secondary">
        {priceSortNote}
      </p>
    ) : null}
  </div>
);
