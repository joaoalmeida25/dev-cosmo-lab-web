'use client';

import { useId, useState, type KeyboardEvent } from 'react';
import type { IProductGalleryItem, IProductGalleryLabels } from './product-gallery.types';
import { ProductGalleryView } from './product-gallery-view.component';

interface IProductGalleryProps {
  images: ReadonlyArray<IProductGalleryItem>;
  labels: IProductGalleryLabels;
}

export const ProductGallery = ({ images, labels }: IProductGalleryProps) => {
  const [index, setIndex] = useState(0);
  const imageId = useId();
  const select = (next: number) => setIndex((next + images.length) % images.length);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (images.length <= 1) return;
    switch (event.key) {
      case 'ArrowLeft':
        select(index - 1);
        break;
      case 'ArrowRight':
        select(index + 1);
        break;
      case 'Home':
        select(0);
        break;
      case 'End':
        select(images.length - 1);
        break;
      default:
        return;
    }
    event.preventDefault();
  };
  return (
    <ProductGalleryView
      images={images}
      current={images[index]}
      index={index}
      imageId={imageId}
      labels={labels}
      onSelect={select}
      onPrevious={() => select(index - 1)}
      onNext={() => select(index + 1)}
      onKeyDown={onKeyDown}
    />
  );
};
