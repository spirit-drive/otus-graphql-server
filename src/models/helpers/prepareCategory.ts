import { CategoryDocument } from '../Category';
import { Category } from '../../graphql.types';

export const prepareCategory = async (item: CategoryDocument): Promise<Category> =>
  item
    ? {
        id: item._id.toString(),
        name: item.name,
        photo: item.photo,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }
    : null;

export const prepareCategories = async (items: CategoryDocument[]): Promise<Category[]> => {
  if (!items?.length) return [];

  const result: Category[] = [];
  for await (const item of items) {
    result.push(await prepareCategory(item));
  }
  return result;
};
