import proposals from '../data/propostas-em-dia.json';
import today from '../data/hoje-cabe.json';
import followup from '../data/followup-inbox.json';
import { mapProduct } from '../mappers/product.mapper';
import type { IProduct, IProductsRepository } from '../products.types';

const readProducts = (): ReadonlyArray<IProduct> => {
  const products = [proposals, today, followup].map(mapProduct);

  if (
    new Set(products.map(({ id }) => id)).size !== products.length ||
    new Set(products.map(({ slug }) => slug)).size !== products.length
  )
    throw new Error('Duplicate product identity');

  return products;
};

export const productsRepository: IProductsRepository = {
  getAllProducts: async () => readProducts(),
  getProductBySlug: async (slug) => readProducts().find((product) => product.slug === slug) ?? null,
};
