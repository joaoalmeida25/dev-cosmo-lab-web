import { ThemedArtwork } from '@/components/shared/themed-artwork/themed-artwork.component';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button/button.component';
import type { IProductCardPresentation } from './product-card.types';

interface IProductCardProps {
  product: IProductCardPresentation;
}
export const ProductCard = ({ product }: IProductCardProps) => (
  <article
    aria-labelledby={`product-${product.id}`}
    className="group flex min-w-0 flex-col rounded-card border border-border bg-surface/40 p-2 shadow-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-accent/60 hover:shadow-editorial focus-within:border-accent motion-reduce:transform-none motion-reduce:transition-none"
  >
    <div className="relative overflow-hidden rounded-xl border border-border/65 bg-primary-soft">
      {product.images ? (
        <ThemedArtwork
          darkSrc={product.images.dark}
          lightSrc={product.images.light}
          width={1448}
          height={1086}
          lightWidth={1672}
          lightHeight={941}
          alt={product.imageAlt}
          className="aspect-[16/10] w-full bg-cover bg-center"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-[16/10] flex-col items-center justify-center gap-3 bg-radial from-ambient-glow to-transparent p-4 pt-12 text-center"
        >
          <span className="font-mono text-[clamp(1.5rem,2vw,2rem)] tracking-[-0.07em] text-accent">
            {product.name}
          </span>
          <span className="text-[10px] tracking-[0.16em] text-text-secondary uppercase">
            {product.type}
          </span>
          <span className="h-px w-12 bg-accent/40" />
        </div>
      )}
      <span className="absolute top-2 left-2 max-w-[calc(100%-1rem)] rounded-control border border-accent/35 bg-primary-soft/95 px-3 py-1.5 text-[10px] leading-tight font-semibold text-text-primary backdrop-blur-sm">
        {product.status}
      </span>
    </div>
    <div className="flex flex-1 flex-col p-2 pt-4">
      <p className="text-[10px] leading-relaxed font-medium text-accent">{product.category}</p>
      <h2
        id={`product-${product.id}`}
        className="mt-1 text-lg leading-snug font-semibold tracking-tight text-text-primary"
      >
        {product.name}
      </h2>
      {product.subtitle ? (
        <p className="mt-1 text-xs text-text-secondary">{product.subtitle}</p>
      ) : null}
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{product.description}</p>
      <p className="mt-5 text-[10px] font-semibold tracking-wider text-text-secondary uppercase">
        {product.highlightsLabel}
      </p>
      <ul className="mt-2 space-y-2">
        {product.highlights.map((highlight) => (
          <li
            key={highlight}
            className="flex items-start gap-2 text-xs leading-relaxed text-text-secondary"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground"
            >
              <Check aria-hidden="true" strokeWidth={1.75} className="size-3" />
            </span>
            {highlight}
          </li>
        ))}
      </ul>
      {product.stageNote ? (
        <p className="mt-4 text-[11px] leading-relaxed text-text-secondary">{product.stageNote}</p>
      ) : null}
      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4 pb-1">
          <p
            className={`py-1 font-semibold text-text-primary ${product.action ? 'text-xl' : 'text-sm'}`}
          >
            {product.priceLabel}
          </p>
          {product.action ? (
            <Button
              href={product.action.href}
              aria-label={product.action.accessibleLabel}
              target="_blank"
              size="sm"
              variant="primary"
              rightIcon={<ArrowRight aria-hidden="true" strokeWidth={1.75} />}
            >
              {product.action.label}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  </article>
);
