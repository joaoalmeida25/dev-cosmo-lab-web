import { HomeIcon, type HomeIconName } from '../home-icon/home-icon.component';
import styles from './brand-laboratory-view.module.css';
import { Container } from '@/components/shared/container/container.component';
import { MotionReveal } from '@/components/shared/motion-reveal/motion-reveal.component';
import { ThemedArtwork } from '@/components/shared/themed-artwork/themed-artwork.component';
import { HomeScene } from '../home-scene/home-scene.component';

interface IBrandLaboratoryViewProps {
  eyebrow: string;
  title: string;
  description: string;
  pillars: ReadonlyArray<{ id: string; title: string; description: string; icon: HomeIconName }>;
}

export const BrandLaboratoryView = ({
  eyebrow,
  title,
  description,
  pillars,
}: IBrandLaboratoryViewProps) => {
  return (
    <HomeScene
      scene="laboratory"
      id="laboratory"
      aria-labelledby="laboratory-title"
      tabIndex={-1}
      className={`${styles.scene} relative isolate min-h-[680px] scroll-mt-20 overflow-hidden py-20 sm:min-h-[640px] lg:flex lg:min-h-[clamp(760px,40vw,1000px)] lg:items-center lg:py-24`}
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
            {eyebrow}
          </p>
          <h2
            id="laboratory-title"
            className="mt-4 max-w-[16ch] text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-bold tracking-[-0.035em] text-text-primary lg:max-w-none lg:text-[clamp(2.25rem,3vw,2.75rem)]"
          >
            {title}
          </h2>
          <p className="mt-5 max-w-[540px] text-[15px] leading-relaxed text-text-secondary md:text-base">
            {description}
          </p>
        </MotionReveal>

        <div className="mt-10 grid max-w-[760px] gap-3 sm:grid-cols-3 lg:max-w-[688px]">
          {pillars.map((pillar, index) => (
            <MotionReveal key={pillar.id} delay={index * 60} className="h-full">
              <article className="h-full rounded-card border border-photo-card-border bg-photo-card p-5 shadow-card backdrop-blur-md">
                <HomeIcon name={pillar.icon} className="size-9 text-accent" />
                <h3 className="mt-5 text-base font-semibold text-text-primary">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {pillar.description}
                </p>
              </article>
            </MotionReveal>
          ))}
        </div>
      </Container>
    </HomeScene>
  );
};
