import { ProductCard } from '@/features/products/components/product-card/product-card.component';
import type { IProductCardPresentation } from '@/features/products/components/product-card/product-card.types';

interface IProductGridProps {
  products: ReadonlyArray<IProductCardPresentation>;
}
export const ProductGrid = ({ products }: IProductGridProps) => (
  <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);
