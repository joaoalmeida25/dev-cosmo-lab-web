import type { IProductFaqItem, IProductStep } from '@/features/products/products.types';
import type {
  IProductGalleryItem,
  IProductGalleryLabels,
} from '@/features/products/components/product-gallery/product-gallery.types';

export interface IProductSummaryProps {
  name: string;
  type: string;
  subtitle: string;
  description: string;
  status: string;
  stageNote: string | null;
  price: string | null;
  action: { href: string; label: string; accessibleLabel: string } | null;
  specifications: ReadonlyArray<{ label: string; value: string }>;
}

export interface IProductDetailsViewProps {
  hero: { title: string; description: string; breadcrumb: string; products: string };
  summary: IProductSummaryProps;
  gallery: ReadonlyArray<IProductGalleryItem>;
  galleryLabels: IProductGalleryLabels;
  includedTitle: string;
  includedIntroduction?: string;
  materials: ReadonlyArray<string>;
  stepsTitle: string;
  steps: ReadonlyArray<IProductStep>;
  faqTitle: string;
  faq: ReadonlyArray<IProductFaqItem>;
}
