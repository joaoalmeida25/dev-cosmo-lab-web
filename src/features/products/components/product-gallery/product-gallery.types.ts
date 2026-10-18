export interface IProductGalleryItem {
  src: string;
  alt: string;
}

export interface IProductGalleryLabels {
  region: string;
  previous: string;
  next: string;
  select: string;
  positions: ReadonlyArray<string>;
  unavailable: string;
}
