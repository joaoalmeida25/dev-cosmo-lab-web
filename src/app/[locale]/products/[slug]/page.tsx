import { ProductDetails } from '@/features/product-details/product-details.component';

const ProductDetailsPage = async ({ params }: PageProps<'/[locale]/products/[slug]'>) => {
  const { slug } = await params;

  return <ProductDetails slug={slug} />;
};

export default ProductDetailsPage;
