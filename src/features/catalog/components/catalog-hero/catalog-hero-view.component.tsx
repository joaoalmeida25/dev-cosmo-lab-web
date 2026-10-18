import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { CompactHero } from '@/components/shared/compact-hero/compact-hero.component';

interface ICatalogHeroViewProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  benefits: ReadonlyArray<{ id: string; title: string; description: string; icon: LucideIcon }>;
}

export const CatalogHeroView = ({
  eyebrow,
  title,
  description,
  benefits,
}: ICatalogHeroViewProps) => (
  <CompactHero labelledBy="catalog-title">
    <div className="max-w-145 lg:max-w-[58%]">
      <p className="text-[10px] font-semibold tracking-[0.22em] text-text-accent-context uppercase">
        {eyebrow}
      </p>
      <h1
        id="catalog-title"
        className="mt-3 max-w-[22ch] text-[clamp(2rem,3.6vw,3rem)] leading-[1.06] font-bold tracking-[-0.04em] text-text-primary"
      >
        {title}
      </h1>
      <p className="mt-4 max-w-125 text-[15px] leading-relaxed text-text-secondary md:text-base">
        {description}
      </p>
      <ul className="mt-6 hidden gap-6 lg:flex">
        {benefits.map(({ icon: Icon, ...benefit }) => (
          <li key={benefit.id} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-linear-to-br from-accent/20 via-icon-surface to-primary/15 text-accent shadow-primary"
            >
              <Icon aria-hidden="true" strokeWidth={1.75} className="size-6" />
            </span>
            <span>
              <strong className="block text-xs font-semibold text-text-primary">
                {benefit.title}
              </strong>
              <span className="mt-1 block text-[11px] text-text-secondary">
                {benefit.description}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  </CompactHero>
);
