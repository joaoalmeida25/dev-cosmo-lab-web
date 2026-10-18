import { ChevronDown } from 'lucide-react';
import type { CatalogFilterKey, IFilterGroup } from '../../catalog.types';

interface ICatalogFiltersProps {
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  clearAllLabel: string;
  groups: ReadonlyArray<IFilterGroup>;
  hasCriteria: boolean;
  onSelect: (key: CatalogFilterKey, value: string) => void;
  onClear: () => void;
}

export const CatalogFilters = ({
  isOpen,
  onToggle,
  title,
  clearAllLabel,
  groups,
  hasCriteria,
  onSelect,
  onClear,
}: ICatalogFiltersProps) => (
  <aside aria-label={title} className="rounded-card border border-border bg-surface/35 shadow-card">
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <h2 className="hidden text-base font-semibold text-text-primary lg:block">{title}</h2>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="catalog-filter-groups"
        className="flex min-h-11 flex-1 cursor-pointer items-center justify-between gap-3 rounded-lg text-base font-semibold text-text-primary focus-visible:outline-2 focus-visible:outline-focus-ring lg:hidden"
      >
        {title}
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.75}
          className={`size-4 transition-transform motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <button
        type="button"
        onClick={onClear}
        disabled={!hasCriteria}
        className="min-h-11 shrink-0 cursor-pointer text-xs font-medium text-accent underline underline-offset-4 disabled:cursor-default disabled:text-text-secondary disabled:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        {clearAllLabel}
      </button>
    </div>
    <div id="catalog-filter-groups" className={`px-4 pb-3 ${isOpen ? 'block' : 'hidden lg:block'}`}>
      {groups.map((group) => (
        <fieldset key={group.key} className="border-t border-border py-4">
          <legend className="float-left mb-3 w-full text-sm font-semibold text-text-primary">
            {group.label}
          </legend>
          <div className="clear-both space-y-1">
            {group.options.map((option) => (
              <label
                key={option.value}
                className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg px-2 text-xs leading-relaxed has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus-ring ${group.selected === option.value ? 'bg-primary-soft text-text-primary ring-1 ring-accent/35' : 'text-text-secondary hover:bg-surface-hover'}`}
              >
                <input
                  type="radio"
                  name={`catalog-${group.key}`}
                  value={option.value}
                  checked={group.selected === option.value}
                  onChange={() => onSelect(group.key, option.value)}
                  className="size-4 shrink-0 cursor-pointer accent-primary"
                />
                <span className="flex-1">{option.label}</span>
                <span className="text-[11px] tabular-nums">{option.count}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  </aside>
);
