import styles from './final-cta-view.module.css';
import { Container } from '@/components/shared/container/container.component';
import { ThemedArtwork } from '@/components/shared/themed-artwork/themed-artwork.component';
import { ArrowRightIcon } from '@/components/shared/arrow-right-icon/arrow-right-icon.component';
import { MotionReveal } from '@/components/shared/motion-reveal/motion-reveal.component';
import { Button } from '@/components/ui/button/button.component';

interface IFinalCTAViewProps {
  eyebrow: string;
  title: string;
  description: string;
  action: string;
}

export const FinalCTAView = ({ eyebrow, title, description, action }: IFinalCTAViewProps) => {
  return (
    <section
      aria-labelledby="final-cta-title"
      className={`${styles.scene} relative isolate min-h-125 overflow-hidden py-20 sm:min-h-115 lg:min-h-105 lg:py-24`}
    >
      <ThemedArtwork
        darkSrc="/assets/devcosmo/home/dark/final-cta.webp"
        lightSrc="/assets/devcosmo/home/light/final-cta.webp"
        mobileDarkSrc="/assets/devcosmo/home/mobile/dark/final-cta-portrait.webp"
        mobileLightSrc="/assets/devcosmo/home/mobile/light/final-cta-portrait.webp"
        width={1672}
        height={941}
        className="absolute inset-0 -z-20 bg-cover bg-position-[center_bottom] lg:bg-position-[center_55%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 [background-image:var(--final-cta-overlay)]"
      />
      <Container>
        <MotionReveal
          variant="artwork"
          duration={600}
          className="mx-auto flex max-w-180 flex-col items-center text-center"
        >
          <p className="text-[10px] leading-relaxed font-semibold tracking-[0.17em] text-text-accent-context uppercase md:text-[11px]">
            {eyebrow}
          </p>
          <h2
            id="final-cta-title"
            className="mt-4 max-w-[16ch] text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-bold tracking-[-0.035em] text-text-primary"
          >
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-text-secondary md:text-base">
            {description}
          </p>
          <div className="mt-7">
            <Button
              href="#featured-product"
              size="lg"
              variant="primary"
              rightIcon={<ArrowRightIcon />}
            >
              {action}
            </Button>
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
};
