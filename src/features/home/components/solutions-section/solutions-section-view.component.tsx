import { ProjectContact } from '../project-contact/project-contact.component';
import { SolutionCard } from './components/solution-card/solution-card.component';
import { Container } from '@/components/shared/container/container.component';
import { HomeScene } from '../home-scene/home-scene.component';

import type { ISolutionCard } from './solutions-section.types';
interface ISolutionsSectionViewProps {
  eyebrow: string;
  title: string;
  description: string;
  journeyTitle: string;
  steps: ReadonlyArray<string>;
  solutionCards: ReadonlyArray<ISolutionCard>;
}

export const SolutionsSectionView = ({
  eyebrow,
  title,
  description,
  journeyTitle,
  steps,
  solutionCards,
}: ISolutionsSectionViewProps) => {
  return (
    <HomeScene
      scene="solutions"
      id="services"
      aria-labelledby="solutions-title"
      tabIndex={-1}
      className="relative scroll-mt-20 overflow-hidden py-section lg:py-section-lg"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)] lg:items-center lg:gap-12 xl:gap-16">
          <div>
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {solutionCards.map((card) => (
              <SolutionCard
                key={card.id}
                title={card.title}
                description={card.description}
                icon={card.icon}
              />
            ))}
          </div>
        </div>
        <div className="mt-7 border-t border-border pt-6">
          <h3 className="text-lg font-semibold text-text-primary">{journeyTitle}</h3>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm text-text-secondary">
                <span aria-hidden="true" className="font-mono text-accent">
                  0{index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mx-auto mt-5 max-w-sm text-center">
            <ProjectContact placement="services" />
          </div>
        </div>
      </Container>
    </HomeScene>
  );
};
