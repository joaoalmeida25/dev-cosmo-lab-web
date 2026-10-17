export interface IProduct {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  materials: Array<string>;
  imageAlt: string;
  images: {
    dark: string;
    light: string;
  };
}
