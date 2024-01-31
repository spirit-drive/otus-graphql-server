import { ApolloResolver, ErrorCode } from '../../../types';
import { Product, ProductMutationsRemoveArgs } from '../../../graphql.types';
import { ProductModel } from '../../../models/Product';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql/index';
import { prepareProduct } from '../../../models/helpers/prepareProduct';
import { withAuth } from '../../auth';

export const removeRaw: ApolloResolver<never, Product | Error, ProductMutationsRemoveArgs> = async (
  _,
  args,
  { user }
) => {
  const { id } = args;
  const { commandId } = (user || {}) as UserDocument;
  const entity = await ProductModel.findById(id);

  if (!entity) {
    return new GraphQLError(`Product with id: "${id}" not found`, {
      extensions: {
        code: ErrorCode.NOT_FOUND,
      },
    });
  }

  if (entity.commandId !== commandId) {
    return new GraphQLError(`You can't remove this Product`, {
      extensions: {
        code: ErrorCode.NOT_ALLOWED,
      },
    });
  }
  await entity.deleteOne();

  return await prepareProduct(entity);
};

export const remove = withAuth(removeRaw);
