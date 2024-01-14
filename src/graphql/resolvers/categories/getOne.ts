import { ApolloResolver, ErrorCode } from '../../../types';
import { Category, CategoryQueriesGetOneArgs } from '../../../graphql.types';
import { CategoryModel } from '../../../models/Category';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql/index';
import { prepareCategory } from '../../../models/helpers/prepareCategory';

export const getOne: ApolloResolver<never, Category | Error, CategoryQueriesGetOneArgs> = async (_, args, { user }) => {
  const { commandId } = (user || {}) as UserDocument;
  const { id } = args;
  const query = CategoryModel.findOne({ _id: id });
  if (commandId) {
    query.where('commandId', commandId);
  }
  const entity = await query;

  if (!entity) {
    return new GraphQLError(`Category with id: "${id}" not found`, {
      extensions: { code: ErrorCode.NOT_FOUND },
    });
  }
  return await prepareCategory(entity);
};
