import { ApolloResolver, Messages } from '../../../types';
import { Operation, OperationQueriesGetOneArgs } from '../../../graphql.types';
import { OperationModel } from '../../../models/Operation';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql/index';
import { prepareOperation } from '../../../models/helpers/prepareOperation';

export const getOne: ApolloResolver<never, Operation | Error, OperationQueriesGetOneArgs> = async (
  _,
  args,
  { user }
) => {
  const { commandId } = (user || {}) as UserDocument;
  const { id } = args;
  const query = OperationModel.findOne({ _id: id });
  if (commandId) {
    query.where('commandId', commandId);
  }
  const entity = await query;

  if (!entity) {
    return new GraphQLError(`Operation with id: "${id}" not found`, {
      extensions: { code: Messages.NOT_FOUND, http: { status: 404 } },
    });
  }
  return await prepareOperation(entity);
};
