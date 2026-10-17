import { SolutionCard } from './components/solution-card/solution-card.component';
import { Container } from '@/components/shared/container/container.component';
import { MotionReveal } from '@/components/shared/motion-reveal/motion-reveal.component';
import { HomeScene } from '../home-scene/home-scene.component';

import type { ISolutionCard } from './solutions-section.types';
interface ISolutionsSectionViewProps {
  eyebrow: string;
  title: string;
  description: string;
  unavailable: string;
  productAction: string;
  solutionCards: ReadonlyArray<ISolutionCard>;
}

export const SolutionsSectionView = ({
  eyebrow,
  title,
  description,
  unavailable,
  productAction,
  solutionCards,
}: ISolutionsSectionViewProps) => {
  return (
    <HomeScene
      scene="solutions"
      id="solutions"
      aria-labelledby="solutions-title"
      tabIndex={-1}
      className="relative scroll-mt-20 overflow-hidden bg-background-soft/35 py-section lg:py-section-lg"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.46fr)_minmax(0,1fr)] lg:items-center lg:gap-8">
          <MotionReveal>
            <p className="text-[10px] leading-relaxed font-semibold tracking-[0.17em] text-text-accent-context uppercase md:text-[11px]">
              {eyebrow}
            </p>
            <h2
              id="solutions-title"
              className="mt-4 max-w-[11ch] lg:max-w-[14ch] text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-bold tracking-[-0.035em] text-text-primary"
            >
              {title}
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-text-secondary md:text-base">
              {description}
            </p>
          </MotionReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {solutionCards.map((card, index) => (
              <MotionReveal key={card.id} delay={index * 50} className="h-full">
                <SolutionCard
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  isAvailable={card.isAvailable}
                  unavailable={unavailable}
                  productAction={productAction}
                />
              </MotionReveal>
            ))}
          </div>
        </div>
      </Container>
    </HomeScene>
  );
};
