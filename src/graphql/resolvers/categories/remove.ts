import { ApolloResolver, ErrorCode } from '../../../types';
import { Category, CategoryMutationsRemoveArgs } from '../../../graphql.types';
import { CategoryModel } from '../../../models/Category';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql/index';
import { prepareCategory } from '../../../models/helpers/prepareCategory';
import { withAuth } from '../../auth';

export const removeRaw: ApolloResolver<never, Category | Error, CategoryMutationsRemoveArgs> = async (
  _,
  args,
  { user }
) => {
  const { id } = args;
  const { commandId } = (user || {}) as UserDocument;
  const entity = await CategoryModel.findById(id);

  if (!entity) {
    return new GraphQLError(`Category with id: "${id}" not found`, {
      extensions: {
        code: ErrorCode.NOT_FOUND,
      },
    });
  }

  if (entity.commandId !== commandId) {
    return new GraphQLError(`You can't remove this Category`, {
      extensions: {
        code: ErrorCode.NOT_ALLOWED,
      },
    });
  }
  await entity.deleteOne();

  return await prepareCategory(entity);
};

export const remove = withAuth(removeRaw);
