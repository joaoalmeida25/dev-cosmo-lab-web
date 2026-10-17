import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ISolutionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isAvailable: boolean;
  unavailable: string;
  productAction: string;
}

export const SolutionCard = ({
  title,
  description,
  icon: Icon,
  isAvailable,
  unavailable,
  productAction,
}: ISolutionCardProps) => {
  const content = (
    <>
      <span
        className="flex size-14 items-center justify-center rounded-[14px] bg-icon-surface text-accent"
        aria-hidden="true"
      >
        <Icon aria-hidden="true" strokeWidth={1.75} className="size-8" />
      </span>
      <h3 className="mt-6 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 min-h-13 text-sm leading-relaxed text-text-secondary">{description}</p>
      <span
        className={`mt-6 inline-flex h-10 items-center justify-center rounded-full text-sm ${isAvailable ? 'w-10 border border-border text-text-primary' : 'px-4 bg-chip-background text-text-secondary'}`}
      >
        {isAvailable ? <ArrowRight aria-hidden="true" strokeWidth={1.75} /> : unavailable}
      </span>
    </>
  );
  return isAvailable ? (
    <a
      href="#featured-product"
      aria-label={productAction}
      className="group block h-full rounded-card border border-accent/60 bg-surface/85 p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[3px] hover:border-accent hover:shadow-editorial focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring motion-reduce:transform-none motion-reduce:transition-none"
    >
      {content}
    </a>
  ) : (
    <article className="h-full rounded-card border border-border bg-surface/55 p-5">
      {content}
    </article>
  );
};
