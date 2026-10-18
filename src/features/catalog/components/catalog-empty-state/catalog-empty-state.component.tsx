import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button/button.component';

interface ICatalogEmptyStateProps {
  title: string;
  description: string;
  action: string;
  onClear: () => void;
}

export const CatalogEmptyState = ({
  title,
  description,
  action,
  onClear,
}: ICatalogEmptyStateProps) => (
  <div className="flex h-full min-h-90 flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface/25 px-6 py-12 text-center">
    <SearchX aria-hidden="true" strokeWidth={1.75} className="mb-5 size-9 text-accent" />
    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
    <p className="mt-3 mb-6 max-w-90 text-sm leading-relaxed text-text-secondary">{description}</p>
    <Button onClick={onClear} variant="primary">
      {action}
    </Button>
  </div>
);
