import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { CompactHero } from '@/components/shared/compact-hero/compact-hero.component';
import { Container } from '@/components/shared/container/container.component';
import { ProductGallery } from '@/features/products/components/product-gallery/product-gallery.component';
import { ProductFaq } from '@/features/products/components/product-faq/product-faq.component';
import { ProductSummary } from './components/product-summary/product-summary.component';
import { ProductDetailSection } from './components/product-detail-section/product-detail-section.component';
import type { IProductDetailsViewProps } from './product-details.types';

export const ProductDetailsView = ({
  hero,
  summary,
  gallery,
  galleryLabels,
  includedTitle,
  includedIntroduction,
  materials,
  stepsTitle,
  steps,
  faqTitle,
  faq,
}: IProductDetailsViewProps) => (
  <>
    <CompactHero labelledBy="product-details-title">
      <div className="max-w-145 lg:max-w-[58%]">
        <nav aria-label={hero.breadcrumb} className="mb-5 text-xs text-text-secondary">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link
                href="/produtos"
                className="inline-flex min-h-6 items-center text-text-accent-context hover:underline focus-visible:outline-2 focus-visible:outline-focus-ring"
              >
                {hero.products}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li aria-current="page">{summary.name}</li>
          </ol>
        </nav>
        <h1
          id="product-details-title"
          className="text-[clamp(2rem,3.6vw,3rem)] leading-[1.06] font-bold tracking-[-0.04em] text-text-primary"
        >
          {hero.title}
        </h1>
        <p className="mt-4 max-w-125 text-[15px] leading-relaxed text-text-secondary md:text-base">
          {hero.description}
        </p>
      </div>
    </CompactHero>
    <Container className="pt-6 pb-3 md:pt-8">
      <section
        aria-labelledby="product-name"
        className="grid items-start gap-8 pb-8 md:gap-10 md:pb-10 lg:grid-cols-[11fr_9fr] lg:gap-12"
      >
        <ProductGallery images={gallery} labels={galleryLabels} />
        <ProductSummary {...summary} />
      </section>
      {materials.length ? (
        <ProductDetailSection
          id="product-included"
          title={includedTitle}
          introduction={includedIntroduction}
        >
          <ul className="space-y-3 text-sm leading-relaxed text-text-secondary">
            {materials.map((material) => (
              <li key={material}>{material}</li>
            ))}
          </ul>
        </ProductDetailSection>
      ) : null}
      {steps.length ? (
        <ProductDetailSection id="product-steps" title={stepsTitle}>
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span aria-hidden="true" className="text-lg font-semibold text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-sm leading-relaxed font-medium text-text-primary">
                    {step.title}
                  </h3>
                  {step.description ? (
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                      {step.description}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </ProductDetailSection>
      ) : null}
      {faq.length ? (
        <ProductDetailSection id="product-faq" title={faqTitle}>
          <ProductFaq items={faq} />
        </ProductDetailSection>
      ) : null}
    </Container>
  </>
);
