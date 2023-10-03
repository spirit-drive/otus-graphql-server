import { Document } from 'mongoose';
import { IFieldResolver } from '@graphql-tools/utils/typings';
import { ApolloContext, ErrorCode } from '../../types';
import { CategoryModel } from '../../models/Category';
import { prepareCategory } from '../../models/helpers/prepareCategory';
import { GraphQLError } from 'graphql/index';
import { Types } from 'mongoose';

const { ObjectId } = Types;

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
  if (!ObjectId.isValid(source.categoryId)) {
    return new GraphQLError(`category id "${source.categoryId}" is not valid`, {
      extensions: {
        code: ErrorCode.NOT_VALID_ID,
        http: { status: 400 },
        fieldName: 'categoryId',
      },
    });
  }

  const result = await CategoryModel.findById(source.categoryId);
  if (!result) {
    return new GraphQLError(`Category with id: "${source.categoryId}" not found`, {
      extensions: { code: ErrorCode.NOT_FOUND, http: { status: 404 } },
    });
  }
  return await prepareCategory(result);
};
