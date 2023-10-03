import { ProductModel } from '../../../models/Product';
import { GraphQLError } from 'graphql/index';
import { ErrorCode } from '../../../types';
import { Types } from 'mongoose';

const { ObjectId } = Types;

export const isExistProducts = async (productIds: string[]): Promise<boolean> => {
  for await (const id of productIds) {
    if (!ObjectId.isValid(id)) {
      throw new GraphQLError(`product id "${id}" is not valid`, {
        extensions: {
          code: ErrorCode.NOT_VALID_ID,
          http: { status: 400 },
          fieldName: 'products',
        },
      });
    }

    const product = await ProductModel.exists({ _id: id });
    if (!product) return false;
  }
  return true;
};
