import type { LucideIcon } from 'lucide-react';
interface ISolutionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}
export const SolutionCard = ({ title, description, icon: Icon }: ISolutionCardProps) => (
  <article className="h-full rounded-card border border-border bg-surface/40 p-4 md:p-5 shadow-card transition-colors hover:border-accent/40 motion-reduce:transition-none">
    <span className="flex size-10 items-center justify-center rounded-xl bg-icon-surface text-accent">
      <Icon aria-hidden="true" strokeWidth={1.75} className="size-5" />
    </span>
    <h3 className="mt-3 text-base font-semibold text-text-primary">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
  </article>
);
