import type { ReactNode } from 'react';

interface IProductDetailSectionProps {
  id: string;
  title: string;
  introduction?: string;
  children: ReactNode;
}

export const ProductDetailSection = ({
  id,
  title,
  introduction,
  children,
}: IProductDetailSectionProps) => (
  <section
    aria-labelledby={id}
    className="grid gap-5 border-t border-border py-7 md:grid-cols-[2fr_3fr] md:gap-7 md:py-9"
  >
    <div>
      <h2
        id={id}
        className="text-2xl leading-tight font-semibold tracking-[-0.04em] text-text-primary md:text-3xl"
      >
        {title}
      </h2>
      {introduction ? (
        <p className="mt-4 max-w-85 text-base leading-relaxed text-text-secondary">
          {introduction}
        </p>
      ) : null}
    </div>
    <div className="min-w-0 md:border-l md:border-border md:pl-7">{children}</div>
  </section>
);
