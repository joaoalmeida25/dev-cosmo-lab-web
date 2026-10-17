import type { IProductImages } from '../../products.types';

export interface IProductCardPresentation {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  highlights: ReadonlyArray<string>;
  highlightsLabel: string;
  category: string;
  type: string;
  status: string;
  stageNote: string | null;
  images: IProductImages | null;
  imageAlt: string;
  priceLabel: string;
  action: { href: string; label: string; accessibleLabel: string } | null;
}
