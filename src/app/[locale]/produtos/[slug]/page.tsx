import { ProductDetails } from '@/features/product-details/product-details.component';

export { generateProductDetailsMetadata as generateMetadata } from '@/features/product-details/product-details-metadata.util';

const ProductDetailsPage = async ({ params }: PageProps<'/[locale]/produtos/[slug]'>) => {
  const { slug } = await params;
  return <ProductDetails slug={slug} />;
};

export default ProductDetailsPage;
