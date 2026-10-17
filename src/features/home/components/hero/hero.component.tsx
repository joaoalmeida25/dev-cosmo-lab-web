import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/shared/container/container.component';
import { ThemedArtwork } from '@/components/shared/themed-artwork/themed-artwork.component';
import { ArrowRightIcon } from '@/components/shared/arrow-right-icon/arrow-right-icon.component';
import { Button } from '@/components/ui/button/button.component';
import { HomeScene } from '../home-scene/home-scene.component';

export const Hero = async () => {
  const t = await getTranslations('home.hero');
  const benefits = ['solutions', 'productivity', 'evolution'] as const;

  return (
    <HomeScene
      scene="hero"
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-210 scroll-mt-0 items-center overflow-hidden sm:min-h-195 lg:min-h-[clamp(720px,45vw,1000px)]"
    >
      <ThemedArtwork
        darkSrc="/assets/devcosmo/home/dark/hero.webp"
        lightSrc="/assets/devcosmo/home/light/hero.webp"
        mobileDarkSrc="/assets/devcosmo/home/mobile/dark/hero-portrait.webp"
        mobileLightSrc="/assets/devcosmo/home/mobile/light/hero-portrait.webp"
        width={1672}
        height={941}
        className="absolute inset-0 -z-20 bg-cover bg-position-[62%_bottom] sm:bg-position-[68%_center] lg:bg-position-[center_35%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 [background-image:var(--hero-overlay)]"
      />

      <Container className="pt-28 pb-16 md:pt-32 lg:pt-28 lg:pb-20">
        <div className="max-w-152.5 lg:w-1/2">
          <p
            data-hero-step="eyebrow"
            className="text-[10px] leading-relaxed font-semibold tracking-[0.17em] text-text-accent-context uppercase md:text-[11px]"
          >
            {t('eyebrow')}
          </p>
          <h1
            id="hero-title"
            data-hero-step="headline"
            className="mt-5 text-[clamp(2.5rem,10vw,3.5rem)] leading-[1.04] font-bold tracking-[-0.045em] text-text-primary lg:text-[clamp(3.5rem,5.4vw,5rem)]"
          >
            {t.rich('headline', {
              line: (chunks) => <span className="block">{chunks}</span>,
              highlight: (chunks) => <span className="text-accent">{chunks}</span>,
            })}
          </h1>
          <p
            data-hero-step="body"
            className="mt-5 max-w-136 text-[15px] leading-relaxed text-text-secondary md:text-lg"
          >
            {t('description')}
          </p>
          <div
            data-hero-step="actions"
            className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <Button
              href="#featured-product"
              size="lg"
              variant="primary"
              rightIcon={<ArrowRightIcon />}
            >
              {t('primaryAction')}
            </Button>
            <Button href="#laboratory" size="lg" variant="secondary">
              {t('secondaryAction')}
            </Button>
          </div>
          <div data-hero-step="benefits" className="mt-8 md:mt-9">
            <ul className="flex max-w-xl flex-wrap gap-x-5 gap-y-3 text-xs text-text-secondary md:text-sm">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-accent ring-4 ring-accent/15"
                  />
                  {t(`benefits.${benefit}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </HomeScene>
  );
};
