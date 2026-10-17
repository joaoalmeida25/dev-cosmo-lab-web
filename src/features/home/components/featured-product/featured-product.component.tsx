import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/shared/container/container.component';
import { Section } from '@/components/shared/section/section.component';
import { ThemedArtwork } from '@/components/shared/themed-artwork/themed-artwork.component';
import { MotionReveal } from '@/components/shared/motion-reveal/motion-reveal.component';
import type { IProduct } from '@/features/products/products.types';

interface IFeaturedProductProps {
  product: IProduct;
}

export const FeaturedProduct = async ({ product }: IFeaturedProductProps) => {
  const t = await getTranslations('home.featured');
  const benefits = ['organization', 'followUp', 'materials'] as const;

  return (
    <Section
      id="featured-product"
      aria-labelledby="featured-title"
      tabIndex={-1}
      className="relative overflow-hidden bg-featured-surface lg:min-h-155"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 [background-image:var(--featured-glow)]"
      />
      <Container>
        <MotionReveal className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          <div className="min-w-0 lg:py-6">
            <p className="text-[10px] leading-relaxed font-semibold tracking-[0.14em] text-text-accent-context uppercase">
              {t('eyebrow')}
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
              {benefits.map((benefit, index) => (
                <li key={benefit} className="flex gap-4">
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-icon-surface text-xl font-semibold text-accent"
                    aria-hidden="true"
                  >
                    {index === 0 ? '✓' : index === 1 ? '↗' : '＋'}
                  </span>
                  <span>
                    <strong className="block text-sm font-semibold text-text-primary">
                      {t(`benefits.${benefit}.title`)}
                    </strong>
                    <span className="mt-1 block text-sm leading-relaxed text-text-secondary">
                      {t(`benefits.${benefit}.description`)}
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
              {t('illustration')}
            </figcaption>
          </figure>
        </MotionReveal>
      </Container>
    </Section>
  );
};
