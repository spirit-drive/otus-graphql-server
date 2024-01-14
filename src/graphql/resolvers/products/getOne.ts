import { ApolloResolver, ErrorCode } from '../../../types';
import { Product, ProductQueriesGetOneArgs } from '../../../graphql.types';
import { ProductModel } from '../../../models/Product';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql/index';
import { prepareProduct } from '../../../models/helpers/prepareProduct';

export const getOne: ApolloResolver<never, Product | Error, ProductQueriesGetOneArgs> = async (_, args, { user }) => {
  const { commandId } = (user || {}) as UserDocument;
  const { id } = args;
  const query = ProductModel.findOne({ _id: id });
  if (commandId) {
    query.where('commandId', commandId);
  }
  const entity = await query;

  if (!entity) {
    return new GraphQLError(`Product with id: "${id}" not found`, {
      extensions: { code: ErrorCode.NOT_FOUND },
    });
  }
  return await prepareProduct(entity);
};
