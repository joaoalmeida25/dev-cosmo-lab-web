import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Container } from '@/components/shared/container/container.component';
import { ThemedArtwork } from '@/components/shared/themed-artwork/themed-artwork.component';
import styles from './catalog-hero-view.module.css';

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
  <section
    aria-labelledby="catalog-title"
    className={`${styles.scene} relative isolate overflow-hidden`}
  >
    <ThemedArtwork
      darkSrc="/assets/devcosmo/home/dark/hero.webp"
      lightSrc="/assets/devcosmo/home/light/hero.webp"
      width={1672}
      height={941}
      className="absolute inset-0 -z-20 bg-cover bg-position-[65%_48%] lg:bg-position-[center_28%]"
    />
    <div aria-hidden="true" className={`${styles.overlay} absolute inset-0 -z-10`} />
    <Container className="pt-28 pb-16 md:pt-24 md:pb-12">
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
    </Container>
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
      className={styles.edge}
    >
      <path
        d="M0 0 Q500 200 1000 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  </section>
);
