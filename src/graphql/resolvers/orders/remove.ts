import { ApolloResolver, ErrorCode } from '../../../types';
import { Order, OrderMutationsRemoveArgs } from '../../../graphql.types';
import { OrderModel } from '../../../models/Order';
import { UserDocument } from '../../../models/User';
import { GraphQLError } from 'graphql/index';
import { prepareOrder } from '../../../models/helpers/prepareOrder';
import { withAuth } from '../../auth';

export const removeRaw: ApolloResolver<never, Order | Error, OrderMutationsRemoveArgs> = async (_, args, { user }) => {
  const { id } = args;
  const { commandId, id: userId } = (user || {}) as UserDocument;
  const entity = await OrderModel.findOneAndRemove({ _id: id, commandId });

  if (!entity) {
    return new GraphQLError(`Order with id: "${id}" not found`, {
      extensions: {
        code: ErrorCode.NOT_FOUND,
        http: { status: 404 },
      },
    });
  }
  if (entity.userId !== userId) {
    return new GraphQLError(`The order can only be edited by the creator`, {
      extensions: {
        code: ErrorCode.NOT_ALLOWED,
        http: { status: 403 },
      },
    });
  }
  return await prepareOrder(entity);
};

export const remove = withAuth(removeRaw);
