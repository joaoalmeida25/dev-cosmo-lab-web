import type { LucideIcon } from 'lucide-react';
import styles from './featured-product-view.module.css';
import { Container } from '@/components/shared/container/container.component';
import { Section } from '@/components/shared/section/section.component';
import { ThemedArtwork } from '@/components/shared/themed-artwork/themed-artwork.component';
import type { IHomeFeaturedProduct } from '@/features/home/home.types';

interface IFeaturedProductViewProps {
  eyebrow: string;
  illustration: string;
  product: Pick<IHomeFeaturedProduct, 'name' | 'description' | 'images' | 'imageAlt'>;
  benefits: ReadonlyArray<{ id: string; title: string; description: string; icon: LucideIcon }>;
}

export const FeaturedProductView = ({
  eyebrow,
  illustration,
  product,
  benefits,
}: IFeaturedProductViewProps) => {
  return (
    <Section
      id="featured-product"
      aria-labelledby="featured-title"
      tabIndex={-1}
      className={`${styles.scene} relative overflow-hidden bg-featured-surface lg:min-h-155`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 [background-image:var(--featured-glow)]"
      />
      <Container>
        <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div className="min-w-0 lg:py-6">
            <p className="text-[10px] leading-relaxed font-semibold tracking-[0.14em] text-text-accent-context uppercase">
              {eyebrow}
            </p>
            <h2
              id="featured-title"
              className="mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-bold tracking-[-0.035em] text-text-primary lg:text-[clamp(2rem,3.5vw,3rem)]"
            >
              {product.name}
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-text-secondary md:text-base">
              {product.description}
            </p>
            <ul className="mt-7 space-y-5">
              {benefits.map(({ icon: Icon, ...benefit }) => (
                <li key={benefit.id} className="flex gap-4">
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-icon-surface text-xl font-semibold text-accent"
                    aria-hidden="true"
                  >
                    <Icon aria-hidden="true" strokeWidth={1.75} className="size-6" />
                  </span>
                  <span>
                    <strong className="block text-sm font-semibold text-text-primary">
                      {benefit.title}
                    </strong>
                    <span className="mt-1 block text-sm leading-relaxed text-text-secondary">
                      {benefit.description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="relative min-w-0 lg:-mr-8 xl:-mr-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full bg-radial from-ambient-glow to-transparent to-70%"
            />
            <ThemedArtwork
              darkSrc={product.images.dark}
              lightSrc={product.images.light}
              width={1448}
              height={1086}
              lightWidth={1672}
              lightHeight={941}
              alt={product.imageAlt}
              className="relative aspect-4/3 w-full bg-contain bg-center light:aspect-[1672/941]"
            />
            <figcaption className="relative mx-auto mt-1 max-w-md text-center text-xs leading-relaxed text-text-secondary">
              {illustration}
            </figcaption>
          </figure>
        </div>
      </Container>
    </Section>
  );
};
