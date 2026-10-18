import type { KeyboardEventHandler } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button/button.component';
import type { IProductGalleryItem, IProductGalleryLabels } from './product-gallery.types';

interface IProductGalleryViewProps {
  images: ReadonlyArray<IProductGalleryItem>;
  current: IProductGalleryItem | undefined;
  index: number;
  imageId: string;
  labels: IProductGalleryLabels;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
}

export const ProductGalleryView = ({
  images,
  current,
  index,
  imageId,
  labels,
  onSelect,
  onPrevious,
  onNext,
  onKeyDown,
}: IProductGalleryViewProps) => (
  <div role="region" aria-label={labels.region} onKeyDown={onKeyDown} className="min-w-0">
    <div
      id={imageId}
      className="relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-surface/40 shadow-card"
    >
      {current ? (
        <Image
          src={current.src}
          alt={current.alt}
          fill
          unoptimized
          sizes="(min-width: 1440px) 720px, (min-width: 1024px) 55vw, 100vw"
          className="object-contain"
        />
      ) : (
        <div className="flex aspect-4/3 items-center justify-center bg-radial from-ambient-glow to-transparent p-8 text-center text-sm text-text-secondary">
          {labels.unavailable}
        </div>
      )}
      {images.length > 1 ? (
        <>
          <Button
            size="icon"
            aria-label={labels.previous}
            onClick={onPrevious}
            className="absolute! top-1/2 left-3 -translate-y-1/2 bg-background/90!"
          >
            <ChevronLeft />
          </Button>
          <Button
            size="icon"
            aria-label={labels.next}
            onClick={onNext}
            className="absolute! top-1/2 right-3 -translate-y-1/2 bg-background/90!"
          >
            <ChevronRight />
          </Button>
        </>
      ) : null}
    </div>
    {images.length > 1 ? (
      <>
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {labels.positions[index]}
        </p>
        <div className="mt-3 flex gap-2 overflow-x-auto p-1">
          {images.map((image, position) => (
            <button
              key={image.src}
              type="button"
              aria-label={`${labels.select}: ${image.alt}`}
              aria-pressed={position === index}
              aria-controls={imageId}
              onClick={() => onSelect(position)}
              className="relative aspect-4/3 w-[calc((100%-1rem)/3)] max-w-36 min-w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border bg-surface/40 p-1 hover:border-accent aria-pressed:border-accent aria-pressed:ring-1 aria-pressed:ring-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <Image
                src={image.src}
                alt=""
                fill
                unoptimized
                sizes="144px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      </>
    ) : null}
  </div>
);
