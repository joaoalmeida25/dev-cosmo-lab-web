import { getTranslations } from 'next-intl/server';
import { ArrowRightIcon } from '@/components/shared/arrow-right-icon/arrow-right-icon.component';
import { Container } from '@/components/shared/container/container.component';
import { MotionReveal } from '@/components/shared/motion-reveal/motion-reveal.component';
import { HomeScene } from '../home-scene/home-scene.component';

const solutionCards = ['product', 'newProducts', 'moreSolutions'] as const;

export const SolutionsSection = async () => {
  const t = await getTranslations('home.solutions');

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
              {t('eyebrow')}
            </p>
            <h2
              id="solutions-title"
              className="mt-4 max-w-[11ch] lg:max-w-[14ch] text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-bold tracking-[-0.035em] text-text-primary"
            >
              {t('title')}
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-text-secondary md:text-base">
              {t('description')}
            </p>
          </MotionReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {solutionCards.map((card, index) => {
              const isAvailable = card === 'product';
              const content = (
                <>
                  <span
                    className="flex size-14 items-center justify-center rounded-[14px] bg-icon-surface text-accent"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-8"
                    >
                      {index === 0 ? (
                        <path d="M4 5h6v6H4V5Zm10 0h6v6h-6V5ZM4 15h6v4H4v-4Zm10 0h6v4h-6v-4Z" />
                      ) : index === 1 ? (
                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3-12-2 4-4 2 2-4 4-2Z" />
                      ) : (
                        <path d="M12 3v6m0 6v6M3 12h6m6 0h6M5.6 5.6l4.2 4.2m4.4 4.4 4.2 4.2m0-12.8-4.2 4.2m-4.4 4.4-4.2 4.2" />
                      )}
                    </svg>
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-text-primary">
                    {t(`cards.${card}.title`)}
                  </h3>
                  <p className="mt-2 min-h-13 text-sm leading-relaxed text-text-secondary">
                    {t(`cards.${card}.description`)}
                  </p>
                  <span
                    className={`mt-6 inline-flex h-10 items-center justify-center rounded-full text-sm ${isAvailable ? 'w-10 border border-border text-text-primary' : 'px-4 bg-chip-background text-text-secondary'}`}
                  >
                    {isAvailable ? <ArrowRightIcon /> : t('unavailable')}
                  </span>
                </>
              );

              return (
                <MotionReveal key={card} delay={index * 50} className="h-full">
                  {isAvailable ? (
                    <a
                      href="#featured-product"
                      aria-label={t('productAction')}
                      className="group block h-full rounded-card border border-accent/60 bg-surface/85 p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[3px] hover:border-accent hover:shadow-editorial focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {content}
                    </a>
                  ) : (
                    <article className="h-full rounded-card border border-border bg-surface/55 p-5">
                      {content}
                    </article>
                  )}
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </Container>
    </HomeScene>
  );
};
