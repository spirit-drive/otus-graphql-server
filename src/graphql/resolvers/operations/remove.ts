import { ApolloResolver, ErrorCode } from '../../../types';
import { Operation, OperationMutationsRemoveArgs } from '../../../graphql.types';
import { OperationModel } from '../../../models/Operation';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql/index';
import { prepareOperation } from '../../../models/helpers/prepareOperation';
import { withAuth } from '../../auth';

export const removeRaw: ApolloResolver<never, Operation | Error, OperationMutationsRemoveArgs> = async (
  _,
  args,
  { user }
) => {
  const { id } = args;
  const { commandId } = (user || {}) as UserDocument;
  const entity = await OperationModel.findOneAndRemove({ _id: id, commandId });

  if (!entity) {
    return new GraphQLError(`Operation with id: "${id}" not found`, {
      extensions: {
        code: ErrorCode.NOT_FOUND,
        http: { status: 404 },
      },
    });
  }
  return await prepareOperation(entity);
};

export const remove = withAuth(removeRaw);
