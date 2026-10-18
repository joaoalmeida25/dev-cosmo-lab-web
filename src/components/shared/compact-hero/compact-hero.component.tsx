import type { ReactNode } from 'react';
import { Container } from '@/components/shared/container/container.component';
import { ThemedArtwork } from '@/components/shared/themed-artwork/themed-artwork.component';
import styles from './compact-hero.module.css';

interface ICompactHeroProps {
  children: ReactNode;
  labelledBy: string;
}

export const CompactHero = ({ children, labelledBy }: ICompactHeroProps) => (
  <section
    aria-labelledby={labelledBy}
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
    <Container className="pt-28 pb-16 md:pt-24 md:pb-12">{children}</Container>
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
