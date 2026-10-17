import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/shared/container/container.component';
import { MotionReveal } from '@/components/shared/motion-reveal/motion-reveal.component';
import { ThemedArtwork } from '@/components/shared/themed-artwork/themed-artwork.component';
import { HomeScene } from '../home-scene/home-scene.component';

const pillars = ['create', 'explore', 'evolve'] as const;

const LaboratoryIcon = ({ index }: { index: number }) => {
  if (index === 0) {
    return <path d="m9 7-5 5 5 5m6-10 5 5-5 5m-3-12-2 14" />;
  }

  if (index === 1) {
    return <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3-12-2 4-4 2 2-4 4-2Z" />;
  }

  return <path d="M5 19V9m7 10V5m7 14v-7M3 19h18" />;
};

export const BrandLaboratory = async () => {
  const t = await getTranslations('home.laboratory');

  return (
    <HomeScene
      scene="laboratory"
      id="laboratory"
      aria-labelledby="laboratory-title"
      tabIndex={-1}
      className="relative isolate min-h-[680px] scroll-mt-20 overflow-hidden py-20 sm:min-h-[640px] lg:flex lg:min-h-[clamp(760px,40vw,1000px)] lg:items-center lg:py-24"
    >
      <ThemedArtwork
        darkSrc="/assets/devcosmo/home/dark/laboratory.webp"
        lightSrc="/assets/devcosmo/home/light/laboratory.webp"
        mobileDarkSrc="/assets/devcosmo/home/mobile/dark/laboratory-portrait.webp"
        mobileLightSrc="/assets/devcosmo/home/mobile/light/laboratory-portrait.webp"
        width={1672}
        height={941}
        className="absolute inset-0 -z-20 bg-cover bg-[position:62%_center] lg:bg-position-[center_22%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 [background-image:var(--laboratory-overlay)]"
      />

      <Container>
        <MotionReveal className="max-w-[760px] lg:max-w-[640px]">
          <p className="text-[10px] leading-relaxed font-semibold tracking-[0.17em] text-text-accent-context uppercase md:text-[11px]">
            {t('eyebrow')}
          </p>
          <h2
            id="laboratory-title"
            className="mt-4 max-w-[16ch] text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-bold tracking-[-0.035em] text-text-primary lg:max-w-none lg:text-[clamp(2.25rem,3vw,2.75rem)]"
          >
            {t('title')}
          </h2>
          <p className="mt-5 max-w-[540px] text-[15px] leading-relaxed text-text-secondary md:text-base">
            {t('description')}
          </p>
        </MotionReveal>

        <div className="mt-10 grid max-w-[760px] gap-3 sm:grid-cols-3 lg:max-w-[688px]">
          {pillars.map((pillar, index) => (
            <MotionReveal key={pillar} delay={index * 60} className="h-full">
              <article className="h-full rounded-card border border-photo-card-border bg-photo-card p-5 shadow-card backdrop-blur-md">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-9 text-accent"
                  aria-hidden="true"
                >
                  <LaboratoryIcon index={index} />
                </svg>
                <h3 className="mt-5 text-base font-semibold text-text-primary">
                  {t(`pillars.${pillar}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {t(`pillars.${pillar}.description`)}
                </p>
              </article>
            </MotionReveal>
          ))}
        </div>
      </Container>
    </HomeScene>
  );
};
