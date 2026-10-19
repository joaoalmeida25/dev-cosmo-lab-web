'use client';

import { useEffect, useOptimistic, useRef, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  PRODUCT_TYPES,
} from '../products/products.constants';
import {
  CATALOG_SORTS,
  DEFAULT_CATALOG_FILTERS,
  PRICE_RANGES,
  parseCatalogQuery,
  serializeCatalogQuery,
} from './utils/catalog-query/catalog-query.util';
import {
  countCatalogFacet,
  filterCatalogProducts,
  sortCatalogProducts,
} from './utils/catalog-engine/catalog-engine.util';
import type {
  CatalogFilterKey,
  ICatalogBrowserProps,
  ICatalogFilters,
  IFilterGroup,
} from './catalog.types';
import { useCatalogFeedback } from './hooks/use-catalog-feedback/use-catalog-feedback.hook';
import { mapCatalogCard } from './mappers/catalog-card/catalog-card.mapper';
import { CatalogView } from './catalog-view.component';

export const CatalogBrowser = ({ products, locale, filters: parsed }: ICatalogBrowserProps) => {
  const t = useTranslations('catalog');
  const router = useRouter();
  const pathname = usePathname();
  const hasPrices = products.some((product) => product.priceCents !== null);
  const filters =
    !hasPrices && parsed.sort.startsWith('price-')
      ? { ...parsed, sort: DEFAULT_CATALOG_FILTERS.sort }
      : parsed;

  const [optimistic, setOptimistic] = useOptimistic(filters);
  const [pending, startTransition] = useTransition();
  const { updating, startFeedback } = useCatalogFeedback(pending);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [resultsHeight, setResultsHeight] = useState<number | undefined>(undefined);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigationHashRef = useRef<string | null>(null);

  useEffect(() => {
    if (pending || navigationHashRef.current === null) {
      return;
    }

    const hash = navigationHashRef.current;
    navigationHashRef.current = null;

    if (window.location.hash === hash) {
      return;
    }

    const url = new URL(window.location.href);
    url.hash = hash;
    window.history.replaceState(window.history.state, '', url.href);
  }, [pending, parsed]);

  const categories = Object.fromEntries(
    PRODUCT_CATEGORIES.map((id) => [id, t(`categories.${id}`)]),
  );

  const types = Object.fromEntries(PRODUCT_TYPES.map((id) => [id, t(`productTypes.${id}`)]));
  const taxonomy = { categories, types };
  const visible = sortCatalogProducts(
    filterCatalogProducts(products, optimistic, taxonomy),
    optimistic,
    locale,
  );

  const groups: ReadonlyArray<IFilterGroup> = [
    {
      key: 'category',
      label: t('groups.category'),
      selected: optimistic.category,
      options: [
        'all',
        ...PRODUCT_CATEGORIES.filter((value) =>
          products.some((product) => product.category === value),
        ),
      ].map((value) => ({
        value,
        label: t(`categories.${value}`),
        count: countCatalogFacet(products, optimistic, 'category', value, taxonomy),
      })),
    },
    {
      key: 'status',
      label: t('groups.status'),
      selected: optimistic.status,
      options: ['all', ...PRODUCT_STATUSES].map((value) => ({
        value,
        label: t(`statuses.${value}`),
        count: countCatalogFacet(products, optimistic, 'status', value, taxonomy),
      })),
    },
    {
      key: 'type',
      label: t('groups.type'),
      selected: optimistic.type,
      options: [
        'all',
        ...PRODUCT_TYPES.filter((value) => products.some((product) => product.type === value)),
      ].map((value) => ({
        value,
        label: t(`productTypes.${value}`),
        count: countCatalogFacet(products, optimistic, 'type', value, taxonomy),
      })),
    },
    {
      key: 'price',
      label: t('groups.price'),
      selected: optimistic.price,
      options: PRICE_RANGES.map((value) => ({
        value,
        label: t(`prices.${value}`),
        count: countCatalogFacet(products, optimistic, 'price', value, taxonomy),
      })),
    },
  ];

  const navigate = (next: ICatalogFilters, replace = false) => {
    setResultsHeight(resultsRef.current?.getBoundingClientRect().height);
    startFeedback();
    const query = serializeCatalogQuery(next);
    navigationHashRef.current = window.location.hash;
    startTransition(() => {
      setOptimistic(next);
      router[replace ? 'replace' : 'push'](
        `${pathname}${query ? `?${query}` : ''}${window.location.hash}`,
        { scroll: false },
      );
    });
  };

  const selectFilter = (key: CatalogFilterKey, value: string) => {
    const params = new URLSearchParams(serializeCatalogQuery(optimistic));
    params.set(key, value);
    navigate(parseCatalogQuery(params));
  };

  const clearSearch = () => {
    navigate({ ...optimistic, q: '' });
    searchInputRef.current?.focus();
  };

  const clearAll = () => navigate({ ...DEFAULT_CATALOG_FILTERS });
  const cards = visible.map((product) => mapCatalogCard(product, locale, t, categories, types));

  const activeFilters = groups
    .filter((group) => group.selected !== 'all')
    .map((group) => {
      const label =
        group.options.find((option) => option.value === group.selected)?.label ?? group.label;

      return { key: group.key, label, removeLabel: t('interface.removeFilter', { label }) };
    });

  return (
    <CatalogView
      products={cards}
      filters={optimistic}
      groups={groups}
      activeFilters={activeFilters}
      updating={updating}
      resultsRef={resultsRef}
      resultsMinHeight={updating ? resultsHeight : undefined}
      filtersOpen={filtersOpen}
      searchInputRef={searchInputRef}
      hasCriteria={Boolean(optimistic.q || activeFilters.length || optimistic.sort !== 'editorial')}
      labels={{
        updating: t('interface.updating'),
        results: t('interface.results', { count: visible.length }),
        search: t('interface.search'),
        searchPlaceholder: t('interface.searchPlaceholder'),
        clearSearch: t('interface.clearSearch'),
        sort: t('interface.sort'),
        filters: t('interface.filters'),
        clearAll: t('interface.clearAll'),
        activeFilters: t('interface.activeFilters'),
        emptyTitle: t('interface.emptyTitle'),
        emptyDescription: t('interface.emptyDescription'),
      }}
      sortOptions={CATALOG_SORTS.map((value) => ({
        value,
        label: t(`sorts.${value}`),
        disabled: !hasPrices && value.startsWith('price-'),
      }))}
      priceSortNote={hasPrices ? null : t('interface.priceSortUnavailable')}
      onQuery={(q) => navigate({ ...optimistic, q }, true)}
      onClearSearch={clearSearch}
      onSelect={selectFilter}
      onRemoveFilter={(key) => selectFilter(key, 'all')}
      onClear={clearAll}
      onSort={(value) => {
        const params = new URLSearchParams(serializeCatalogQuery(optimistic));
        params.set('sort', value);
        navigate(parseCatalogQuery(params));
      }}
      onToggleFilters={() => setFiltersOpen((current) => !current)}
    />
  );
};
