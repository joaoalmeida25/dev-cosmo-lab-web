import { Search, X } from 'lucide-react';
import type { RefObject } from 'react';
import { Button } from '@/components/ui/button/button.component';

interface ICatalogSearchProps {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  label: string;
  placeholder: string;
  clearLabel: string;
  onChange: (value: string) => void;
  onClear: () => void;
}
export const CatalogSearch = ({
  inputRef,
  value,
  label,
  placeholder,
  clearLabel,
  onChange,
  onClear,
}: ICatalogSearchProps) => (
  <div
    role="search"
    className="flex min-h-13 min-w-0 items-center gap-3 rounded-control border border-accent/45 bg-surface/65 px-4 shadow-primary focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring"
  >
    <Search aria-hidden="true" strokeWidth={1.75} className="size-5 shrink-0 text-text-secondary" />
    <label htmlFor="catalog-search" className="sr-only">
      {label}
    </label>
    <input
      ref={inputRef}
      id="catalog-search"
      type="search"
      maxLength={240}
      autoComplete="off"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-controls="catalog-results"
      className="min-h-12 w-full min-w-0 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary [&::-webkit-search-cancel-button]:appearance-none"
    />
    {value ? (
      <Button size="icon" variant="ghost" aria-label={clearLabel} onClick={onClear}>
        <X aria-hidden="true" strokeWidth={1.75} />
      </Button>
    ) : null}
  </div>
);
