import { Document } from 'mongoose';
import { IFieldResolver } from '@graphql-tools/utils/typings';
import { ApolloContext } from '../../types';
import { CategoryModel } from '../../models/Category';
import { prepareCategory } from '../../models/helpers/prepareCategory';

export const updateModel = <T, Doc extends Document & T>(input: T, doc: Doc, keys: (keyof T)[], patch?: boolean) => {
  keys.forEach((key) => {
    if (patch) {
      doc[key] = (input as unknown as Doc)[key] || doc[key];
    } else {
      doc[key] = (input as unknown as Doc)[key] || null;
    }
  });
};

export const category: IFieldResolver<{ categoryId: string }, unknown, ApolloContext> = async (source) => {
  const result = await CategoryModel.findById(source.categoryId);
  return await prepareCategory(result);
};
