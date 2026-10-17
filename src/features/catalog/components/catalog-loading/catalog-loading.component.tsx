import { LoaderCircle } from 'lucide-react';

interface ICatalogLoadingProps {
  label: string;
}

export const CatalogLoading = ({ label }: ICatalogLoadingProps) => (
  <div
    role="status"
    aria-live="polite"
    className="inline-flex items-center gap-3 rounded-control border border-accent/30 bg-surface px-5 py-3 text-xs font-medium text-text-primary shadow-primary"
  >
    <LoaderCircle
      aria-hidden="true"
      strokeWidth={1.75}
      className="size-4 animate-spin text-accent motion-reduce:animate-none"
    />
    {label}
  </div>
);
