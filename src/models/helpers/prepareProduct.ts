import { ProductDocument } from '../Product';
import { Product } from '../../graphql.types';

export const prepareProduct = async (item: ProductDocument): Promise<Product> => {
  if (!item) return null;
  return {
    ...item.toObject(),
    id: item._id.toString(),
  };
};

export const prepareProducts = async (items: ProductDocument[]): Promise<Product[]> => {
  if (!items?.length) return [];

  const result: Product[] = [];
  for await (const item of items) {
    result.push(await prepareProduct(item));
  }
  return result;
};
