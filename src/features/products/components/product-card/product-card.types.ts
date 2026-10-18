export interface IProductCardPresentation {
  id: string;
  detailHref: string | null;
  name: string;
  subtitle: string;
  description: string;
  highlights: ReadonlyArray<string>;
  highlightsLabel: string;
  category: string;
  type: string;
  status: string;
  stageNote: string | null;
  cover: string | null;
  imageAlt: string;
  priceLabel: string | null;
}
