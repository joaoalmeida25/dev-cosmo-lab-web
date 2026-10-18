import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button/button.component';
import type { IProductSummaryProps } from '../../product-details.types';

export const ProductSummary = ({
  name,
  type,
  subtitle,
  description,
  status,
  stageNote,
  price,
  action,
  specifications,
}: IProductSummaryProps) => (
  <div className="min-w-0 lg:pt-3">
    <p className="text-[11px] font-semibold tracking-widest text-text-accent-context uppercase">
      {type}
    </p>
    <h2
      id="product-name"
      className="mt-4 text-3xl leading-tight font-bold tracking-[-0.04em] text-text-primary md:text-4xl"
    >
      {name}
    </h2>
    {subtitle ? <p className="mt-2 text-base font-medium text-text-primary">{subtitle}</p> : null}
    <p className="mt-4 text-base leading-relaxed text-text-secondary">{description}</p>
    <p className="mt-5 inline-flex rounded-control border border-accent/30 bg-primary-soft px-3 py-1 text-xs font-medium text-text-primary">
      {status}
    </p>
    {stageNote ? (
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{stageNote}</p>
    ) : null}
    {price ? (
      <p className="mt-5 text-3xl font-semibold tracking-tight text-text-primary">{price}</p>
    ) : null}
    {action ? (
      <Button
        href={action.href}
        target="_blank"
        aria-label={action.accessibleLabel}
        variant="primary"
        size="lg"
        className="mt-5 w-full"
        rightIcon={<ArrowRight aria-hidden="true" />}
      >
        {action.label}
      </Button>
    ) : null}
    {specifications.length ? (
      <dl className="mt-5 divide-y divide-border border-t border-border">
        {specifications.map(({ label, value }) => (
          <div
            key={label}
            className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-4 py-3 text-sm"
          >
            <dt className="text-text-secondary">{label}</dt>
            <dd className="text-text-primary">{value}</dd>
          </div>
        ))}
      </dl>
    ) : null}
  </div>
);
